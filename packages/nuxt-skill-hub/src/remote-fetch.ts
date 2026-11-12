import { ofetch } from 'ofetch'

const GITHUB_API_BASE = 'https://api.github.com'
const UNGH_API_BASE = 'https://ungh.cc'

interface GitHubTreeEntry {
  path: string
  type: 'blob' | 'tree'
}

const githubDirectoryCache = new Map<string, Promise<string[]>>()
const githubDefaultBranchCache = new Map<string, Promise<string | null>>()
const githubFileTextCache = new Map<string, Promise<{ ok: boolean, data?: string, status?: number, error?: string }>>()
const urlTextCache = new Map<string, Promise<{ ok: boolean, data?: string, status?: number, error?: string }>>()
const urlBytesCache = new Map<string, Promise<{ ok: boolean, data?: Uint8Array, status?: number, error?: string }>>()

function githubFetchOptions(timeoutMs: number) {
  return {
    timeout: timeoutMs,
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'nuxt-skill-hub',
    },
  }
}

function fetchStatus(error: unknown): number | undefined {
  return typeof error === 'object' && error && 'status' in error
    ? Number((error as { status?: number }).status)
    : undefined
}

function encodeGitHubPath(path: string): string {
  return path
    .split('/')
    .filter(Boolean)
    .map(segment => encodeURIComponent(segment))
    .join('/')
}

function toRepoPath(value: string): string | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  const direct = trimmed
    .replace(/^git\+/, '')
    .replace(/^https?:\/\/github\.com\//, '')
    .replace(/^git:\/\/github\.com\//, '')
    .replace(/^git@github\.com:/, '')
    .replace(/\/+$/, '')
    .replace(/\.git$/, '')

  if (/^[\w.-]+\/[\w.-]+$/.test(direct)) {
    return direct
  }

  try {
    const url = new URL(trimmed.replace(/^git\+/, ''))
    if (url.hostname !== 'github.com') {
      return null
    }

    const pathname = url.pathname.replace(/^\/+|\/+$/g, '').replace(/\.git$/, '')
    if (/^[\w.-]+\/[\w.-]+$/.test(pathname)) {
      return pathname
    }
  }
  catch {
    // ignore invalid URL formats
  }

  return null
}

function memoize<T>(cache: Map<string, Promise<T>>, key: string, factory: () => Promise<T>): Promise<T> {
  const cached = cache.get(key)
  if (cached) {
    return cached
  }

  const pending = factory()
  cache.set(key, pending)
  return pending
}

export function parseGitHubRepo(input: string | undefined | null): string | null {
  if (!input) {
    return null
  }

  return toRepoPath(input)
}

export async function listGitHubDirectory(repo: string, ref: string, dirPath: string, timeoutMs: number): Promise<string[]> {
  const repoPath = toRepoPath(repo)
  if (!repoPath) {
    return []
  }

  const normalizedDirPath = dirPath.replace(/^\/+|\/+$/g, '')
  const prefix = normalizedDirPath ? `${normalizedDirPath}/` : ''

  return await memoize(githubDirectoryCache, `${repoPath}::${ref}::${normalizedDirPath}`, async () => {
    try {
      const data = await ofetch<{ tree?: GitHubTreeEntry[] }>(
        `${GITHUB_API_BASE}/repos/${repoPath}/git/trees/${encodeURIComponent(ref)}?recursive=1`,
        githubFetchOptions(timeoutMs),
      )

      const entries = new Set<string>()
      for (const entry of data.tree || []) {
        if (entry.type !== 'tree' || !entry.path.startsWith(prefix)) {
          continue
        }

        const remainder = entry.path.slice(prefix.length)
        if (remainder && !remainder.includes('/')) {
          entries.add(remainder)
        }
      }

      return Array.from(entries).sort((a, b) => a.localeCompare(b))
    }
    catch {
      return []
    }
  })
}

export async function fetchGitHubDefaultBranch(repo: string, timeoutMs: number): Promise<string | null> {
  const repoPath = toRepoPath(repo)
  if (!repoPath) {
    return null
  }

  const [owner, name] = repoPath.split('/')
  if (!owner || !name) {
    return null
  }

  return await memoize(githubDefaultBranchCache, repoPath, async () => {
    try {
      const data = await ofetch<{ repo?: { defaultBranch?: string } }>(
        `${UNGH_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
        githubFetchOptions(timeoutMs),
      )
      return data.repo?.defaultBranch || null
    }
    catch {
      return null
    }
  })
}

export async function fetchGitHubFileText(
  repo: string,
  ref: string,
  filePath: string,
  timeoutMs: number,
): Promise<{ ok: boolean, data?: string, status?: number, error?: string }> {
  const repoPath = toRepoPath(repo)
  if (!repoPath) {
    return { ok: false, error: 'Invalid GitHub repository format' }
  }

  return await memoize(githubFileTextCache, `${repoPath}::${ref}::${filePath}`, async () => {
    try {
      const data = await ofetch(
        `https://raw.githubusercontent.com/${repoPath}/${encodeURIComponent(ref)}/${encodeGitHubPath(filePath)}`,
        {
          ...githubFetchOptions(timeoutMs),
          responseType: 'text' as const,
        },
      )
      return { ok: true, data }
    }
    catch (error) {
      return {
        ok: false,
        status: fetchStatus(error),
        error: (error as Error).message,
      }
    }
  })
}

export async function fetchUrlText(url: string, timeoutMs: number): Promise<{ ok: boolean, data?: string, status?: number, error?: string }> {
  return await memoize(urlTextCache, url, async () => {
    try {
      const data = await ofetch(url, {
        ...githubFetchOptions(timeoutMs),
        responseType: 'text' as const,
      })
      return { ok: true, data }
    }
    catch (error) {
      return {
        ok: false,
        status: fetchStatus(error),
        error: (error as Error).message,
      }
    }
  })
}

export async function fetchUrlJson<T>(url: string, timeoutMs: number): Promise<{ ok: boolean, data?: T, status?: number, error?: string }> {
  const text = await fetchUrlText(url, timeoutMs)
  if (!text.ok) {
    return {
      ok: false,
      status: text.status,
      error: text.error,
    }
  }

  try {
    return {
      ok: true,
      data: JSON.parse(text.data || '') as T,
    }
  }
  catch (error) {
    return {
      ok: false,
      error: (error as Error).message,
    }
  }
}

export async function fetchUrlBytes(url: string, timeoutMs: number): Promise<{ ok: boolean, data?: Uint8Array, status?: number, error?: string }> {
  return await memoize(urlBytesCache, url, async () => {
    try {
      const data = await ofetch<ArrayBuffer, 'arrayBuffer'>(url, {
        ...githubFetchOptions(timeoutMs),
        responseType: 'arrayBuffer' as const,
      })
      return {
        ok: true,
        data: new Uint8Array(data),
      }
    }
    catch (error) {
      return {
        ok: false,
        status: fetchStatus(error),
        error: (error as Error).message,
      }
    }
  })
}
