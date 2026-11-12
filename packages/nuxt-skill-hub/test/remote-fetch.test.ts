import { describe, expect, it, vi } from 'vitest'
import { parseGitHubRepo } from '../src/remote-fetch'

describe('parseGitHubRepo', () => {
  it('parses common GitHub repository URL formats', () => {
    expect(parseGitHubRepo('onmax/nuxt-skills')).toBe('onmax/nuxt-skills')
    expect(parseGitHubRepo('https://github.com/onmax/nuxt-skills')).toBe('onmax/nuxt-skills')
    expect(parseGitHubRepo('https://github.com/onmax/nuxt-skills.git')).toBe('onmax/nuxt-skills')
    expect(parseGitHubRepo('git+https://github.com/onmax/nuxt-skills.git')).toBe('onmax/nuxt-skills')
    expect(parseGitHubRepo('git@github.com:onmax/nuxt-skills.git')).toBe('onmax/nuxt-skills')
    expect(parseGitHubRepo('git://github.com/onmax/nuxt-skills.git')).toBe('onmax/nuxt-skills')
  })

  it('returns null for non-GitHub values', () => {
    expect(parseGitHubRepo('https://example.com/onmax/nuxt-skills')).toBeNull()
    expect(parseGitHubRepo('')).toBeNull()
    expect(parseGitHubRepo(undefined)).toBeNull()
  })
})

describe('remote fetch memoization', () => {
  it('memoizes default branch lookups per repo', async () => {
    const ofetchMock = vi.fn(async () => ({ repo: { defaultBranch: 'main' } }))

    vi.resetModules()
    vi.doMock('ofetch', () => ({
      ofetch: ofetchMock,
    }))

    const { fetchGitHubDefaultBranch } = await import('../src/remote-fetch')

    expect(await fetchGitHubDefaultBranch('onmax/nuxt-skills', 200)).toBe('main')
    expect(await fetchGitHubDefaultBranch('https://github.com/onmax/nuxt-skills', 400)).toBe('main')
    expect(ofetchMock).toHaveBeenCalledTimes(1)
  })

  it('memoizes file and directory fetches per repo/ref/path', async () => {
    const ofetchMock = vi.fn(async (url: string) => {
      if (url.includes('/git/trees/')) {
        return {
          tree: [
            { path: 'skills/nuxt-ui', type: 'tree' },
            { path: 'skills/nuxt-seo', type: 'tree' },
          ],
        }
      }

      return '{"name":"nuxt-skills"}'
    })

    vi.resetModules()
    vi.doMock('ofetch', () => ({
      ofetch: ofetchMock,
    }))

    const { fetchGitHubFileText, listGitHubDirectory } = await import('../src/remote-fetch')

    await expect(fetchGitHubFileText('onmax/nuxt-skills', 'main', 'package.json', 200)).resolves.toEqual({
      ok: true,
      data: '{"name":"nuxt-skills"}',
    })
    await expect(fetchGitHubFileText('onmax/nuxt-skills', 'main', 'package.json', 200)).resolves.toEqual({
      ok: true,
      data: '{"name":"nuxt-skills"}',
    })
    expect(await listGitHubDirectory('onmax/nuxt-skills', 'main', 'skills', 200)).toEqual(['nuxt-seo', 'nuxt-ui'])
    expect(await listGitHubDirectory('onmax/nuxt-skills', 'main', 'skills', 200)).toEqual(['nuxt-seo', 'nuxt-ui'])
    expect(ofetchMock).toHaveBeenCalledTimes(2)
  })

  it('memoizes generic URL text, JSON, and byte fetches per URL', async () => {
    const ofetchMock = vi.fn(async (url: string, options?: { responseType?: string }) => {
      if (options?.responseType === 'arrayBuffer') {
        return new Uint8Array([1, 2, 3]).buffer
      }

      if (url.endsWith('.json')) {
        return '{"ok":true}'
      }

      return 'hello'
    })

    vi.resetModules()
    vi.doMock('ofetch', () => ({
      ofetch: ofetchMock,
    }))

    const { fetchUrlBytes, fetchUrlJson, fetchUrlText } = await import('../src/remote-fetch')

    for (const timeoutMs of [200, 400]) {
      await expect(fetchUrlText('https://example.com/skill.md', timeoutMs)).resolves.toEqual({ ok: true, data: 'hello' })
      await expect(fetchUrlJson('https://example.com/index.json', timeoutMs)).resolves.toEqual({ ok: true, data: { ok: true } })
      await expect(fetchUrlBytes('https://example.com/skill.tar.gz', timeoutMs)).resolves.toEqual({ ok: true, data: new Uint8Array([1, 2, 3]) })
    }

    expect(ofetchMock).toHaveBeenCalledTimes(3)
  })

  it('returns non-throwing status details for generic URL 404s', async () => {
    const ofetchMock = vi.fn(async () => {
      throw Object.assign(new Error('Not Found'), { status: 404 })
    })

    vi.resetModules()
    vi.doMock('ofetch', () => ({
      ofetch: ofetchMock,
    }))

    const { fetchUrlText } = await import('../src/remote-fetch')

    await expect(fetchUrlText('https://example.com/missing', 200)).resolves.toMatchObject({
      ok: false,
      status: 404,
    })
  })
})
