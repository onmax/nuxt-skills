## Nitro and h3 Server Patterns

### `nitro-validated-input-helpers`: Use h3 validated helpers for route params, query, and body
**Apply when:** creating or refactoring `server/api/*` handlers that take external input.
**Skip when:** the project has no accepted schema or validator library.

```ts
// server/api/users/[id].patch.ts
import { z } from 'zod'

const Params = z.object({ id: z.coerce.number().int() })
const Body = z.object({ name: z.string().min(1) })

export default defineEventHandler(async (event) => {
  // Wrong: const body = (await readBody(event)) as { name: string }
  const { id } = await getValidatedRouterParams(event, Params.parse)
  const body = await readValidatedBody(event, Body.parse)
  return updateUser(id, body)
})
```

**Why:** `getValidatedRouterParams`, `getValidatedQuery`, and `readValidatedBody` give runtime safety and typed results; casting `getQuery`/`readBody` gives neither.
**Verify:** every untrusted param, query, and body is validated; invalid input returns an explicit 4xx, not a 500.

### `nitro-waituntil-for-nonblocking-work`: Move non-critical async side work to `event.waitUntil`
**Apply when:** logging, cache warmup, or analytics in handlers that should not delay the response.
**Skip when:** the task's result is needed to compute the response.

```ts
export default defineEventHandler(async (event) => {
  const order = await createOrder(await readValidatedBody(event, Order.parse))
  // Wrong: await sendAnalytics(order)
  event.waitUntil(sendAnalytics(order))
  return order
})
```

**Why:** `event.waitUntil` lets the runtime provider (including edge runtimes) finish background work after the response is sent.
**Verify:** no awaited non-essential work remains on the response's critical path.

### `nitro-cache-varies-for-tenant-host`: Configure `cache.varies` when caching depends on request headers
**Apply when:** using Nitro caching or cached route rules with host- or tenant-aware logic.
**Skip when:** output is fully header-invariant.

```ts
export default defineCachedEventHandler((event) => {
  const host = getRequestHost(event, { xForwardedHost: true })
  return getTenantConfig(host)
}, { maxAge: 60, varies: ['host', 'x-forwarded-host'] })

// route rules: '/**': { cache: { maxAge: 60, varies: ['host', 'x-forwarded-host'] } }
```

**Why:** cached handlers drop incoming request headers by default, so host-based logic (including `useRequestURL()`) can resolve to `localhost` and one tenant's response gets served to all.
**Verify:** each header the cached output branches on is listed in `varies`.

### `nitro-api-error-shape-client-safe`: Use client-safe API error shape in server handlers
**Apply when:** throwing errors from `server/api/*` endpoints consumed by clients.
**Skip when:** the upstream error contract cannot be mapped safely; document the gap.

```ts
// Wrong: internal detail in the message (redacted for unhandled errors in production, but shown in development and by custom error handlers)
throw new Error(`DB lookup failed for ${email}: ${err.stack}`)
```

```ts
// Right
throw createError({ status: 409, statusText: 'Email Taken', data: { field: 'email' } })
```

**Why:** in API routes, a short `statusText` reaches the client, while `message` can surface in development or through custom error handlers; put structured payload in `data` and keep sensitive detail and raw user input out of both.
**Verify:** thrown errors use a consistent status and `statusText` contract with no leaked internals.

### `nitro-runtime-config-from-event`: Prefer `useRuntimeConfig(event)` in server routes
**Apply when:** reading runtime config inside server handlers.
**Skip when:** the code is not running in an h3 event handler.

```ts
export default defineEventHandler((event) => {
  const { apiSecret } = useRuntimeConfig(event) // not useRuntimeConfig()
  return callUpstream(apiSecret)
})
```

**Why:** the event argument is optional but recommended so runtime-overridden environment values resolve correctly during route execution.
**Verify:** handlers pass `event`, and config values are correct in the deployed runtime, not only in dev.
