import type { SkillEntrypointOptions } from '../shared/skill-render'
import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { PACKAGE_VERSION } from '../shared/package-info'
import {
  createModuleIndex,
  createModuleWrapperContent,
  createSkillEntrypoint,
  createSkillPointer,
  DEFAULT_NUXT_CONTENT_METADATA,
  selectLinkedPacks,
  SKILL_DESCRIPTION,

} from '../shared/skill-render'
import { loadNuxtRuleFiles } from '../src/nuxt-content'
import { loadVueSkillFiles } from '../src/vue-content'

describe('template guidance publication', () => {
  it('keeps the generated section consistent with its source digest', async () => {
    const files = await loadNuxtRuleFiles()
    const pack = files['rules/module-authoring.md']!
    const section = pack.split('<!-- BEGIN GENERATED TEMPLATE GUIDANCE -->')[1]!.split('<!-- END GENERATED TEMPLATE GUIDANCE -->')[0]!.trim()
    const [provenance, ...paragraphs] = section.split('\n\n')
    const digest = provenance!.match(/SHA-256: ([a-f0-9]{64})/)

    expect(digest).not.toBeNull()
    const source = `${paragraphs.join('\n\n').replace(/^### /, '# ')}\n`
    expect(createHash('sha256').update(source).digest('hex')).toBe(digest![1])
  })
})

describe('createSkillEntrypoint', () => {
  it('stamps core metadata with the package version', () => {
    expect(DEFAULT_NUXT_CONTENT_METADATA.version).toBe(PACKAGE_VERSION)
  })

  it('has exactly one pack entry per rule file', async () => {
    const ruleFiles = Object.keys(await loadNuxtRuleFiles()).sort()
    const packPaths = DEFAULT_NUXT_CONTENT_METADATA.packs.map(pack => pack.relativePath).sort()

    expect(packPaths).toEqual(ruleFiles)
    expect(new Set(DEFAULT_NUXT_CONTENT_METADATA.packs.map(pack => pack.id)).size).toBe(packPaths.length)
  })

  it('uses each rule file title as the pack title', async () => {
    const ruleFiles = await loadNuxtRuleFiles()

    for (const pack of DEFAULT_NUXT_CONTENT_METADATA.packs) {
      expect(ruleFiles[pack.relativePath]!.split('\n')[0], pack.id).toBe(`## ${pack.title}`)
    }
  })

  it('omits the monorepo scope section for standalone apps', () => {
    const entry = createSkillEntrypoint('nuxt', DEFAULT_NUXT_CONTENT_METADATA)

    expect(entry).toContain('# Nuxt Skill Router')
    expect(entry).toContain('## Loading rules')
    expect(entry).toContain('## Routing')
    expect(entry).toContain('| Task shape or symptom | Example request | Open first |')
    expect(entry).toContain('./references/vue/SKILL.md')
    expect(entry).toContain('"This page fetches twice on first load"')
    expect(entry).toContain('"Why do I get a hydration mismatch from Date.now()?"')
    expect(entry).toContain('"Change canonical URL and OG tags"')
    expect(entry).toContain('"Expose only the public runtimeConfig key"')
    expect(entry).toContain('"This server/api handler cache or route rule is wrong"')
    expect(entry).toContain('"`clearError` is not behaving as expected"')
    expect(entry).toContain('"Should this secret live in runtime config or client code?"')
    expect(entry).toContain('Hydration and SSR Consistency')
    expect(entry).toContain('Server Routes, h3 Patterns, and Runtime Config')
    expect(entry).toContain('Nitro and h3 Server Patterns')
    expect(entry).toContain('Plugins and Runtime Boot')
    expect(entry).toContain('Performance and Rendering')
    expect(entry).toContain('Migrations and Compatibility')
    expect(entry).toContain('Verification and Finish')
    expect(entry).toContain('## Finish')
    expect(entry).not.toContain('## Monorepo scope')
    expect(entry).not.toContain('## Activation Flow')
    expect(entry).not.toContain('## High-Frequency Nuxt Decisions')
    expect(entry).not.toContain('## Precedence')
    expect(entry).not.toContain('## Before Completion')
    expect(entry).not.toContain('## Vue guidance')
    expect(entry).not.toContain('## All Nuxt packs')
    expect(entry).not.toContain('## Primary Packs')
    expect(entry).not.toContain('Installed module APIs')
    expect(entry).not.toContain('Nuxt UI Primitives')
    expect(entry).not.toContain('Content Modeling and Navigation')
    expect(entry).not.toContain('references/nuxt/index.md')
  })

  it('renders a hard monorepo scope warning when a scope path is provided', () => {
    const entry = createSkillEntrypoint('nuxt-web', DEFAULT_NUXT_CONTENT_METADATA, { monorepoScopePath: 'apps/web' })

    expect(entry).toContain('## Monorepo scope')
    expect(entry).toContain('`apps/web`')
    expect(entry).toContain('This skill applies only to `apps/web`.')
    expect(entry).toContain('Treat files and tasks outside that subtree as out of scope unless the user explicitly redirects you there.')
  })

  it('puts disambiguation before routing and verification in the finish step', () => {
    const entry = createSkillEntrypoint('nuxt', DEFAULT_NUXT_CONTENT_METADATA)
    const loadingRules = entry.slice(entry.indexOf('## Loading rules'), entry.indexOf('## Routing'))
    const finish = entry.slice(entry.indexOf('## Finish'))

    expect(loadingRules).toContain('[Abstraction Disambiguation](./references/nuxt/rules/abstraction-disambiguation.md)')
    expect(finish).toContain('[Verification and Finish](./references/nuxt/rules/verification-finish.md)')
  })

  it('routes module-specific packs only when their package is installed', () => {
    const entry = createSkillEntrypoint('nuxt', DEFAULT_NUXT_CONTENT_METADATA, {
      installedPackages: ['@nuxt/ui', '@nuxt/content'],
    })

    expect(entry).toContain('[Nuxt UI Primitives](./references/nuxt/rules/nuxt-ui-primitives.md)')
    expect(entry).toContain('[Content Modeling and Navigation](./references/nuxt/rules/content-modeling-navigation.md)')
  })

  it.each<[string, SkillEntrypointOptions, string[]]>([
    ['a plain app', {}, []],
    ['module authoring', { moduleAuthoring: true }, ['module-authoring']],
    ['Nuxt UI', { installedPackages: ['@nuxt/ui'] }, ['nuxt-ui-primitives']],
    ['a module skill for Nuxt Content', { entries: [{ packageName: '@nuxt/content', skillName: 'nuxt-content', scriptsIncluded: false, sourceKind: 'dist', official: true, resolver: 'agentsField' }] }, ['content-modeling-navigation']],
    ['every gated pack', { moduleAuthoring: true, installedPackages: ['@nuxt/ui', '@nuxt/content'] }, ['module-authoring', 'nuxt-ui-primitives', 'content-modeling-navigation']],
  ])('routes gated packs for %s', (_label, options, expectedPacks) => {
    const entry = createSkillEntrypoint('nuxt', DEFAULT_NUXT_CONTENT_METADATA, options)
    const linked = new Set(Array.from(entry.matchAll(/\]\(\.\/references\/nuxt\/([^)]+)\)/g), match => match[1]))

    for (const pack of ['module-authoring', 'nuxt-ui-primitives', 'content-modeling-navigation']) {
      expect(linked.has(`rules/${pack}.md`), pack).toBe(expectedPacks.includes(pack))
    }
  })

  it('links every pack when all gates are open', () => {
    const packs = selectLinkedPacks(DEFAULT_NUXT_CONTENT_METADATA, {
      moduleAuthoring: true,
      installedPackages: DEFAULT_NUXT_CONTENT_METADATA.packs.flatMap(pack => pack.packages || []),
    })

    expect(packs).toEqual(DEFAULT_NUXT_CONTENT_METADATA.packs)
  })

  it('keeps the default skill app-oriented when module authoring is disabled', () => {
    const entry = createSkillEntrypoint('nuxt', DEFAULT_NUXT_CONTENT_METADATA)

    expect(entry).not.toContain('"Add a Nuxt module option, hook, or runtime extension"')
    expect(entry).not.toContain('Writing or refactoring a Nuxt module')
  })

  it('layers module-author guidance on top of the default skill', () => {
    const entry = createSkillEntrypoint('nuxt', DEFAULT_NUXT_CONTENT_METADATA, { moduleAuthoring: true })

    expect(entry).toContain('Module Authoring Conventions')
    expect(entry).toContain('Writing or refactoring a Nuxt module (`defineNuxtModule`, hooks, public APIs)')
    expect(entry).toContain('"Add a Nuxt module option, hook, or runtime extension"')
    expect(entry).not.toContain('## Module authoring')
    expect(entry).not.toContain('## Module Author Focus')
    expect(entry).not.toContain('## Module author focus')
  })
})

describe('createModuleWrapperContent', () => {
  it('renders scoped metadata routers for generated module wrappers', () => {
    const entry = {
      packageName: '@nuxtjs/i18n',
      version: undefined,
      skillName: 'i18n',
      description: 'i18n features for your Nuxt project so you can easily add internationalization.',
      scriptsIncluded: false,
      sourceKind: 'generated' as const,
      sourceLabel: 'Metadata-routed skill',
      repoUrl: 'https://github.com/nuxt-modules/i18n',
      docsUrl: 'https://i18n.nuxtjs.org',
      official: true,
      trustLevel: 'official' as const,
      resolver: 'metadataRouter' as const,
    }

    const content = createModuleWrapperContent(entry)
    expect(content).toContain('# @nuxtjs/i18n Module Router')
    expect(content).toContain('Docs: [https://i18n.nuxtjs.org](https://i18n.nuxtjs.org)')
    expect(content).toContain('Source code: [https://github.com/nuxt-modules/i18n](https://github.com/nuxt-modules/i18n)')
    expect(content).toContain('Start with the relevant route in the parent Nuxt skill')
    expect(content).toContain('Keep this module guidance scoped to `@nuxtjs/i18n`')
  })

  it('keeps the root module section compact and moves details to the module index', () => {
    const entry = createSkillEntrypoint('nuxt', DEFAULT_NUXT_CONTENT_METADATA, { entries: [
      {
        packageName: '@nuxthub/core',
        version: undefined,
        skillName: 'nuxthub',
        description: 'NuxtHub support.',
        scriptsIncluded: false,
        sourceKind: 'github' as const,
        repoUrl: 'https://github.com/nuxt-hub/core',
        docsUrl: 'https://hub.nuxt.com',
        official: true,
        trustLevel: 'official' as const,
        resolver: 'agentsField' as const,
        wrapperPath: 'references/modules/nuxthub/nuxthub.md',
      },
    ] })

    expect(entry).toContain('## Module guides')
    expect(entry).toContain('[Module guide index](./references/modules/index.md)')
    expect(entry).toContain('Installed module APIs, options, components, or composables: `@nuxthub/core`')
    expect(entry).toContain('1 resolved')
    expect(entry).not.toContain('### Resolved module skills')
    expect(entry).not.toContain('[@nuxthub/core](./references/modules/nuxthub/nuxthub.md)')
    expect(entry).not.toContain('Resolved module skill. Trust: `official`.')
    expect(entry).not.toContain('GitHub-resolved')
    expect(entry).not.toContain('`unknown`')
  })

  it('renders detailed module entries in the module index', () => {
    const index = createModuleIndex([
      {
        packageName: '@nuxthub/core',
        version: undefined,
        skillName: 'nuxthub',
        description: 'NuxtHub support.',
        scriptsIncluded: false,
        sourceKind: 'github' as const,
        repoUrl: 'https://github.com/nuxt-hub/core',
        docsUrl: 'https://hub.nuxt.com',
        official: true,
        trustLevel: 'official' as const,
        resolver: 'agentsField' as const,
        wrapperPath: 'references/modules/nuxthub/nuxthub.md',
      },
    ])

    expect(index).toContain('### Resolved module skills')
    expect(index).toContain('[@nuxthub/core](./nuxthub/nuxthub.md)')
    expect(index).toContain('Resolved module skill. Trust: `official`.')
  })

  it('renders docs-discovered module skills in their own group', () => {
    const index = createModuleIndex([
      {
        packageName: 'docus',
        version: '5.9.0',
        skillName: 'create-docs',
        description: 'Create Docus documentation.',
        scriptsIncluded: true,
        sourceKind: 'wellKnown' as const,
        sourceLabel: 'Docs-discovered skill',
        docsUrl: 'https://docus.dev/',
        official: true,
        trustLevel: 'official' as const,
        resolver: 'wellKnownV2' as const,
        wrapperPath: 'references/modules/docus/create-docs.md',
      },
    ])

    expect(index).toContain('### Docs-discovered skills')
    expect(index).toContain('[docus](./docus/create-docs.md) `v5.9.0` - Docs-discovered skill. Trust: `official`.')
  })
})

describe('createSkillPointer', () => {
  it('points rules-directory agents at the generated skill', () => {
    const entry = createSkillPointer('nuxt-web', '../../../node_modules/.cache/nuxt-skill-hub/generated/nuxt-web/SKILL.md', { projectPath: 'apps/web' })

    expect(entry).toContain(`description: ${JSON.stringify(SKILL_DESCRIPTION)}`)
    expect(entry).toContain('1. Open [the generated Nuxt skill](../../../node_modules/.cache/nuxt-skill-hub/generated/nuxt-web/SKILL.md) and follow it.')
    expect(entry).toContain('2. If it\'s missing, run `npx nuxt prepare` in `apps/web`, then open it.')
    expect(entry).toContain('_Generated by nuxt-skill-hub.')
    expect(entry).not.toContain('core Nuxt rule packs')
  })

  it('runs prepare from the repository root and falls back to the bundled packs', () => {
    const rules = '../../../node_modules/nuxt-skill-hub/nuxt-best-practices/rules'
    const entry = createSkillPointer('nuxt', './SKILL.md', { bundledRulesPath: rules })

    expect(entry).toContain('run `npx nuxt prepare` from the repository root')
    expect(entry).toContain(`3. If it still can't be generated, read the core Nuxt rule packs that ship with the module in [${rules}](${rules}).`)
  })
})

describe('bundled Vue content', () => {
  it('vendors the vue-best-practices skill with the must-read references', async () => {
    const files = await loadVueSkillFiles()

    expect(files['SKILL.md']).toContain('name: vue-best-practices')
    expect(files['SKILL.md']).toContain('references/reactivity.md')
    expect(files['SKILL.md']).toContain('references/sfc.md')
    expect(files['references/composables.md']).toContain('# Composable Organization Patterns')
  })
})
