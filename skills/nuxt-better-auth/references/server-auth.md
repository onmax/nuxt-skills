# Server-Side Authentication

## serverAuth()

Get the Better Auth instance for advanced operations:

```ts
// server/api/custom.ts
export default defineEventHandler(async (event) => {
  const auth = serverAuth()
  // Access full Better Auth API
  const sessions = await auth.api.listSessions({ headers: event.headers })
  return sessions
})
```

Module-level singleton (safe to call multiple times - returns cached instance).

### Available Server Methods

Via `serverAuth().api`:

```ts
const auth = serverAuth()

// Session management
await auth.api.listSessions({ headers: event.headers })
await auth.api.revokeSession({ sessionId: 'xxx' }, { headers: event.headers })
await auth.api.revokeOtherSessions({ headers: event.headers })
await auth.api.revokeSessions({ headers: event.headers })

// User management (with admin plugin)
await auth.api.setRole({ userId: 'xxx', role: 'admin' }, { headers: event.headers })
```

## getUserSession()

Get current session without throwing (returns null if not authenticated):

```ts
export default defineEventHandler(async (event) => {
  const result = await getUserSession(event)
  if (!result) {
    return { guest: true }
  }
  return { user: result.user }
})
```

Returns `{ user: AuthUser, session: AuthSession } | null`.

## requireUserSession()

Enforce authentication - throws if not authenticated:

```ts
export default defineEventHandler(async (event) => {
  const { user, session } = await requireUserSession(event)
  // user and session are guaranteed to exist
  return { userId: user.id }
})
```

- Throws `401` if not authenticated
- Throws `403` if user matching fails

## User Matching

Restrict access based on user properties:

```ts
// Single value - exact match
await requireUserSession(event, {
  user: { role: 'admin' }
})

// Array - OR logic (any value matches)
await requireUserSession(event, {
  user: { role: ['admin', 'moderator'] }
})

// Multiple fields - AND logic (all must match)
await requireUserSession(event, {
  user: { role: 'admin', verified: true }
})
```

## Custom Rules

For complex validation logic:

```ts
await requireUserSession(event, {
  rule: ({ user, session }) => {
    return user.subscription?.active && user.points > 100
  }
})

// Combined with user matching
await requireUserSession(event, {
  user: { verified: true },
  rule: ({ user }) => user.subscription?.plan === 'pro'
})
```

## Pattern Examples

```ts
// Admin-only endpoint
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event, {
    user: { role: 'admin' }
  })
  return getAdminData()
})

// Premium feature
export default defineEventHandler(async (event) => {
  await requireUserSession(event, {
    rule: ({ user }) => ['pro', 'enterprise'].includes(user.plan)
  })
  return getPremiumContent()
})

// Owner-only resource
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { user } = await requireUserSession(event)
  const resource = await getResource(id)
  if (resource.ownerId !== user.id) {
    throw createError({ statusCode: 403 })
  }
  return resource
})
```
