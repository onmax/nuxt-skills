# TypeScript Types

## Module Alias

Import types from the module alias:

```ts
import type { AuthUser, AuthSession, ServerAuthContext, AppAuthClient } from '#nuxt-better-auth'
```

## Core Types

### AuthUser

User object returned by `useUserSession()` and `requireUserSession()`:

```ts
interface AuthUser {
  id: string
  email: string
  name?: string
  image?: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  // Plus any fields from plugins (role, etc.)
}
```

### AuthSession

Session object:

```ts
interface AuthSession {
  id: string
  userId: string
  expiresAt: Date
  // token is filtered from exposed data
}
```

## Type Inference

Types are automatically inferred from your server config. The module uses `InferUser` and `InferSession` from Better Auth:

```ts
// Inferred from server/auth.config.ts
type AuthUser = InferUser<typeof authConfig>
type AuthSession = InferSession<typeof authConfig>
```

## Plugin Type Augmentation

When using plugins, types extend automatically:

```ts
// With admin plugin
interface AuthUser {
  // ... base fields
  role: 'user' | 'admin'
}

// With 2FA plugin
interface AuthUser {
  // ... base fields
  twoFactorEnabled: boolean
}
```

## ServerAuthContext

Available in `defineServerAuth()` callback:

```ts
interface ServerAuthContext {
  runtimeConfig: RuntimeConfig
  db?: DrizzleDatabase  // When NuxtHub enabled
}
```

## Using Types in Components

```vue
<script setup lang="ts">
import type { AuthUser } from '#nuxt-better-auth'

const { user } = useUserSession()
// user is Ref<AuthUser | null>

function greet(u: AuthUser) {
  return `Hello, ${u.name}`
}
</script>
```

## Using Types in Server

```ts
// server/utils/helpers.ts
import type { AuthUser, AuthSession } from '#nuxt-better-auth'

export function isAdmin(user: AuthUser): boolean {
  return user.role === 'admin'
}
```

## Custom User Fields

Extend user type via Better Auth config:

```ts
// server/auth.config.ts
export default defineServerAuth(() => ({
  user: {
    additionalFields: {
      plan: { type: 'string' },
      credits: { type: 'number' }
    }
  }
}))
```

Types automatically include these fields:

```ts
// AuthUser now includes:
interface AuthUser {
  // ... base fields
  plan: string
  credits: number
}
```

## Type-Safe User Matching

```ts
// Fully typed
await requireUserSession(event, {
  user: { role: 'admin' }  // TypeScript knows valid fields
})
```
