# Installation & Configuration

## Install

```bash
pnpm add @onmax/nuxt-better-auth better-auth
```

**Version Requirements:**

- `@onmax/nuxt-better-auth`: `^0.0.2-alpha.19` (alpha)
- `better-auth`: `^1.0.0` (module tested with `1.4.7`)
- `@nuxthub/core`: `^0.10.5+` (optional, for database - requires 0.10.5+ for `hub:db` aliases)

## Module Setup

The module auto-scaffolds `server/auth.config.ts` and `app/auth.config.ts` files during installation (since v0.0.2-alpha.15).

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@onmax/nuxt-better-auth'],
  auth: {
    serverConfig: 'server/auth.config',  // default
    clientConfig: 'app/auth.config',     // default
    clientOnly: false,                   // true for external auth backend
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
# Can also be set via runtimeConfig.betterAuthSecret (takes priority)
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
  },
  // Session configuration (optional)
  session: {
    expiresIn: 60 * 60 * 24 * 7,      // 7 days (default)
    updateAge: 60 * 60 * 24,           // Update every 24h (default)
    freshAge: 60 * 60 * 24,            // Consider fresh for 24h (default, 0 to disable)
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5                   // 5 minutes cookie cache
    }
  }
}))
```

Context available in `defineServerAuth`:

- `runtimeConfig` - Nuxt runtime config
- `db` - Database adapter (when NuxtHub enabled)

### Session Options

| Option                  | Default            | Description                                   |
| ----------------------- | ------------------ | --------------------------------------------- |
| `expiresIn`             | `604800` (7 days)  | Session lifetime in seconds                   |
| `updateAge`             | `86400` (24 hours) | How often to refresh session expiry           |
| `freshAge`              | `86400` (24 hours) | Session considered "fresh" period (0 = never) |
| `cookieCache.enabled`   | `false`            | Enable cookie caching to reduce DB queries    |
| `cookieCache.maxAge`    | `300` (5 minutes)  | Cookie cache lifetime                         |
| `disableSessionRefresh` | `false`            | Disable automatic session refresh             |

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

## Client-Only Mode

For external auth backends (microservices, separate servers):

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  auth: {
    clientOnly: true,  // No local auth server
  }
})
```

See [references/client-only.md](client-only.md) for full setup.

## i18n Integration

For internationalization support with `@nuxtjs/i18n` (since v0.0.2-alpha.15):

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', '@onmax/nuxt-better-auth'],
  i18n: {
    // Your i18n config
  }
})
```

The module automatically integrates with `@nuxtjs/i18n` when present, enabling localized auth flows and error messages.
