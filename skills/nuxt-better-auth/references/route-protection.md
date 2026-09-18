# Route protection

## Layers

1. `routeRules` or `nitro.routeRules` for broad app sections
2. `definePageMeta({ auth })` for page-level overrides
3. `requireUserSession(event)` for server-side enforcement

Use route rules and page meta for navigation UX. Use `requireUserSession(event)` for protected API routes and mutations.

## Common route rules

```ts
export default defineNuxtConfig({
  routeRules: {
    '/app/**': { auth: { only: 'user', redirectTo: '/login' } },
    '/login': { auth: { only: 'guest', redirectTo: '/app' } },
    '/admin/**': { auth: { only: 'user', user: { role: 'admin' } } },
  },
})
```

The same auth keys work under `nitro.routeRules`. If both `routeRules` and `nitro.routeRules` are set, the module reads `nitro.routeRules`.

## Matching

- `'user'`: authenticated users only
- `'guest'`: unauthenticated users only
- `{ user: { ... } }`: user must match fields
- arrays inside a field mean OR matching
- multiple fields mean AND matching
- `false`: disable auth for that route/page

The string forms remain available as shorthand. `auth: 'user'` redirects to the configured login fallback, and `auth: 'guest'` redirects to the configured guest fallback.

## Redirects

```ts
export default defineNuxtConfig({
  auth: {
    redirects: {
      login: '/login',
      guest: '/',
      authenticated: '/app',
      logout: '/goodbye',
    },
    preserveRedirect: true,
    redirectQueryKey: 'redirect',
  },
})
```

- Per-route `redirectTo` takes precedence over `auth.redirects.login` and `auth.redirects.guest`.
- A validated local redirect query takes precedence over `auth.redirects.authenticated` after sign-in or sign-up.
- `auth.redirects.logout` applies after sign-out unless the caller supplies `onSuccess`.

## Broad rules and internals

Broad rules such as `'/**': { auth: 'user' }` intentionally skip framework and module internals that must stay reachable:

- `/_nuxt/**`
- `/_ipx/**`
- `/__nuxt_devtools__/**`
- `/__better-auth-devtools`
- `/api/auth/**`
- `/api/_better-auth/**`
- `/api/_nuxt_icon/**`

The same broad rules still apply to app-owned pages and app-owned `/api/**` handlers.

## Page meta

```vue
<script setup lang="ts">
definePageMeta({
  auth: {
    only: 'user',
    redirectTo: '/login',
    user: { role: ['admin', 'owner'] },
  },
})
</script>
```

Page meta overrides global route rules for that page.
