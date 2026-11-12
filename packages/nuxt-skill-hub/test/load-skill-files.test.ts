import { promises as fsp } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'pathe'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadSkillFilesFromDir } from '../shared/load-skill-files'
import { DEFAULT_NUXT_CONTENT_METADATA } from '../shared/skill-render'
import { buildNuxtTemplateFiles } from '../src/internal'

const glob = fsp.glob
const roots: string[] = []

function useWindowsGlobPaths() {
  vi.spyOn(fsp, 'glob').mockImplementation(async function* (...args: Parameters<typeof fsp.glob>) {
    for await (const path of glob(...args)) {
      yield typeof path === 'string' ? path.replaceAll('/', '\\') : path
    }
    return undefined
  })
}

afterEach(async () => {
  vi.restoreAllMocks()
  await Promise.all(roots.splice(0).map(root => fsp.rm(root, { recursive: true, force: true })))
})

describe('windows skill file paths', () => {
  it('uses slash-delimited keys and skip entries for nested files', async () => {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-paths-'))
    roots.push(root)
    await fsp.mkdir(join(root, 'rules'))
    await fsp.writeFile(join(root, 'rules/keep.md'), 'keep')
    await fsp.writeFile(join(root, 'rules/skip.md'), 'skip')
    useWindowsGlobPaths()

    expect(await loadSkillFilesFromDir(root, ['rules/skip.md'])).toEqual({
      'rules/keep.md': 'keep',
    })
  })

  it('builds a bundled Nuxt rule pack with Windows glob results', async () => {
    useWindowsGlobPaths()
    const pack = DEFAULT_NUXT_CONTENT_METADATA.packs[0]!

    const files = await buildNuxtTemplateFiles('references/nuxt', [pack])

    expect(files).toEqual([{
      path: join('references/nuxt', pack.relativePath),
      contents: expect.stringContaining(`## ${pack.title}`),
    }])
  })
})
