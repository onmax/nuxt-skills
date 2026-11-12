import type { ResolvedContribution, SkillManifestSkipped, SkillSourceKind, ValidationIssue } from './types'
import type { WellKnownResolutionLimits } from './well-known-resolver'
import { promises as fsp } from 'node:fs'
import { downloadTemplate } from 'giget'
import { dirname, join } from 'pathe'
import { createMetadataRouterSkillFiles, resolveMetadataRouterSkillName } from '../shared/skill-render'
import { createValidationIssue, ensureDir, normalizeContribution, parseAgentSkillDeclarations, pathExists, sanitizeSegment } from './internal'
import { findPackageOverride } from './package-overrides'
import { fetchGitHubDefaultBranch, fetchGitHubFileText, listGitHubDirectory, parseGitHubRepo } from './remote-fetch'
import { resolveViaWellKnown } from './well-known-resolver'

export interface InstalledPackageInfo {
  packageName: string
  version?: string
  description?: string
  repository?: string
  homepage?: string
  docsUrls?: string[]
}

export interface RemoteResolveOptions {
  cacheRoot: string
  githubLookupTimeoutMs: number
  enableGithubLookup: boolean
  enableGithubHeuristics?: boolean
  enableWellKnownLookup?: boolean
  wellKnownLimits?: Partial<WellKnownResolutionLimits>
}

export interface RemoteResolveResult {
  contributions: ResolvedContribution[]
  issues: ValidationIssue[]
  skipped: SkillManifestSkipped[]
}

interface RemoteSkillCandidate {
  skillName: string
  sourcePath: string
  sourceKind: SkillSourceKind
  sourceRepo: string
  sourceRef: string
  official: boolean
  resolver: 'agentsField' | 'githubHeuristic'
}

function makeSkip(packageName: string, skillName: string, reason: string, sourceKind?: SkillSourceKind): SkillManifestSkipped {
  return {
    packageName,
    skillName,
    reason,
    sourceKind,
  }
}

export function slugCandidates(packageName: string): string[] {
  const [scopeOrName, scopedName] = packageName.startsWith('@') ? packageName.split('/') : ['', packageName]
  const base = (scopedName || scopeOrName || '').trim()
  const candidates = new Set<string>()

  if (base) {
    candidates.add(base)
  }

  if (scopeOrName === '@nuxt' && base) {
    candidates.add(`nuxt-${base}`)
  }

  if (scopeOrName === '@nuxthub' && base === 'core') {
    candidates.add('nuxthub')
  }

  if (scopeOrName === '@vueuse' && base === 'core') {
    candidates.add('vueuse')
  }

  return Array.from(candidates)
}

function dedupe(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))]
}

function normalizeHttpUrl(url: string | undefined): string | undefined {
  const trimmed = url?.trim()
  if (!trimmed) {
    return undefined
  }

  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
      ? parsed.toString()
      : undefined
  }
  catch {
    return undefined
  }
}

function resolveDocsUrl(packageInfo: InstalledPackageInfo): string | undefined {
  const override = findPackageOverride(packageInfo.packageName)
  const overrideDocsUrl = override?.docsUrls?.map(normalizeHttpUrl).find(Boolean)
  const packageDocsUrl = packageInfo.docsUrls?.map(normalizeHttpUrl).find(Boolean)
  return overrideDocsUrl || packageDocsUrl || normalizeHttpUrl(packageInfo.homepage)
}

function resolveRepositoryUrl(packageInfo: InstalledPackageInfo): { repoUrl?: string, sourceRepo?: string } {
  const override = findPackageOverride(packageInfo.packageName)
  const sourceRepo = override?.repo || parseGitHubRepo(packageInfo.repository) || parseGitHubRepo(packageInfo.homepage)
  if (sourceRepo) {
    return {
      sourceRepo,
      repoUrl: `https://github.com/${sourceRepo}`,
    }
  }

  return {
    repoUrl: normalizeHttpUrl(packageInfo.repository),
  }
}

function isImmutableRef(ref: string, version?: string): boolean {
  if (!ref) {
    return false
  }

  if (version && (ref === version || ref === `v${version}`)) {
    return true
  }

  return /^[a-f0-9]{7,40}$/i.test(ref)
}

async function materializeCandidate(
  packageInfo: InstalledPackageInfo,
  candidate: RemoteSkillCandidate,
  cacheRoot: string,
): Promise<ResolvedContribution | null> {
  const targetDir = join(
    cacheRoot,
    candidate.sourceKind,
    sanitizeSegment(candidate.sourceRepo),
    sanitizeSegment(candidate.sourceRef),
    sanitizeSegment(packageInfo.packageName),
    sanitizeSegment(packageInfo.version || 'unknown'),
    sanitizeSegment(candidate.skillName),
  )
  const skillFilePath = join(targetDir, 'SKILL.md')

  if (isImmutableRef(candidate.sourceRef, packageInfo.version) && await pathExists(skillFilePath)) {
    return normalizeContribution({
      packageName: packageInfo.packageName,
      version: packageInfo.version,
      sourceDir: targetDir,
      skillName: candidate.skillName,
      sourceKind: candidate.sourceKind,
      sourceRepo: candidate.sourceRepo,
      sourceRef: candidate.sourceRef,
      sourcePath: candidate.sourcePath,
      official: candidate.official,
      resolver: candidate.resolver,
      forceIncludeScripts: true,
    }, targetDir, join(targetDir, '..'))
  }

  try {
    await downloadTemplate(`gh:${candidate.sourceRepo}/${candidate.sourcePath}#${candidate.sourceRef}`, {
      dir: targetDir,
      force: true,
      forceClean: true,
      registry: false,
      silent: true,
    })
  }
  catch {
    return null
  }

  if (!(await pathExists(skillFilePath))) {
    return null
  }

  return normalizeContribution({
    packageName: packageInfo.packageName,
    version: packageInfo.version,
    sourceDir: targetDir,
    skillName: candidate.skillName,
    sourceKind: candidate.sourceKind,
    sourceRepo: candidate.sourceRepo,
    sourceRef: candidate.sourceRef,
    sourcePath: candidate.sourcePath,
    official: candidate.official,
    resolver: candidate.resolver,
    forceIncludeScripts: true,
  }, targetDir, join(targetDir, '..'))
}

interface GitHubResolveContext {
  issues: ValidationIssue[]
  skipped: SkillManifestSkipped[]
  override: ReturnType<typeof findPackageOverride>
  repo?: string
  refs: string[]
  pathCandidates: string[]
}

function createGitHubResolveContext(packageInfo: InstalledPackageInfo): GitHubResolveContext {
  const override = findPackageOverride(packageInfo.packageName)
  const repo = override?.repo
    || parseGitHubRepo(packageInfo.repository)
    || parseGitHubRepo(packageInfo.homepage)

  const refs = dedupe([
    override?.ref || '',
    packageInfo.version ? `v${packageInfo.version}` : '',
    packageInfo.version || '',
  ])

  const candidates = dedupe([
    override?.skillName || '',
    ...slugCandidates(packageInfo.packageName),
  ])
  const pathCandidates = dedupe([
    override?.path || '',
    ...candidates.flatMap((skillName) => {
      return [
        `skills/${skillName}`,
        `.claude/skills/${skillName}`,
        `.github/skills/${skillName}`,
      ]
    }),
  ])

  return {
    issues: [],
    skipped: [],
    override,
    repo: repo || undefined,
    refs,
    pathCandidates,
  }
}

async function resolveAgentSkillsForRef(
  packageInfo: InstalledPackageInfo,
  context: GitHubResolveContext,
  ref: string,
  cacheRoot: string,
  timeoutMs: number,
): Promise<ResolvedContribution[] | null> {
  if (!context.repo) {
    return null
  }

  const packageJson = await fetchGitHubFileText(context.repo, ref, 'package.json', timeoutMs)
  if (!packageJson.ok || !packageJson.data) {
    return null
  }

  try {
    const parsed = JSON.parse(packageJson.data) as unknown
    const remoteSkills = parseAgentSkillDeclarations(parsed, packageInfo.packageName, 'github')
    context.issues.push(...remoteSkills.issues)

    for (const skill of remoteSkills.skills) {
      const resolved = await materializeCandidate(packageInfo, {
        skillName: skill.name,
        sourcePath: skill.path,
        sourceKind: 'github',
        sourceRepo: context.repo,
        sourceRef: ref,
        official: context.override?.official !== false,
        resolver: 'agentsField',
      }, cacheRoot)
      if (resolved) {
        return [resolved]
      }
    }
  }
  catch {
    context.issues.push(createValidationIssue(packageInfo.packageName, packageInfo.packageName, 'Failed to parse remote package.json', 'github'))
  }

  return null
}

async function resolveViaGitHubAgents(
  packageInfo: InstalledPackageInfo,
  cacheRoot: string,
  timeoutMs: number,
): Promise<RemoteResolveResult> {
  const context = createGitHubResolveContext(packageInfo)

  if (!context.repo) {
    return {
      contributions: [],
      issues: context.issues,
      skipped: [],
    }
  }

  for (const ref of context.refs) {
    const resolved = await resolveAgentSkillsForRef(packageInfo, context, ref, cacheRoot, timeoutMs)
    if (resolved?.length) {
      return { contributions: resolved, issues: context.issues, skipped: context.skipped }
    }
  }

  const fallbackRefs = dedupe([
    await fetchGitHubDefaultBranch(context.repo, timeoutMs) || '',
    'main',
    'master',
  ])

  for (const ref of fallbackRefs) {
    const resolved = await resolveAgentSkillsForRef(packageInfo, context, ref, cacheRoot, timeoutMs)
    if (resolved?.length) {
      return { contributions: resolved, issues: context.issues, skipped: context.skipped }
    }
  }

  return {
    contributions: [],
    issues: context.issues,
    skipped: context.skipped,
  }
}

async function resolveViaGitHubHeuristics(
  packageInfo: InstalledPackageInfo,
  cacheRoot: string,
  timeoutMs: number,
): Promise<RemoteResolveResult> {
  const context = createGitHubResolveContext(packageInfo)

  if (!context.repo) {
    return {
      contributions: [],
      issues: context.issues,
      skipped: [makeSkip(packageInfo.packageName, context.override?.skillName || packageInfo.packageName, 'No GitHub repository metadata found', 'github')],
    }
  }

  const tryResolveForRef = async (ref: string, allowTreeLookup: boolean): Promise<ResolvedContribution[] | null> => {
    const skillsDirs = allowTreeLookup && !context.override?.path
      ? await listGitHubDirectory(context.repo!, ref, 'skills', timeoutMs)
      : []
    if (skillsDirs.length) {
      const contributions: ResolvedContribution[] = []
      for (const skillName of skillsDirs) {
        const resolved = await materializeCandidate(packageInfo, {
          skillName,
          sourcePath: `skills/${skillName}`,
          sourceKind: 'github',
          sourceRepo: context.repo!,
          sourceRef: ref,
          official: context.override?.official !== false,
          resolver: 'githubHeuristic',
        }, cacheRoot)
        if (resolved) {
          contributions.push(resolved)
        }
      }
      if (contributions.length) {
        return contributions
      }
    }

    for (const path of context.pathCandidates) {
      const candidateSkillName = context.override?.path && path === context.override.path
        ? (context.override.skillName || path.split('/').pop() || packageInfo.packageName)
        : path.split('/').pop() || packageInfo.packageName

      const resolved = await materializeCandidate(packageInfo, {
        skillName: candidateSkillName,
        sourcePath: path,
        sourceKind: 'github',
        sourceRepo: context.repo!,
        sourceRef: ref,
        official: context.override?.official !== false,
        resolver: 'githubHeuristic',
      }, cacheRoot)

      if (resolved) {
        return [resolved]
      }
    }

    return null
  }

  const fallbackRefs = dedupe([
    await fetchGitHubDefaultBranch(context.repo, timeoutMs) || '',
    'main',
    'master',
  ])

  for (const ref of fallbackRefs) {
    const resolved = await tryResolveForRef(ref, true)
    if (resolved?.length) {
      return { contributions: resolved, issues: context.issues, skipped: context.skipped }
    }
  }

  for (const ref of context.refs) {
    const resolved = await tryResolveForRef(ref, true)
    if (resolved?.length) {
      return { contributions: resolved, issues: context.issues, skipped: context.skipped }
    }
  }

  context.skipped.push(makeSkip(packageInfo.packageName, context.override?.skillName || packageInfo.packageName, 'No GitHub skill found using configured refs and path heuristics', 'github'))
  return {
    contributions: [],
    issues: context.issues,
    skipped: context.skipped,
  }
}

async function resolveViaMetadataRouter(
  packageInfo: InstalledPackageInfo,
  cacheRoot: string,
): Promise<RemoteResolveResult> {
  const { repoUrl, sourceRepo } = resolveRepositoryUrl(packageInfo)
  const docsUrl = resolveDocsUrl(packageInfo)

  if (!repoUrl && !docsUrl) {
    return {
      contributions: [],
      issues: [],
      skipped: [makeSkip(packageInfo.packageName, packageInfo.packageName, 'No package metadata was available to generate a metadata-routed skill', 'generated')],
    }
  }

  const skillName = resolveMetadataRouterSkillName(packageInfo.packageName)
  const targetDir = join(
    cacheRoot,
    'generated',
    'metadata-router',
    sanitizeSegment(packageInfo.packageName),
    sanitizeSegment(packageInfo.version || 'unknown'),
    sanitizeSegment(skillName),
  )
  const skillFilePath = join(targetDir, 'SKILL.md')

  if (await pathExists(skillFilePath)) {
    return {
      contributions: [
        normalizeContribution({
          packageName: packageInfo.packageName,
          version: packageInfo.version,
          sourceDir: targetDir,
          skillName,
          description: packageInfo.description,
          sourceKind: 'generated',
          sourceRepo,
          repoUrl,
          docsUrl,
          official: true,
          resolver: 'metadataRouter',
          forceIncludeScripts: false,
        }, targetDir, join(targetDir, '..')),
      ],
      issues: [],
      skipped: [],
    }
  }

  const files = createMetadataRouterSkillFiles({
    packageName: packageInfo.packageName,
    skillName,
    description: packageInfo.description,
    repoUrl,
    docsUrl,
  })

  for (const [relativePath, contents] of Object.entries(files)) {
    const destination = join(targetDir, relativePath)
    await ensureDir(dirname(destination))
    await fsp.writeFile(destination, contents, 'utf8')
  }

  return {
    contributions: [
      normalizeContribution({
        packageName: packageInfo.packageName,
        version: packageInfo.version,
        sourceDir: targetDir,
        skillName,
        description: packageInfo.description,
        sourceKind: 'generated',
        sourceRepo,
        repoUrl,
        docsUrl,
        official: true,
        resolver: 'metadataRouter',
        forceIncludeScripts: false,
      }, targetDir, join(targetDir, '..')),
    ],
    issues: [],
    skipped: [],
  }
}

export async function resolveRemoteContributionsForPackage(
  packageInfo: InstalledPackageInfo,
  options: RemoteResolveOptions,
): Promise<RemoteResolveResult> {
  const githubAgentsPromise = options.enableGithubLookup
    ? resolveViaGitHubAgents(packageInfo, options.cacheRoot, options.githubLookupTimeoutMs)
    : {
        contributions: [],
        issues: [],
        skipped: [],
      }
  const wellKnownPromise = options.enableWellKnownLookup === false
    ? {
        contributions: [],
        issues: [],
        skipped: [],
      }
    : resolveViaWellKnown(packageInfo, options.cacheRoot, options.githubLookupTimeoutMs, options.wellKnownLimits)

  const [githubAgentsResult, wellKnownResult] = await Promise.all([
    githubAgentsPromise,
    wellKnownPromise,
  ])

  if (githubAgentsResult.contributions.length) {
    return githubAgentsResult
  }

  if (wellKnownResult.contributions.length) {
    return {
      contributions: wellKnownResult.contributions,
      issues: [...githubAgentsResult.issues, ...wellKnownResult.issues],
      skipped: wellKnownResult.skipped,
    }
  }

  const githubHeuristicResult = options.enableGithubLookup && options.enableGithubHeuristics
    ? await resolveViaGitHubHeuristics(packageInfo, options.cacheRoot, options.githubLookupTimeoutMs)
    : {
        contributions: [],
        issues: [],
        skipped: [],
      }

  if (githubHeuristicResult.contributions.length) {
    return {
      contributions: githubHeuristicResult.contributions,
      issues: [...githubAgentsResult.issues, ...wellKnownResult.issues, ...githubHeuristicResult.issues],
      skipped: wellKnownResult.skipped,
    }
  }

  const generatedResult = await resolveViaMetadataRouter(packageInfo, options.cacheRoot)

  if (generatedResult.contributions.length) {
    return {
      contributions: generatedResult.contributions,
      issues: [...githubAgentsResult.issues, ...wellKnownResult.issues, ...githubHeuristicResult.issues, ...generatedResult.issues],
      skipped: [...wellKnownResult.skipped, ...generatedResult.skipped],
    }
  }

  return {
    contributions: [],
    issues: [...githubAgentsResult.issues, ...wellKnownResult.issues, ...githubHeuristicResult.issues, ...generatedResult.issues],
    skipped: [...wellKnownResult.skipped, ...githubHeuristicResult.skipped, ...generatedResult.skipped],
  }
}
