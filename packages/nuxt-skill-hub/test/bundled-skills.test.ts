import { promises as fsp } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { BUNDLED_SKILL_PACKAGES, collectBundledContributions } from '../src/bundled-skills'
import { generateSkillTree } from '../src/generator'

const roots: string[] = []
afterEach(async () => {
  await Promise.all(roots.splice(0).map(root => fsp.rm(root, { recursive: true, force: true })))
})

async function createApp(packages: Record<string, string>): Promise<string> {
  const root = await fsp.mkdtemp(join(tmpdir(), 'bundled-skills-'))
  roots.push(root)
  await fsp.writeFile(join(root, 'package.json'), JSON.stringify({ name: 'curated-app', private: true }))
  for (const [name, version] of Object.entries(packages)) {
    const dir = join(root, 'node_modules', name)
    await fsp.mkdir(dir, { recursive: true })
    await fsp.writeFile(join(dir, 'package.json'), JSON.stringify({ name, version, type: 'module', main: './module.mjs' }))
    await fsp.writeFile(join(dir, 'module.mjs'), 'export default () => {}\n')
  }
  return root
}

const silent = { start: () => {}, success: () => {}, warn: () => {}, info: () => {} }

describe('bundled skills', () => {
  it('maps every listed skill to a skill folder in this repository', async () => {
    const installed = Object.values(BUNDLED_SKILL_PACKAGES).flat().map(packageName => ({ packageName, version: '1.0.0', packageRoot: `/x/${packageName}` }))
    const contributions = collectBundledContributions(installed as any, new Set())
    expect(contributions.map(c => c.skillName).sort()).toEqual(
      Object.entries(BUNDLED_SKILL_PACKAGES).flatMap(([skill, pkgs]) => pkgs.map(() => skill)).sort(),
    )
  })

  it('skips packages whose own skill already resolved', () => {
    const contributions = collectBundledContributions([{ packageName: '@nuxt/ui', version: '4.0.0', packageRoot: '/x' }] as any, new Set(['@nuxt/ui']))
    expect(contributions).toEqual([])
  })

  it('links the curated skill only for installed modules, with no Nuxt and no network', async () => {
    const rootDir = await createApp({ '@pinia/nuxt': '0.11.0' })
    await generateSkillTree({
      rootDir,
      exportRoot: rootDir,
      skillName: 'nuxt-curated-app',
      targets: ['claude-code'],
      options: { remote: false },
      logger: silent,
      modules: ['@pinia/nuxt'],
    })

    const skillRoot = join(rootDir, '.claude/skills/nuxt-curated-app')
    const index = await fsp.readFile(join(skillRoot, 'references/modules/index.md'), 'utf8')
    expect(index).toContain('### Curated nuxt-skills skills')
    expect(index).toContain('[@pinia/nuxt]')
    expect(index).not.toContain('@nuxt/ui')
    const pinia = await fsp.readdir(join(skillRoot, 'references/modules'), { recursive: true })
    expect(pinia.some(path => String(path).endsWith('pinia/SKILL.md'))).toBe(true)
  })
})
