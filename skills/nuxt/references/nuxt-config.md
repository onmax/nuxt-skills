# Nuxt configuration

Keep `nuxt.config.ts` declarative and use the narrowest configuration owner. Module-specific options belong under that module's config key and should follow the installed module's skill or documentation.

## Core shape

```ts
export default defineNuxtConfig({
  modules: [],
  runtimeConfig: {
    apiSecret: '',
    public: {
      apiBase: '/api',
    },
  },
  routeRules: {
    '/': { prerender: true },
    '/admin/**': { ssr: false },
    '/old': { redirect: '/new' },
  },
})
```

Preserve the repository's established `compatibilityDate`; do not update it incidentally because it can change Nitro behavior. Add one from the current Nuxt guidance when a project does not have it, then treat later changes as deliberate upgrades. Treat `future.compatibilityVersion` as an opt-in migration test and verify the entire application before keeping it.

## Runtime config and app config

`runtimeConfig` is populated at runtime and can receive environment overrides. Values outside `public` remain server-only; values under `public` are serialized to the client. Use matching `NUXT_...` environment variable names for runtime overrides instead of reading arbitrary environment variables in client code.

`app.config.ts` holds public, reactive application configuration that can be known at build time. It is not a secret store and does not receive the same runtime environment override contract as `runtimeConfig`.

## Route rules

`routeRules` applies behavior by route pattern. Depending on the installed Nitro version and deployment preset, rules can control prerendering, SSR, caching, redirects, headers, proxies, and middleware. Verify provider-specific caching and proxy semantics against the production preset.

Prefer config-level route rules for stable project behavior. Page-level inline rules require explicit framework support and configuration, so check the installed version before using them.

## Modules, imports, and components

List modules in `modules` and keep their configuration under their documented key. Nuxt auto-imports its own composables and scans conventional `app/composables`, `app/utils`, and `app/components` locations. Add custom import or component directories only when the conventional structure cannot represent the ownership.

Avoid manual imports solely to work around stale generated types; run `nuxt prepare` first. Avoid broad global component registration when local import or a focused scan path keeps the bundle and ownership clearer.

## Layers and aliases

Use `extends` for Nuxt layers that intentionally share configuration, components, composables, or assets across applications. Keep application secrets and deployment-specific values out of reusable layers.

Prefer Nuxt aliases (`~`, `~~`, `#imports`, `#components`, and server aliases supported by the installed version) over duplicating them in Vite or TypeScript. Define custom aliases in Nuxt config so generated TypeScript configuration receives them too.

## Vite, Nitro, and hooks

Configure Vite through `vite` and the server build through `nitro`. Reach into these objects only for behavior owned by those tools; Nuxt-level options are more portable across builders and presets.

Use Nuxt hooks for build-time extension and plugins for application-runtime hooks. If the task is reusable across projects, it may belong in a local Nuxt module instead of a large config callback.

## Completion checks

- `nuxt prepare` regenerates types without alias or module errors.
- Private runtime config is absent from the client payload.
- Route rules behave on the production Nitro preset.
- Layer order and overrides are deliberate and documented by the repository structure.
- Module APIs are sourced from the installed module rather than copied into core Nuxt guidance.
