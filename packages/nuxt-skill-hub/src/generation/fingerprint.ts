import type { NuxtContentMetadata } from '../../shared/skill-render'
import type { SkillHubOptions } from '../types'
import type { LocalSourceFingerprint } from './sources'
import { createHash } from 'node:crypto'
import { promises as fsp } from 'node:fs'
import { hash as ohash } from 'ohash'
import { join, relative } from 'pathe'
import { resolveLockfile } from 'pkg-types'
import { createSkillEntrypoint, DEFAULT_NUXT_CONTENT_METADATA } from '../../shared/skill-render'
import { loadNuxtRuleFiles } from '../nuxt-content'
import { normalizeGenerationMode, normalizeRemoteOptions } from '../types'

export interface LockfileInfo {
  path: string
  hash: string
}

export async function resolveLockfileInfo(exportRoot: string): Promise<LockfileInfo | null> {
  let lockfilePath: string

  try {
    lockfilePath = await resolveLockfile(exportRoot)
  }
  catch {
    return null
  }

  const contents = await fsp.readFile(lockfilePath)
  const hash = createHash('sha256').update(contents).digest('hex')

  return {
    path: relative(exportRoot, lockfilePath).replaceAll('\\', '/'),
    hash,
  }
}

/**
 * Hash of the content this package bundles: the rule packs and the router template.
 * Keeps the cache honest when that content changes without a version bump (local
 * development, linked checkouts).
 */
export function hashBuiltInContent(ruleFiles: Record<string, string>, metadata: NuxtContentMetadata = DEFAULT_NUXT_CONTENT_METADATA): string {
  const router = createSkillEntrypoint('fingerprint', metadata, {
    moduleAuthoring: true,
    installedPackages: metadata.packs.flatMap(pack => pack.packages || []),
  })
  return ohash({ ruleFiles, metadata, router })
}

export async function createGenerationFingerprint(input: {
  packageVersion: string
  rootDir: string
  exportRoot: string
  skillName: string
  options: SkillHubOptions
  installedPackages: Array<{ packageName: string, version?: string }>
  localSources: LocalSourceFingerprint[]
  /** Defaults to hashing the bundled rule packs and router. */
  builtInContentHash?: string
}): Promise<string> {
  const builtInContentHash = input.builtInContentHash ?? hashBuiltInContent(await loadNuxtRuleFiles())
  const rootPackageHash = await hashFileIfExists(join(input.rootDir, 'package.json'))
  const lockfile = await resolveLockfileInfo(input.exportRoot)
  const modules = [...input.installedPackages]
    .filter(pkg => pkg.packageName !== 'nuxt-skill-hub')
    .map(pkg => ({ name: pkg.packageName, version: pkg.version || null }))
    .sort((a, b) => a.name.localeCompare(b.name))
  const localSources = [...input.localSources].sort((a, b) => {
    const left = `${a.packageName}::${a.skillName}::${a.sourceDir}`
    const right = `${b.packageName}::${b.skillName}::${b.sourceDir}`
    return left.localeCompare(right)
  })

  return ohash({
    packageVersion: input.packageVersion,
    builtInContentHash,
    skillName: input.skillName,
    rootDir: input.rootDir,
    rootPackageHash,
    lockfile,
    modules,
    localSources,
    skillHub: {
      skillName: input.options.skillName?.trim() || null,
      targets: [...(input.options.targets || [])].sort(),
      moduleAuthoring: Boolean(input.options.moduleAuthoring),
      generationMode: normalizeGenerationMode(input.options.generationMode),
      remote: normalizeRemoteOptions(input.options.remote),
    },
  })
}

async function hashFileIfExists(path: string): Promise<string | null> {
  try {
    const contents = await fsp.readFile(path)
    return createHash('sha256').update(contents).digest('hex')
  }
  catch {
    return null
  }
}
