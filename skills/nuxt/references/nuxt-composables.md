# Nuxt composables

## Choose the data primitive

- Use `useFetch` for one HTTP endpoint. It wraps `useAsyncData` and `$fetch`, generates a stable key from the URL and options, transfers SSR data through the Nuxt payload, and forwards request context for relative server calls.
- Use `useAsyncData` for custom async logic, SDK calls, multiple requests, or an explicit shared cache key.
- Use `$fetch` for event-driven requests such as form submissions. Calling `$fetch` directly during component setup can run once on the server and again during hydration because its result is not transferred in the Nuxt payload.

```vue
<script setup lang="ts">
const page = ref(1)

const { data, status, error, execute, clear } = await useFetch('/api/products', {
  query: { page },
  immediate: false,
  watch: false,
})
</script>
```

`execute()` starts the deferred request. `clear()` resets data, error, and status and cancels a pending request. Add `watch` sources only when changing them should refetch automatically.

## Async data invariants

Give reusable `useAsyncData` wrappers an explicit stable key. Calls sharing a key also share state, so keep their handler and structural options consistent.

```ts
export function useCatalog () {
  return useAsyncData('catalog', (_nuxtApp, { signal }) => {
    return $fetch('/api/catalog', { signal })
  })
}
```

Handlers should return a truthy value and remain side-effect-free. Use `callOnce` for side effects that must coordinate across SSR and client navigation. Pass the handler's abort `signal` to cancellable work.

Use `useNuxtData(key)` to read cached async data, `refreshNuxtData(key)` to refresh it, and `clearNuxtData(key)` to discard it. Prefer these over a second cache layered around Nuxt unless the application needs different persistence semantics.

For relative server requests during SSR, `useFetch` uses the current request context. In a custom helper, use `useRequestFetch()` when cookies and request headers need to be forwarded; plain `$fetch` intentionally does not forward them automatically.

## State and hydration

Use `useState` for SSR-safe state shared by components in one Nuxt application request. Its initializer must be serializable and side-effect-free.

```ts
export const useSelectedTeam = () => useState<string | null>('selected-team', () => null)
```

Use a dedicated store when the domain needs actions, persistence, or richer organization. Use `useHydration` only in plugins or modules that must transfer custom server state into the client payload; application data normally belongs in `useFetch`, `useAsyncData`, or `useState`.

## Request, config, cookies, and head

- `useRuntimeConfig()` reads private server config and public client config. Do not expose private values through `runtimeConfig.public`.
- `useRequestURL()`, `useRequestHeaders()`, and `useRequestFetch()` read the active SSR request. Guard server-only behavior with the runtime context when necessary.
- `useCookie()` creates an SSR-aware cookie ref. Keep values serializable and set security attributes appropriate to the data.
- `useSeoMeta()` is the preferred typed API for common SEO metadata. Use `useHead()` for links, scripts, attributes, and metadata outside that surface.
- `useRoute()` and `useRouter()` are application-routing APIs. Route middleware should use its `to` and `from` arguments instead of `useRoute()`.

## VueUse boundary

VueUse complements Nuxt for browser APIs, sensors, timing, and general Vue reactivity. Install and use VueUse from its official package rather than maintaining a copied skill or API catalog.

When names overlap, choose by ownership:

- Nuxt `useFetch`, `useCookie`, `useHead`, `useState`, and request composables preserve Nuxt SSR and hydration behavior, so use them in a Nuxt application.
- Vue's `toRef`, `toRefs`, and `toValue` are the canonical reactivity utilities; do not import same-named helpers accidentally from another package.
- VueUse utilities such as `watchDebounced`, `useStorage`, and browser sensor composables are appropriate after the Nuxt lifecycle boundary is settled. A client storage ref does not replace SSR state or a server cookie.
- Module-provided composables, such as an image or content helper, belong to that module's skill and documentation.

## Completion checks

- Initial data is not fetched twice across SSR and hydration.
- Shared async-data keys have consistent handlers and options.
- Request headers and cookies cross server boundaries only when intended.
- State placed in the Nuxt payload is serializable and contains no secrets.
