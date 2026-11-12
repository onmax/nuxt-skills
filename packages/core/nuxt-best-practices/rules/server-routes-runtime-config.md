## Server Routes, h3 Patterns, and Runtime Config

### `server-validate-input-at-boundary`: Validate request input at handler boundaries
**Apply when:** creating or updating `server/api/*` routes, webhook handlers, or actions.
**Skip when:** the handler cannot define a stable input contract; flag that instead of casting.

```ts
// server/api/webhooks/billing.post.ts
import { z } from 'zod'

const BillingEvent = z.object({ type: z.string(), data: z.object({ id: z.string() }) })

export default defineEventHandler(async (event) => {
  // Wrong: const payload = (await readBody(event)) as z.infer<typeof BillingEvent>
  const result = BillingEvent.safeParse(await readBody(event))
  if (!result.success)
    throw createError({ status: 422, statusText: 'Invalid Payload', data: result.error.flatten() })
  return handleBillingEvent(result.data)
})
```

**Why:** validation at the h3 entrypoint keeps downstream code free of hidden shape assumptions. `readValidatedBody` is the shorthand (see Nitro and h3 Server Patterns).
**Verify:** params, query, and body of each new or edited handler are validated; an invalid payload returns an explicit 4xx.

### `server-runtime-config-public-minimal`: Keep runtime config exposure intentional
**Apply when:** adding env vars or endpoint values to `runtimeConfig`.
**Skip when:** never put secrets in public config; if a feature seems to require it, move the logic server-side.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    stripeSecret: '', // server only, NUXT_STRIPE_SECRET
    public: {
      apiBase: '/api', // client-visible, NUXT_PUBLIC_API_BASE
      // Wrong: stripeSecret, dbUrl, or a whole upstream config object here
    },
  },
})
```

**Why:** keys under `runtimeConfig.public` ship to every client; adding one is a public API change.
**Verify:** the `nuxt.config` diff adds only the public keys the client actually reads.

### `server-header-forwarding-allowlist`: Forward request headers intentionally
**Apply when:** passing request context from SSR to internal or external API calls.
**Skip when:** the upstream contract demands full raw header pass-through (document why).

```vue
<script setup lang="ts">
// Internal: relative useFetch on the server forwards request context for you
const { data: me } = await useFetch('/api/me')

// External: allowlist what the upstream needs
const headers = useRequestHeaders(['accept-language'])
const { data: offers } = await useFetch('https://api.partner.com/offers', { headers })

// Wrong: { headers: useRequestHeaders() } sends cookies and auth to a third party
</script>
```

**Why:** relative `useFetch` calls on the server are request-aware; external calls get nothing by default and need explicit safety controls when you add headers.
**Verify:** for each upstream (internal or external), only the required headers are forwarded.
