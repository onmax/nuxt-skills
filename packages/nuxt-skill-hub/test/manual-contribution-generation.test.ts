import { execSync } from 'node:child_process'
import { promises as fsp } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, describe, expect, it } from 'vitest'

const rootDir = fileURLToPath(new URL('./fixtures/manual-contribution', import.meta.url))
// Skills go to the nearest pnpm workspace: this repository's root.
const workspaceRoot = resolve(rootDir, '../../../../..')
const manualSkillRoot = join(rootDir, 'manual-skill')
const manualSkillFile = join(manualSkillRoot, 'SKILL.md')

async function writeManualSkill(description: string, body: string): Promise<void> {
  await fsp.mkdir(manualSkillRoot, { recursive: true })
  await fsp.writeFile(manualSkillFile, [
    '---',
    'name: manual-skill',
    `description: ${description}`,
    '---',
    '',
    '# Manual Skill',
    '',
    body,
    '',
  ].join('\n'), 'utf8')
}

afterAll(async () => {
  await fsp.rm(manualSkillRoot, { recursive: true, force: true })
})

describe('manual contribution generation', () => {
  it('regenerates when a local manual skill changes between prepare runs', async () => {
    await writeManualSkill('Initial manual skill.', 'Version A')
    execSync('pnpm exec nuxt prepare', { cwd: rootDir, encoding: 'utf8', stdio: 'pipe' })

    const skillRoot = join(workspaceRoot, '.claude', 'skills', 'nuxt-manual-contribution-fixture')
    const generatedSkillRoot = skillRoot
    const generatedManualSkillPath = join(
      generatedSkillRoot,
      'references/modules/test-manual-contribution/manual-skill/SKILL.md',
    )

    await expect(fsp.readFile(generatedManualSkillPath, 'utf8')).resolves.toContain('Version A')

    await writeManualSkill('Updated manual skill.', 'Version B')
    execSync('pnpm exec nuxt prepare', { cwd: rootDir, encoding: 'utf8', stdio: 'pipe' })

    await expect(fsp.readFile(generatedManualSkillPath, 'utf8')).resolves.toContain('Version B')
  }, 15000)
})
