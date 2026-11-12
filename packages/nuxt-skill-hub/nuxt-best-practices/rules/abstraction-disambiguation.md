## Abstraction Disambiguation

### `disambiguation-framework-primitives-first`: Prefer framework-owned primitives before generic Vue or raw HTML
**Apply when:** generic Vue code, hand-rolled HTML, or custom event wiring looks like a plausible fix.
**Skip when:** the task explicitly requires behavior outside the framework-owned abstraction.

```vue
<!-- Wrong: hand-rolled watcher + $fetch for route data -->
<script setup lang="ts">
const route = useRoute()
const post = ref()
watch(() => route.params.slug, async (slug) => {
  post.value = await $fetch(`/api/posts/${slug}`)
}, { immediate: true })
</script>
```

```vue
<!-- Right: Nuxt owns route-reactive data loading -->
<script setup lang="ts">
const route = useRoute()
const { data: post } = await useFetch(() => `/api/posts/${route.params.slug}`)
</script>
```

**Why:** custom code that renders correctly is still wrong if it bypasses an abstraction that Nuxt, Nuxt Content, or Nuxt UI owns. Evals and framework conventions expect the native one.
**Verify:** name the surface being edited, check whether Nuxt, Nuxt Content, or Nuxt UI has a first-class primitive for it, and confirm the final code uses it. Fall back to generic Vue only when none fits.

### `disambiguation-nearby-concepts-before-editing`: Resolve nearby concept pairs before changing code
**Apply when:** the task could map to two similar Nuxt concepts.
**Skip when:** both concepts are intentionally involved and clearly separated.

Decide the pair before editing:
- `definePageMeta` (page behavior: layout, middleware) vs `useHead`/`useSeoMeta` (document head)
- data collection (records) vs page collection (renderable pages)
- `<NuxtLink>` (internal routes) vs raw `<a>` (external or router-bypassing)
- `useCookie` (SSR-safe) vs `document.cookie` (client-only)

**Why:** strong agents fail Nuxt tasks more often by picking the wrong neighboring abstraction than by writing broken code.
**Verify:** from the prompt's symptoms and the file's location, the chosen abstraction matches what the change is actually responsible for.

### `disambiguation-do-not-stop-at-visually-correct`: Do not accept a visually correct result as sufficient
**Apply when:** UI, docs, or content tasks where a hand-built implementation can look right.
**Skip when:** the prompt explicitly asks for custom markup or behavior the primitive cannot support.

**Why:** Nuxt evals reject custom HTML that renders acceptably when the intended answer was a Nuxt UI, Nuxt Content, or SSR-aware primitive.
**Verify:** check component choice, slot API, and data-source wiring against the expected framework primitive, not the screenshot.
