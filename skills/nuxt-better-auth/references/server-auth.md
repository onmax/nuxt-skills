# Server-side authentication

## Helpers

These helpers are auto-imported inside `server/` in full mode:

- `serverAuth(event?)`
- `getUserSession(event)`
- `getRequestSession(event)`
- `setRequestSession(event, session)`
- `refreshSessionCookieCache(event)`
- `requireUserSession(event, options?)`
- `createSession(event, userId)`
- `setSessionCookie(event, token)`

## Which helper to use

| Need | Helper |
| --- | --- |
| Access raw Better Auth APIs | `serverAuth(event)` |
| Read session if it exists | `getUserSession(event)` |
| Reuse the same session lookup in one request | `getRequestSession(event)` |
| Supply a session resolved by trusted server authentication | `setRequestSession(event, session)` |
| Refresh Better Auth's cached session cookie after server-side updates | `refreshSessionCookieCache(event)` |
| Enforce auth | `requireUserSession(event, options?)` |
| Create a session in a custom flow | `createSession(event, userId)` |
| Attach a session token cookie manually | `setSessionCookie(event, token)` |

## Common API protection

```ts
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event, {
    user: { role: 'admin' },
  })

  return { userId: user.id }
})
```

`requireUserSession(event)` throws `401` when unauthenticated and `403` when the user match or custom rule fails.

## Supply a verified request session

Use `setRequestSession(event, session)` when another server authentication layer verifies the request and resolves a complete `AppSession` for existing session helpers to reuse.

```ts
const claims = await verifyBearerToken(event)
const session = await resolveCurrentAppSession(claims)

setRequestSession(event, session)
await requireUserSession(event)
```

The supplied value applies only to the current request and does not set a session cookie. Authenticate the value and enforce bearer-token audience and scope restrictions before calling the helper.

## Refresh cached session data

Use `refreshSessionCookieCache(event)` after server-side code updates data returned by `auth.api.getSession()`, `getUserSession(event)`, or `getRequestSession(event)`.

```ts
export default defineEventHandler(async (event) => {
  await updateCurrentUserProfile(event)
  await refreshSessionCookieCache(event)

  return { ok: true }
})
```

The helper refreshes the cached session cookie and the request-scoped `getRequestSession(event)` memo. It does not update the user or session record; do that first.

## Matching rules

- scalar value: exact match
- array value: OR match
- multiple fields: AND match
- `rule`: custom callback for logic field matching cannot express

```ts
await requireUserSession(event, {
  user: { role: ['admin', 'owner'] },
  rule: ({ user }) => user.verified === true,
})
```

## Custom server auth flow

```ts
export default defineEventHandler(async (event) => {
  const userId = await verifyCustomLogin(event)
  const session = await createSession(event, userId)
  await setSessionCookie(event, session.token)

  return { ok: true }
})
```

`setSessionCookie(event, token)` sets the Better Auth session token cookie only. It does not recreate every Better Auth sign-in side effect.
