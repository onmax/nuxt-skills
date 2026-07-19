# Advanced Content APIs

## Hooks

Use hooks for project-wide build-time adjustments to existing parsers.

```ts
export default defineNuxtConfig({
  hooks: {
    'content:file:beforeParse'(ctx) {
      if (ctx.file.id.endsWith('.md')) {
        ctx.file.body = ctx.file.body.replaceAll('Old name', 'New name')
      }
    },
    'content:file:afterParse'(ctx) {
      const words = typeof ctx.file.body === 'string'
        ? ctx.file.body.trim().split(/\s+/).length
        : 0
      ctx.content.readingTime = Math.ceil(words / 180)
    },
  },
})
```

Fields added after parsing must exist in the target collection schema or typed queries will discard their contract.

## Transformers

Use a transformer when parsing or enrichment is a reusable content-processing unit, especially for custom file extensions.

```ts
// transformers/title-suffix.ts
import { defineTransformer } from '@nuxt/content'

export default defineTransformer({
  name: 'title-suffix',
  extensions: ['.md'],
  transform(file) {
    return { ...file, title: `${file.title} · Docs` }
  },
})
```

```ts
export default defineNuxtConfig({
  content: {
    build: {
      transformers: ['~~/transformers/title-suffix'],
    },
  },
})
```

## Custom sources

Use `defineCollectionSource` for APIs or stores that can expose a deterministic key inventory and fetch each item by key.

```ts
import { defineCollection, defineCollectionSource, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

const releases = defineCollectionSource({
  async getKeys() {
    return await $fetch<string[]>('https://example.com/releases/keys')
  },
  async getItem(key) {
    return await $fetch(`https://example.com/releases/${key}`)
  },
})

export default defineContentConfig({
  collections: {
    releases: defineCollection({
      type: 'data',
      source: releases,
      schema: z.object({ title: z.string(), publishedAt: z.string() }),
    }),
  },
})
```

Stable keys are the incremental-build identity. Authentication stays in the build environment because source collection happens during content generation.

## Raw content and search

Add `rawbody: z.string()` to a collection schema when production code genuinely needs the source body. Nuxt Content fills that field automatically; setting `rawbody: ''` in a document suppresses it for that file. Shipping raw content increases payload and database size, so select it only in queries that consume it.

Use `queryCollectionSearchSections` to produce heading-level search records. Pair the result with Nuxt UI Content Search, MiniSearch, Fuse, or another search engine; keep presentation and ranking behavior in that consumer.

## Debugging and migration

For local SQLite, inspect `.data/content/contents.sqlite` after starting Nuxt. If generated content is stale, run `npx nuxi cleanup`, restart, and recheck the collection source before resetting the database.

When migrating from Content v2:

- Replace `queryContent()` with collection-scoped `queryCollection()`.
- Replace navigation, surroundings, and search helpers with their `queryCollection*` equivalents.
- Create an explicit catch-all Nuxt page for document-driven routing.
- Use `.navigation.yml`, `path`, and the v3 built-in fields.
- Render through `ContentRenderer`; use native slots with `mdc-unwrap` in content components.

## Checks

- Hooks and transformers produce fields allowed by the collection schema.
- Custom source keys remain stable across identical upstream data.
- Raw content and search data are selected only where consumed.
- A migrated route resolves the same URL and 404 behavior under SSR and client navigation.

Official references: [hooks](https://content.nuxt.com/docs/advanced/hooks), [transformers](https://content.nuxt.com/docs/advanced/transformers), [custom sources](https://content.nuxt.com/docs/advanced/custom-source), [raw content](https://content.nuxt.com/docs/advanced/raw-content), [migration](https://content.nuxt.com/docs/getting-started/migration).
