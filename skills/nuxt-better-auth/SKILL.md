---
name: nuxt-better-auth
description: Use when implementing auth in Nuxt apps with @onmax/nuxt-better-auth - provides useUserSession composable, server auth helpers, route protection, and Better Auth plugins integration.
license: MIT
---

# Nuxt Better Auth

Authentication module for Nuxt 4+ built on [Better Auth](https://www.better-auth.com/). Provides composables, server utilities, and route protection.

> **Alpha Status**: This module is currently in alpha (v0.0.2-alpha.8) and not recommended for production use. APIs may change.

## When to Use

- Installing/configuring `@onmax/nuxt-better-auth`
- Implementing login/signup/signout flows
- Protecting routes (client and server)
- Accessing user session in API routes
- Integrating Better Auth plugins (admin, passkey, 2FA)
- Setting up database with NuxtHub

**For Nuxt patterns:** use `nuxt` skill
**For NuxtHub database:** use `nuxthub` skill

## Available Guidance

| File                                                                 | Topics                                                |
| -------------------------------------------------------------------- | ----------------------------------------------------- |
| **[references/installation.md](references/installation.md)**         | Module setup, env vars, config files                  |
| **[references/client-auth.md](references/client-auth.md)**           | useUserSession, signIn/signUp/signOut, safe redirects |
| **[references/server-auth.md](references/server-auth.md)**           | serverAuth, getUserSession, requireUserSession        |
| **[references/route-protection.md](references/route-protection.md)** | routeRules, definePageMeta, middleware                |
| **[references/plugins.md](references/plugins.md)**                   | Better Auth plugins (admin, passkey, 2FA)             |
| **[references/database.md](references/database.md)**                 | NuxtHub integration, Drizzle schema                   |
| **[references/types.md](references/types.md)**                       | AuthUser, AuthSession, type augmentation              |

## Usage Pattern

**Load based on context:**

- Installing module? → [references/installation.md](references/installation.md)
- Login/signup forms? → [references/client-auth.md](references/client-auth.md)
- API route protection? → [references/server-auth.md](references/server-auth.md)
- Route rules/page meta? → [references/route-protection.md](references/route-protection.md)
- Using plugins? → [references/plugins.md](references/plugins.md)
- Database setup? → [references/database.md](references/database.md)
- TypeScript types? → [references/types.md](references/types.md)

**DO NOT read all files at once.** Load based on context.

## Key Concepts

| Concept                | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| `useUserSession()`     | Client composable - user, session, loggedIn, signIn/Out methods |
| `requireUserSession()` | Server helper - throws 401/403 if not authenticated             |
| `auth` route mode      | `'user'`, `'guest'`, `{ user: {...} }`, or `false`              |
| `serverAuth()`         | Get Better Auth instance in server routes                       |

## Quick Reference

```ts
// Client: useUserSession()
const { user, loggedIn, signIn, signOut } = useUserSession()
await signIn.email({ email, password }, { onSuccess: () => navigateTo('/') })
```

```ts
// Server: requireUserSession()
const { user } = await requireUserSession(event, { user: { role: 'admin' } })
```

```ts
// nuxt.config.ts: Route protection
routeRules: {
  '/admin/**': { auth: { user: { role: 'admin' } } },
  '/login': { auth: 'guest' },
  '/app/**': { auth: 'user' }
}
```

## Resources

- [Module Docs](https://github.com/onmax/nuxt-better-auth)
- [Better Auth Docs](https://www.better-auth.com/)

---

_Token efficiency: Main skill ~300 tokens, each sub-file ~800-1200 tokens_
