import type { NuxtPackMetadata, SkillResolverKind } from '../shared/skill-render'
import type { InvalidTarget, SkillHubTarget } from './agents'
import type {
  AgentSkillDeclaration,
  ResolvedContribution,
  SkillHubContribution,
  SkillSourceKind,
  ValidatedContribution,
  ValidationIssue,
} from './types'
import { randomBytes } from 'node:crypto'
import { existsSync, promises as fsp, lstatSync } from 'node:fs'
import { homedir } from 'node:os'
import process from 'node:process'
import matter from 'gray-matter'
import { basename, dirname, isAbsolute, join, relative, resolve } from 'pathe'
import { findWorkspaceDir, readPackageJSON, resolvePackageJSON } from 'pkg-types'
import { detectInstalledTargets, resolveAgentTargetConfig, validateTargets } from './agents'
import { loadNuxtRuleFiles } from './nuxt-content'
import { loadVueSkillFiles } from './vue-content'

export const MANAGED_HINT_START = '<!-- nuxt-skill-hub:start -->'
export const MANAGED_HINT_END = '<!-- nuxt-skill-hub:end -->'

const SKILL_NAME_MAX_LENGTH = 64
const SKILL_NAME_PATTERN = /^[a-z0-9-]+$/

export async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (!items.length) {
    return []
  }

  const results: R[] = []
  let nextIndex = 0
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const index = nextIndex++
      if (index >= items.length) {
        return
      }

      results[index] = await mapper(items[index]!, index)
    }
  })

  await Promise.all(workers)
  return results
}

export interface PackageSkillDiscovery {
  packageName: string
  version?: string
  packageRoot: string
  skills: AgentSkillDeclaration[]
  issues: ValidationIssue[]
}

export interface InstalledPackageMetadata {
  packageName: string
  version?: string
  description?: string
  packageRoot: string
  repository?: string
  homepage?: string
  docsUrls?: string[]
  packageData: unknown
}

export interface GeneratedModuleEntry {
  packageName: string
  version?: string
  skillName: string
  entryPath?: string
  sourceDir: string
  destination: string
  scriptsIncluded: boolean
  description?: string
  sourceKind: SkillSourceKind
  sourceLabel: string
  sourceRepo?: string
  sourceRef?: string
  sourcePath?: string
  repoUrl?: string
  docsUrl?: string
  official: boolean
  trustLevel: 'official' | 'community'
  resolver: SkillResolverKind
  wrapperPath?: string
}

export async function pathExists(path: string): Promise<boolean> {
  try {
    await fsp.access(path)
    return true
  }
  catch {
    return false
  }
}

export async function ensureDir(path: string): Promise<void> {
  await fsp.mkdir(path, { recursive: true })
}

export async function emptyDir(path: string): Promise<void> {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      await fsp.rm(path, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 })
      break
    }
    catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if ((code === 'ENOTEMPTY' || code === 'EBUSY') && attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, 50))
        continue
      }
      throw error
    }
  }
  await ensureDir(path)
}

export async function writeFileIfChanged(path: string, contents: string): Promise<void> {
  const previous = await pathExists(path) ? await fsp.readFile(path, 'utf8') : null
  if (previous === contents) {
    return
  }
  await ensureDir(dirname(path))
  await fsp.writeFile(path, contents, 'utf8')
}

async function hasWorkspacePackageConfig(path: string): Promise<boolean> {
  const packageJsonPath = join(path, 'package.json')
  if (!(await pathExists(packageJsonPath))) {
    return false
  }

  try {
    const packageJson = JSON.parse(await fsp.readFile(packageJsonPath, 'utf8')) as { workspaces?: unknown }
    return Array.isArray(packageJson.workspaces) || (!!packageJson.workspaces && typeof packageJson.workspaces === 'object')
  }
  catch {
    return false
  }
}

export async function resolveExportRoot(rootDir: string): Promise<string> {
  const appRoot = resolve(rootDir)
  const workspaceDir = await findWorkspaceDir(appRoot).catch(() => null)
  if (!workspaceDir) {
    return appRoot
  }

  const resolvedWorkspaceDir = resolve(workspaceDir)
  let current = appRoot
  while (true) {
    if (await pathExists(join(current, 'pnpm-workspace.yaml')) || await hasWorkspacePackageConfig(current)) {
      return current
    }

    if (current === resolvedWorkspaceDir) {
      return appRoot
    }

    const parent = dirname(current)
    if (parent === current) {
      return appRoot
    }
    current = parent
  }
}

export function resolveMonorepoScopePath(rootDir: string, exportRoot: string): string | undefined {
  const appRoot = resolve(rootDir)
  const resolvedExportRoot = resolve(exportRoot)

  if (appRoot === resolvedExportRoot) {
    return undefined
  }

  const scopePath = relative(resolvedExportRoot, appRoot).replace(/\/+$/, '')
  return scopePath || undefined
}

export function createValidationIssue(packageName: string, skillName: string, reason: string, sourceKind?: SkillSourceKind): ValidationIssue {
  return {
    severity: 'warning',
    packageName,
    skillName,
    reason,
    sourceKind,
  }
}

export function isValidSkillName(name: string): boolean {
  if (!name || name.length > SKILL_NAME_MAX_LENGTH) {
    return false
  }

  if (!SKILL_NAME_PATTERN.test(name)) {
    return false
  }

  if (name.startsWith('-') || name.endsWith('-') || name.includes('--')) {
    return false
  }

  return true
}

export interface ParsedAgentSkillDeclarations {
  skills: AgentSkillDeclaration[]
  issues: ValidationIssue[]
}

export function parseAgentSkillDeclarations(pkg: unknown, packageName: string, sourceKind?: SkillSourceKind): ParsedAgentSkillDeclarations {
  const raw = pkg && typeof pkg === 'object'
    ? (pkg as { agents?: { skills?: unknown } }).agents?.skills
    : undefined

  if (!Array.isArray(raw)) {
    return { skills: [], issues: [] }
  }

  const skills: AgentSkillDeclaration[] = []
  const issues: ValidationIssue[] = []

  for (const [index, entry] of raw.entries()) {
    if (!entry || typeof entry !== 'object') {
      issues.push(createValidationIssue(packageName, `entry-${index + 1}`, 'agents.skills entry must be an object', sourceKind))
      continue
    }

    const name = typeof entry.name === 'string' ? entry.name.trim() : ''
    const path = typeof entry.path === 'string' ? entry.path.trim() : ''

    if (!name) {
      issues.push(createValidationIssue(packageName, `entry-${index + 1}`, 'agents.skills entry is missing a non-empty "name"', sourceKind))
      continue
    }

    if (!path) {
      issues.push(createValidationIssue(packageName, name, 'agents.skills entry is missing a non-empty "path"', sourceKind))
      continue
    }

    if (!isValidSkillName(name)) {
      issues.push(createValidationIssue(packageName, name, 'skill name must be hyphen-case, lowercase, <=64 chars, and cannot contain consecutive hyphens', sourceKind))
      continue
    }

    skills.push({ name, path })
  }

  return { skills, issues }
}

function packageNameFromSpecifier(specifier: string): string {
  if (specifier.startsWith('@')) {
    const [scope, name] = specifier.split('/')
    return name ? `${scope}/${name}` : specifier
  }
  return specifier.split('/')[0] || specifier
}

function extractModuleSpecifier(moduleEntry: unknown): string | null {
  if (typeof moduleEntry === 'string') {
    return moduleEntry
  }

  if (Array.isArray(moduleEntry) && typeof moduleEntry[0] === 'string') {
    return moduleEntry[0]
  }

  return null
}

function isPackageSpecifier(specifier: string): boolean {
  if (!specifier) {
    return false
  }

  if (specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith('file:')) {
    return false
  }

  return true
}

function isSubPath(parent: string, child: string): boolean {
  const rel = relative(resolve(parent), resolve(child))
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel))
}

function readRepositoryUrl(repository: string | { url?: string } | undefined): string | undefined {
  if (typeof repository === 'string')
    return repository
  if (repository && typeof repository.url === 'string')
    return repository.url
  return undefined
}

function readUrlValues(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap(readUrlValues)
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()]
  }

  if (value && typeof value === 'object' && 'url' in value) {
    const url = (value as { url?: unknown }).url
    return typeof url === 'string' && url.trim() ? [url.trim()] : []
  }

  return []
}

function dedupe(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
}

async function discoverInstalledPackageFromSpecifier(specifier: string, rootDir: string): Promise<InstalledPackageMetadata | null> {
  if (!isPackageSpecifier(specifier)) {
    return null
  }

  let packageJsonPath: string
  try {
    packageJsonPath = await resolvePackageJSON(specifier, { url: rootDir })
  }
  catch {
    const fallback = join(rootDir, 'node_modules', packageNameFromSpecifier(specifier), 'package.json')
    if (!existsSync(fallback))
      return null
    packageJsonPath = fallback
  }

  return readInstalledPackageMetadata(packageJsonPath, specifier)
}

export async function discoverInstalledPackageFromDirectory(directory: string): Promise<InstalledPackageMetadata | null> {
  const packageJsonPath = join(directory, 'package.json')
  if (!(await pathExists(packageJsonPath))) {
    return null
  }

  return readInstalledPackageMetadata(packageJsonPath)
}

export async function collectInstalledModulePackages(
  modules: unknown[] | undefined,
  rootDir: string,
): Promise<InstalledPackageMetadata[]> {
  const specifiers = Array.from(new Set(
    (modules || [])
      .map(entry => extractModuleSpecifier(entry))
      .filter((entry): entry is string => Boolean(entry)),
  ))

  const resolved = await Promise.all(
    specifiers.map(specifier => discoverInstalledPackageFromSpecifier(specifier, rootDir)),
  )

  const seenPackageRoots = new Set<string>()
  const packages: InstalledPackageMetadata[] = []
  for (const pkg of resolved) {
    if (!pkg || seenPackageRoots.has(pkg.packageRoot))
      continue
    seenPackageRoots.add(pkg.packageRoot)
    packages.push(pkg)
  }

  return packages
}

async function readInstalledPackageMetadata(packageJsonPath: string, fallbackSpecifier?: string): Promise<InstalledPackageMetadata> {
  const pkg = await readPackageJSON(packageJsonPath)
  const docsUrls = dedupe([
    ...readUrlValues((pkg as { docs?: unknown }).docs),
    ...readUrlValues((pkg as { documentation?: unknown }).documentation),
    ...readUrlValues(pkg.homepage),
  ])

  return {
    packageName: pkg.name || (fallbackSpecifier ? packageNameFromSpecifier(fallbackSpecifier) : basename(dirname(packageJsonPath))),
    version: pkg.version,
    description: pkg.description,
    packageRoot: dirname(packageJsonPath),
    repository: readRepositoryUrl(pkg.repository as string | { url?: string } | undefined),
    homepage: pkg.homepage,
    docsUrls,
    packageData: pkg,
  }
}

export function discoverPackageSkillsFromInstalledPackage(
  installedPackage: InstalledPackageMetadata,
  sourceKind: SkillSourceKind = 'dist',
): PackageSkillDiscovery | null {
  const parsed = parseAgentSkillDeclarations(installedPackage.packageData, installedPackage.packageName, sourceKind)
  const skills = parsed.skills

  if (!skills.length && !parsed.issues.length) {
    return null
  }

  return {
    packageName: installedPackage.packageName,
    version: installedPackage.version,
    packageRoot: installedPackage.packageRoot,
    skills,
    issues: parsed.issues,
  }
}

export async function discoverLocalPackageSkills(rootDir: string): Promise<PackageSkillDiscovery | null> {
  const packageJsonPath = join(rootDir, 'package.json')
  if (!(await pathExists(packageJsonPath))) {
    return null
  }

  const pkg = await readPackageJSON(packageJsonPath)
  const packageName = pkg.name || 'local-project'
  const parsed = parseAgentSkillDeclarations(pkg, packageName, 'dist')
  if (!parsed.skills.length && !parsed.issues.length) {
    return null
  }

  return {
    packageName,
    version: pkg.version,
    packageRoot: rootDir,
    skills: parsed.skills,
    issues: parsed.issues,
  }
}

function normalizeSkillName(rawSkillName: string | undefined, sourceDir: string): string {
  return rawSkillName?.trim() || basename(sourceDir).trim()
}

export function normalizeContribution(contribution: SkillHubContribution, sourceDir: string, sourceRoot: string): ResolvedContribution {
  return {
    packageName: contribution.packageName,
    version: contribution.version,
    sourceDir,
    sourceRoot,
    skillName: normalizeSkillName(contribution.skillName, sourceDir),
    sourceKind: contribution.sourceKind || 'dist',
    description: contribution.description,
    sourceRepo: contribution.sourceRepo,
    sourceRef: contribution.sourceRef,
    sourcePath: contribution.sourcePath,
    repoUrl: contribution.repoUrl,
    docsUrl: contribution.docsUrl,
    official: contribution.official ?? true,
    resolver: contribution.resolver || 'agentsField',
    forceIncludeScripts: contribution.forceIncludeScripts ?? false,
  }
}

async function validateContribution(contribution: ResolvedContribution): Promise<ValidatedContribution> {
  const issues: ValidationIssue[] = []

  if (!isSubPath(contribution.sourceRoot, contribution.sourceDir)) {
    issues.push(createValidationIssue(contribution.packageName, contribution.skillName, 'skill path must stay within package root', contribution.sourceKind))
  }

  if (!isValidSkillName(contribution.skillName)) {
    issues.push(createValidationIssue(contribution.packageName, contribution.skillName, 'skill name must be hyphen-case, lowercase, <=64 chars, and cannot contain consecutive hyphens', contribution.sourceKind))
  }

  const sourceDirName = basename(contribution.sourceDir)
  if (sourceDirName !== contribution.skillName) {
    issues.push(createValidationIssue(contribution.packageName, contribution.skillName, `skill directory name "${sourceDirName}" must match declared skill name`, contribution.sourceKind))
  }

  const skillFilePath = join(contribution.sourceDir, 'SKILL.md')
  if (!(await pathExists(skillFilePath))) {
    issues.push(createValidationIssue(contribution.packageName, contribution.skillName, 'SKILL.md is required at skill root', contribution.sourceKind))
    return { contribution, issues }
  }

  const skillContents = await fsp.readFile(skillFilePath, 'utf8')
  if (!matter.test(skillContents)) {
    issues.push(createValidationIssue(contribution.packageName, contribution.skillName, 'SKILL.md must include YAML frontmatter', contribution.sourceKind))
    return { contribution, issues }
  }

  let frontmatter: { name?: string, description?: string }
  try {
    const parsed = matter(skillContents).data
    frontmatter = {
      name: typeof parsed.name === 'string' ? parsed.name.trim() : undefined,
      description: typeof parsed.description === 'string' ? parsed.description.trim() : undefined,
    }
  }
  catch {
    issues.push(createValidationIssue(contribution.packageName, contribution.skillName, 'SKILL.md must include YAML frontmatter', contribution.sourceKind))
    return { contribution, issues }
  }

  if (!frontmatter.name) {
    issues.push(createValidationIssue(contribution.packageName, contribution.skillName, 'SKILL.md frontmatter must include non-empty "name"', contribution.sourceKind))
  }
  else if (frontmatter.name !== contribution.skillName) {
    issues.push(createValidationIssue(contribution.packageName, contribution.skillName, `SKILL.md frontmatter name "${frontmatter.name}" must match declared skill name`, contribution.sourceKind))
  }

  if (!frontmatter.description) {
    issues.push(createValidationIssue(contribution.packageName, contribution.skillName, 'SKILL.md frontmatter must include non-empty "description"', contribution.sourceKind))
  }

  return {
    contribution: {
      ...contribution,
      description: frontmatter.description || contribution.description,
    },
    issues,
  }
}

export interface ResolveContributionsResult {
  contributions: ResolvedContribution[]
  issues: ValidationIssue[]
}

export async function validateResolvedContributions(contributions: ResolvedContribution[]): Promise<ResolveContributionsResult> {
  const validations = await Promise.all(contributions.map(validateContribution))
  const valid: ResolvedContribution[] = []
  const issues: ValidationIssue[] = []

  for (const validation of validations) {
    if (validation.issues.length) {
      issues.push(...validation.issues)
      continue
    }
    valid.push(validation.contribution)
  }

  return {
    contributions: sortAndDedupeContributions(valid),
    issues,
  }
}

export async function resolveContributions(discoveries: PackageSkillDiscovery[]): Promise<ResolveContributionsResult> {
  const contributions: ResolvedContribution[] = []
  const issues: ValidationIssue[] = []

  for (const discovery of discoveries) {
    issues.push(...discovery.issues)

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

  const validated = await validateResolvedContributions(contributions)

  return {
    contributions: validated.contributions,
    issues: [...issues, ...validated.issues],
  }
}

export function sortAndDedupeContributions(contributions: ResolvedContribution[]): ResolvedContribution[] {
  const byKey = new Map<string, ResolvedContribution>()

  for (const contribution of contributions) {
    const key = [
      contribution.packageName,
      contribution.skillName,
      contribution.sourceDir,
    ].join('::')
    byKey.set(key, contribution)
  }

  return Array.from(byKey.values())
    .sort((a, b) => {
      const left = `${a.packageName}::${a.skillName}::${a.sourceDir}`
      const right = `${b.packageName}::${b.skillName}::${b.sourceDir}`
      return left.localeCompare(right)
    })
}

export async function deriveSkillName(rootDir: string): Promise<string> {
  const pkg = await readPackageJSON(rootDir).catch(() => null)
  const projectName = (pkg?.name || '').replace(/^@[^/]+\//, '').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '')
  const skillName = projectName ? `nuxt-${projectName}` : 'nuxt'
  return isValidSkillName(skillName) ? skillName : 'nuxt'
}

export function sanitizeSegment(value: string): string {
  return value.replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '') || 'unknown'
}

export async function copySkillTree(sourceDir: string, destinationDir: string, includeScripts: boolean): Promise<void> {
  await emptyDir(destinationDir)
  await fsp.cp(sourceDir, destinationDir, {
    recursive: true,
    force: true,
    filter: (source) => {
      const relativePath = relative(sourceDir, source)
      if (!relativePath) {
        return true
      }

      if (relativePath.split('/').includes('..')) {
        return false
      }

      if (!includeScripts && (relativePath === 'scripts' || relativePath.startsWith('scripts/'))) {
        return false
      }

      return !lstatSync(source).isSymbolicLink()
    },
  })
}

const RENAME_RETRY_CODES = new Set(['EPERM', 'EACCES', 'EBUSY'])
const RENAME_RETRY_DELAYS_MS = [50, 100, 200, 400, 800]

/**
 * Windows denies a rename while another process (a watcher, indexer or virus scanner) holds a
 * handle in the tree, which clears within a few hundred milliseconds.
 */
async function renameWithRetry(from: string, to: string): Promise<void> {
  for (const delay of RENAME_RETRY_DELAYS_MS) {
    try {
      await fsp.rename(from, to)
      return
    }
    catch (error) {
      if (!RENAME_RETRY_CODES.has((error as NodeJS.ErrnoException).code ?? '')) {
        throw error
      }
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  await fsp.rename(from, to)
}

function isProcessAlive(pid: number): boolean {
  try {
    process.kill(pid, 0)
    return true
  }
  catch (error) {
    return (error as NodeJS.ErrnoException).code === 'EPERM'
  }
}

/**
 * Returns a staging path next to `target` that no other process uses, so a dev server and
 * `nuxt prepare` can't wipe each other's tree. Removes staging trees left by runs that crashed.
 */
export async function createStagingPath(target: string): Promise<string> {
  const prefix = `${basename(target)}.staging`
  const parent = dirname(target)
  await ensureDir(parent)
  for (const name of await fsp.readdir(parent)) {
    if (!name.startsWith(prefix)) {
      continue
    }
    const pid = Number(name.slice(prefix.length + 1).split('-')[0])
    if (!pid || !isProcessAlive(pid)) {
      await fsp.rm(join(parent, name), { recursive: true, force: true })
    }
  }
  return join(parent, `${prefix}-${process.pid}-${randomBytes(4).toString('hex')}`)
}

/**
 * Moves a finished `staging` tree to `target`. If the move fails, the old tree goes back to
 * `target`. If another process published `target` meanwhile, its tree wins.
 */
export async function swapDir(staging: string, target: string): Promise<void> {
  const previous = `${target}.previous`
  await fsp.rm(previous, { recursive: true, force: true })
  const hadTarget = await pathExists(target)
  if (hadTarget) {
    await renameWithRetry(target, previous)
  }
  try {
    await renameWithRetry(staging, target)
  }
  catch (error) {
    if (await pathExists(target)) {
      await fsp.rm(previous, { recursive: true, force: true })
      return
    }
    if (hadTarget) {
      await renameWithRetry(previous, target)
    }
    throw error
  }
  await fsp.rm(previous, { recursive: true, force: true })
}

/** Like `copySkillTree`, but the destination switches over only once the copy is complete. */
export async function replaceSkillTree(sourceDir: string, destinationDir: string): Promise<void> {
  const staging = await createStagingPath(destinationDir)
  try {
    await copySkillTree(sourceDir, staging, true)
    await swapDir(staging, destinationDir)
  }
  finally {
    await fsp.rm(staging, { recursive: true, force: true })
  }
}

export function resolveTargets(
  explicitTargets: SkillHubTarget[],
): { targets: SkillHubTarget[], invalidTargets: InvalidTarget[] } {
  if (explicitTargets.length) {
    const { valid, invalid } = validateTargets(explicitTargets)
    return {
      targets: valid,
      invalidTargets: invalid,
    }
  }

  return {
    targets: detectInstalledTargets(),
    invalidTargets: [],
  }
}

export async function buildNuxtTemplateFiles(nuxtDir: string, packs: NuxtPackMetadata[]): Promise<Array<{ path: string, contents: string }>> {
  const nuxtRuleFiles = await loadNuxtRuleFiles()

  return packs.map((pack) => {
    const contents = nuxtRuleFiles[pack.relativePath]
    if (contents === undefined) {
      throw new Error(`Missing Nuxt rule pack ${pack.relativePath}`)
    }
    return { path: join(nuxtDir, pack.relativePath), contents }
  })
}

export async function buildVueTemplateFiles(vueDir: string): Promise<Array<{ path: string, contents: string }>> {
  const vueFiles = await loadVueSkillFiles()

  return Object.entries(vueFiles).map(([name, contents]) => ({
    path: join(vueDir, name),
    contents,
  }))
}

export function createModuleDestination(baseModulesDir: string, contribution: SkillHubContribution): string {
  return join(
    baseModulesDir,
    sanitizeSegment(contribution.packageName),
    sanitizeSegment(contribution.skillName || basename(contribution.sourceDir)),
  )
}

export function getTargetSkillRoot(
  rootDir: string,
  target: SkillHubTarget,
  skillName: string,
): { targetDir: string, skillRoot: string } {
  const targetConfig = resolveAgentTargetConfig(target)
  if (!targetConfig) {
    throw new Error(`Target "${target}" could not be resolved from unagent.`)
  }

  if (!targetConfig.projectSkillsDir) {
    throw new Error(`Target "${target}" configDir "${targetConfig.configDir}" is not under home "${homedir()}".`)
  }

  const targetDir = resolve(rootDir, targetConfig.projectSkillsDir)
  return { targetDir, skillRoot: join(targetDir, skillName) }
}

// Skills from old `onmax/nuxt-skills` that nuxt-skill-hub also generates (built-in or via modules)
const CONFLICTING_SKILL_NAMES = [
  'nuxt',
  'vue',
  'nuxt-ui',
  'nuxt-content',
  'nuxt-seo',
  'nuxt-modules',
  'nuxt-better-auth',
  'nuxthub',
  'reka-ui',
  'vueuse',
  'tresjs',
  'motion',
]

export interface ConflictingSkillsResult {
  globalDir: string
  skillNames: string[]
}

export function detectConflictingSkills(targets: SkillHubTarget[], generatedSkillName: string): ConflictingSkillsResult[] {
  const seen = new Map<string, ConflictingSkillsResult>()

  for (const target of targets) {
    const config = resolveAgentTargetConfig(target)
    if (!config)
      continue

    const globalSkillsDir = join(config.configDir, config.skillsDir)
    if (seen.has(globalSkillsDir) || !existsSync(globalSkillsDir))
      continue

    const found: string[] = []
    for (const name of CONFLICTING_SKILL_NAMES) {
      // When skillName falls back to 'nuxt', skip it since it's ours
      if (name === generatedSkillName)
        continue
      if (existsSync(join(globalSkillsDir, name, 'SKILL.md'))) {
        found.push(name)
      }
    }

    if (found.length) {
      seen.set(globalSkillsDir, { globalDir: globalSkillsDir, skillNames: found })
    }
  }

  return Array.from(seen.values())
}

export function formatConflictWarning(conflict: ConflictingSkillsResult): string {
  return `Found ${conflict.skillNames.length} standalone skill(s) that may conflict with nuxt-skill-hub: `
    + `${conflict.skillNames.join(', ')} (global: ${conflict.globalDir}). `
    + `Remove with: npx skills remove --global`
}
