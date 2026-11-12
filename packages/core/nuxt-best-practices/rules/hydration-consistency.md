## Hydration and SSR Consistency

### `hydration-no-browser-apis-in-ssr-path`: Keep browser-only APIs out of SSR execution paths
**Apply when:** reading storage, window size, document state, or navigator data in setup or render.
**Skip when:** a third-party dependency cannot run at all without browser APIs before mount (isolate it in `<ClientOnly>`).

```vue
<!-- Wrong: localStorage does not exist during SSR -->
<script setup lang="ts">
const theme = ref(localStorage.getItem('theme') ?? 'light')
</script>
```

```vue
<!-- Right: cookies are readable on server and client -->
<script setup lang="ts">
const theme = useCookie('theme', { default: () => 'light' })
</script>
<!-- or gate it: <ClientOnly><ThemePicker /></ClientOnly>, or read in onMounted -->
```

**Why:** a hydration mismatch can force a full subtree re-render and break event-binding assumptions.
**Verify:** setup and template have no unguarded `window`/`document`/`localStorage`/`navigator`; server HTML and first client render match.

### `hydration-deterministic-first-render`: Make first render deterministic across server and client
**Apply when:** rendering timestamps, random values, or locale-sensitive formatting.
**Skip when:** the feature requires a client-personalized first paint and has an acceptable fallback.

```vue
<!-- Wrong: server and client compute different values -->
<template>
  <p>Generated {{ new Date().toLocaleString() }} · #{{ Math.random() }}</p>
</template>
```

```vue
<!-- Right: compute once on the server, reuse on hydration -->
<script setup lang="ts">
const seed = useState('seed', () => Math.random())
const builtAt = useState('built-at', () => new Date().toISOString())
</script>
<template>
  <NuxtTime :datetime="builtAt" /> #{{ seed }}
</template>
```

**Why:** time, randomness, and locale differences between SSR and CSR are a common mismatch cause. Otherwise defer such values until after mount.
**Verify:** the page hydrates with no mismatch warnings in the browser console.

### `hydration-client-only-libraries-after-mount`: Initialize DOM-mutating third-party libraries after hydration
**Apply when:** integrating analytics, tag managers, embeds, or widgets that touch the DOM directly.
**Skip when:** the library requires synchronous pre-hydration bootstrap and offers no fallback.

```vue
<!-- Wrong: runs during setup, before hydration finishes -->
<script setup lang="ts">
if (import.meta.client) initCarousel('#hero')
</script>
```

```vue
<!-- Right: init after mount; SSR renders a static fallback -->
<script setup lang="ts">
const hero = useTemplateRef('hero')
onMounted(() => initCarousel(hero.value!))
</script>
<template><div ref="hero"><img src="/hero-1.jpg" alt=""></div></template>
```

**Why:** `import.meta.client` only picks the code path; DOM writes before hydration completes still risk a mismatch. For app-wide libraries, use a `.client.ts` plugin and init in `nuxtApp.hook('app:mounted', ...)`.
**Verify:** no hydration warnings and no visible layout flash from re-render.
