# Collections

## When to Use

Setting up `content.config.ts`, defining collection schemas, or configuring content sources.

## Defining Collections

```ts
// content.config.ts
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        date: z.date(),
        tags: z.array(z.string()).optional(),
        image: z.string().optional(),
      }),
    }),
    authors: defineCollection({
      type: 'data',
      source: 'authors/*.yml',
      schema: z.object({
        name: z.string(),
        avatar: z.string(),
        twitter: z.string().optional(),
      }),
    }),
  },
})
```

## Collection Types

| Type | Use Case | Includes |
|------|----------|----------|
| `page` | Content with routes | `path`, `title`, `description`, `seo`, `body`, `navigation` |
| `data` | Structured data only | `id`, `stem`, `extension`, `meta` |

**Page collections** auto-generate: `path` from file location, `title` from first H1, `description` from first paragraph.

**Data collections** for non-routable content like authors, settings, translations.

## Schema Definition

Use Zod for type-safe schemas:

```ts
schema: z.object({
  // Required fields
  title: z.string(),

  // Optional with defaults
  draft: z.boolean().default(false),

  // Arrays
  tags: z.array(z.string()).optional(),

  // Dates (parsed from frontmatter)
  publishedAt: z.date(),

  // Enums
  status: z.enum(['draft', 'published', 'archived']),

  // Nested objects
  author: z.object({
    name: z.string(),
    email: z.string().email(),
  }).optional(),
})
```

## Source Patterns

```ts
// Single directory
source: 'blog/**/*.md'

// Multiple patterns
source: ['posts/**/*.md', 'articles/**/*.md']

// Exclude patterns
source: {
  include: 'docs/**/*.md',
  exclude: ['docs/internal/**', 'docs/**/_*.md'],
}
```

## Remote Sources

```ts
import { defineCollection, defineCollectionSource } from '@nuxt/content'

const githubSource = defineCollectionSource({
  repository: 'nuxt/nuxt',
  branch: 'main',
  prefix: '/docs',
  include: '**/*.md',
  // For private repos
  auth: process.env.GITHUB_TOKEN,
})

export default defineContentConfig({
  collections: {
    nuxtDocs: defineCollection({
      type: 'page',
      source: githubSource,
    }),
  },
})
```

## Path Extraction

File paths become content properties:

```
content/blog/2024/my-post.md
         └─────┬────┘
              stem: "blog/2024/my-post"
              path: "/blog/2024/my-post"
```

Override path in frontmatter:
```yaml
---
path: /custom-url
---
```

## Navigation Metadata

Control navigation behavior per-file:

```yaml
---
navigation:
  title: Short Nav Title
  icon: heroicons:home
---
```

Or per-directory with `.navigation.yml`:

```yaml
# content/blog/.navigation.yml
title: Blog Posts
icon: heroicons:newspaper
```

## Best Practices

| Do | Don't |
|----|-------|
| Use `page` for routable content | Use `page` for config/data files |
| Define explicit schemas | Rely on implicit types |
| Use Zod defaults for optional fields | Leave required fields without validation |
| Colocate related content | Scatter files across unrelated directories |

## Common Patterns

**Blog with categories:**
```ts
blog: defineCollection({
  type: 'page',
  source: 'blog/**/*.md',
  schema: z.object({
    category: z.enum(['tech', 'life', 'news']),
    date: z.date(),
    featured: z.boolean().default(false),
  }),
})
```

**Documentation with ordering:**
```ts
docs: defineCollection({
  type: 'page',
  source: 'docs/**/*.md',
  schema: z.object({
    order: z.number().default(999),
    section: z.string().optional(),
  }),
})
```

## Resources

- Collections: https://content.nuxt.com/docs/collections/collections
- Schema: https://content.nuxt.com/docs/collections/schema
- Sources: https://content.nuxt.com/docs/collections/sources
