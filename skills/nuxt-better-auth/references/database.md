# Database integration

## Fastest database-backed path

Use NuxtHub.

```ts
export default defineNuxtConfig({
  modules: ['@nuxthub/core', '@nuxtjs/better-auth'],
  hub: {
    db: 'sqlite',
  },
})
```

## What the module does with NuxtHub

- reads `server/auth.config.ts`
- generates auth tables from enabled Better Auth features
- exposes generated schema through `#auth/schema`
- supports custom atomic secondary storage for session lookup caching

## Secondary storage

```ts
export default defineNuxtConfig({
  hub: { db: 'sqlite' },
  auth: {
    hubSecondaryStorage: 'custom',
  },
})
```

Important:

- NuxtHub KV cannot implement Better Auth 1.7's atomic `getAndDelete` and `increment` operations, so `hubSecondaryStorage: true` logs a setup warning and continues without module-provided secondary storage. Sessions use the configured database when one exists. Track native support in [nuxt-hub/core#927](https://github.com/nuxt-hub/core/pull/927)
- `hubSecondaryStorage: 'custom'` means you provide an atomic `secondaryStorage`, such as Redis or Upstash
- use DB-only reads if you prefer stricter read-after-write consistency

## Non-NuxtHub setups

If you are not using NuxtHub, configure the Better Auth adapter yourself in `server/auth.config.ts` and manage schema generation separately.
