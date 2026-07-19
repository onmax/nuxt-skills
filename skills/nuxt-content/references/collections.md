# Collections

Use collections as the schema and routing boundary for content. Once `content.config.ts` exists, Nuxt Content imports only files matched by a collection source.

## Choose the collection type

- `page` adds `path`, `title`, `description`, `seo`, `body`, and `navigation`; use it when one content file maps to one route.
- `data` adds the common file fields but leaves the domain schema to you; use it for authors, products, configuration, and other structured records.
- Every collection includes `id`, `stem`, `extension`, and `meta`.

Keep each source file in one collection. Overlapping collection globs can break live reload, so use `exclude` to make ownership explicit.

## Validators and editor metadata

Import validators from their packages. The `z` re-export from `@nuxt/content` is deprecated.

```ts
import { defineCollection, defineContentConfig, property } from '@nuxt/content'
import { z } from 'zod/v4'

export default defineContentConfig({
  collections: {
    products: defineCollection({
      type: 'data',
      source: 'products/*.json',
      schema: z.object({
        sku: z.string(),
        category: z.string(),
        price: z.number(),
        image: property(z.string()).editor({ input: 'media' }),
      }),
      indexes: [
        { columns: ['category', 'price'] },
        { columns: ['sku'], unique: true },
      ],
    }),
  },
})
```

Nuxt Content supports Zod 3, Zod 4, and Valibot through JSON Schema conversion. Use `property(schema).editor(...)` for Studio input metadata and `property(schema).inherit(...)` when a schema should follow a Vue component's props. Keep indexes beside the collection they optimize; `columns`, `unique`, and `name` are collection index options.

## Source shapes

```ts
// Local content directory
source: 'docs/**'

// Explicit include, exclusions, and route prefix
source: {
  include: 'fr/**',
  exclude: ['fr/drafts/**'],
  prefix: '/fr',
}

// Files outside content/
source: {
  cwd: resolve('packages/handbook'),
  include: '**/*.md',
}

// Remote Git repository
source: {
  repository: {
    url: 'https://github.com/org/docs',
    branch: 'main',
    auth: { token: process.env.DOCS_TOKEN },
  },
  include: 'content/**',
}
```

Remote repositories require `include`. Keep credentials in environment variables and use the narrowest repository token that can read the source.

For API-backed content, use `defineCollectionSource` with stable `getKeys()` results and a `getItem(key)` implementation. The returned items still pass through the collection schema, so keys and field types must be deterministic.

## Navigation and locale sources

Navigation metadata lives in `.navigation.yml`. A source such as `**/*.md` excludes that file; use `**` or an include pattern that covers Markdown and YAML when navigation is required.

```ts
const common = z.object({ locale: z.enum(['en', 'fr']) })

export default defineContentConfig({
  collections: {
    docs_en: defineCollection({
      type: 'page',
      source: { include: 'en/**', prefix: '/' },
      schema: common,
    }),
    docs_fr: defineCollection({
      type: 'page',
      source: { include: 'fr/**', prefix: '/fr' },
      schema: common,
    }),
  },
})
```

Pick the collection from the active locale, then query its generated path. For `@nuxtjs/i18n` route behavior, apply that module's guidance after the collection boundary is settled.

## Checks

- `npx nuxi typecheck` resolves every collection and custom field.
- Each source glob includes the intended files and excludes competing collections.
- Fields added by hooks or transformers exist in the collection schema.
- Query indexes cover actual filter/sort patterns rather than every field.

Official references: [define collections](https://content.nuxt.com/docs/collections/define), [sources](https://content.nuxt.com/docs/collections/sources), [validators](https://content.nuxt.com/docs/collections/validators).
