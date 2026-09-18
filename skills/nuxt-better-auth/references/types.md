# TypeScript types

## Primary imports

```ts
import type {
  AuthUser,
  AuthSession,
  AuthMeta,
  AuthRouteRules,
  RequireSessionOptions,
  AuthSocialProviderId,
} from '#nuxt-better-auth'
```

## Key guarantees

- `AuthUser` and `AuthSession` are inferred from your Better Auth config.
- plugin fields flow into `useUserSession()`, `getUserSession()`, `getRequestSession()`, `requireUserSession()`, and auth route matching.
- `AuthSocialProviderId` is inferred from configured social providers.

## Manual augmentation

Only add manual module augmentation if inference is not enough or you need to declare project-specific fields in advance.

```ts
import '#nuxt-better-auth'

declare module '#nuxt-better-auth' {
  interface AuthUser {
    customField?: string
  }
}
```

## Type-safe user matching

```ts
await requireUserSession(event, {
  user: { role: 'admin' },
})
```

The same user matcher shape works in route rules and page meta.
