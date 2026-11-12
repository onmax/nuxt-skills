import type { SkillResolverKind, SkillSourceKind, SkillTrustLevel } from '../shared/skill-render'
import type { SkillHubTarget } from './agents'

export type { SkillResolverKind, SkillSourceKind, SkillTrustLevel }

export type SkillHubGenerationMode = 'prepare' | 'manual'
export const DEFAULT_SKILL_HUB_GENERATION_MODE: SkillHubGenerationMode = 'prepare'
export const DEFAULT_REMOTE_TIMEOUT_MS = 1500
export const DEFAULT_REMOTE_CACHE_TTL_MS = 1000 * 60 * 60 * 24
export const DEFAULT_REMOTE_CONCURRENCY = 8
export const DEFAULT_WELL_KNOWN_MAX_FILES = 40
export const DEFAULT_WELL_KNOWN_MAX_BYTES = 512 * 1024
export const DEFAULT_WELL_KNOWN_MAX_FILE_BYTES = 128 * 1024

export function normalizeGenerationMode(value: string | undefined | null): SkillHubGenerationMode {
  return value === 'manual' ? 'manual' : DEFAULT_SKILL_HUB_GENERATION_MODE
}

export interface SkillHubRemoteOptions {
  enabled?: boolean
  timeoutMs?: number
  concurrency?: number
  refresh?: boolean
  cacheTtlMs?: number
  githubHeuristics?: boolean
  timings?: boolean
  maxFiles?: number
  maxBytes?: number
  maxFileBytes?: number
}

export interface NormalizedSkillHubRemoteOptions {
  enabled: boolean
  timeoutMs: number
  concurrency: number
  refresh: boolean
  cacheTtlMs: number
  githubHeuristics: boolean
  timings: boolean
  maxFiles: number
  maxBytes: number
  maxFileBytes: number
}

function positiveNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback
}

function nonNegativeNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback
}

function positiveInteger(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : fallback
}

export function normalizeRemoteOptions(value: boolean | SkillHubRemoteOptions | undefined): NormalizedSkillHubRemoteOptions {
  const options = typeof value === 'object' && value ? value : {}
  const enabled = typeof value === 'boolean' ? value : options.enabled !== false

  return {
    enabled,
    timeoutMs: positiveNumber(options.timeoutMs, DEFAULT_REMOTE_TIMEOUT_MS),
    concurrency: positiveInteger(options.concurrency, DEFAULT_REMOTE_CONCURRENCY),
    refresh: options.refresh === true,
    cacheTtlMs: nonNegativeNumber(options.cacheTtlMs, DEFAULT_REMOTE_CACHE_TTL_MS),
    githubHeuristics: options.githubHeuristics === true,
    timings: options.timings === true,
    maxFiles: positiveNumber(options.maxFiles, DEFAULT_WELL_KNOWN_MAX_FILES),
    maxBytes: positiveNumber(options.maxBytes, DEFAULT_WELL_KNOWN_MAX_BYTES),
    maxFileBytes: positiveNumber(options.maxFileBytes, DEFAULT_WELL_KNOWN_MAX_FILE_BYTES),
  }
}

export interface SkillHubResolveStartContext {
  skillName: string
  packageCount: number
  concurrency: number
  remoteEnabled: boolean
  githubHeuristics: boolean
}

export interface SkillHubResolvePackageContext {
  skillName: string
  packageName: string
  packageIndex: number
  packageCount: number
  durationMs: number
  resolver?: SkillResolverKind
  sourceKind?: SkillSourceKind
  contributionCount: number
  skippedCount: number
}

export interface SkillHubResolveDoneContext extends SkillHubResolveStartContext {
  durationMs: number
  contributionCount: number
  skippedCount: number
  issueCount: number
  resolverCounts: Partial<Record<SkillResolverKind, number>>
}

export interface SkillHubOptions {
  skillName?: string
  targets?: SkillHubTarget[]
  moduleAuthoring?: boolean
  generationMode?: SkillHubGenerationMode
  remote?: boolean | SkillHubRemoteOptions
}

/** Events the generator emits. The Nuxt module forwards them to `nuxt.callHook`. */
export interface SkillHubHooks {
  'skill-hub:contribute': (ctx: SkillHubContributionContext) => void | Promise<void>
  'skill-hub:resolve:start': (ctx: SkillHubResolveStartContext) => void | Promise<void>
  'skill-hub:resolve:package': (ctx: SkillHubResolvePackageContext) => void | Promise<void>
  'skill-hub:resolve:done': (ctx: SkillHubResolveDoneContext) => void | Promise<void>
}

export type SkillHubCallHook = <Name extends keyof SkillHubHooks>(name: Name, ctx: Parameters<SkillHubHooks[Name]>[0]) => Promise<unknown>

export interface AgentSkillDeclaration {
  name: string
  path: string
}

export interface SkillHubContribution {
  packageName: string
  version?: string
  sourceDir: string
  skillName?: string
  description?: string
  sourceKind?: SkillSourceKind
  sourceRepo?: string
  sourceRef?: string
  sourcePath?: string
  repoUrl?: string
  docsUrl?: string
  official?: boolean
  resolver?: SkillResolverKind
  forceIncludeScripts?: boolean
}

export interface SkillHubContributionContext {
  add: (contribution: SkillHubContribution) => void
}

export interface ResolvedContribution extends SkillHubContribution {
  skillName: string
  sourceRoot: string
  sourceKind: SkillSourceKind
  description?: string
  repoUrl?: string
  docsUrl?: string
  official: boolean
  resolver: SkillResolverKind
  forceIncludeScripts: boolean
}

export type ValidationSeverity = 'warning'

export interface ValidationIssue {
  severity: ValidationSeverity
  packageName: string
  skillName: string
  reason: string
  sourceKind?: SkillSourceKind
}

export interface ValidatedContribution {
  contribution: ResolvedContribution
  issues: ValidationIssue[]
}

export interface SkillManifestSkipped {
  packageName: string
  skillName: string
  reason: string
  sourceKind?: SkillSourceKind
}
