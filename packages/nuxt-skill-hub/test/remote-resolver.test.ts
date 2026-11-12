import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { promises as fsp } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'

function createSkillFiles(destinationDir: string, skillName: string): Promise<void> {
  const content = `---\nname: ${skillName}\ndescription: test\n---\n`
  return fsp.mkdir(destinationDir, { recursive: true })
    .then(() => fsp.writeFile(join(destinationDir, 'SKILL.md'), content, 'utf8'))
}

function skillMarkdown(skillName: string, description = 'test'): string {
  return `---\nname: ${skillName}\ndescription: ${description}\n---\n`
}

function sha256(content: string): string {
  return `sha256:${createHash('sha256').update(content).digest('hex')}`
}

function mockDownloadTemplate(impl: (input: string, dir: string) => Promise<void>) {
  return vi.fn(async (input: string, options?: { dir?: string }) => {
    if (!options?.dir) {
      throw new Error('missing dir')
    }

    await impl(input, options.dir)
    return {
      dir: options.dir,
      source: input,
    }
  })
}

describe('resolveRemoteContributionsForPackage', () => {
  it('resolves skill from github heuristics', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const downloadMock = mockDownloadTemplate(async (input, destinationDir) => {
      if (input === 'gh:acme/reka-ui/skills/reka-ui#main') {
        await createSkillFiles(destinationDir, 'reka-ui')
      }
      else {
        throw new Error('not found')
      }
    })

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn((input: string) => input || null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => ['reka-ui']),
      fetchUrlJson: vi.fn(async () => ({ ok: false, status: 404 })),
      fetchUrlBytes: vi.fn(async () => ({ ok: false, status: 404 })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: downloadMock,
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'reka-ui',
      version: '1.2.3',
      repository: 'acme/reka-ui',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
      enableGithubHeuristics: true,
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('github')
    expect(result.contributions[0]?.official).toBe(true)
    expect(result.contributions[0]?.resolver).toBe('githubHeuristic')
    expect(result.skipped).toEqual([])
    expect(downloadMock.mock.calls.some(call => String(call[0]).includes('onmax/nuxt-skills'))).toBe(false)
  })

  it('resolves the curated Nuxt Content skill without treating it as official upstream guidance', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const downloadMock = mockDownloadTemplate(async (input, destinationDir) => {
      if (input === 'gh:onmax/nuxt-skills/skills/nuxt-content#main') {
        await createSkillFiles(destinationDir, 'nuxt-content')
        return
      }

      throw new Error('not found')
    })
    const listGitHubDirectoryMock = vi.fn(async () => ['unrelated-skill'])

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: listGitHubDirectoryMock,
      fetchUrlJson: vi.fn(async () => ({ ok: false, status: 404 })),
      fetchUrlBytes: vi.fn(async () => ({ ok: false, status: 404 })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: downloadMock,
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: '@nuxt/content',
      version: '3.15.0',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
      enableGithubHeuristics: true,
      enableWellKnownLookup: false,
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]).toMatchObject({
      skillName: 'nuxt-content',
      sourceRepo: 'onmax/nuxt-skills',
      sourcePath: 'skills/nuxt-content',
      official: false,
      resolver: 'githubHeuristic',
    })
    expect(listGitHubDirectoryMock).not.toHaveBeenCalled()
  })

  it('generates a metadata-routed skill when github metadata is unavailable but package metadata exists', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const downloadMock = mockDownloadTemplate(async () => {
      throw new Error('not found')
    })

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: vi.fn(async () => ({ ok: false, status: 404 })),
      fetchUrlBytes: vi.fn(async () => ({ ok: false, status: 404 })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: downloadMock,
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'reka-ui',
      version: '1.2.3',
      description: 'Headless primitives for Vue.',
      homepage: 'https://reka-ui.com',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('generated')
    expect(result.contributions[0]?.resolver).toBe('metadataRouter')
    expect(result.contributions[0]?.docsUrl).toBe('https://reka-ui.com/')
    expect(result.skipped).toEqual([])
    expect(downloadMock.mock.calls).toEqual([])
  })

  it.each([
    ['versioned manifest', 'v0.3.0', 'skills/nuxt-module'],
    ['fallback manifest', 'main', '.agent/skills/nuxt-module'],
  ])('uses remote package agents.skills from a %s before heuristics', async (_label, sourceRef, sourcePath) => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const downloadMock = mockDownloadTemplate(async (input, destinationDir) => {
      if (input === `gh:acme/nuxt-module/${sourcePath}#${sourceRef}`) {
        await createSkillFiles(destinationDir, 'nuxt-module')
      }
      else if (input === 'gh:acme/nuxt-module/skills/wrong-heuristic#main') {
        await createSkillFiles(destinationDir, 'wrong-heuristic')
      }
      else {
        throw new Error('not found')
      }
    })
    const listGitHubDirectoryMock = vi.fn(async () => ['wrong-heuristic'])
    const defaultBranchMock = vi.fn(async () => 'main')

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn((input: string) => input || null),
      fetchGitHubDefaultBranch: defaultBranchMock,
      listGitHubDirectory: listGitHubDirectoryMock,
      fetchUrlJson: vi.fn(async () => ({ ok: false, status: 404 })),
      fetchUrlBytes: vi.fn(async () => ({ ok: false, status: 404 })),
      fetchGitHubFileText: vi.fn(async (_repo: string, ref: string) => ref === sourceRef
        ? {
            ok: true,
            status: 200,
            data: JSON.stringify({ agents: { skills: [{ name: 'nuxt-module', path: sourcePath }] } }),
          }
        : { ok: false, status: 404 }),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: downloadMock,
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: '@acme/nuxt-module',
      version: '0.3.0',
      repository: 'acme/nuxt-module',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
      enableGithubHeuristics: true,
    })

    expect(result.contributions).toEqual([expect.objectContaining({
      skillName: 'nuxt-module',
      sourceKind: 'github',
      resolver: 'agentsField',
      sourceRef,
      sourcePath,
    })])
    await expect(fsp.readFile(join(result.contributions[0]!.sourceDir, 'SKILL.md'), 'utf8')).resolves.toContain('name: nuxt-module')
    expect(listGitHubDirectoryMock).not.toHaveBeenCalled()
    if (sourceRef === 'v0.3.0') {
      expect(defaultBranchMock).not.toHaveBeenCalled()
    }
  })

  it('does not probe well-known indexes on localhost homepages', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const fetchUrlJsonMock = vi.fn(async () => ({ ok: false, status: 404 }))

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: fetchUrlJsonMock,
      fetchUrlBytes: vi.fn(async () => ({ ok: false, status: 404 })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: mockDownloadTemplate(async () => {
        throw new Error('not found')
      }),
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'local-docs',
      version: '1.0.0',
      description: 'Local docs.',
      homepage: 'http://localhost:3000/',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('generated')
    expect(fetchUrlJsonMock).not.toHaveBeenCalled()
  })

  it('does not probe well-known indexes on private IPv4 homepages', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const fetchUrlJsonMock = vi.fn(async () => ({ ok: false, status: 404 }))

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: fetchUrlJsonMock,
      fetchUrlBytes: vi.fn(async () => ({ ok: false, status: 404 })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: mockDownloadTemplate(async () => {
        throw new Error('not found')
      }),
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'private-docs',
      version: '1.0.0',
      description: 'Private docs.',
      homepage: 'http://192.168.1.10/docs',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('generated')
    expect(result.contributions[0]?.docsUrl).toBe('http://192.168.1.10/docs')
    expect(fetchUrlJsonMock).not.toHaveBeenCalled()
  })

  it('skips well-known v2 skill-md entries whose artifact URL leaves the discovery origin', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const fetchUrlBytesMock = vi.fn(async () => ({ ok: true, data: Buffer.from(skillMarkdown('docs-sdk')) }))

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: vi.fn(async (url: string) => url === 'https://docs.example.com/.well-known/agent-skills/index.json'
        ? {
            ok: true,
            data: {
              $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
              skills: [
                {
                  name: 'docs-sdk',
                  type: 'skill-md',
                  description: 'Use the SDK docs.',
                  url: 'https://evil.example.com/SKILL.md',
                  digest: sha256(skillMarkdown('docs-sdk')),
                },
              ],
            },
          }
        : { ok: false, status: 404 }),
      fetchUrlBytes: fetchUrlBytesMock,
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: mockDownloadTemplate(async () => {
        throw new Error('not found')
      }),
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'docs-sdk',
      version: '1.0.0',
      description: 'Docs SDK.',
      homepage: 'https://docs.example.com/',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('generated')
    expect(result.skipped.some(entry => entry.reason === 'well-known v2 skill URL must stay on the discovery origin')).toBe(true)
    expect(fetchUrlBytesMock).not.toHaveBeenCalled()
  })

  it('probes v2 and Docus well-known discovery indexes', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const fetchUrlJsonMock = vi.fn(async () => ({ ok: false, status: 404 }))

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: fetchUrlJsonMock,
      fetchUrlBytes: vi.fn(async () => ({ ok: false, status: 404 })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: mockDownloadTemplate(async () => {
        throw new Error('not found')
      }),
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'docs-sdk',
      version: '1.0.0',
      description: 'Docs SDK.',
      homepage: 'https://docs.example.com/',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('generated')
    expect(fetchUrlJsonMock).toHaveBeenCalledTimes(2)
    expect(fetchUrlJsonMock).toHaveBeenCalledWith('https://docs.example.com/.well-known/agent-skills/index.json', 200)
    expect(fetchUrlJsonMock).toHaveBeenCalledWith('https://docs.example.com/.well-known/skills/index.json', 200)
  })

  it('can disable well-known probing while still generating metadata routers', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const fetchUrlJsonMock = vi.fn(async () => ({ ok: false, status: 404 }))

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: fetchUrlJsonMock,
      fetchUrlBytes: vi.fn(async () => ({ ok: false, status: 404 })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: mockDownloadTemplate(async () => {
        throw new Error('not found')
      }),
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'docs-sdk',
      version: '1.0.0',
      description: 'Docs SDK.',
      homepage: 'https://docs.example.com/',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: false,
      enableWellKnownLookup: false,
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('generated')
    expect(fetchUrlJsonMock).not.toHaveBeenCalled()
  })

  it('skips schema-less well-known indexes instead of treating them as legacy discovery', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const fetchUrlBytesMock = vi.fn(async () => ({ ok: true, data: Buffer.from(skillMarkdown('docs-sdk')) }))

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: vi.fn(async (url: string) => url === 'https://docs.example.com/.well-known/agent-skills/index.json'
        ? {
            ok: true,
            data: {
              skills: [
                {
                  name: 'docs-sdk',
                  description: 'Use the SDK docs.',
                  files: ['SKILL.md'],
                },
              ],
            },
          }
        : { ok: false, status: 404 }),
      fetchUrlBytes: fetchUrlBytesMock,
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: mockDownloadTemplate(async () => {
        throw new Error('not found')
      }),
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'docs-sdk',
      version: '1.0.0',
      description: 'Docs SDK.',
      homepage: 'https://docs.example.com/',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('generated')
    expect(result.skipped.some(entry => entry.reason === 'well-known index is missing the v2 schema')).toBe(true)
    expect(fetchUrlBytesMock).not.toHaveBeenCalled()
  })

  it('resolves Docus well-known skills indexes', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const skill = skillMarkdown('docs-sdk', 'Use the SDK docs.')
    const apiRef = '# API\n'

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: vi.fn(async (url: string) => {
        if (url === 'https://docs.example.com/.well-known/agent-skills/index.json') {
          return { ok: false, status: 404 }
        }

        if (url === 'https://docs.example.com/.well-known/skills/index.json') {
          return {
            ok: true,
            data: {
              skills: [
                {
                  name: 'docs-sdk',
                  description: 'Use the SDK docs.',
                  files: ['SKILL.md', 'references/api.md'],
                },
              ],
            },
          }
        }

        return { ok: false, status: 404 }
      }),
      fetchUrlBytes: vi.fn(async (url: string) => {
        if (url === 'https://docs.example.com/.well-known/skills/docs-sdk/SKILL.md') {
          return { ok: true, data: Buffer.from(skill) }
        }

        if (url === 'https://docs.example.com/.well-known/skills/docs-sdk/references/api.md') {
          return { ok: true, data: Buffer.from(apiRef) }
        }

        return { ok: false, status: 404 }
      }),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: mockDownloadTemplate(async () => {
        throw new Error('not found')
      }),
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'docs-sdk',
      version: '1.0.0',
      description: 'Docs SDK.',
      homepage: 'https://docs.example.com/',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('wellKnown')
    expect(result.contributions[0]?.resolver).toBe('wellKnownSkills')
    await expect(fsp.readFile(join(result.contributions[0]!.sourceDir, 'SKILL.md'), 'utf8')).resolves.toBe(skill)
    await expect(fsp.readFile(join(result.contributions[0]!.sourceDir, 'references/api.md'), 'utf8')).resolves.toBe(apiRef)
  })

  it('skips Docus well-known indexes that exceed file limits', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: vi.fn(async (url: string) => url === 'https://docs.example.com/.well-known/skills/index.json'
        ? {
            ok: true,
            data: {
              skills: [
                {
                  name: 'docs-sdk',
                  description: 'Use the SDK docs.',
                  files: ['SKILL.md', 'references/api.md'],
                },
              ],
            },
          }
        : { ok: false, status: 404 }),
      fetchUrlBytes: vi.fn(async () => ({ ok: true, data: Buffer.from(skillMarkdown('docs-sdk')) })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: mockDownloadTemplate(async () => {
        throw new Error('not found')
      }),
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'docs-sdk',
      version: '1.0.0',
      description: 'Docs SDK.',
      homepage: 'https://docs.example.com/',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
      wellKnownLimits: {
        maxFiles: 1,
      },
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('generated')
    expect(result.skipped.some(entry => entry.reason.includes('exceeding the limit of 1'))).toBe(true)
  })

  it('skips Docus well-known indexes that include non-context files', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: vi.fn(async (url: string) => url === 'https://docs.example.com/.well-known/skills/index.json'
        ? {
            ok: true,
            data: {
              skills: [
                {
                  name: 'docs-sdk',
                  description: 'Use the SDK docs.',
                  files: ['SKILL.md', 'assets/logo.png'],
                },
              ],
            },
          }
        : { ok: false, status: 404 }),
      fetchUrlBytes: vi.fn(async () => ({ ok: true, data: Buffer.from(skillMarkdown('docs-sdk')) })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: mockDownloadTemplate(async () => {
        throw new Error('not found')
      }),
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'docs-sdk',
      version: '1.0.0',
      description: 'Docs SDK.',
      homepage: 'https://docs.example.com/',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('generated')
    expect(result.skipped.some(entry => entry.reason.includes('only .md and .json files are supported'))).toBe(true)
  })

  it('skips Docus well-known files that exceed byte limits', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const oversized = `${skillMarkdown('docs-sdk')}${'x'.repeat(32)}`

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: vi.fn(async (url: string) => url === 'https://docs.example.com/.well-known/skills/index.json'
        ? {
            ok: true,
            data: {
              skills: [
                {
                  name: 'docs-sdk',
                  description: 'Use the SDK docs.',
                  files: ['SKILL.md'],
                },
              ],
            },
          }
        : { ok: false, status: 404 }),
      fetchUrlBytes: vi.fn(async () => ({ ok: true, data: Buffer.from(oversized) })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: mockDownloadTemplate(async () => {
        throw new Error('not found')
      }),
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'docs-sdk',
      version: '1.0.0',
      description: 'Docs SDK.',
      homepage: 'https://docs.example.com/',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
      wellKnownLimits: {
        maxFileBytes: 16,
      },
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('generated')
    expect(result.skipped.some(entry => entry.reason.includes('per-file limit of 16 bytes'))).toBe(true)
  })

  it('resolves well-known v2 skill-md entries and verifies digests', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const skill = skillMarkdown('docs-sdk', 'Use the SDK docs.')

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: vi.fn(async (url: string) => url === 'https://docs.example.com/.well-known/agent-skills/index.json'
        ? {
            ok: true,
            data: {
              $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
              skills: [
                {
                  name: 'docs-sdk',
                  type: 'skill-md',
                  description: 'Use the SDK docs.',
                  url: '/.well-known/agent-skills/docs-sdk/SKILL.md',
                  digest: sha256(skill),
                },
              ],
            },
          }
        : { ok: false, status: 404 }),
      fetchUrlBytes: vi.fn(async (url: string) => url === 'https://docs.example.com/.well-known/agent-skills/docs-sdk/SKILL.md'
        ? { ok: true, data: Buffer.from(skill) }
        : { ok: false, status: 404 }),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: mockDownloadTemplate(async () => {
        throw new Error('not found')
      }),
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'docs-sdk',
      version: '1.0.0',
      homepage: 'https://docs.example.com/',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('wellKnown')
    expect(result.contributions[0]?.resolver).toBe('wellKnownV2')
    await expect(fsp.readFile(join(result.contributions[0]!.sourceDir, 'SKILL.md'), 'utf8')).resolves.toBe(skill)
  })

  it('skips well-known v2 skill-md entries with invalid digest formats and falls back', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const fetchUrlBytesMock = vi.fn(async () => ({ ok: true, data: Buffer.from(skillMarkdown('docs-sdk')) }))

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: vi.fn(async (url: string) => url === 'https://docs.example.com/.well-known/agent-skills/index.json'
        ? {
            ok: true,
            data: {
              $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
              skills: [
                {
                  name: 'docs-sdk',
                  type: 'skill-md',
                  description: 'Use the SDK docs.',
                  url: '/.well-known/agent-skills/docs-sdk/SKILL.md',
                  digest: 'sha256:not-valid',
                },
              ],
            },
          }
        : { ok: false, status: 404 }),
      fetchUrlBytes: fetchUrlBytesMock,
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: mockDownloadTemplate(async () => {
        throw new Error('not found')
      }),
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'docs-sdk',
      version: '1.0.0',
      homepage: 'https://docs.example.com/',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('generated')
    expect(result.skipped.some(entry => entry.reason === 'well-known v2 skill is missing a valid sha256 digest')).toBe(true)
    expect(fetchUrlBytesMock).not.toHaveBeenCalled()
  })

  it('skips well-known v2 skill-md entries with digest mismatches and falls back', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const skill = skillMarkdown('docs-sdk', 'Use the SDK docs.')

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: vi.fn(async (url: string) => {
        if (url === 'https://docs.example.com/.well-known/agent-skills/index.json') {
          return {
            ok: true,
            data: {
              $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
              skills: [
                {
                  name: 'docs-sdk',
                  type: 'skill-md',
                  description: 'Use the SDK docs.',
                  url: '/.well-known/agent-skills/docs-sdk/SKILL.md',
                  digest: `sha256:${'0'.repeat(64)}`,
                },
              ],
            },
          }
        }

        return { ok: false, status: 404 }
      }),
      fetchUrlBytes: vi.fn(async () => ({ ok: true, data: Buffer.from(skill) })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: mockDownloadTemplate(async () => {
        throw new Error('not found')
      }),
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'docs-sdk',
      version: '1.0.0',
      homepage: 'https://docs.example.com/',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('generated')
    expect(result.skipped.some(entry => entry.sourceKind === 'wellKnown' && entry.reason.includes('digest mismatch'))).toBe(true)
  })

  it('skips well-known v2 archive entries until archive extraction is supported', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: vi.fn(async (url: string) => url === 'https://docs.example.com/.well-known/agent-skills/index.json'
        ? {
            ok: true,
            data: {
              $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
              skills: [
                {
                  name: 'docs-sdk',
                  type: 'archive',
                  description: 'Use the SDK docs.',
                  url: '/.well-known/agent-skills/docs-sdk.tar.gz',
                  digest: `sha256:${'1'.repeat(64)}`,
                },
              ],
            },
          }
        : { ok: false, status: 404 }),
      fetchUrlBytes: vi.fn(async () => ({ ok: false, status: 404 })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: mockDownloadTemplate(async () => {
        throw new Error('not found')
      }),
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'docs-sdk',
      version: '1.0.0',
      homepage: 'https://docs.example.com/',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('generated')
    expect(result.skipped.some(entry => entry.reason === 'archive artifacts are not supported yet')).toBe(true)
  })

  it('discovers all root github skills for docus', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const downloadMock = mockDownloadTemplate(async (input, destinationDir) => {
      if (
        input === 'gh:nuxt-content/docus/skills/docus#main'
        || input === 'gh:nuxt-content/docus/skills/create-docs#main'
        || input === 'gh:nuxt-content/docus/skills/review-docs#main'
      ) {
        await createSkillFiles(destinationDir, input.split('/').pop()?.split('#')[0] || 'unknown')
      }
      else {
        throw new Error('not found')
      }
    })

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn((input: string) => input || null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => ['docus', 'create-docs', 'review-docs']),
      fetchUrlJson: vi.fn(async () => ({ ok: false, status: 404 })),
      fetchUrlBytes: vi.fn(async () => ({ ok: false, status: 404 })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: downloadMock,
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'docus',
      version: '5.8.0',
      repository: 'nuxt-content/docus',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
      enableGithubHeuristics: true,
    })

    expect(result.contributions).toHaveLength(3)
    expect(result.contributions.map(item => item.skillName)).toEqual(['docus', 'create-docs', 'review-docs'])
    expect(result.contributions.every(item => item.sourceKind === 'github')).toBe(true)
    expect(result.contributions.every(item => item.official)).toBe(true)
    expect(result.skipped).toEqual([])
  })

  it('generates a metadata-routed skill when no remote skill is available', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const downloadMock = mockDownloadTemplate(async () => {
      throw new Error('not found')
    })

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: vi.fn(async () => ({ ok: false, status: 404 })),
      fetchUrlBytes: vi.fn(async () => ({ ok: false, status: 404 })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: downloadMock,
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: '@nuxt/a11y',
      version: '1.0.0',
      description: 'Accessibility tooling for Nuxt.',
      repository: 'https://github.com/nuxt/a11y',
      homepage: 'https://a11y.nuxt.com/',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })

    expect(result.contributions).toHaveLength(1)
    expect(result.contributions[0]?.sourceKind).toBe('generated')
    expect(result.contributions[0]?.resolver).toBe('metadataRouter')
    expect(result.contributions[0]?.repoUrl).toBe('https://github.com/nuxt/a11y')
    expect(result.contributions[0]?.docsUrl).toBe('https://a11y.nuxt.com/')
    expect(result.skipped).toEqual([])
    await expect(fsp.readFile(join(result.contributions[0]!.sourceDir, 'SKILL.md'), 'utf8')).resolves.toContain('Docs: [https://a11y.nuxt.com/](https://a11y.nuxt.com/)')
    await expect(fsp.readFile(join(result.contributions[0]!.sourceDir, 'SKILL.md'), 'utf8')).resolves.not.toContain('This skill was generated from package metadata')
    await expect(fsp.access(join(result.contributions[0]!.sourceDir, 'references/index.md'))).rejects.toBeDefined()
  })

  it('reuses cached github skill trees across runs', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const downloadMock = mockDownloadTemplate(async (input, destinationDir) => {
      if (input === 'gh:acme/nuxt-module/skills/nuxt-module#v0.3.0') {
        await createSkillFiles(destinationDir, 'nuxt-module')
        return
      }

      throw new Error('not found')
    })

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn((input: string) => input || null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: vi.fn(async () => ({ ok: false, status: 404 })),
      fetchUrlBytes: vi.fn(async () => ({ ok: false, status: 404 })),
      fetchGitHubFileText: vi.fn(async () => ({
        ok: true,
        status: 200,
        data: JSON.stringify({
          agents: {
            skills: [
              { name: 'nuxt-module', path: 'skills/nuxt-module' },
            ],
          },
        }),
      })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: downloadMock,
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const packageInfo = {
      packageName: '@acme/nuxt-module',
      version: '0.3.0',
      repository: 'acme/nuxt-module',
    }

    const first = await resolveRemoteContributionsForPackage(packageInfo, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })
    const downloadCallsAfterFirstRun = downloadMock.mock.calls.length
    const second = await resolveRemoteContributionsForPackage(packageInfo, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })

    expect(first.contributions).toHaveLength(1)
    expect(second.contributions).toHaveLength(1)
    expect(downloadCallsAfterFirstRun).toBeGreaterThan(0)
    expect(downloadMock.mock.calls).toHaveLength(downloadCallsAfterFirstRun)
    expect(second.contributions[0]?.sourceDir).toBe(first.contributions[0]?.sourceDir)
  })

  it('re-fetches cached github skill trees for mutable branch refs', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const downloadMock = mockDownloadTemplate(async (input, destinationDir) => {
      if (input === 'gh:acme/reka-ui/skills/reka-ui#main') {
        await createSkillFiles(destinationDir, 'reka-ui')
        return
      }

      throw new Error('not found')
    })

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn((input: string) => input || null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => ['reka-ui']),
      fetchUrlJson: vi.fn(async () => ({ ok: false, status: 404 })),
      fetchUrlBytes: vi.fn(async () => ({ ok: false, status: 404 })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: downloadMock,
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const packageInfo = {
      packageName: 'reka-ui',
      version: '1.2.3',
      repository: 'acme/reka-ui',
    }

    const first = await resolveRemoteContributionsForPackage(packageInfo, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
      enableGithubHeuristics: true,
    })
    const second = await resolveRemoteContributionsForPackage(packageInfo, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
      enableGithubHeuristics: true,
    })

    expect(first.contributions).toHaveLength(1)
    expect(second.contributions).toHaveLength(1)
    expect(downloadMock).toHaveBeenCalledTimes(2)
    expect(second.contributions[0]?.sourceDir).toBe(first.contributions[0]?.sourceDir)
  })

  it('reuses cached metadata-router skill files across runs', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const downloadMock = mockDownloadTemplate(async () => {
      throw new Error('not found')
    })

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: vi.fn(async () => ({ ok: false, status: 404 })),
      fetchUrlBytes: vi.fn(async () => ({ ok: false, status: 404 })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: downloadMock,
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const packageInfo = {
      packageName: '@nuxt/a11y',
      version: '1.0.0',
      description: 'Accessibility tooling for Nuxt.',
      repository: 'https://github.com/nuxt/a11y',
      homepage: 'https://a11y.nuxt.com/',
    }

    const first = await resolveRemoteContributionsForPackage(packageInfo, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })
    const skillPath = join(first.contributions[0]!.sourceDir, 'SKILL.md')
    const cacheMarker = '\n<!-- cached-router -->\n'
    await fsp.appendFile(skillPath, cacheMarker)

    const second = await resolveRemoteContributionsForPackage(packageInfo, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })

    expect(second.contributions).toHaveLength(1)
    expect(second.contributions[0]?.sourceDir).toBe(first.contributions[0]?.sourceDir)
    await expect(fsp.readFile(skillPath, 'utf8')).resolves.toContain(cacheMarker)
    expect(downloadMock).not.toHaveBeenCalled()
  })

  it('keeps package skipped when metadata cannot produce a router skill', async () => {
    const cacheRoot = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-remote-'))
    const downloadMock = mockDownloadTemplate(async () => {
      throw new Error('not found')
    })

    vi.resetModules()
    vi.doMock('../src/remote-fetch', () => ({
      parseGitHubRepo: vi.fn(() => null),
      fetchGitHubDefaultBranch: vi.fn(async () => 'main'),
      fetchGitHubFileText: vi.fn(async () => ({ ok: false, status: 404 })),
      listGitHubDirectory: vi.fn(async () => []),
      fetchUrlJson: vi.fn(async () => ({ ok: false, status: 404 })),
      fetchUrlBytes: vi.fn(async () => ({ ok: false, status: 404 })),
    }))
    vi.doMock('giget', () => ({
      downloadTemplate: downloadMock,
    }))

    const { resolveRemoteContributionsForPackage } = await import('../src/remote-resolver')
    const result = await resolveRemoteContributionsForPackage({
      packageName: 'unknown-module',
      version: '0.0.1',
    }, {
      cacheRoot,
      githubLookupTimeoutMs: 200,
      enableGithubLookup: true,
    })

    expect(result.contributions).toEqual([])
    expect(result.skipped.some(entry => entry.sourceKind === 'generated')).toBe(true)
    expect(result.skipped.some(entry => entry.reason.includes('metadata-routed skill'))).toBe(true)
  })
})
