# Installation & Configuration

## Install

```bash
pnpm add @onmax/nuxt-better-auth better-auth
```

## Module Setup

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@onmax/nuxt-better-auth'],
  auth: {
    serverConfig: 'server/auth.config',  // default
    clientConfig: 'app/auth.config',     // default
    redirects: {
      login: '/login',  // redirect when auth required
      guest: '/'        // redirect when already logged in
    }
  }
})
```

## Environment Variables

```bash
# Required (min 32 chars)
BETTER_AUTH_SECRET=your-secret-key-at-least-32-characters

# Required in production for OAuth
NUXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Server Config

```ts
// server/auth.config.ts
import { defineServerAuth } from '#auth/server'

export default defineServerAuth(({ runtimeConfig, db }) => ({
  emailAndPassword: { enabled: true },
  // OAuth providers
  socialProviders: {
    github: {
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret
    }
  }
}))
```

Context available in `defineServerAuth`:

- `runtimeConfig` - Nuxt runtime config
- `db` - Database adapter (when NuxtHub enabled)

## Client Config

```ts
// app/auth.config.ts
import { createAppAuthClient } from '#auth/client'

export default createAppAuthClient({
  // Client-side plugin options (e.g., passkey, twoFactor)
})
```

## NuxtHub Integration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxthub/core', '@onmax/nuxt-better-auth'],
  hub: { database: true },
  auth: {
    secondaryStorage: true  // Enable KV for session caching
  }
})
```

See [references/database.md](database.md) for schema setup.
