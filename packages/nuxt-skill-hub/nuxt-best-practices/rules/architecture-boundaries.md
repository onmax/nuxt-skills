## Architecture Boundaries

### `arch-secrets-server-only`: Keep secrets and request checks server-side
**Apply when:** implementing auth, secret-bearing API calls, or per-request business logic.
**Skip when:** never skip; if a server-only check cannot be moved out of client code, stop and flag it.

```ts
// Wrong: app/composables/useReports.ts ships to the browser
export function useReports() {
  const { reportsToken } = useRuntimeConfig().public
  return useFetch('https://reports.internal/api', { headers: { 'x-token': reportsToken } })
}
```

```ts
// Right: server/api/reports.get.ts
export default defineEventHandler(async (event) => {
  await requireUser(event) // server/utils/auth.ts
  const { reportsToken } = useRuntimeConfig(event)
  return $fetch('https://reports.internal/api', { headers: { 'x-token': reportsToken } })
})
```

**Why:** everything in `runtimeConfig.public` and every composable imported by client code is visible in the browser.
**Verify:** grep changed `server/`, `app/composables/`, and `runtimeConfig` usage; no secret values or token checks end up in client bundles.

### `arch-request-safe-state`: Use request-safe state boundaries
**Apply when:** adding reusable cross-page logic with state.
**Skip when:** the state is truly global and immutable (constants, static lookup tables).

```ts
// Wrong: module scope is shared by every SSR request
const currentUser = ref<User | null>(null)
export const useCurrentUser = () => currentUser
```

```ts
// Right: per-request state, serialized to the client
export const useCurrentUser = () => useState<User | null>('current-user', () => null)
```

**Why:** the server process handles many requests; module-level mutable state leaks one user's data into another's render.
**Verify:** no request-specific data lives in module-scope `ref`/`reactive`/`let`; shared state goes through `useState` or is passed request context explicitly.

### `arch-server-entrypoint-for-sensitive-io`: Keep sensitive I/O behind server entrypoints
**Apply when:** calling third-party APIs, databases, or internal services with credentials.
**Skip when:** the upstream is public and needs no credentials.

```vue
<!-- Wrong: browser calls the privileged upstream with the user's token -->
<script setup lang="ts">
const token = useCookie('token')
const { data } = await useFetch('https://crm.example.com/contacts', {
  headers: { Authorization: `Bearer ${token.value}` },
})
</script>
```

```vue
<!-- Right: browser calls a constrained internal endpoint -->
<script setup lang="ts">
const { data } = await useFetch('/api/contacts')
</script>
```

**Why:** relative `useFetch('/api/*')` on the server reuses request context; external APIs need an explicit header allowlist.
**Verify:** browser code only talks to internal endpoints; check fetch targets, forwarded headers, and where tokens are read.
