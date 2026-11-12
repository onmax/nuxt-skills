import { execSync } from 'node:child_process'
import { promises as fsp } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { expectCopiedPacksMatchRouterLinks } from './utils'

const rootDir = fileURLToPath(new URL('./fixtures/with-modules', import.meta.url))
// Skills go to the nearest pnpm workspace: this repository's root.
const workspaceRoot = resolve(rootDir, '../../../../..')
const cacheRoot = join(workspaceRoot, 'node_modules', '.cache', 'nuxt-skill-hub')

async function writeFixtureModule(
  pkgName: string,
  version: string,
  skillName: string,
  description?: string,
  scriptBody?: string,
): Promise<void> {
  const moduleRoot = join(rootDir, 'node_modules', pkgName)
  const skillRoot = join(moduleRoot, 'skills', skillName)
  const scriptRoot = join(skillRoot, 'scripts')
  const referencesRoot = join(skillRoot, 'references')
  const skillFrontmatter = [
    '---',
    `name: ${skillName}`,
    ...(description ? [`description: ${description}`] : []),
    '---',
    '',
    `# Test ${skillName} Skill`,
    '',
    `Scope: Applies when working with \`${pkgName}\`.`,
    '',
  ].join('\n')

  await fsp.mkdir(referencesRoot, { recursive: true })
  if (scriptBody) {
    await fsp.mkdir(scriptRoot, { recursive: true })
  }

  await fsp.writeFile(join(moduleRoot, 'package.json'), JSON.stringify({
    name: pkgName,
    version,
    type: 'module',
    main: './module.mjs',
    agents: {
      skills: [
        {
          name: skillName,
          path: `./skills/${skillName}`,
        },
      ],
    },
  }, null, 2), 'utf8')

  await fsp.writeFile(join(moduleRoot, 'module.mjs'), `import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '${pkgName}',
  },
  setup() {},
})
`, 'utf8')

  await fsp.writeFile(join(skillRoot, 'SKILL.md'), skillFrontmatter, 'utf8')
  await fsp.writeFile(join(referencesRoot, `${skillName}.md`), `# ${skillName}\n`, 'utf8')

  if (scriptBody) {
    await fsp.writeFile(join(scriptRoot, 'check.sh'), scriptBody, 'utf8')
  }
}

async function writeMetadataRouterFixtureModule(
  pkgName: string,
  version: string,
  homepage: string,
  repository: string,
  description: string,
): Promise<void> {
  const moduleRoot = join(rootDir, 'node_modules', pkgName)

  await fsp.mkdir(moduleRoot, { recursive: true })
  await fsp.writeFile(join(moduleRoot, 'package.json'), JSON.stringify({
    name: pkgName,
    version,
    type: 'module',
    main: './module.mjs',
    homepage,
    repository,
    description,
  }, null, 2), 'utf8')

  await fsp.writeFile(join(moduleRoot, 'module.mjs'), `import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '${pkgName}',
  },
  setup() {},
})
`, 'utf8')
}

async function prepareFixtureModules(): Promise<void> {
  await writeFixtureModule('test-nuxt-ui', '0.1.0', 'nuxt-ui', 'Test Nuxt UI module skill.', '#!/usr/bin/env sh\necho ui\n')
  await writeFixtureModule('test-nuxt-seo', '0.2.0', 'nuxt-seo', 'Test Nuxt SEO module skill.', '#!/usr/bin/env sh\necho seo\n')
  await writeFixtureModule('test-nuxt-bad', '0.0.1', 'nuxt-bad')
  await writeMetadataRouterFixtureModule(
    'test-meta-router',
    '0.3.0',
    'https://example.com/test-meta-router',
    'https://github.com/example/test-meta-router',
    'Generated from package metadata.',
  )
}

await prepareFixtureModules()

describe('module-expanded generation', () => {
  it('writes merged module references into the build-dir output without copying scripts by default', async () => {
    await fsp.rm(cacheRoot, { recursive: true, force: true })

    execSync('pnpm exec nuxt prepare', { cwd: rootDir, encoding: 'utf8', stdio: 'pipe' })

    const cachedGeneratedRoot = join(cacheRoot, 'generated', 'nuxt-with-modules-fixture')
    const cacheMarker = '\n<!-- restored-from-cache -->\n'
    await fsp.appendFile(join(cachedGeneratedRoot, 'SKILL.md'), cacheMarker, 'utf8')
    const skillRoot = join(workspaceRoot, '.claude', 'skills', 'nuxt-with-modules-fixture')
    // Publishing skips a copy that already matches the cache, so drop it to see the cached tree restored.
    await fsp.rm(skillRoot, { recursive: true, force: true })

    execSync('pnpm exec nuxt prepare', { cwd: rootDir, encoding: 'utf8', stdio: 'pipe' })

    const generatedSkillRoot = skillRoot
    const entry = await fsp.readFile(join(generatedSkillRoot, 'SKILL.md'), 'utf8')
    const moduleIndex = await fsp.readFile(join(generatedSkillRoot, 'references/modules/index.md'), 'utf8')
    const metadataSkill = await fsp.readFile(join(generatedSkillRoot, 'references/modules/test-meta-router/test-meta-router/SKILL.md'), 'utf8')
    await expectCopiedPacksMatchRouterLinks(generatedSkillRoot, entry)
    expect(entry).toContain('## Module guides')
    expect(entry).toContain('[Module guide index](./references/modules/index.md)')
    expect(entry).toContain('2 installed')
    expect(entry).toContain('1 metadata-routed')
    expect(entry).toContain('2 skipped')
    expect(entry).not.toContain('### Official upstream skills')
    expect(moduleIndex).toContain('# Module Guide Index')
    expect(moduleIndex).toContain('### Official upstream skills')
    expect(moduleIndex).toContain('### Metadata-routed skills')
    expect(moduleIndex).toContain('### Skipped or unavailable')
    expect(moduleIndex).toContain('test-nuxt-ui')
    expect(moduleIndex).toContain('test-nuxt-bad')
    expect(moduleIndex).toContain('test-meta-router')
    expect(entry).toContain('restored-from-cache')
    expect(metadataSkill).toContain('# test-meta-router Module Router')
    expect(metadataSkill).toContain('Docs: [https://example.com/test-meta-router](https://example.com/test-meta-router)')
    expect(metadataSkill).toContain('Source code: [https://github.com/example/test-meta-router](https://github.com/example/test-meta-router)')
    await expect(fsp.readFile(join(generatedSkillRoot, 'references/modules/test-nuxt-ui/nuxt-ui/SKILL.md'), 'utf8')).resolves.toContain('description: Test Nuxt UI module skill.')
    await expect(fsp.readFile(join(generatedSkillRoot, 'references/modules/test-nuxt-seo/nuxt-seo/SKILL.md'), 'utf8')).resolves.toContain('description: Test Nuxt SEO module skill.')
    await expect(fsp.access(join(generatedSkillRoot, 'references/modules/test-nuxt-ui/nuxt-ui/scripts/check.sh'))).rejects.toBeDefined()
    await expect(fsp.access(join(generatedSkillRoot, 'references/modules/test-nuxt-seo/nuxt-seo/scripts/check.sh'))).rejects.toBeDefined()
    await expect(fsp.access(join(skillRoot, 'references/index.md'))).rejects.toBeDefined()
    await expect(fsp.access(join(skillRoot, 'manifest.json'))).rejects.toBeDefined()
    await expect(fsp.access(join(cacheRoot, 'generated', 'nuxt-with-modules-fixture', '.state.json'))).resolves.toBeUndefined()
  }, 15000)
})
