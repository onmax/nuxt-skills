import { PACKAGE_VERSION } from './package-info'

export type SkillSourceKind = 'dist' | 'bundled' | 'github' | 'wellKnown' | 'generated'
export type SkillResolverKind = 'agentsField' | 'bundled' | 'githubHeuristic' | 'wellKnownV2' | 'wellKnownSkills' | 'metadataRouter'
export type SkillTrustLevel = 'official' | 'community'

export interface NuxtPackMetadata {
  id: string
  title: string
  relativePath: string
  /** Routing table cell describing the task shape. Packs without a route are linked from the loading rules instead. */
  route?: string
  /** A user request that should land on this pack. */
  example?: string
  /** Only route to this pack when module authoring is enabled. */
  moduleAuthoring?: boolean
  /** Only route to this pack when one of these packages is installed. */
  packages?: string[]
}

export interface NuxtContentMetadata {
  id: string
  version: string
  description: string
  packs: NuxtPackMetadata[]
}

export interface SkillModuleRenderEntry {
  packageName: string
  version?: string
  skillName: string
  entryPath?: string
  description?: string
  scriptsIncluded: boolean
  sourceKind: SkillSourceKind
  sourceLabel?: string
  sourceRepo?: string
  sourceRef?: string
  sourcePath?: string
  repoUrl?: string
  docsUrl?: string
  official: boolean
  trustLevel?: SkillTrustLevel
  resolver: SkillResolverKind
  wrapperPath?: string
}

export interface SkillSkippedRenderEntry {
  packageName: string
  skillName: string
  reason: string
  sourceKind?: SkillSourceKind
}

export interface SkillFrontmatter {
  name?: string
  description?: string
}

// Single source of truth for Nuxt rule packs. Every file in `nuxt-best-practices/rules/`
// needs an entry here, and the order is the routing table order.
export const DEFAULT_NUXT_CONTENT_METADATA: NuxtContentMetadata = {
  id: 'nuxt-best-practices',
  version: PACKAGE_VERSION,
  description: 'Nuxt-native decision packs and best-practice rule packs for AI execution. Complements docs, not a replacement.',
  packs: [
    {
      id: 'abstraction-disambiguation',
      title: 'Abstraction Disambiguation',
      relativePath: 'rules/abstraction-disambiguation.md',
    },
    {
      id: 'module-authoring',
      title: 'Module Authoring Conventions',
      relativePath: 'rules/module-authoring.md',
      route: 'Writing or refactoring a Nuxt module (`defineNuxtModule`, hooks, public APIs)',
      example: 'Add a Nuxt module option, hook, or runtime extension',
      moduleAuthoring: true,
    },
    {
      id: 'nuxt-ui-primitives',
      title: 'Nuxt UI Primitives',
      relativePath: 'rules/nuxt-ui-primitives.md',
      route: 'Tables, forms, modals, dropdowns, page shells, or other UI that Nuxt UI already ships',
      example: 'This modal/table/dropdown was hand-built in raw HTML',
      packages: ['@nuxt/ui', '@nuxt/ui-pro'],
    },
    {
      id: 'content-modeling-navigation',
      title: 'Content Modeling and Navigation',
      relativePath: 'rules/content-modeling-navigation.md',
      route: 'Nuxt Content collections, structured data records, or navigation built from content',
      example: 'Build the docs sidebar from the content folder',
      packages: ['@nuxt/content'],
    },
    {
      id: 'data-fetching-ssr',
      title: 'Data Fetching and SSR',
      relativePath: 'rules/data-fetching-ssr.md',
      route: 'SSR, initial page load, route params, or data fetched for first render',
      example: 'This page fetches twice on first load',
    },
    {
      id: 'hydration-consistency',
      title: 'Hydration and SSR Consistency',
      relativePath: 'rules/hydration-consistency.md',
      route: 'Hydration warnings, `ClientOnly`, browser-only APIs, time/randomness, or SSR/CSR mismatch',
      example: 'Why do I get a hydration mismatch from Date.now()?',
    },
    {
      id: 'page-meta-head-layout',
      title: 'Page Meta, Head, and Layout',
      relativePath: 'rules/page-meta-head-layout.md',
      route: 'Page options, middleware, layout selection, title, meta tags, canonical URLs, or OG data',
      example: 'Change canonical URL and OG tags',
    },
    {
      id: 'error-surfaces-recovery',
      title: 'Error Surfaces and Recovery',
      relativePath: 'rules/error-surfaces-recovery.md',
      route: 'Global/local errors, `clearError`, `showError`, or recovery flows',
      example: '`clearError` is not behaving as expected',
    },
    {
      id: 'server-routes-runtime-config',
      title: 'Server Routes, h3 Patterns, and Runtime Config',
      relativePath: 'rules/server-routes-runtime-config.md',
      route: '`nuxt.config.*`, `runtimeConfig`, env wiring, or public/private config exposure',
      example: 'Expose only the public runtimeConfig key',
    },
    {
      id: 'nitro-h3-patterns',
      title: 'Nitro and h3 Server Patterns',
      relativePath: 'rules/nitro-h3-patterns.md',
      route: '`server/api/**`, `server/routes/**`, `defineEventHandler`, route rules, caching, or Nitro plugins',
      example: 'This server/api handler cache or route rule is wrong',
    },
    {
      id: 'architecture-boundaries',
      title: 'Architecture Boundaries',
      relativePath: 'rules/architecture-boundaries.md',
      route: 'Secrets, privileged API calls, request isolation, or server/client boundary confusion',
      example: 'Should this secret live in runtime config or client code?',
    },
    {
      id: 'plugins',
      title: 'Plugins and Runtime Boot',
      relativePath: 'rules/plugins.md',
      route: 'Plugins, injections, app boot logic, or global runtime initialization',
      example: 'Register a global helper when the app starts',
    },
    {
      id: 'performance-rendering',
      title: 'Performance and Rendering',
      relativePath: 'rules/performance-rendering.md',
      route: 'Performance regressions, rendering strategy, lazy loading, or payload/bundle cost',
      example: 'This page ships too much JavaScript',
    },
    {
      id: 'migrations',
      title: 'Migrations and Compatibility',
      relativePath: 'rules/migrations.md',
      route: 'Upgrades, deprecations, compatibility fixes, or version-boundary work',
      example: 'Upgrade this app from Nuxt 3 to Nuxt 4',
    },
    {
      id: 'verification-finish',
      title: 'Verification and Finish',
      relativePath: 'rules/verification-finish.md',
    },
  ],
}

function yamlString(value: string): string {
  return JSON.stringify(value)
}

function parseFrontmatterValue(raw: string): string {
  const value = raw.trim()
  if (!value) {
    return ''
  }

  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
    return value.slice(1, -1).trim()
  }

  return value
}

export function parseSkillFrontmatter(contents: string): SkillFrontmatter | null {
  const lines = contents.split(/\r?\n/)
  if (lines[0]?.trim() !== '---') {
    return null
  }

  const endIndex = lines.findIndex((line, index) => index > 0 && line.trim() === '---')
  if (endIndex === -1) {
    return null
  }

  const frontmatter: SkillFrontmatter = {}
  const body = lines.slice(1, endIndex)

  for (const line of body) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmed.indexOf(':')
    if (separatorIndex <= 0) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    if (!/^[\w-]+$/.test(key)) {
      continue
    }

    const value = parseFrontmatterValue(trimmed.slice(separatorIndex + 1))
    if (key === 'name') {
      frontmatter.name = value
    }
    else if (key === 'description') {
      frontmatter.description = value
    }
  }

  return frontmatter
}

export function getSourceLabel(sourceKind: SkillSourceKind): string {
  switch (sourceKind) {
    case 'dist':
      return 'Installed package skill'
    case 'bundled':
      return 'Curated nuxt-skills skill'
    case 'github':
      return 'Resolved module skill'
    case 'wellKnown':
      return 'Docs-discovered skill'
    case 'generated':
      return 'Metadata-routed skill'
  }
}

export function getTrustLevel(official: boolean): SkillTrustLevel {
  return official ? 'official' : 'community'
}

export interface MetadataRouterSkillInput {
  packageName: string
  skillName: string
  description?: string
  repoUrl?: string
  docsUrl?: string
}

function formatCompactLinks(
  entry: Pick<MetadataRouterSkillInput, 'repoUrl' | 'docsUrl'>,
  labels: {
    docs: string
    repo: string
  },
): string {
  const links: string[] = []

  if (entry.docsUrl) {
    links.push(`${labels.docs}: [${entry.docsUrl}](${entry.docsUrl})`)
  }

  if (entry.repoUrl) {
    links.push(`${labels.repo}: [${entry.repoUrl}](${entry.repoUrl})`)
  }

  return links.join('\n\n')
}

function formatWrapperLinks(
  entry: Pick<MetadataRouterSkillInput, 'repoUrl' | 'docsUrl'>,
  labels: {
    docs: string
    repo: string
  },
): string {
  const links: string[] = []

  if (entry.docsUrl) {
    links.push(`- ${labels.docs}: [${entry.docsUrl}](${entry.docsUrl})`)
  }

  if (entry.repoUrl) {
    links.push(`- ${labels.repo}: [${entry.repoUrl}](${entry.repoUrl})`)
  }

  return links.join('\n')
}

export function resolveMetadataRouterSkillName(packageName: string): string {
  if (packageName.startsWith('@')) {
    const [scope, name] = packageName.split('/')
    if (scope === '@nuxt' && name) {
      return `nuxt-${name}`
    }

    return (name || scope?.replace(/^@/, '') || '').trim()
  }

  return packageName.trim()
}

export function createMetadataRouterSkillFiles(input: MetadataRouterSkillInput): Record<string, string> {
  const description = input.description?.trim()
    || `Metadata-routed module skill for ${input.packageName}. Use it to reach the official docs and upstream source.`
  const body = createMetadataRouterContent(input).trim()

  return {
    'SKILL.md': `---
name: ${yamlString(input.skillName)}
description: ${yamlString(description)}
---

${body}
`,
  }
}

function withDerivedModuleFields(entry: SkillModuleRenderEntry): Required<Pick<SkillModuleRenderEntry, 'sourceLabel' | 'trustLevel'>> & SkillModuleRenderEntry {
  return {
    ...entry,
    sourceLabel: entry.sourceLabel || getSourceLabel(entry.sourceKind),
    trustLevel: entry.trustLevel || getTrustLevel(entry.official),
  }
}

function formatVersion(version?: string): string | undefined {
  return version ? `v${version}` : undefined
}

function relativeModuleLink(entry: SkillModuleRenderEntry, prefix: string): string {
  const path = entry.entryPath || entry.wrapperPath
  if (!path) {
    return ''
  }

  return `${prefix}${path.replace(/^references\/modules\//, '')}`
}

function groupModuleEntries(entries: SkillModuleRenderEntry[]) {
  const officialUpstream = entries.filter(entry => entry.sourceKind === 'dist')
  const bundled = entries.filter(entry => entry.sourceKind === 'bundled')
  const githubResolved = entries.filter(entry => entry.sourceKind === 'github')
  const wellKnownResolved = entries.filter(entry => entry.sourceKind === 'wellKnown')
  const metadataRouted = entries.filter(entry => entry.sourceKind === 'generated')

  return { officialUpstream, bundled, githubResolved, wellKnownResolved, metadataRouted }
}

function hasModuleGuidance(entries: SkillModuleRenderEntry[], skipped: SkillSkippedRenderEntry[] = []): boolean {
  return entries.length > 0 || skipped.length > 0
}

function renderModuleGroup(title: string, entries: SkillModuleRenderEntry[], prefix: string): string {
  if (!entries.length) {
    return ''
  }

  const lines = entries.map((rawEntry) => {
    const entry = withDerivedModuleFields(rawEntry)
    const wrapperLink = relativeModuleLink(entry, prefix)
    const description = entry.description ? ` ${entry.description}` : ''
    const version = formatVersion(entry.version)
    const versionLabel = version ? ` \`${version}\`` : ''
    return `- [${entry.packageName}](${wrapperLink})${versionLabel} - ${entry.sourceLabel}. Trust: \`${entry.trustLevel}\`.${description}`
  })

  return `### ${title}\n${lines.join('\n')}\n`
}

function renderSkippedEntries(skipped: SkillSkippedRenderEntry[]): string {
  if (!skipped.length) {
    return ''
  }

  const lines = skipped.map((entry) => {
    const base = `- **${entry.packageName}** / \`${entry.skillName}\``
    const source = entry.sourceKind ? ` (\`${entry.sourceKind}\`)` : ''
    return `${base}${source}: ${entry.reason}. Use the relevant Nuxt pack plus the module's official docs.`
  })

  return `### Skipped or unavailable\n${lines.join('\n')}\n`
}

function renderModuleSummary(entries: SkillModuleRenderEntry[], skipped: SkillSkippedRenderEntry[]): string {
  if (!hasModuleGuidance(entries, skipped)) {
    return ''
  }

  const grouped = groupModuleEntries(entries)
  const counts: Array<[string, number]> = [
    ['installed', grouped.officialUpstream.length],
    ['curated', grouped.bundled.length],
    ['resolved', grouped.githubResolved.length],
    ['docs-discovered', grouped.wellKnownResolved.length],
    ['metadata-routed', grouped.metadataRouted.length],
    ['skipped', skipped.length],
  ]
  const coverage = counts
    .filter(([, count]) => count > 0)
    .map(([label, count]) => `${count} ${label}`)
    .join(', ')

  return `## Module guides
Module guidance exists for installed packages. Keep it scoped to module-owned APIs, config, runtime behavior, plugins, composables, components, hooks, and owned files.

- Inventory: [Module guide index](./references/modules/index.md)
- Coverage: ${coverage || 'none'}`
}

export function createModuleIndex(entries: SkillModuleRenderEntry[], skipped: SkillSkippedRenderEntry[] = []): string {
  if (!hasModuleGuidance(entries, skipped)) {
    return ''
  }

  const grouped = groupModuleEntries(entries)
  const moduleSections = [
    renderModuleGroup('Official upstream skills', grouped.officialUpstream, './'),
    renderModuleGroup('Curated nuxt-skills skills', grouped.bundled, './'),
    renderModuleGroup('Resolved module skills', grouped.githubResolved, './'),
    renderModuleGroup('Docs-discovered skills', grouped.wellKnownResolved, './'),
    renderModuleGroup('Metadata-routed skills', grouped.metadataRouted, './'),
    renderSkippedEntries(skipped),
  ].filter(Boolean)

  return `# Module Guide Index

Use a module entry only when an installed module owns the surface. Module guidance is delta-only and should not replace broad Nuxt rules outside that module.

${moduleSections.join('\n')}`
}

function findPack(metadata: NuxtContentMetadata, id: string): NuxtPackMetadata {
  return metadata.packs.find(pack => pack.id === id) || metadata.packs[0]!
}

function packLink(metadata: NuxtContentMetadata, id: string): string {
  const pack = findPack(metadata, id)
  return `[${pack.title}](./references/nuxt/${pack.relativePath})`
}

/** Agents pick a skill by its description, so the router and the rules-directory pointer share this one. */
export const SKILL_DESCRIPTION = 'Use before changing Nuxt code. Routes to the smallest relevant guide for `useFetch`/`useAsyncData`, SSR and hydration, `definePageMeta`/`useSeoMeta`, `runtimeConfig`, Nitro server routes, plugins, errors, Nuxt UI, Nuxt Content, installed Nuxt modules, or module authoring.'

const DEFAULT_VUE_GUIDE_HREF = './references/vue/SKILL.md'
/** Link to use when the Vue guide isn't bundled with the skill. */
export const UPSTREAM_VUE_GUIDE_URL = 'https://github.com/vuejs-ai/skills/blob/main/skills/vue-best-practices/SKILL.md'

export interface SkillEntrypointOptions {
  /** Restrict the skill to this subtree of a monorepo. */
  monorepoScopePath?: string
  /** Route module-authoring work to the module authoring pack. */
  moduleAuthoring?: boolean
  /** Installed package names. Packs gated by `packages` are routed only when one of them is installed. */
  installedPackages?: string[]
  entries?: SkillModuleRenderEntry[]
  skipped?: SkillSkippedRenderEntry[]
  /** Extra markdown sections rendered after routing, before the finish step. */
  extraSections?: string[]
  /** Where the Vue guide lives. Defaults to the bundled copy. */
  vueGuideHref?: string
}

/**
 * Packs the router links for these options: the routing table rows plus the packs
 * linked from the loading rules and finish step. Copy exactly these into a skill.
 */
export function selectLinkedPacks(metadata: NuxtContentMetadata, options: SkillEntrypointOptions = {}): NuxtPackMetadata[] {
  const installed = new Set([
    ...(options.installedPackages || []),
    ...(options.entries || []).map(entry => entry.packageName),
  ])

  return metadata.packs.filter((pack) => {
    if (pack.moduleAuthoring && !options.moduleAuthoring) {
      return false
    }
    if (pack.packages && !pack.packages.some(name => installed.has(name))) {
      return false
    }
    return true
  })
}

export function selectRoutedPacks(metadata: NuxtContentMetadata, options: SkillEntrypointOptions = {}): NuxtPackMetadata[] {
  return selectLinkedPacks(metadata, options).filter(pack => pack.route)
}

function formatModuleNames(entries: SkillModuleRenderEntry[], skipped: SkillSkippedRenderEntry[]): string {
  const names = Array.from(new Set([...entries, ...skipped].map(entry => entry.packageName))).sort()
  const shown = names.slice(0, 5).map(name => `\`${name}\``).join(', ')
  return names.length > 5 ? `${shown}, and ${names.length - 5} more` : shown
}

function createRoutingTable(metadata: NuxtContentMetadata, options: SkillEntrypointOptions): string {
  const entries = options.entries || []
  const skipped = options.skipped || []
  const rows: Array<[string, string, string]> = selectRoutedPacks(metadata, options)
    .map(pack => [pack.route!, pack.example ? `"${pack.example}"` : '', packLink(metadata, pack.id)])

  if (hasModuleGuidance(entries, skipped)) {
    rows.unshift([
      `Installed module APIs, options, components, or composables: ${formatModuleNames(entries, skipped)}`,
      '"Which props does this module component take?"',
      '[Module guide index](./references/modules/index.md)',
    ])
  }

  rows.push([
    'The remaining work is components, composables, reactivity, props/emits, or SFC structure',
    '"Split this component and keep the props typed"',
    `[Vue Best Practices](${options.vueGuideHref || DEFAULT_VUE_GUIDE_HREF})`,
  ])

  return [
    '| Task shape or symptom | Example request | Open first |',
    '| --- | --- | --- |',
    ...rows.map(([symptom, example, target]) => `| ${symptom} | ${example} | ${target} |`),
  ].join('\n')
}

export function createSkillEntrypoint(
  skillName: string,
  metadata: NuxtContentMetadata,
  options: SkillEntrypointOptions = {},
): string {
  const entries = options.entries || []
  const skipped = options.skipped || []
  const monorepoScopeSection = options.monorepoScopePath
    ? `\n## Monorepo scope
This skill applies only to \`${options.monorepoScopePath}\`. Treat files and tasks outside that subtree as out of scope unless the user explicitly redirects you there.\n`
    : ''
  const sections = [
    `## Routing
Open one guide that matches the task. Open more only when that guide points you there or the task clearly crosses boundaries.

${createRoutingTable(metadata, options)}`,
    renderModuleSummary(entries, skipped),
    ...(options.extraSections || []),
  ].filter(Boolean).join('\n\n')

  return `---
name: ${yamlString(skillName)}
description: ${yamlString(SKILL_DESCRIPTION)}
---

# Nuxt Skill Router

Decide what Nuxt owns before editing, then open the smallest relevant Nuxt, Vue, or module guide.
${monorepoScopeSection}
## Loading rules
1. Repository-global instructions and required workflows win first.
2. Inspect the exact surface you are changing: page, layout, component, composable, server handler, plugin, config file, or module-owned file.
3. If a generic Vue or raw HTML fix looks plausible, read ${packLink(metadata, 'abstraction-disambiguation')} first. Most Nuxt mistakes are the right behavior built on the wrong primitive.
4. Switch to [Vue Best Practices](${options.vueGuideHref || DEFAULT_VUE_GUIDE_HREF}) only when Nuxt no longer owns the abstraction.
5. Use module guides only for module-owned APIs, config, runtime behavior, and files.

${sections}

## Finish
Before concluding a change that touches more than one surface, read ${packLink(metadata, 'verification-finish')}.

- Check paired surfaces: page and head, server and client, global and local errors.
- Verify framework behavior, not only visible output.
- Keep module guidance scoped to the owning module.

---

_Generated by nuxt-skill-hub. Do not edit this file manually._
`
}

export interface SkillPointerOptions {
  /** Nuxt app directory relative to the folder holding the agent dirs. Empty for the root. */
  projectPath?: string
  /** Link to the rule packs bundled in the installed package, if they exist. */
  bundledRulesPath?: string
}

/**
 * The one file written to agents that load every file in a rules directory as a rule.
 * It points at the generated skill instead of copying its references there.
 */
export function createSkillPointer(
  skillName: string,
  generatedEntryPath: string,
  options: SkillPointerOptions = {},
): string {
  const location = options.projectPath ? `in \`${options.projectPath}\`` : 'from the repository root'
  const steps = [
    `1. Open [the generated Nuxt skill](${generatedEntryPath}) and follow it.`,
    `2. If it's missing, run \`npx nuxt prepare\` ${location}, then open it.`,
  ]
  if (options.bundledRulesPath) {
    steps.push(`3. If it still can't be generated, read the core Nuxt rule packs that ship with the module in [${options.bundledRulesPath}](${options.bundledRulesPath}). Open the pack named after the task's surface, and tell the user the full skill wasn't available.`)
  }

  return `---
name: ${yamlString(skillName)}
description: ${yamlString(SKILL_DESCRIPTION)}
---

# Nuxt Skill

${steps.join('\n')}

---

_Generated by nuxt-skill-hub. Do not edit this file manually._
`
}

function createResolverNote(entry: SkillModuleRenderEntry): string {
  if (entry.sourceKind === 'dist') {
    return 'This module skill came from the installed package. Treat it as the highest-confidence module-specific delta guide.'
  }

  if (entry.sourceKind === 'github' && entry.resolver === 'agentsField') {
    return 'This module skill was resolved from repository metadata. It is still module-specific guidance, but verify version-sensitive details against the installed module docs or source.'
  }

  if (entry.sourceKind === 'github') {
    return 'This module skill was resolved from GitHub heuristics. Verify important behavior against the installed module docs or source before relying on edge cases.'
  }

  if (entry.sourceKind === 'wellKnown') {
    return 'This module skill was resolved from a docs .well-known endpoint. Treat it as product-published guidance, and verify version-sensitive details against the installed module docs or source.'
  }

  return 'This module router was generated from package metadata. Use the linked docs and repository as the source of truth for module-specific behavior.'
}

function createCompactMetadataRouterContent(entry: Pick<MetadataRouterSkillInput, 'repoUrl' | 'docsUrl'>): string {
  return `${formatCompactLinks(entry, {
    docs: 'Docs',
    repo: 'Source code',
  })}\n`
}

function createMetadataRouterContent(entry: MetadataRouterSkillInput): string {
  const links = createCompactMetadataRouterContent(entry).trim()
  const sourceSection = links || 'Docs: unavailable\n\nSource code: unavailable'

  return `# ${entry.packageName} Module Router

Use this module router only when the task directly involves \`${entry.packageName}\` APIs, config, runtime behavior, plugins, composables, components, hooks, or owned files.

## Source of truth
${sourceSection}

## Context rules
1. Start with the relevant route in the parent Nuxt skill before using this module router.
2. Use the docs link for exact APIs, options, and examples instead of guessing from generic Nuxt or Vue patterns.
3. Use the source link when behavior is version-sensitive or the docs are ambiguous.
4. Keep this module guidance scoped to \`${entry.packageName}\`; do not replace broader Nuxt rules outside module-owned surfaces.
`
}

export function createModuleWrapperContent(entry: SkillModuleRenderEntry): string {
  if (entry.sourceKind === 'generated') {
    return createMetadataRouterContent(entry)
  }

  const derivedEntry = withDerivedModuleFields(entry)
  const skillPath = `./${entry.skillName}/SKILL.md`
  const scriptsNote = entry.scriptsIncluded
    ? 'Module scripts were copied into this generated output.'
    : 'Module scripts were not copied into this generated output.'
  const descriptionBlock = entry.description
    ? `## Module Summary\n${entry.description}\n\n`
    : ''
  const upstreamLinks = formatWrapperLinks({
    docsUrl: entry.docsUrl,
    repoUrl: entry.repoUrl,
  }, {
    docs: 'Docs',
    repo: 'Repository',
  })
  const installedVersion = formatVersion(entry.version)

  return `# ${entry.packageName} Module Wrapper

Use this wrapper before opening the copied module skill.

## Snapshot
- Package: \`${entry.packageName}\`
- Installed version: ${installedVersion ? `\`${installedVersion}\`` : '_not detected_'}
- Skill: \`${entry.skillName}\`
- Source: ${derivedEntry.sourceLabel}
- Trust: \`${derivedEntry.trustLevel}\`
- Scripts: ${entry.scriptsIncluded ? 'included' : 'not included'}

${descriptionBlock}## Scope
Use this wrapper only when the task directly involves \`${entry.packageName}\` APIs, config, runtime behavior, plugins, composables, components, hooks, or owned files.

## Delta-only rule
Module guidance is a delta on top of Nuxt guidance.
Do not replace broad Nuxt rules with module-specific guidance outside \`${entry.packageName}\` surfaces.

${upstreamLinks
  ? `## Upstream links
${upstreamLinks}

`
  : ''}## How to use it
1. Start with the relevant route in [../../SKILL.md](../../SKILL.md), then load the matching Nuxt pack or Vue guidance.
2. Then open the copied module skill: [${entry.skillName} / SKILL.md](${skillPath}).
3. Apply the module guidance only within \`${entry.packageName}\` surfaces.
4. If behavior is unresolved or version-sensitive, use the static docs and repository links above.

## Reliability note
${createResolverNote(entry)}

## Scripts
${scriptsNote}
`
}
