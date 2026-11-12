import { execSync } from 'node:child_process'
import { promises as fsp } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { expectCopiedPacksMatchRouterLinks } from './utils'

const rootDir = fileURLToPath(new URL('./fixtures/core-only', import.meta.url))
// Skills go to the nearest pnpm workspace: this repository's root.
const workspaceRoot = resolve(rootDir, '../../../../..')
const cacheRoot = join(workspaceRoot, 'node_modules', '.cache', 'nuxt-skill-hub')

describe('core-only generation', () => {
  it('writes the generated skill into the agent skills dir during prepare', async () => {
    const skillRoot = join(workspaceRoot, '.claude', 'skills', 'nuxt-core-only-fixture')
    await fsp.rm(cacheRoot, { recursive: true, force: true })
    // What an older version left behind: a wrapper in the skills dir and the tree in the build dir.
    await fsp.rm(skillRoot, { recursive: true, force: true })
    await fsp.mkdir(skillRoot, { recursive: true })
    await fsp.writeFile(join(skillRoot, 'SKILL.md'), '# Nuxt Skill Wrapper\n')
    await fsp.mkdir(join(rootDir, '.nuxt', 'skill-hub', 'nuxt-core-only-fixture'), { recursive: true })

    execSync('pnpm exec nuxt prepare', { cwd: rootDir, encoding: 'utf8', stdio: 'pipe' })
    execSync('pnpm exec nuxt prepare', { cwd: rootDir, encoding: 'utf8', stdio: 'pipe' })

    const entry = await fsp.readFile(join(skillRoot, 'SKILL.md'), 'utf8')
    const dataPack = await fsp.readFile(join(skillRoot, 'references/nuxt/rules/data-fetching-ssr.md'), 'utf8')
    const vue = await fsp.readFile(join(skillRoot, 'references/vue/SKILL.md'), 'utf8')

    await expectCopiedPacksMatchRouterLinks(skillRoot, entry)
    expect(entry).toContain('# Nuxt Skill Router')
    expect(entry).toContain('## Loading rules')
    expect(entry).toContain('## Routing')
    expect(entry).toContain('| Task shape or symptom | Example request | Open first |')
    expect(entry).toContain('Page Meta, Head, and Layout')
    expect(entry).toContain('Hydration and SSR Consistency')
    expect(entry).toContain('Server Routes, h3 Patterns, and Runtime Config')
    expect(entry).toContain('Nitro and h3 Server Patterns')
    expect(entry).toContain('Plugins and Runtime Boot')
    expect(entry).toContain('Performance and Rendering')
    expect(entry).toContain('Migrations and Compatibility')
    expect(entry).toContain('Verification and Finish')
    expect(entry).not.toContain('# Nuxt Skill Wrapper')
    expect(entry).not.toContain('## Vue guidance')
    expect(entry).toContain('## Monorepo scope')
    expect(entry).toContain('`packages/nuxt-skill-hub/test/fixtures/core-only`')
    expect(dataPack).toContain('## Data Fetching and SSR')
    expect(vue).toContain('# Vue Best Practices Workflow')
    await expect(fsp.access(join(skillRoot, 'references/nuxt/index.md'))).rejects.toBeDefined()
    // Gated packs stay out when their module isn't installed and module authoring is off.
    await expect(fsp.access(join(skillRoot, 'references/nuxt/rules/nuxt-ui-primitives.md'))).rejects.toBeDefined()
    await expect(fsp.access(join(skillRoot, 'references/nuxt/rules/module-authoring.md'))).rejects.toBeDefined()

    await expect(fsp.readFile(join(skillRoot, '.gitignore'), 'utf8')).resolves.toContain('\n*\n')

    await expect(fsp.access(join(rootDir, '.nuxt', 'skill-hub'))).rejects.toBeDefined()
    await expect(fsp.access(join(cacheRoot, 'generated', 'nuxt-core-only-fixture', '.state.json'))).resolves.toBeUndefined()
  }, 15000)
})
