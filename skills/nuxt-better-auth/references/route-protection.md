# Route Protection

Three layers of protection: route rules, page meta, and server middleware.

## Route Rules (Global)

Define auth requirements in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  routeRules: {
    '/admin/**': { auth: { user: { role: 'admin' } } },
    '/dashboard/**': { auth: 'user' },
    '/login': { auth: 'guest' },
    '/public/**': { auth: false }
  }
})
```

## Auth Modes

| Mode              | Behavior                                               |
| ----------------- | ------------------------------------------------------ |
| `'user'`          | Requires authenticated user                            |
| `'guest'`         | Only unauthenticated users (redirects logged-in users) |
| `{ user: {...} }` | Requires user matching specific properties             |
| `false`           | No protection                                          |

## Page Meta (Per-Page)

Override or define auth for specific pages:

```vue
<script setup>
// Require authentication
definePageMeta({ auth: 'user' })
</script>
```

```vue
<script setup>
// Require admin role
definePageMeta({
  auth: { user: { role: 'admin' } }
})
</script>
```

```vue
<script setup>
// Guest-only (login page)
definePageMeta({ auth: 'guest' })
</script>
```

## User Property Matching

```ts
// Single value
{ auth: { user: { role: 'admin' } } }

// OR logic (array)
{ auth: { user: { role: ['admin', 'moderator'] } } }

// AND logic (multiple fields)
{ auth: { user: { role: 'admin', verified: true } } }
```

## Redirect Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  auth: {
    redirects: {
      login: '/login',    // Where to redirect unauthenticated users
      guest: '/dashboard' // Where to redirect logged-in users from guest pages
    }
  }
})
```

## Server Middleware

Auth middleware runs on all `/api/**` routes matching `routeRules`.

For custom API protection, use `requireUserSession()`:

```ts
// server/api/admin/[...].ts
export default defineEventHandler(async (event) => {
  await requireUserSession(event, { user: { role: 'admin' } })
  // Handle request
})
```

## Priority Order

1. `definePageMeta({ auth })` - highest priority
2. `routeRules` patterns - matched by path
3. Default: no protection

## Prerendered Pages

Auth checks skip during prerender hydration. Session fetched client-side after hydration completes.
