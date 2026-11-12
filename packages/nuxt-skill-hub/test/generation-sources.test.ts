import type { ResolvedContribution } from '../src/types'
import { promises as fsp } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { collectWorkspaceDiscoverySources, createLocalSourceFingerprints } from '../src/generation/sources'

const cleanupPaths: string[] = []

function createContribution(sourceDir: string): ResolvedContribution {
  return {
    packageName: 'test-package',
    skillName: 'test-skill',
    sourceDir,
    sourceRoot: sourceDir,
    sourceKind: 'dist',
    official: false,
    resolver: 'agentsField',
    forceIncludeScripts: false,
  }
}

afterEach(async () => {
  await Promise.all(cleanupPaths.splice(0).map(path => fsp.rm(path, { recursive: true, force: true })))
})

describe('collectWorkspaceDiscoverySources', () => {
  it('includes non-node_modules local discoveries and skips installed package roots', () => {
    const rootDir = '/repo/apps/web'

    const contributions = collectWorkspaceDiscoverySources(rootDir, [
      {
        packageName: 'web-app',
        version: '1.0.0',
        packageRoot: '/repo/apps/web',
        skills: [{ name: 'web-skill', path: './skills/web-skill' }],
        issues: [],
      },
      {
        packageName: 'workspace-module',
        version: '1.0.0',
        packageRoot: '/repo/packages/workspace-module',
        skills: [{ name: 'workspace-skill', path: './skills/workspace-skill' }],
        issues: [],
      },
      {
        packageName: 'installed-module',
        version: '1.0.0',
        packageRoot: '/repo/node_modules/installed-module',
        skills: [{ name: 'installed-skill', path: './skills/installed-skill' }],
        issues: [],
      },
    ])

    expect(contributions).toEqual([
      expect.objectContaining({
        packageName: 'web-app',
        skillName: 'web-skill',
        sourceDir: '/repo/apps/web/skills/web-skill',
        sourceRoot: '/repo/apps/web',
      }),
      expect.objectContaining({
        packageName: 'workspace-module',
        skillName: 'workspace-skill',
        sourceDir: '/repo/packages/workspace-module/skills/workspace-skill',
        sourceRoot: '/repo/packages/workspace-module',
      }),
    ])
  })
})

describe('createLocalSourceFingerprints', () => {
  it('returns a null hash for non-directory source paths', async () => {
    const tempRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-source-fingerprint-'))
    cleanupPaths.push(tempRoot)

    const sourceFile = join(tempRoot, 'not-a-directory.md')
    await fsp.writeFile(sourceFile, '# not a skill directory\n', 'utf8')

    await expect(createLocalSourceFingerprints([createContribution(sourceFile)])).resolves.toEqual([
      expect.objectContaining({
        sourceDir: sourceFile,
        hash: null,
      }),
    ])
  })
})
