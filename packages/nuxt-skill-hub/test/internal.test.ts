import { promises as fsp } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createStagingPath,
  discoverInstalledPackageFromDirectory,
  getTargetSkillRoot,
  isValidSkillName,
  parseAgentSkillDeclarations,
  replaceSkillTree,
  resolveContributions,
  resolveExportRoot,
  resolveMonorepoScopePath,
  sortAndDedupeContributions,
  swapDir,
} from '../src/internal'

describe('parseAgentSkillDeclarations', () => {
  it('returns valid entries and reports invalid declarations', () => {
    const parsed = parseAgentSkillDeclarations({
      agents: {
        skills: [
          { name: 'nuxt-ui', path: './skills/nuxt-ui' },
          { name: 'bad_name', path: './skills/empty-name' },
          { name: 'nuxt-seo', path: '' },
          { foo: 'bar' },
        ],
      },
    }, 'test-module')

    expect(parsed.skills).toEqual([{ name: 'nuxt-ui', path: './skills/nuxt-ui' }])
    expect(parsed.issues).toHaveLength(3)
    expect(parsed.issues.map(issue => issue.packageName)).toEqual(['test-module', 'test-module', 'test-module'])
  })
})

describe('discoverInstalledPackageFromDirectory', () => {
  it('reads package metadata from a resolved layer directory', async () => {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-layer-'))
    await fsp.writeFile(join(root, 'package.json'), JSON.stringify({
      name: 'docus',
      version: '5.8.0',
      docs: 'https://docus.dev/docs',
      documentation: { url: 'https://docus.dev/reference' },
      homepage: 'https://docus.dev',
      repository: {
        type: 'git',
        url: 'git+https://github.com/nuxt-content/docus.git',
      },
    }, null, 2), 'utf8')

    const result = await discoverInstalledPackageFromDirectory(root)

    expect(result).toMatchObject({
      packageName: 'docus',
      version: '5.8.0',
      packageRoot: root,
      repository: 'git+https://github.com/nuxt-content/docus.git',
      homepage: 'https://docus.dev',
      docsUrls: ['https://docus.dev/docs', 'https://docus.dev/reference', 'https://docus.dev'],
    })
  })
})

describe('isValidSkillName', () => {
  it('accepts and rejects names using strict skill format', () => {
    expect(isValidSkillName('nuxt-ui')).toBe(true)
    expect(isValidSkillName('Nuxt-ui')).toBe(false)
    expect(isValidSkillName('nuxt_ui')).toBe(false)
    expect(isValidSkillName('nuxt--ui')).toBe(false)
    expect(isValidSkillName(`a${'b'.repeat(64)}`)).toBe(false)
  })
})

describe('sortAndDedupeContributions', () => {
  it('removes duplicates and keeps deterministic ordering', () => {
    const sorted = sortAndDedupeContributions([
      {
        packageName: 'z-module',
        skillName: 'z',
        sourceDir: '/tmp/z',
        sourceRoot: '/tmp',
        sourceKind: 'dist',
        official: true,
        resolver: 'agentsField',
        forceIncludeScripts: false,
      },
      {
        packageName: 'a-module',
        skillName: 'a',
        sourceDir: '/tmp/a',
        sourceRoot: '/tmp',
        sourceKind: 'dist',
        official: true,
        resolver: 'agentsField',
        forceIncludeScripts: false,
      },
      {
        packageName: 'a-module',
        skillName: 'a',
        sourceDir: '/tmp/a',
        sourceRoot: '/tmp',
        sourceKind: 'dist',
        official: true,
        resolver: 'agentsField',
        forceIncludeScripts: false,
      },
    ])

    expect(sorted).toHaveLength(2)
    expect(sorted[0]?.packageName).toBe('a-module')
    expect(sorted[1]?.packageName).toBe('z-module')
  })
})

describe('resolveContributions', () => {
  it('skips invalid frontmatter and keeps valid skills', async () => {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-'))
    const validDir = join(root, 'skills', 'nuxt-ui')
    const invalidDir = join(root, 'skills', 'nuxt-seo')
    await fsp.mkdir(validDir, { recursive: true })
    await fsp.mkdir(invalidDir, { recursive: true })
    await fsp.writeFile(join(validDir, 'SKILL.md'), '---\nname: nuxt-ui\ndescription: ok\n---\n', 'utf8')
    await fsp.writeFile(join(invalidDir, 'SKILL.md'), '---\nname: nuxt-seo\n---\n', 'utf8')

    const result = await resolveContributions([
      {
        packageName: 'test-mod',
        packageRoot: root,
        skills: [
          { name: 'nuxt-ui', path: './skills/nuxt-ui' },
          { name: 'nuxt-seo', path: './skills/nuxt-seo' },
        ],
        issues: [],
      },
    ])

    expect(result.contributions.map(item => item.skillName)).toEqual(['nuxt-ui'])
    expect(result.contributions[0]?.description).toBe('ok')
    expect(result.issues.some(issue => issue.reason.includes('description'))).toBe(true)
  })

  it('accepts quoted and multiline frontmatter descriptions', async () => {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-'))
    const skillDir = join(root, 'skills', 'nuxt-ui')
    await fsp.mkdir(skillDir, { recursive: true })
    await fsp.writeFile(
      join(skillDir, 'SKILL.md'),
      [
        '---',
        'name: "nuxt-ui"',
        'description: |',
        '  Handles "Nuxt UI: forms" tasks.',
        '  Includes multiline guidance.',
        '---',
        '',
        '# Body',
      ].join('\n'),
      'utf8',
    )

    const result = await resolveContributions([
      {
        packageName: 'test-mod',
        packageRoot: root,
        skills: [
          { name: 'nuxt-ui', path: './skills/nuxt-ui' },
        ],
        issues: [],
      },
    ])

    expect(result.issues).toEqual([])
    expect(result.contributions[0]?.description).toBe('Handles "Nuxt UI: forms" tasks.\nIncludes multiline guidance.')
  })

  it('reports missing YAML frontmatter when a skill file has no frontmatter block', async () => {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-'))
    const skillDir = join(root, 'skills', 'nuxt-ui')
    await fsp.mkdir(skillDir, { recursive: true })
    await fsp.writeFile(join(skillDir, 'SKILL.md'), '# No frontmatter\n', 'utf8')

    const result = await resolveContributions([
      {
        packageName: 'test-mod',
        packageRoot: root,
        skills: [
          { name: 'nuxt-ui', path: './skills/nuxt-ui' },
        ],
        issues: [],
      },
    ])

    expect(result.contributions).toEqual([])
    expect(result.issues).toContainEqual(expect.objectContaining({
      packageName: 'test-mod',
      skillName: 'nuxt-ui',
      reason: 'SKILL.md must include YAML frontmatter',
    }))
  })
})

describe('resolveExportRoot', () => {
  it('returns the nearest pnpm workspace root', async () => {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-workspace-'))
    const workspaceRoot = join(root, 'repo')
    const appRoot = join(workspaceRoot, 'apps', 'web')

    await fsp.mkdir(appRoot, { recursive: true })
    await fsp.writeFile(join(workspaceRoot, 'pnpm-workspace.yaml'), 'packages:\n  - apps/*\n', 'utf8')

    expect(await resolveExportRoot(appRoot)).toBe(workspaceRoot)
  })

  it('returns the nearest package workspace root', async () => {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-workspace-'))
    const workspaceRoot = join(root, 'repo')
    const appRoot = join(workspaceRoot, 'packages', 'docs')

    await fsp.mkdir(appRoot, { recursive: true })
    await fsp.writeFile(join(workspaceRoot, 'package.json'), JSON.stringify({
      private: true,
      workspaces: ['packages/*'],
    }, null, 2), 'utf8')

    expect(await resolveExportRoot(appRoot)).toBe(workspaceRoot)
  })

  it('prefers the nearest enclosing workspace marker', async () => {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-workspace-'))
    const outerRoot = join(root, 'outer')
    const innerRoot = join(outerRoot, 'inner')
    const appRoot = join(innerRoot, 'apps', 'web')

    await fsp.mkdir(appRoot, { recursive: true })
    await fsp.writeFile(join(outerRoot, 'pnpm-workspace.yaml'), 'packages:\n  - inner/*\n', 'utf8')
    await fsp.writeFile(join(innerRoot, 'package.json'), JSON.stringify({
      private: true,
      workspaces: ['apps/*'],
    }, null, 2), 'utf8')

    expect(await resolveExportRoot(appRoot)).toBe(innerRoot)
  })

  it('falls back to the app root when no workspace marker exists', async () => {
    const appRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-app-'))
    expect(await resolveExportRoot(appRoot)).toBe(appRoot)
  })
})

describe('getTargetSkillRoot', () => {
  it('mirrors claude-code skills dir to project-local path', () => {
    const root = '/tmp/project'
    const resolved = getTargetSkillRoot(root, 'claude-code', 'nuxt')

    expect(resolved.targetDir).toBe(join(root, '.claude', 'skills'))
    expect(resolved.skillRoot).toBe(join(root, '.claude', 'skills', 'nuxt'))
  })

  it('mirrors nested windsurf config path to project-local rules dir', () => {
    const root = '/tmp/project'
    const resolved = getTargetSkillRoot(root, 'windsurf', 'nuxt')

    expect(resolved.targetDir).toBe(join(root, '.codeium', 'windsurf', 'rules'))
    expect(resolved.skillRoot).toBe(join(root, '.codeium', 'windsurf', 'rules', 'nuxt'))
  })

  it('throws when target configDir is outside the home directory', async () => {
    vi.resetModules()
    vi.doMock('unagent/env', () => ({
      detectInstalledAgents: vi.fn(() => []),
      getAgentConfig: vi.fn(() => ({
        configDir: '/opt/custom-agent-config',
        skillsDir: 'rules',
      })),
      getAgentIds: vi.fn(() => ['custom-agent']),
      expandPath: (value: string) => value,
    }))

    const { getTargetSkillRoot: getTargetSkillRootWithMock } = await import('../src/internal')
    const root = '/tmp/project'

    expect(() => getTargetSkillRootWithMock(root, 'custom-agent', 'nuxt')).toThrow('is not under home')
  })

  it('keeps skill roots distinct for multiple apps sharing a workspace export root', () => {
    const exportRoot = '/tmp/workspace'
    const webSkill = getTargetSkillRoot(exportRoot, 'claude-code', 'nuxt-web')
    const adminSkill = getTargetSkillRoot(exportRoot, 'claude-code', 'nuxt-admin')

    expect(webSkill.targetDir).toBe(adminSkill.targetDir)
    expect(webSkill.skillRoot).toBe(join(exportRoot, '.claude', 'skills', 'nuxt-web'))
    expect(adminSkill.skillRoot).toBe(join(exportRoot, '.claude', 'skills', 'nuxt-admin'))
    expect(resolveMonorepoScopePath('/tmp/workspace/apps/web', exportRoot)).toBe('apps/web')
    expect(resolveMonorepoScopePath(exportRoot, exportRoot)).toBeUndefined()
  })
})

describe('swapDir and replaceSkillTree', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('replaces a tree only once the new one is complete', async () => {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-swap-'))
    const target = join(root, 'skill')
    await fsp.mkdir(target)
    await fsp.writeFile(join(target, 'SKILL.md'), 'old')

    await expect(replaceSkillTree(join(root, 'missing'), target)).rejects.toThrow()
    await expect(fsp.readFile(join(target, 'SKILL.md'), 'utf8')).resolves.toBe('old')

    const staging = join(root, 'staging')
    await fsp.mkdir(staging)
    await fsp.writeFile(join(staging, 'SKILL.md'), 'new')
    await swapDir(staging, target)

    await expect(fsp.readFile(join(target, 'SKILL.md'), 'utf8')).resolves.toBe('new')
    expect((await fsp.readdir(root)).sort()).toEqual(['skill'])
    await fsp.rm(root, { recursive: true, force: true })
  })

  async function createSwapFixture() {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-swap-'))
    const target = join(root, 'skill')
    const staging = join(root, 'staging')
    await fsp.mkdir(target)
    await fsp.writeFile(join(target, 'SKILL.md'), 'old')
    await fsp.mkdir(staging)
    await fsp.writeFile(join(staging, 'SKILL.md'), 'new')
    return { root, target, staging }
  }

  /** Makes `fsp.rename` fail with EPERM, as Windows does, for the first `times` moves from `from`. */
  function denyRenames(from: string, times: number) {
    const rename = fsp.rename.bind(fsp)
    let denied = 0
    return vi.spyOn(fsp, 'rename').mockImplementation(async (source, destination) => {
      if (source === from && denied < times) {
        denied++
        throw Object.assign(new Error(`EPERM: operation not permitted, rename '${source}' -> '${destination}'`), { code: 'EPERM' })
      }
      return rename(source, destination)
    })
  }

  it('retries a rename that Windows denies for a moment', async () => {
    const { root, target, staging } = await createSwapFixture()
    denyRenames(staging, 2)

    await swapDir(staging, target)

    await expect(fsp.readFile(join(target, 'SKILL.md'), 'utf8')).resolves.toBe('new')
    expect((await fsp.readdir(root)).sort()).toEqual(['skill'])
    await fsp.rm(root, { recursive: true, force: true })
  })

  it('puts the old tree back when the new one cannot move in', async () => {
    const { root, target, staging } = await createSwapFixture()
    denyRenames(staging, Number.POSITIVE_INFINITY)

    await expect(swapDir(staging, target)).rejects.toMatchObject({ code: 'EPERM' })

    await expect(fsp.readFile(join(target, 'SKILL.md'), 'utf8')).resolves.toBe('old')
    expect((await fsp.readdir(root)).sort()).toEqual(['skill', 'staging'])
    await fsp.rm(root, { recursive: true, force: true })
  })

  it('keeps the tree another process published while this one was swapping', async () => {
    const { root, target, staging } = await createSwapFixture()
    const rename = fsp.rename.bind(fsp)
    vi.spyOn(fsp, 'rename').mockImplementation(async (source, destination) => {
      if (source === staging) {
        await fsp.mkdir(target, { recursive: true })
        await fsp.writeFile(join(target, 'SKILL.md'), 'other')
        throw Object.assign(new Error('EPERM'), { code: 'EPERM' })
      }
      return rename(source, destination)
    })

    await swapDir(staging, target)

    await expect(fsp.readFile(join(target, 'SKILL.md'), 'utf8')).resolves.toBe('other')
    expect((await fsp.readdir(root)).sort()).toEqual(['skill', 'staging'])
    await fsp.rm(root, { recursive: true, force: true })
  })

  it('gives each run its own staging path and removes ones left by dead runs', async () => {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-staging-'))
    const target = join(root, 'skill')
    const live = `${target}.staging-${process.pid}-live`
    await fsp.mkdir(live)
    await fsp.mkdir(`${target}.staging`)
    await fsp.mkdir(`${target}.staging-2147483646-dead`)

    const first = await createStagingPath(target)
    const second = await createStagingPath(target)

    expect(first).not.toBe(second)
    expect(first.startsWith(`${target}.staging-${process.pid}-`)).toBe(true)
    expect(await fsp.readdir(root)).toEqual([`skill.staging-${process.pid}-live`])
    await fsp.rm(root, { recursive: true, force: true })
  })
})
