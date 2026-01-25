---
name: nuxt-seo
description: Nuxt SEO meta-module with robots, sitemap, og-image, schema-org. Use when configuring SEO, generating sitemaps, creating OG images, or adding structured data.
license: MIT
---

# Nuxt SEO

```bash
npx nuxi module add @nuxtjs/seo
```

## When to Use

Working with:

- SEO configuration (site URL, name, indexability)
- Robots.txt and sitemap.xml generation
- Dynamic OG image generation
- JSON-LD structured data (schema.org)
- Breadcrumbs and canonical URLs

## Usage Pattern

**Progressive loading - only read what you need:**

- Configuring site? → [references/site-config.md](references/site-config.md)
- Setting up robots/sitemap? → [references/crawlability.md](references/crawlability.md)
- Generating OG images? → [references/og-image.md](references/og-image.md)
- Adding JSON-LD? → [references/schema-org.md](references/schema-org.md)
- Breadcrumbs, links, icons? → [references/utilities.md](references/utilities.md)

## Site Config

Foundation for all SEO modules. Configure `site` in `nuxt.config.ts`, access via `useSiteConfig()`. See [references/site-config.md](references/site-config.md) for full options.

## Module Overview

| Module            | Purpose         | Key API                       |
| ----------------- | --------------- | ----------------------------- |
| nuxt-site-config  | Shared config   | `useSiteConfig()`             |
| @nuxtjs/robots    | robots.txt      | `useRobotsRule()`             |
| @nuxtjs/sitemap   | sitemap.xml     | `defineSitemapEventHandler()` |
| nuxt-og-image     | OG images       | `defineOgImage()`             |
| nuxt-schema-org   | JSON-LD         | `useSchemaOrg()`              |
| nuxt-seo-utils    | Meta utilities  | `useBreadcrumbItems()`        |
| nuxt-link-checker | Link validation | Build-time checks             |

## Nuxt Content v3

Use `asSeoCollection()` for automatic sitemap, og-image, and schema-org from frontmatter:

```ts
// content.config.ts
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { asSeoCollection } from '@nuxtjs/seo/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection(asSeoCollection({ type: 'page', source: 'posts/**' }))
  }
})
```

**Important:** Load `@nuxtjs/seo` before `@nuxt/content` in modules array:

```ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/seo', '@nuxt/content']
})
```

Frontmatter fields: `ogImage`, `sitemap`, `robots`, `schemaOrg`.

## Related Skills

- [nuxt-content](../nuxt-content/SKILL.md) - For MDC rendering with SEO frontmatter

## Links

- [Documentation](https://nuxtseo.com)
- [GitHub](https://github.com/harlan-zw/nuxt-seo)

## Token Efficiency

Main skill: ~250 tokens. Each sub-file: ~400-600 tokens. Only load files relevant to current task.
