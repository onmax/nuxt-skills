# Testing & Publishing

E2E testing, best practices, and publishing modules.

## E2E Testing Setup

```bash
npm install -D @nuxt/test-utils vitest
```

```ts
// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: { environment: 'nuxt' }
})
```

## Test Fixtures

Create a minimal Nuxt app that uses your module:

```ts
// test/fixtures/basic/nuxt.config.ts
import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyModule],
  myModule: { enabled: true }
})
```

```vue
<!-- test/fixtures/basic/pages/index.vue -->
<template>
  <MyButton>Click me</MyButton>
</template>
```

## Writing Tests

```ts
// test/basic.test.ts
import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('basic', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url))
  })

  it('renders component', async () => {
    const html = await $fetch('/')
    expect(html).toContain('Click me')
  })

  it('api works', async () => {
    const data = await $fetch('/api/_my-module/status')
    expect(data).toEqual({ status: 'ok' })
  })
})
```

## Manual Testing

```bash
# In module directory
npm pack

# In test project
npm install /path/to/my-module-1.0.0.tgz
```

---

## Best Practices

### Async Setup

Keep setup fast. Nuxt warns if setup exceeds 1 second.

```ts
// Wrong - blocking
async setup(options, nuxt) {
  const data = await fetchRemoteConfig()  // Slow!
}

// Right - defer to hooks
setup(options, nuxt) {
  nuxt.hook('ready', async () => {
    const data = await fetchRemoteConfig()
  })
}
```

### Prefix All Exports

Avoid naming conflicts:

| Type | Wrong | Right |
|------|-------|-------|
| Components | `<Button>` | `<FooButton>` |
| Composables | `useData()` | `useFooData()` |
| Server routes | `/api/track` | `/api/_foo/track` |
| Plugins | `$helper` | `$fooHelper` |

### Lifecycle Hooks

For one-time setup tasks:

```ts
export default defineNuxtModule({
  meta: { name: 'my-module', version: '2.0.0' },

  async onInstall(nuxt) {
    await generateInitialConfig(nuxt.options.rootDir)
  },

  async onUpgrade(options, nuxt, previousVersion) {
    if (semver.lt(previousVersion, '2.0.0')) {
      await migrateFromV1()
    }
  }
})
```

### TypeScript + ESM Only

```ts
// Always export typed options
export interface ModuleOptions {
  apiKey: string
  debug?: boolean
}

// ESM only - no CommonJS
import { something } from 'package'  // Right
const { something } = require('package')  // Wrong
```

### Error Messages

```ts
setup(options, nuxt) {
  if (!options.apiKey) {
    throw new Error('[my-module] `apiKey` option is required')
  }
}
```

---

## Publishing

### Build & Publish

```bash
npm run prepack  # Build
npm pack         # Test locally first
npm publish      # Publish to npm
```

### Naming Conventions

| Scope | Example | Description |
|-------|---------|-------------|
| `@nuxtjs/` | `@nuxtjs/tailwindcss` | Community modules (nuxt-modules org) |
| `nuxt-` | `nuxt-my-module` | Third-party modules |
| `@org/` | `@myorg/nuxt-auth` | Organization scoped |

### Documentation Checklist

- [ ] **Why** - What problem does this solve?
- [ ] **Installation** - How to install and configure?
- [ ] **Usage** - Basic examples
- [ ] **Options** - All config options with types
- [ ] **Demo** - StackBlitz link

### Version Compatibility

```ts
meta: {
  compatibility: { nuxt: '>=3.0.0' }
}
```

Use "X for Nuxt" naming, not "X for Nuxt 3" — let `meta.compatibility` handle versions.

## Resources

- [@nuxt/test-utils](https://nuxt.com/docs/getting-started/testing)
- [Publishing Modules](https://nuxt.com/docs/guide/going-further/modules#publishing)
- [Nuxt Modules Directory](https://nuxt.com/modules)
