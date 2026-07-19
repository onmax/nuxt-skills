---
name: nuxt-content
description: Build typed, content-driven Nuxt applications with @nuxt/content. Use when working with content.config.ts, collections, queryCollection, Markdown or MDC rendering, content databases, hooks, custom sources, search, or Content v2 migrations.
license: MIT
---

# Nuxt Content

## Workflow

1. Inspect the installed `@nuxt/content` version, `content.config.ts`, matching files under `content/`, and the Nuxt surface that consumes them. The branch is understood when the collection, source glob, schema, and consumer agree.
2. Open the smallest matching guide below. Apply Nuxt Content guidance only to content-owned APIs; use Nuxt, Nuxt Studio, Nuxt UI, or Vue guidance when those packages own the remaining surface.
3. Implement with typed collections and payload-backed Nuxt data loading. The change is complete when collection types resolve, the intended query returns the expected document shape, and the rendered route works in the target rendering mode.

## Routing

| Task                                                                                 | Open                                     |
| ------------------------------------------------------------------------------------ | ---------------------------------------- |
| Collection types, schemas, indexes, local/remote sources, or locale prefixes         | [Collections](references/collections.md) |
| Filtering, sorting, pagination, navigation, surroundings, or search                  | [Querying](references/querying.md)       |
| Markdown, MDC, `ContentRenderer`, prose components, or code highlighting             | [Rendering](references/rendering.md)     |
| Database adapters, markdown processing, renderer aliases, or deployment storage      | [Configuration](references/config.md)    |
| Hooks, transformers, custom sources, raw content, debugging, or Content v2 migration | [Advanced](references/advanced.md)       |
| Visual editing, authentication, media, drafts, or Git publishing                     | `nuxt-studio` skill                      |
| Writing or restructuring documentation prose                                         | `document-writer` skill                  |

## Baseline

```ts
// content.config.ts
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: 'docs/**',
      schema: z.object({
        updatedAt: z.date().optional(),
      }),
    }),
  },
})
```

```vue
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).first()
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
```

Use `npx nuxi typecheck` to verify generated collection types. When a query is empty, confirm that its collection source includes the file—especially `.navigation.yml`—before changing query logic.
