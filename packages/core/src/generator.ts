import type { SkillEntrypointOptions } from '../shared/skill-render'
import type { SkillHubTarget } from './agents'
import type { GeneratedModuleEntry, InstalledPackageMetadata } from './internal'
import type { ResolvedContribution, SkillHubCallHook, SkillHubContribution, SkillHubContributionContext, SkillHubOptions, SkillManifestSkipped, ValidationIssue } from './types'
import { promises as fsp } from 'node:fs'
import { performance } from 'node:perf_hooks'
import { basename, dirname, join, relative, resolve } from 'pathe'
import { PACKAGE_VERSION } from '../shared/package-info'
import {
  createModuleIndex,
  createSkillEntrypoint,
  createSkillPointer,
  DEFAULT_NUXT_CONTENT_METADATA,
  getSourceLabel,
  getTrustLevel,
  selectLinkedPacks,
} from '../shared/skill-render'
import { loadsSkillFolders, resolveAgentTargetConfig } from './agents'
import { collectBundledContributions } from './bundled-skills'
import { createGenerationFingerprint } from './generation/fingerprint'
import {
  collectWorkspaceDiscoverySources,
  createLocalSourceFingerprints,
  resolveManualContribution,
} from './generation/sources'
import { isGeneratedSkillFreshWithOptions, readGenerationState, writeGenerationState } from './generation/state'
import {
  buildNuxtTemplateFiles,
  buildVueTemplateFiles,
  collectInstalledModulePackages,
  copySkillTree,
  createModuleDestination,
  createStagingPath,
  discoverInstalledPackageFromDirectory,
  discoverLocalPackageSkills,
  discoverPackageSkillsFromInstalledPackage,
  emptyDir,
  ensureDir,
  getTargetSkillRoot,
  mapWithConcurrency,
  pathExists,
  replaceSkillTree,
  resolveContributions,
  resolveMonorepoScopePath,
  sortAndDedupeContributions,
  swapDir,
  validateResolvedContributions,
  writeFileIfChanged,
} from './internal'
import { resolveRemoteContributionsForPackage } from './remote-resolver'
import {
  normalizeRemoteOptions,
} from './types'

export interface SkillHubLogger {
  start: (message: string) => void
  success: (message: string) => void
  warn: (message: string) => void
  info: (message: string) => void
}

export interface GenerateSkillTreeInput {
  /** The app whose dependencies decide what the skill covers. */
  rootDir: string
  /** The folder holding the agent dirs: the app root, or the monorepo root above it. */
  exportRoot: string
  skillName: string
  targets: SkillHubTarget[]
  options: SkillHubOptions
  logger: SkillHubLogger
  /** Module entries as written in the app config. Each resolves to an installed package. */
  modules?: unknown[]
  /** Layer directories the app extends. `rootDir` is ignored if listed. */
  layerDirs?: string[]
  /** Folders older versions wrote, removed after publishing. */
  staleDirs?: string[]
  /** Log per-package resolve timings, as `remote.timings` does. */
  debug?: boolean
  callHook?: SkillHubCallHook
  perf?: { startPhase: (name: string) => void, endPhase: (name: string) => void }
}

function normalizeRelativePath(from: string, to: string): string {
  const rel = relative(from, to).replaceAll('\\', '/')
  if (!rel || rel === '.') {
    return './'
  }

  return rel.startsWith('.') ? rel : `./${rel}`
}

function getPersistentCacheRoot(exportRoot: string): string {
  return join(exportRoot, 'node_modules', '.cache', 'nuxt-skill-hub')
}

function getCachedGeneratedSkillRoot(cacheRoot: string, skillName: string): string {
  return join(cacheRoot, 'generated', skillName)
}

function roundMs(value: number): number {
  return Math.round(value * 10) / 10
}

function formatMs(value: number): string {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}s` : `${Math.round(value)}ms`
}

function countResolvers(contributions: ResolvedContribution[]): Partial<Record<ResolvedContribution['resolver'], number>> {
  const counts: Partial<Record<ResolvedContribution['resolver'], number>> = {}
  for (const contribution of contributions) {
    counts[contribution.resolver] = (counts[contribution.resolver] || 0) + 1
  }
  return counts
}

function formatResolverCounts(counts: Partial<Record<ResolvedContribution['resolver'], number>>): string {
  return Object.entries(counts)
    .map(([resolver, count]) => `${count} ${resolver}`)
    .join(', ')
}

function mergeSkipped(entries: SkillManifestSkipped[], keyFn: (entry: SkillManifestSkipped) => string): SkillManifestSkipped[] {
  const byKey = new Map<string, SkillManifestSkipped>()

  for (const entry of entries) {
    const key = keyFn(entry)
    const previous = byKey.get(key)
    if (!previous) {
      byKey.set(key, { ...entry })
      continue
    }

    const reasons = new Set(previous.reason.split('; ').filter(Boolean))
    reasons.add(entry.reason)
    previous.reason = Array.from(reasons).join('; ')
  }

  return Array.from(byKey.values())
    .sort((a, b) => `${a.packageName}::${a.skillName}`.localeCompare(`${b.packageName}::${b.skillName}`))
}

function filterResolvedSkipped(entries: SkillManifestSkipped[], contributions: ResolvedContribution[]): SkillManifestSkipped[] {
  const resolvedKeys = new Set(contributions.map(contribution => `${contribution.packageName}::${contribution.skillName}`))
  return entries.filter(entry => !resolvedKeys.has(`${entry.packageName}::${entry.skillName}`))
}

const GENERATED_GITIGNORE = '# Written by nuxt-skill-hub on `nuxt prepare`. Do not commit or edit.\n*\n'

/** True when the folder is free, or holds a skill this module wrote (the tree, a pointer, or an older version's wrapper). */
async function canReplaceSkillDir(skillRoot: string): Promise<boolean> {
  const entry = join(skillRoot, 'SKILL.md')
  if (!(await pathExists(entry))) {
    return !(await pathExists(skillRoot)) || (await fsp.readdir(skillRoot)).length === 0
  }

  const contents = await fsp.readFile(entry, 'utf8')
  return contents.includes('_Generated by nuxt-skill-hub.') || contents.includes('# Nuxt Skill Wrapper')
}

async function collectInstalledPackages(input: Pick<GenerateSkillTreeInput, 'rootDir' | 'modules' | 'layerDirs'>) {
  const discoveries = []
  const installedPackages: InstalledPackageMetadata[] = []
  const seenPackageRoots = new Set<string>()

  const addInstalledPackage = (installedPackage: InstalledPackageMetadata | null) => {
    if (!installedPackage || seenPackageRoots.has(installedPackage.packageRoot)) {
      return
    }

    seenPackageRoots.add(installedPackage.packageRoot)
    installedPackages.push(installedPackage)

    const discovered = discoverPackageSkillsFromInstalledPackage(installedPackage, 'dist')
    if (discovered) {
      discoveries.push(discovered)
    }
  }

  const modulePackages = await collectInstalledModulePackages(input.modules, input.rootDir)
  for (const pkg of modulePackages) addInstalledPackage(pkg)

  const layerDirectories = Array.from(new Set(
    (input.layerDirs || [])
      .map(layerDir => resolve(layerDir))
      .filter(layerDir => layerDir && layerDir !== resolve(input.rootDir)),
  ))

  const layerPackages = await Promise.all(layerDirectories.map(dir => discoverInstalledPackageFromDirectory(dir)))
  for (const pkg of layerPackages) addInstalledPackage(pkg)

  const localPackageSkills = await discoverLocalPackageSkills(input.rootDir)
  if (localPackageSkills) {
    discoveries.push(localPackageSkills)
  }

  return {
    discoveries,
    installedPackages,
  }
}

/**
 * True when `skillRoot` already holds this exact generation, so publishing can skip the folder
 * swap that Windows sometimes refuses while the repo's watchers hold a handle on the tree.
 */
async function isPublishedCopyCurrent(generatedSkillRoot: string, skillRoot: string): Promise<boolean> {
  const [generated, published, entryExists] = await Promise.all([
    readGenerationState(generatedSkillRoot),
    readGenerationState(skillRoot),
    pathExists(join(skillRoot, 'SKILL.md')),
  ])
  return Boolean(generated && published && entryExists
    && generated.fingerprint === published.fingerprint
    && generated.generatedAt === published.generatedAt)
}

/**
 * Puts the generated tree where each agent loads skills. Agents that load skill folders get the
 * whole tree, written once to `.agents/skills` for the agents that read it. Agents with a rules
 * directory get one pointer file, so they don't load every reference as a rule.
 */
export async function publishSkill(input: {
  logger: SkillHubLogger
  rootDir: string
  exportRoot: string
  skillName: string
  targets: SkillHubTarget[]
  generatedSkillRoot: string
}): Promise<void> {
  const { logger, generatedSkillRoot } = input
  const projectPath = relative(input.exportRoot, input.rootDir).replaceAll('\\', '/')
  // Through the project's own node_modules link, not the resolved store path, so the pointer stays stable across versions.
  const bundledRulesDir = join(input.rootDir, 'node_modules', 'nuxt-skill-hub', 'nuxt-best-practices', 'rules')
  const hasBundledRules = await pathExists(bundledRulesDir)
  const published = new Set<string>()

  for (const target of input.targets) {
    const { skillRoot } = getTargetSkillRoot(input.exportRoot, target, input.skillName)
    await ensureDir(dirname(skillRoot))
    // Two targets can share a folder through a symlink, e.g. `.claude/skills -> ../.agents/skills`.
    const realSkillRoot = join(await fsp.realpath(dirname(skillRoot)), basename(skillRoot))
    if (published.has(realSkillRoot)) {
      continue
    }
    published.add(realSkillRoot)

    if (!(await canReplaceSkillDir(skillRoot))) {
      logger.warn(`Skipped ${skillRoot}: it holds a skill nuxt-skill-hub didn't write. Set \`skillHub.skillName\` to use another name.`)
      continue
    }

    if (loadsSkillFolders(target)) {
      if (!(await isPublishedCopyCurrent(generatedSkillRoot, skillRoot))) {
        await replaceSkillTree(generatedSkillRoot, skillRoot)
      }
      continue
    }

    await emptyDir(skillRoot)
    await ensureDir(skillRoot)
    await writeFileIfChanged(join(skillRoot, 'SKILL.md'), createSkillPointer(
      input.skillName,
      normalizeRelativePath(skillRoot, join(generatedSkillRoot, 'SKILL.md')),
      {
        projectPath,
        bundledRulesPath: hasBundledRules ? normalizeRelativePath(skillRoot, bundledRulesDir) : undefined,
      },
    ))
  }

  // An agent that reads `.agents/skills` would load the skill twice if the copy an older version
  // wrote to its own folder stayed. Keep that copy when the shared folder holds someone else's skill.
  for (const target of input.targets) {
    const previousDirs = resolveAgentTargetConfig(target)?.previousProjectSkillsDirs ?? []
    if (!previousDirs.length || !(await canReplaceSkillDir(getTargetSkillRoot(input.exportRoot, target, input.skillName).skillRoot))) {
      continue
    }
    for (const previousDir of previousDirs) {
      const previousRoot = join(input.exportRoot, previousDir, input.skillName)
      if (!(await pathExists(join(previousRoot, 'SKILL.md')))) {
        continue
      }
      const realPreviousRoot = join(await fsp.realpath(dirname(previousRoot)), basename(previousRoot))
      if (published.has(realPreviousRoot) || !(await canReplaceSkillDir(previousRoot))) {
        continue
      }
      await fsp.rm(previousRoot, { recursive: true, force: true })
    }
  }
}

export async function generateSkillTree(input: GenerateSkillTreeInput): Promise<void> {
  const { rootDir, logger, options, skillName, exportRoot, targets } = input
  const callHook = input.callHook ?? (async () => {})
  const persistentCacheRoot = getPersistentCacheRoot(exportRoot)
  // The one generated copy. `publishSkill` copies it to each agent.
  const generatedSkillRoot = getCachedGeneratedSkillRoot(persistentCacheRoot, skillName)
  const publish = async () => {
    await publishSkill({ logger, rootDir, exportRoot, skillName, targets, generatedSkillRoot })
    for (const dir of input.staleDirs || []) {
      await fsp.rm(dir, { recursive: true, force: true })
    }
  }
  const monorepoScopePath = resolveMonorepoScopePath(rootDir, exportRoot)
  const manualContributions: SkillHubContribution[] = []
  const remoteOptions = normalizeRemoteOptions(options.remote)

  const contributionContext: SkillHubContributionContext = {
    add: (contribution) => {
      manualContributions.push(contribution)
    },
  }

  await callHook('skill-hub:contribute', contributionContext)

  const { discoveries, installedPackages } = await collectInstalledPackages(input)
  const discoveredContributions = await resolveContributions(discoveries)
  const workspaceDiscoverySources = collectWorkspaceDiscoverySources(rootDir, discoveries)
  const resolvedManual = await Promise.all(
    manualContributions.map(contribution => resolveManualContribution(rootDir, contribution)),
  )
  const fingerprint = await createGenerationFingerprint({
    packageVersion: PACKAGE_VERSION,
    rootDir,
    exportRoot,
    skillName,
    options,
    installedPackages,
    localSources: await createLocalSourceFingerprints([
      ...workspaceDiscoverySources,
      ...sortAndDedupeContributions(resolvedManual),
    ]),
  })

  if (await isGeneratedSkillFreshWithOptions(generatedSkillRoot, fingerprint, {
    refresh: remoteOptions.refresh,
    cacheTtlMs: remoteOptions.cacheTtlMs,
  })) {
    await publish()
    logger.info(`Reused cached ${skillName} skill from ${generatedSkillRoot}`)
    return
  }

  const distResolvedPackages = new Set(discoveredContributions.contributions.map(item => item.packageName))
  // A package's own skill wins. Otherwise the curated copy is used, offline, before any remote lookup.
  const bundledContributions = collectBundledContributions(installedPackages, distResolvedPackages)
  for (const contribution of bundledContributions) distResolvedPackages.add(contribution.packageName)

  const remoteIssues: ValidationIssue[] = []
  const remoteSkipped: SkillManifestSkipped[] = []
  const remoteContributions: ResolvedContribution[] = []
  const remoteCacheRoot = join(persistentCacheRoot, 'remote')
  await ensureDir(remoteCacheRoot)

  const packagesToResolve = installedPackages.filter(pkg => pkg.packageName !== 'nuxt-skill-hub' && !distResolvedPackages.has(pkg.packageName))
  const totalToResolve = packagesToResolve.length

  const remoteStart = performance.now()
  const logTimings = remoteOptions.timings || Boolean(input.debug)

  await callHook('skill-hub:resolve:start', {
    skillName,
    packageCount: totalToResolve,
    concurrency: remoteOptions.concurrency,
    remoteEnabled: remoteOptions.enabled,
    githubHeuristics: remoteOptions.githubHeuristics,
  })

  input.perf?.startPhase('skill-hub:resolve')
  const remoteResults = await (async () => {
    try {
      return await mapWithConcurrency(
        packagesToResolve,
        remoteOptions.concurrency,
        async (pkg, index) => {
          logger.start(`Resolving skills for ${pkg.packageName} (${index + 1}/${totalToResolve})...`)
          const packageStart = performance.now()
          const phaseName = `skill-hub:resolve:${pkg.packageName}`
          input.perf?.startPhase(phaseName)
          try {
            const result = await resolveRemoteContributionsForPackage(pkg, {
              cacheRoot: remoteCacheRoot,
              githubLookupTimeoutMs: remoteOptions.timeoutMs,
              enableGithubLookup: remoteOptions.enabled,
              enableWellKnownLookup: remoteOptions.enabled,
              enableGithubHeuristics: remoteOptions.enabled && remoteOptions.githubHeuristics,
              wellKnownLimits: {
                maxFiles: remoteOptions.maxFiles,
                maxBytes: remoteOptions.maxBytes,
                maxFileBytes: remoteOptions.maxFileBytes,
              },
            })
            const durationMs = roundMs(performance.now() - packageStart)
            const firstContribution = result.contributions[0]
            await callHook('skill-hub:resolve:package', {
              skillName,
              packageName: pkg.packageName,
              packageIndex: index,
              packageCount: totalToResolve,
              durationMs,
              resolver: firstContribution?.resolver,
              sourceKind: firstContribution?.sourceKind,
              contributionCount: result.contributions.length,
              skippedCount: result.skipped.length,
            })
            if (logTimings) {
              const outcome = firstContribution
                ? `${firstContribution.resolver}/${firstContribution.sourceKind}`
                : 'unresolved'
              logger.info(`Resolved ${pkg.packageName} via ${outcome} in ${formatMs(durationMs)}`)
            }
            return result
          }
          finally {
            input.perf?.endPhase(phaseName)
          }
        },
      )
    }
    finally {
      input.perf?.endPhase('skill-hub:resolve')
    }
  })()

  for (const remote of remoteResults) {
    remoteIssues.push(...remote.issues)
    remoteSkipped.push(...remote.skipped)
    remoteContributions.push(...remote.contributions)
  }

  const remoteDurationMs = roundMs(performance.now() - remoteStart)
  const resolverCounts = countResolvers(remoteContributions)
  await callHook('skill-hub:resolve:done', {
    skillName,
    packageCount: totalToResolve,
    concurrency: remoteOptions.concurrency,
    remoteEnabled: remoteOptions.enabled,
    githubHeuristics: remoteOptions.githubHeuristics,
    durationMs: remoteDurationMs,
    contributionCount: remoteContributions.length,
    skippedCount: remoteSkipped.length,
    issueCount: remoteIssues.length,
    resolverCounts,
  })
  if (totalToResolve) {
    const summary = formatResolverCounts(resolverCounts)
    logger.info(`Resolved ${totalToResolve} module skill sources in ${formatMs(remoteDurationMs)}${summary ? ` (${summary})` : ''}.`)
  }

  const validatedRemote = await validateResolvedContributions(sortAndDedupeContributions(remoteContributions))
  const validatedManual = await validateResolvedContributions(sortAndDedupeContributions(resolvedManual))

  const contributions = sortAndDedupeContributions([
    ...discoveredContributions.contributions,
    ...bundledContributions,
    ...validatedRemote.contributions,
    ...validatedManual.contributions,
  ])
  const validationIssues = [
    ...discoveredContributions.issues,
    ...remoteIssues,
    ...validatedRemote.issues,
    ...validatedManual.issues,
  ]
  const issuesToSkipped = mergeSkipped(
    validationIssues.map(issue => ({ packageName: issue.packageName, skillName: issue.skillName, reason: issue.reason, sourceKind: issue.sourceKind })),
    entry => `${entry.packageName}::${entry.skillName}`,
  )
  const skipped = filterResolvedSkipped(mergeSkipped(
    [...issuesToSkipped, ...remoteSkipped],
    entry => `${entry.packageName}::${entry.skillName}::${entry.sourceKind || ''}`,
  ), contributions)

  for (const issue of validationIssues) {
    logger.warn(`[validation] ${issue.packageName}/${issue.skillName}: ${issue.reason}`)
  }

  // Built here, then swapped in, so a failed run keeps the previous tree.
  const stagingRoot = await createStagingPath(generatedSkillRoot)
  const referencesRoot = join(stagingRoot, 'references')
  const nuxtRoot = join(referencesRoot, 'nuxt')
  const vueRoot = join(referencesRoot, 'vue')
  const modulesRoot = join(referencesRoot, 'modules')
  await emptyDir(stagingRoot)
  try {
    await ensureDir(nuxtRoot)
    await ensureDir(vueRoot)
    await ensureDir(modulesRoot)

    const vueTemplateFiles = await buildVueTemplateFiles(vueRoot)
    for (const file of vueTemplateFiles) {
      await writeFileIfChanged(file.path, file.contents)
    }

    const generatedEntries: GeneratedModuleEntry[] = []

    for (const contribution of contributions) {
      const includeScripts = contribution.forceIncludeScripts
      const destination = createModuleDestination(modulesRoot, contribution)
      await copySkillTree(contribution.sourceDir, destination, includeScripts)
      const entryPath = relative(stagingRoot, join(destination, 'SKILL.md')).replaceAll('\\', '/')

      generatedEntries.push({
        packageName: contribution.packageName,
        version: contribution.version,
        skillName: contribution.skillName,
        entryPath,
        sourceDir: contribution.sourceDir,
        destination: relative(stagingRoot, destination).replaceAll('\\', '/'),
        scriptsIncluded: includeScripts,
        description: contribution.description,
        sourceKind: contribution.sourceKind,
        sourceLabel: getSourceLabel(contribution.sourceKind),
        sourceRepo: contribution.sourceRepo,
        sourceRef: contribution.sourceRef,
        sourcePath: contribution.sourcePath,
        repoUrl: contribution.repoUrl,
        docsUrl: contribution.docsUrl,
        official: contribution.official,
        trustLevel: getTrustLevel(contribution.official),
        resolver: contribution.resolver,
      })
    }

    const moduleIndex = createModuleIndex(generatedEntries, skipped)
    if (moduleIndex) {
      await writeFileIfChanged(join(modulesRoot, 'index.md'), moduleIndex)
    }

    const entrypointOptions: SkillEntrypointOptions = {
      monorepoScopePath,
      moduleAuthoring: Boolean(options.moduleAuthoring),
      installedPackages: installedPackages.map(pkg => pkg.packageName),
      entries: generatedEntries,
      skipped,
    }
    // Copy only the packs the router links, so no pack sits in the tree unreachable.
    const nuxtTemplateFiles = await buildNuxtTemplateFiles(nuxtRoot, selectLinkedPacks(DEFAULT_NUXT_CONTENT_METADATA, entrypointOptions))
    for (const file of nuxtTemplateFiles) {
      await writeFileIfChanged(file.path, file.contents)
    }

    await writeFileIfChanged(join(stagingRoot, 'SKILL.md'), createSkillEntrypoint(skillName, DEFAULT_NUXT_CONTENT_METADATA, entrypointOptions))
    await writeFileIfChanged(join(stagingRoot, '.gitignore'), GENERATED_GITIGNORE)
    await writeGenerationState(stagingRoot, fingerprint)
    await swapDir(stagingRoot, generatedSkillRoot)
  }
  finally {
    await fsp.rm(stagingRoot, { recursive: true, force: true })
  }
  await publish()

  logger.success(`Generated ${skillName} skill for ${targets.join(', ')}`)
}
