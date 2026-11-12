import { execSync } from 'node:child_process'
import { promises as fsp } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { loadNuxtRuleFiles } from '../src/nuxt-content'
import { expectCopiedPacksMatchRouterLinks } from './utils'

const rootDir = fileURLToPath(new URL('./fixtures/module-author', import.meta.url))
// Skills go to the nearest pnpm workspace: this repository's root.
const workspaceRoot = resolve(rootDir, '../../../../..')

describe('module-author generation', () => {
  it('layers module-author guidance on top of the generated skill', async () => {
    execSync('pnpm exec nuxt prepare', { cwd: rootDir, encoding: 'utf8', stdio: 'pipe' })

    const skillRoot = join(workspaceRoot, '.claude', 'skills', 'nuxt-module-author-fixture')
    const generatedSkillRoot = skillRoot
    const entry = await fsp.readFile(join(generatedSkillRoot, 'SKILL.md'), 'utf8')
    const modulePack = await fsp.readFile(join(generatedSkillRoot, 'references/nuxt/rules/module-authoring.md'), 'utf8')
    expect(modulePack).toBe((await loadNuxtRuleFiles())['rules/module-authoring.md'])
    await expectCopiedPacksMatchRouterLinks(generatedSkillRoot, entry)
    expect(entry).toContain('Module Authoring Conventions')
    expect(entry).toContain('Writing or refactoring a Nuxt module (`defineNuxtModule`, hooks, public APIs)')
    expect(entry).toContain('Add a Nuxt module option, hook, or runtime extension')
    expect(entry).toContain('Verification and Finish')
    expect(entry).toContain('Hydration and SSR Consistency')
    expect(entry).not.toContain('## Module authoring')
    expect(entry).not.toContain('## Module Author Focus')
    expect(entry).not.toContain('## Module author focus')
    await expect(fsp.access(join(skillRoot, 'references/index.md'))).rejects.toBeDefined()
    await expect(fsp.access(join(skillRoot, 'manifest.json'))).rejects.toBeDefined()
  }, 15000)
})
