---
name: nuxt
description: Nuxt application development and maintenance. Use for project structure, pages and routing, data fetching, SSR-safe state, middleware, plugins, server routes, runtime config, route rules, layers, built-in components, hydration, upgrades, and testing.
license: MIT
---

# Nuxt

Use Nuxt-owned primitives for Nuxt lifecycle, rendering, routing, and server behavior. Hand module-specific behavior to the matching module skill instead of reproducing its API here.

## Start here

1. Inspect `package.json`, the lockfile, `nuxt.config.*`, and the directory layout before choosing an API. Nuxt features move, so verify the installed version instead of assuming the latest release.
2. Open only the reference that owns the task.
3. Prefer the smallest Nuxt primitive that preserves SSR, hydration, and generated types.
4. Run `nuxt prepare` after config, module, alias, or generated-type changes, then verify the affected runtime path.

## Reference map

- Project structure, upgrades, deployment mode, and testing: [project-setup.md](references/project-setup.md)
- Data fetching, state, request context, cookies, head, and hydration: [nuxt-composables.md](references/nuxt-composables.md)
- Pages, layouts, navigation, route metadata, and errors: [routing.md](references/routing.md)
- Route middleware, app plugins, and runtime hooks: [middleware-plugins.md](references/middleware-plugins.md)
- API routes, server middleware, validation, caching, and Nitro: [server.md](references/server.md)
- Built-in components, assets, images, and lazy hydration: [nuxt-components.md](references/nuxt-components.md)
- Nuxt config, runtime config, route rules, layers, modules, Vite, and Nitro options: [nuxt-config.md](references/nuxt-config.md)

## Ownership boundaries

- Use the `nuxt-modules` skill for authoring or publishing a Nuxt module.
- Use the relevant module skill for Nuxt UI, Nuxt Content, Nuxt Studio, NuxtHub, Nuxt Image, Nuxt Scripts, Nuxt SEO, or another installed module.
- Use official VueUse guidance for VueUse composables. When names overlap, Nuxt owns Nuxt lifecycle and SSR semantics; see [nuxt-composables.md](references/nuxt-composables.md#vueuse-boundary).
- Use Vue guidance for component-local reactivity that has no Nuxt lifecycle or rendering concern.

## Baseline

```vue
<script setup lang="ts">
const { data: products, status, error } = await useFetch('/api/products')

useSeoMeta({
  title: 'Products',
  description: 'Browse the product catalog.',
})
</script>

<template>
  <main>
    <p v-if="status === 'pending'">Loading…</p>
    <p v-else-if="error">Could not load products.</p>
    <ProductList v-else :products="products ?? []" />
  </main>
</template>
```

`useFetch` integrates the request with Nuxt's SSR payload, while `useSeoMeta` participates in Nuxt's head lifecycle. Reach for lower-level primitives only when the task needs behavior these do not provide.
