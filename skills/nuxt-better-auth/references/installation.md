# Installation and configuration

## Happy path

```bash
npx nuxi module add @nuxtjs/better-auth
```

Required files:

- `server/auth.config.ts`
- `app/auth.config.ts` or the equivalent file inside your `srcDir`
- `.env` with `NUXT_BETTER_AUTH_SECRET`

## Environment variables

```ini
NUXT_BETTER_AUTH_SECRET=replace-with-a-random-32-character-secret
```

Set the public site URL when the deployment platform cannot detect it:

```ini
NUXT_PUBLIC_SITE_URL=https://your-domain.com
```

`BETTER_AUTH_SECRET` is still accepted as a fallback. Prefer `NUXT_BETTER_AUTH_SECRET`.

For non-destructive secret rotation, keep the current and previous secrets in Better Auth's versioned variable:

```ini
BETTER_AUTH_SECRETS=2:current-secret-must-be-at-least-32-characters,1:previous-secret-must-be-at-least-32-characters
```

## Minimal module setup

```ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/better-auth'],
})
```

## Minimal server config

```ts
import { defineServerAuth } from '@nuxtjs/better-auth/config'

export default defineServerAuth({
  emailAndPassword: {
    enabled: true,
  },
})
```

## Minimal client config

```ts
import { defineClientAuth } from '@nuxtjs/better-auth/config'

export default defineClientAuth({})
```

## Module-owned values

- Do not set `secret` manually in `defineServerAuth()`. The module injects it.
- Do not set `baseURL` manually in full mode. The module resolves it.
- Use `auth.clientOnly = true` only when Better Auth runs on an external backend.
- For database-backed auth with the shortest setup, prefer NuxtHub.

## NuxtHub setup

```ts
export default defineNuxtConfig({
  modules: ['@nuxthub/core', '@nuxtjs/better-auth'],
  hub: { db: 'sqlite' },
})
```

See [references/database.md](database.md) for schema setup.

## Client-only mode

For external auth backends:

```ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/better-auth'],
  auth: {
    clientOnly: true,
  },
})
```

See [references/client-only.md](client-only.md) for full setup.
