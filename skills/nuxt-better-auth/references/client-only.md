# Client-Only Mode (External Auth Backend)

When Better Auth runs on a separate backend (microservices, standalone server), use `clientOnly` mode.

## Configuration

### 1. Enable in nuxt.config.ts

```ts
export default defineNuxtConfig({
  modules: ['@onmax/nuxt-better-auth'],
  auth: {
    clientOnly: true,
  },
})
```

### 2. Point client to external server

```ts [app/auth.config.ts]
import { createAuthClient } from 'better-auth/vue'

export function createAppAuthClient(_baseURL: string) {
  return createAuthClient({
    baseURL: 'https://auth.example.com', // External auth server
  })
}
```

### 3. Set frontend URL

```ini [.env]
NUXT_PUBLIC_SITE_URL="https://your-frontend.com"
```

## What Changes

| Feature                                                                       | Full Mode       | Client-Only       |
| ----------------------------------------------------------------------------- | --------------- | ----------------- |
| `server/auth.config.ts`                                                       | Required        | Not needed        |
| `/api/auth/**` handlers                                                       | Auto-registered | Skipped           |
| `NUXT_BETTER_AUTH_SECRET`                                                     | Required        | Not needed        |
| Server utilities (`serverAuth()`, `getUserSession()`, `requireUserSession()`) | Available       | **Not available** |
| SSR session hydration                                                         | Server-side     | Client-side only  |
| `useUserSession()`, route protection, `<BetterAuthState>`                     | Works           | Works             |

## CORS Requirements

Ensure external auth server:

- Allows requests from frontend (CORS with `credentials: true`)
- Uses `SameSite=None; Secure` cookies (HTTPS required)
- Includes frontend URL in `trustedOrigins`

## SSR Considerations

Session fetched client-side only:

- Server-rendered pages render as "unauthenticated" initially
- Hydrates with session data on client
- Use `<BetterAuthState>` for loading states

```vue
<BetterAuthState v-slot="{ isLoading, user }">
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="user">Welcome, {{ user.name }}</div>
  <div v-else>Please log in</div>
</BetterAuthState>
```

## Use Cases

- **Microservices**: Auth service is separate deployment
- **Shared auth**: Multiple frontends share one auth backend
- **Existing backend**: Already have Better Auth server running elsewhere
- **Convex backend**: Use Convex HTTP adapter for serverless auth (since v0.0.2-alpha.16)

## Architecture Example

```
┌─────────────────┐     ┌─────────────────┐
│   Nuxt App      │────▶│  Auth Server    │
│  (clientOnly)   │     │ (Better Auth)   │
│                 │◀────│                 │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │    Database     │
                        └─────────────────┘
```
