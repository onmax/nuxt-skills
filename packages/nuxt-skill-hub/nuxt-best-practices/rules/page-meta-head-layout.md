## Page Meta, Head, and Layout

### `page-define-page-meta-for-page-behavior`: Use `definePageMeta` for page behavior, not document metadata
**Apply when:** changing layout, middleware, route rules, page transitions, keepalive, or other page-level behavior.
**Skip when:** the change is not page-scoped.

```vue
<!-- app/pages/admin.vue -->
<script setup lang="ts">
// Wrong: setPageLayout in onMounted, or a manual redirect check in setup
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  keepalive: true,
})
</script>
```

**Why:** `definePageMeta` controls how the page behaves inside the app, not what goes into the document head.
**Verify:** the change lives in a page file and page behavior is declared in page metadata instead of custom glue.

### `page-use-head-for-document-metadata`: Use `useHead` or `useSeoMeta` for title and meta tags
**Apply when:** changing title, meta description, canonical URL, social metadata, or other head elements.
**Skip when:** the task is about route behavior, layout, or middleware.

```vue
<script setup lang="ts">
// Wrong: definePageMeta({ title: 'Pricing' }) only sets route.meta, no <title>
useSeoMeta({
  title: 'Pricing',
  description: 'Plans and limits',
  ogImage: '/og/pricing.png',
})
useHead({ link: [{ rel: 'canonical', href: 'https://example.com/pricing' }] })
</script>
```

**Why:** head metadata and page metadata are adjacent but not interchangeable. Use `useSeoMeta` for SEO tags and `useHead` for everything else in the head.
**Verify:** the rendered HTML `<head>` contains the expected tags, emitted through Nuxt head composables.

### `page-layout-structure-belongs-in-layouts`: Put shared page chrome and structure in layouts or framework shells
**Apply when:** headers, footers, navigation shells, or other structure repeat across routes.
**Skip when:** the structure is intentionally page-specific.

```vue
<!-- app/layouts/docs.vue; pages opt in with definePageMeta({ layout: 'docs' }) -->
<template>
  <AppHeader />
  <slot />
  <AppFooter />
</template>
<!-- app/app.vue renders <NuxtLayout><NuxtPage /></NuxtLayout> -->
```

**Why:** layout confusion usually travels with `definePageMeta` vs `useHead` confusion, so resolve both surfaces together.
**Verify:** shared chrome lives in a layout or framework shell, not duplicated in pages; reuse an existing layout before adding one.
