import { promises as fsp } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { DEFAULT_NUXT_CONTENT_METADATA } from '../shared/skill-render'
import { createGenerationFingerprint, hashBuiltInContent, resolveLockfileInfo } from '../src/generation/fingerprint'
import { getGenerationStatePath, isGeneratedSkillFreshWithOptions } from '../src/generation/state'

describe('resolveLockfileInfo', () => {
  it('returns null when no supported lockfile exists', async () => {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-lockfile-'))
    await expect(resolveLockfileInfo(root)).resolves.toBeNull()
  })
})

describe('createGenerationFingerprint', () => {
  it('is stable regardless of installed package or local source ordering', async () => {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-fingerprint-'))
    await fsp.writeFile(join(root, 'package.json'), JSON.stringify({
      name: 'fingerprint-fixture',
      private: true,
    }, null, 2), 'utf8')

    const common = {
      packageVersion: '0.0.4',
      rootDir: root,
      exportRoot: root,
      skillName: 'nuxt-fingerprint-fixture',
      options: {
        targets: ['codex'],
        generationMode: 'prepare' as const,
        moduleAuthoring: false,
      },
    }

    const first = await createGenerationFingerprint({
      ...common,
      installedPackages: [
        { packageName: 'b', version: '1.0.0' },
        { packageName: 'a', version: '2.0.0' },
      ],
      localSources: [
        {
          packageName: 'pkg-b',
          skillName: 'skill-b',
          sourceDir: '/tmp/b',
          sourceRoot: '/tmp',
          sourceKind: 'dist',
          forceIncludeScripts: false,
          hash: 'bbb',
        },
        {
          packageName: 'pkg-a',
          skillName: 'skill-a',
          sourceDir: '/tmp/a',
          sourceRoot: '/tmp',
          sourceKind: 'dist',
          forceIncludeScripts: false,
          hash: 'aaa',
        },
      ],
    })

    const second = await createGenerationFingerprint({
      ...common,
      installedPackages: [
        { packageName: 'a', version: '2.0.0' },
        { packageName: 'b', version: '1.0.0' },
      ],
      localSources: [
        {
          packageName: 'pkg-a',
          skillName: 'skill-a',
          sourceDir: '/tmp/a',
          sourceRoot: '/tmp',
          sourceKind: 'dist',
          forceIncludeScripts: false,
          hash: 'aaa',
        },
        {
          packageName: 'pkg-b',
          skillName: 'skill-b',
          sourceDir: '/tmp/b',
          sourceRoot: '/tmp',
          sourceKind: 'dist',
          forceIncludeScripts: false,
          hash: 'bbb',
        },
      ],
    })

    expect(first).toBe(second)
  })

  it('changes when local source script inclusion changes', async () => {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-fingerprint-flags-'))
    await fsp.writeFile(join(root, 'package.json'), JSON.stringify({
      name: 'fingerprint-flags-fixture',
      private: true,
    }, null, 2), 'utf8')

    const common = {
      packageVersion: '0.0.4',
      rootDir: root,
      exportRoot: root,
      skillName: 'nuxt-fingerprint-flags',
      options: {
        targets: ['codex'],
        generationMode: 'prepare' as const,
        moduleAuthoring: false,
      },
      installedPackages: [],
    }

    const withoutScripts = await createGenerationFingerprint({
      ...common,
      localSources: [
        {
          packageName: 'pkg',
          skillName: 'skill',
          sourceDir: '/tmp/skill',
          sourceRoot: '/tmp',
          sourceKind: 'dist',
          forceIncludeScripts: false,
          hash: 'same',
        },
      ],
    })

    const withScripts = await createGenerationFingerprint({
      ...common,
      localSources: [
        {
          packageName: 'pkg',
          skillName: 'skill',
          sourceDir: '/tmp/skill',
          sourceRoot: '/tmp',
          sourceKind: 'dist',
          forceIncludeScripts: true,
          hash: 'same',
        },
      ],
    })

    expect(withoutScripts).not.toBe(withScripts)
  })

  it('changes when remote generation controls change', async () => {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-fingerprint-remote-'))
    await fsp.writeFile(join(root, 'package.json'), JSON.stringify({
      name: 'fingerprint-remote-fixture',
      private: true,
    }, null, 2), 'utf8')

    const common = {
      packageVersion: '0.0.4',
      rootDir: root,
      exportRoot: root,
      skillName: 'nuxt-fingerprint-remote',
      installedPackages: [],
      localSources: [],
    }

    const enabled = await createGenerationFingerprint({
      ...common,
      options: {
        targets: ['codex'],
        generationMode: 'prepare' as const,
        remote: { enabled: true },
      },
    })

    const disabled = await createGenerationFingerprint({
      ...common,
      options: {
        targets: ['codex'],
        generationMode: 'prepare' as const,
        remote: false,
      },
    })

    expect(enabled).not.toBe(disabled)
  })
})

describe('built-in content in the fingerprint', () => {
  it('changes the fingerprint when bundled content changes at the same package version', async () => {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-fingerprint-content-'))
    const common = {
      packageVersion: '0.0.4',
      rootDir: root,
      exportRoot: root,
      skillName: 'nuxt-fingerprint-fixture',
      options: {},
      installedPackages: [],
      localSources: [],
    }

    const before = await createGenerationFingerprint({ ...common, builtInContentHash: 'a' })
    const after = await createGenerationFingerprint({ ...common, builtInContentHash: 'b' })

    expect(before).not.toBe(after)
  })

  it('hashes rule text and pack metadata', () => {
    const rules = { 'rules/data-fetching-ssr.md': '## Data Fetching and SSR\n' }
    const base = hashBuiltInContent(rules)

    expect(hashBuiltInContent({ ...rules })).toBe(base)
    expect(hashBuiltInContent({ 'rules/data-fetching-ssr.md': '## Data Fetching and SSR\nchanged\n' })).not.toBe(base)
    expect(hashBuiltInContent(rules, {
      ...DEFAULT_NUXT_CONTENT_METADATA,
      packs: DEFAULT_NUXT_CONTENT_METADATA.packs.map(pack => ({ ...pack, example: `${pack.example || ''}!` })),
    })).not.toBe(base)
  })
})

describe('isGeneratedSkillFreshWithOptions', () => {
  it('honors refresh and cache TTL settings', async () => {
    const root = await fsp.mkdtemp(join(tmpdir(), 'skill-hub-state-'))
    await fsp.writeFile(join(root, 'SKILL.md'), '# Skill\n', 'utf8')
    await fsp.writeFile(getGenerationStatePath(root), JSON.stringify({
      fingerprint: 'abc',
      generatedAt: new Date(Date.now() - 10_000).toISOString(),
      packageVersion: '0.0.4',
    }, null, 2), 'utf8')

    await expect(isGeneratedSkillFreshWithOptions(root, 'abc', { cacheTtlMs: 60_000 })).resolves.toBe(true)
    await expect(isGeneratedSkillFreshWithOptions(root, 'abc', { cacheTtlMs: 1 })).resolves.toBe(false)
    await expect(isGeneratedSkillFreshWithOptions(root, 'abc', { refresh: true, cacheTtlMs: 60_000 })).resolves.toBe(false)
  })
})
