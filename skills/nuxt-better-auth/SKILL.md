---
name: nuxt-better-auth
description: Guides authentication in Nuxt apps using @nuxtjs/better-auth. Use when installing or configuring the module, using its client or server APIs, protecting routes, refreshing sessions, or integrating Better Auth plugins.
license: MIT
---

# Nuxt Better Auth

Use the smallest reference that matches the task.

## Pick a reference

| Task | Read |
| --- | --- |
| Install the module, configure environment variables, or create config files | [references/installation.md](references/installation.md) |
| Read client session state, build auth forms, call plugins, or fetch auth-bound data | [references/client-auth.md](references/client-auth.md) |
| Read or enforce sessions in server handlers, create sessions, or refresh cached session data | [references/server-auth.md](references/server-auth.md) |
| Protect pages or API routes and configure redirects | [references/route-protection.md](references/route-protection.md) |
| Register Better Auth plugins and their client companions | [references/plugins.md](references/plugins.md) |
| Configure NuxtHub, generated schema, or secondary storage | [references/database.md](references/database.md) |
| Connect a Nuxt frontend to an external Better Auth server | [references/client-only.md](references/client-only.md) |
| Use inferred auth types or add project fields | [references/types.md](references/types.md) |

## Rules that apply across tasks

- Confirm the consumer's installed package version supports each API you use. The published skill may be newer than the consumer's lockfile.
- Enforce protected API reads and mutations server-side with `requireUserSession(event)`. Route rules and page meta also control navigation.
- Navigate only to validated local redirect paths.
- In `clientOnly` mode, do not use local server helpers or expect SSR session hydration.
- After server-side changes to session payload fields, call `refreshSessionCookieCache(event)`. Wrap custom client auth endpoints that create or change the current session with `runWithSessionRefresh()`.

Before finishing an implementation, run the consumer's typecheck and the narrowest relevant auth test.

## Resources

- [Documentation site](https://better-auth.nuxt.dev)
- [Better Auth docs](https://www.better-auth.com/)
