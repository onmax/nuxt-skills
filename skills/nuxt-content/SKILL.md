---
name: nuxt-content
description: Use when working with Nuxt Content v3 - provides collections (local/remote/API sources), queryCollection API, MDC rendering, database configuration, NuxtStudio integration, hooks, i18n patterns, and LLMs integration
license: MIT
---

# Nuxt Content v3

Progressive guidance for content-driven Nuxt apps with typed collections and SQL-backed queries.

## When to Use

Working with:

- Content collections (`content.config.ts`, `defineCollection`)
- Remote sources (GitHub repos, external APIs via `defineCollectionSource`)
- Content queries (`queryCollection`, navigation, search)
- MDC rendering (`<ContentRenderer>`, prose components)
- Database configuration (SQLite, PostgreSQL, D1, LibSQL)
- Content hooks (`content:file:beforeParse`, `content:file:afterParse`)
- i18n multi-language content
- NuxtStudio or preview mode
- LLMs integration (`nuxt-llms`)

**For writing documentation:** use `document-writer` skill
**For Nuxt basics:** use `nuxt` skill
**For NuxtHub deployment:** use `nuxthub` skill (NuxtHub v1 compatible)

## Available Guidance

Read specific files based on current work:

- **[references/collections.md](references/collections.md)** - defineCollection, schemas, sources, content.config.ts
- **[references/querying.md](references/querying.md)** - queryCollection, navigation, search, surroundings
- **[references/rendering.md](references/rendering.md)** - ContentRenderer, MDC syntax, prose components, Shiki
- **[references/config.md](references/config.md)** - Database setup, markdown plugins, renderer options
- **[references/studio.md](references/studio.md)** - NuxtStudio integration, preview mode, live editing

## Loading Files

**Consider loading these reference files based on your task:**

- [ ] [references/collections.md](references/collections.md) - if setting up collections, schemas, or content.config.ts
- [ ] [references/querying.md](references/querying.md) - if using queryCollection, navigation, or search
- [ ] [references/rendering.md](references/rendering.md) - if rendering markdown/MDC or working with ContentRenderer
- [ ] [references/config.md](references/config.md) - if configuring database, markdown plugins, or renderer options
- [ ] [references/studio.md](references/studio.md) - if integrating NuxtStudio or preview mode

**DO NOT load all files at once.** Load only what's relevant to your current task.

## Key Concepts

| Concept         | Purpose                                                           |
| --------------- | ----------------------------------------------------------------- |
| Collections     | Typed content groups with schemas                                 |
| Page vs Data    | `page` = routes + body, `data` = structured data only             |
| Remote sources  | `source.repository` for GitHub, `defineCollectionSource` for APIs |
| queryCollection | SQL-like fluent API for content                                   |
| MDC             | Vue components inside markdown                                    |
| ContentRenderer | Renders parsed markdown body                                      |

## Directory Structure

```
project/
├── content/                    # Content files
│   ├── blog/                   # Maps to 'blog' collection
│   └── .navigation.yml         # Navigation metadata
├── components/content/         # MDC components
└── content.config.ts           # Collection definitions
```

## Official Documentation

- Nuxt Content: https://content.nuxt.com
- MDC syntax: https://content.nuxt.com/docs/files/markdown#mdc-syntax
- Collections: https://content.nuxt.com/docs/collections/collections

## Token Efficiency

Main skill: ~300 tokens. Each sub-file: ~800-1200 tokens. Only load files relevant to current task.
