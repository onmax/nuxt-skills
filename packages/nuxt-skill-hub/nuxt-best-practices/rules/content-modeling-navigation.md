## Content Modeling and Navigation

### `content-data-collections-for-structured-records`: Use data collections for structured JSON or YAML records
**Apply when:** working with structured records that are not authored as full content pages.
**Skip when:** the data is intentionally authored and rendered as page content.

```ts
// content.config.ts
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    docs: defineCollection({ type: 'page', source: 'docs/**/*.md' }),
    // Right: authors are records, not pages (Wrong: type: 'page')
    authors: defineCollection({
      type: 'data',
      source: 'authors/*.yml',
      schema: z.object({ name: z.string(), avatar: z.string() }),
    }),
  },
})
```

**Why:** collection type changes the query surface. Page collections carry `path`, `body`, and navigation; data collections avoid those page assumptions and are read with `queryCollection('authors')`.
**Verify:** for each collection, file format and `type` match the content model (records vs renderable pages).

### `content-navigation-from-collections`: Use collection navigation primitives for generated docs navigation
**Apply when:** building sidebars, section navigation, or docs trees from content.
**Skip when:** the navigation behavior cannot be expressed with collection helpers.

```vue
<!-- Wrong: flat query + custom tree building -->
<script setup lang="ts">
const { data: pages } = await useAsyncData('docs', () => queryCollection('docs').all())
const tree = computed(() => buildTree(pages.value)) // groups by path segments
</script>
```

```vue
<!-- Right -->
<script setup lang="ts">
const { data: navigation } = await useAsyncData('docs-nav', () => queryCollectionNavigation('docs'))
</script>
<template>
  <UContentNavigation :navigation="navigation" />
</template>
```

**Why:** manual sidebar assembly is a repeated failure mode when Nuxt Content already provides `queryCollectionNavigation`.
**Verify:** the sidebar derives from `queryCollectionNavigation`, not custom tree-building over the collection schema.

### `content-model-before-rendering`: Finalize content modeling before choosing rendering primitives
**Apply when:** a task mixes collection setup, querying, and rendering.
**Skip when:** the collection model is already fixed and correct.

Lock collection type, source, and schema first, then query, then render. A component that filters out `path` or strips `body` to display JSON records usually means the collection should be `type: 'data'`.

**Why:** many content bugs are modeling mistakes hidden under custom rendering code.
**Verify:** rendering code follows the collection model in `content.config.ts` instead of compensating for a wrong one.
