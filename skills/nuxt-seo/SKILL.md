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

## Loading Files

**Consider loading these reference files based on your task:**

- [ ] [references/site-config.md](references/site-config.md) - if configuring site URL, name, or SEO foundation
- [ ] [references/crawlability.md](references/crawlability.md) - if setting up robots.txt or sitemap.xml
- [ ] [references/og-image.md](references/og-image.md) - if generating dynamic OG images
- [ ] [references/schema-org.md](references/schema-org.md) - if adding JSON-LD structured data
- [ ] [references/utilities.md](references/utilities.md) - if working with breadcrumbs, canonical URLs, or link checking

**DO NOT load all files at once.** Load only what's relevant to your current task.

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
