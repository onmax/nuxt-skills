# Server routes and Nitro

Nuxt's `server/` directory runs through Nitro and H3. Check the installed Nuxt and Nitro versions before using a recently introduced server API.

## Directory ownership

```text
server/api/            routes prefixed with /api
server/routes/         routes without the /api prefix
server/middleware/     every HTTP request before route handlers
server/plugins/        Nitro runtime plugins and hooks
server/utils/          server-only auto-imported utilities
```

Suffix route files with an HTTP method when appropriate: `server/api/products/[id].get.ts` or `server/api/products.post.ts`. Server middleware should inspect or extend `event.context` and should not return an application response.

## Validate at the boundary

```ts
import { z } from 'zod'

const ProductInput = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(),
})

export default defineEventHandler(async (event) => {
  const input = await readValidatedBody(event, ProductInput.parse)
  const product = await createProduct(input)

  return { product }
})
```

Use `getValidatedQuery`, `getValidatedRouterParams`, or the corresponding H3 validation helper for other request inputs. Throw `createError` with an accurate status code for expected failures. Treat headers, cookies, route params, query values, and request bodies as untrusted even when TypeScript says otherwise.

Keep responses serializable. Do not return database connections, class instances with hidden state, secrets, or raw internal errors.

## Calling other services

Use `event.$fetch` for an internal request that should carry the current event context. Use `$fetch` for an external service and forward only the headers it needs. Never proxy all incoming headers blindly.

Prefer calling a shared server utility directly over making an HTTP request back into the same application when both handlers run in the same process.

## Caching and route rules

Use `cachedEventHandler` to cache a complete handler response and `cachedFunction` to cache reusable server work. Build keys from every input that changes the result, and never share a public cache entry across users when the response depends on authentication, cookies, locale, or private headers.

Use Nuxt `routeRules` for path-level rendering, prerendering, caching, redirects, and proxy behavior. Keep provider-specific cache behavior in Nitro or the deployment integration rather than assuming every preset implements the same storage semantics.

## Long-lived and background work

Streaming, server-sent events, WebSockets, and background tasks depend on Nitro, H3, and the deployment preset. Verify support in the installed versions and target platform before choosing them. Attach deferred work to the request or platform lifecycle when an API exists; an untracked promise may be terminated as soon as the response finishes.

For queues, schedules, durable state, and provider storage, use the provider or module skill that owns the runtime contract.

## Completion checks

- Runtime validation rejects malformed input before domain logic runs.
- Authorization is enforced in the server path that owns the data.
- Cache keys include all response-varying inputs and do not mix users.
- The production Nitro preset supports any streaming or background primitive used.
- Error responses expose safe details while logs retain the diagnostic context.
