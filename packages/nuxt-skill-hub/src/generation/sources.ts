import type { Buffer } from 'node:buffer'
import type { PackageSkillDiscovery } from '../internal'
import type {
  ResolvedContribution,
  SkillHubContribution,
} from '../types'
import { createHash } from 'node:crypto'
import { promises as fsp } from 'node:fs'
import { isAbsolute, join, relative, resolve } from 'pathe'
import { glob } from 'tinyglobby'
import {
  mapWithConcurrency,
  normalizeContribution,
  sortAndDedupeContributions,
} from '../internal'

const HASH_READ_CONCURRENCY = 16

export interface LocalSourceFingerprint {
  packageName: string
  skillName: string
  sourceDir: string
  sourceRoot: string
  sourceKind: ResolvedContribution['sourceKind']
  forceIncludeScripts: boolean
  hash: string | null
}

export async function resolveManualContribution(rootDir: string, contribution: SkillHubContribution): Promise<ResolvedContribution> {
  const sourceDir = isAbsolute(contribution.sourceDir)
    ? contribution.sourceDir
    : resolve(rootDir, contribution.sourceDir)

  return normalizeContribution(contribution, sourceDir, sourceDir)
}

export function collectWorkspaceDiscoverySources(_rootDir: string, discoveries: PackageSkillDiscovery[]): ResolvedContribution[] {
  const contributions: ResolvedContribution[] = []

  for (const discovery of discoveries) {
    if (!isLocalDiscoveryRoot(discovery.packageRoot)) {
      continue
    }

    for (const skill of discovery.skills) {
      const sourceDir = resolve(discovery.packageRoot, skill.path)
      contributions.push(normalizeContribution({
        packageName: discovery.packageName,
        version: discovery.version,
        sourceDir,
        skillName: skill.name,
      }, sourceDir, discovery.packageRoot))
    }
  }

  return sortAndDedupeContributions(contributions)
}

function isLocalDiscoveryRoot(packageRoot: string): boolean {
  const normalizedRoot = resolve(packageRoot).replaceAll('\\', '/')
  return !/(?:^|\/)node_modules(?:\/|$)/.test(normalizedRoot)
}

export async function createLocalSourceFingerprints(contributions: ResolvedContribution[]): Promise<LocalSourceFingerprint[]> {
  const fingerprints = await Promise.all(contributions.map(async contribution => ({
    packageName: contribution.packageName,
    skillName: contribution.skillName,
    sourceDir: resolve(contribution.sourceDir).replaceAll('\\', '/'),
    sourceRoot: resolve(contribution.sourceRoot).replaceAll('\\', '/'),
    sourceKind: contribution.sourceKind,
    forceIncludeScripts: contribution.forceIncludeScripts,
    hash: await hashDirectoryTreeIfExists(contribution.sourceDir),
  })))

  return fingerprints.sort((a, b) => {
    const left = `${a.packageName}::${a.skillName}::${a.sourceDir}`
    const right = `${b.packageName}::${b.skillName}::${b.sourceDir}`
    return left.localeCompare(right)
  })
}

async function hashDirectoryTreeIfExists(rootPath: string): Promise<string | null> {
  let rootStat
  try {
    rootStat = await fsp.lstat(rootPath)
  }
  catch {
    return null
  }

  if (!rootStat.isDirectory()) {
    return null
  }

  const entries = await glob('**/*', {
    cwd: rootPath,
    dot: true,
    expandDirectories: false,
    followSymbolicLinks: false,
    onlyFiles: false,
  })

  entries.sort((a, b) => a.localeCompare(b))

  const chunkGroups = await mapWithConcurrency(entries, HASH_READ_CONCURRENCY, async (entry): Promise<Array<string | Buffer>> => {
    const currentPath = join(rootPath, entry)
    const stat = await fsp.lstat(currentPath)
    const rel = relative(rootPath, currentPath).replaceAll('\\', '/')
    if (stat.isSymbolicLink())
      return [`symlink:${rel}:`, await fsp.readlink(currentPath), '\n']
    if (stat.isDirectory())
      return [`dir:${rel}\n`]
    if (stat.isFile())
      return [`file:${rel}:`, await fsp.readFile(currentPath), '\n']
    return [`other:${rel}:${stat.mode}\n`]
  })

  const hash = createHash('sha256')
  hash.update('dir:.\n')
  for (const chunks of chunkGroups) {
    for (const chunk of chunks) hash.update(chunk)
  }
  return hash.digest('hex')
}
