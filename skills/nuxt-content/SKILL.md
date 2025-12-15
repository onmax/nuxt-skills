---
name: nuxt-content
description: Use when working with Nuxt Content v3 - provides collections (local/remote/API sources), queryCollection API, MDC rendering, database configuration, NuxtStudio integration, hooks, i18n patterns, and LLMs integration
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

## Available Guidance

Read specific files based on current work:

- **collections.md** - defineCollection, schemas, sources, content.config.ts
- **querying.md** - queryCollection, navigation, search, surroundings
- **rendering.md** - ContentRenderer, MDC syntax, prose components, Shiki
- **config.md** - Database setup, markdown plugins, renderer options
- **studio.md** - NuxtStudio integration, preview mode, live editing

## Usage Pattern

**Progressive loading - only read what you need:**

```bash
# Setting up collections?
cat ~/.claude/skills/nuxt-content/collections.md

# Querying content?
cat ~/.claude/skills/nuxt-content/querying.md

# Rendering markdown/MDC?
cat ~/.claude/skills/nuxt-content/rendering.md

# Configuring database/markdown?
cat ~/.claude/skills/nuxt-content/config.md

# Using NuxtStudio?
cat ~/.claude/skills/nuxt-content/studio.md
```

**DO NOT read all files at once.** Load based on context:

- Editing `content.config.ts` → read collections.md
- Using `queryCollection()` → read querying.md
- Working with `<ContentRenderer>` or MDC → read rendering.md
- Configuring database or markdown → read config.md
- Setting up preview/studio → read studio.md

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
