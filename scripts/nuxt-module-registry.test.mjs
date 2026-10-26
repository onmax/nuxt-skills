import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- These tests run in CI before dependencies are installed.
import { test } from 'node:test'
import { fetchNuxtModules } from './nuxt-module-registry.mjs'

const registryUrl = 'https://cdn.jsdelivr.net/npm/@nuxt/modules@latest/modules.json'
const modules = [
  { name: 'ui', npm: '@nuxt/ui', github: 'https://github.com/nuxt/ui' },
  { name: 'hub', npm: '@nuxthub/core', github: 'https://github.com/nuxt-hub/core' },
]

test('loads the published registry when the website has no payload script', async () => {
  const requests = []
  const result = await fetchNuxtModules(async (url) => {
    requests.push(url)
    if (url === registryUrl)
      return JSON.stringify(modules)
    if (url === 'https://nuxt.com/modules')
      return '<html><body>Nuxt modules</body></html>'
    throw new Error(`Unexpected request: ${url}`)
  })

  assert.deepEqual(result, modules)
  assert.deepEqual(requests, [registryUrl])
})

test('rejects unavailable registries', async () => {
  await assert.rejects(fetchNuxtModules(async () => null), /Unable to fetch Nuxt module registry/)
  await assert.rejects(fetchNuxtModules(async () => {
    throw new Error('Network failure')
  }), /Network failure/)
})

test('rejects non-JSON responses', async () => {
  await assert.rejects(fetchNuxtModules(async () => '<html>Unavailable</html>'), /Invalid Nuxt module registry JSON/)
})

test('rejects empty, malformed and partially invalid registries before pruning skills', async () => {
  for (const payload of [
    null,
    { modules },
    [],
    [null],
    [{ ...modules[0], name: '' }],
    [{ ...modules[0], npm: undefined }],
    [{ ...modules[0], github: 'https://example.com/nuxt/ui' }],
    [modules[0], { ...modules[1], github: 3 }],
  ]) {
    await assert.rejects(fetchNuxtModules(async () => JSON.stringify(payload)), /Invalid or empty Nuxt module registry/)
  }
})
