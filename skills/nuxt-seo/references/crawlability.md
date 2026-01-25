# Crawlability: Robots & Sitemap

## Robots.txt

Auto-generated at `/robots.txt`. Respects `site.indexable` setting.

### Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  robots: {
    // Block AI crawlers
    blockAiBots: true,
    // Block non-SEO bots (reduces server load)
    blockNonSeoBots: true,
    // Custom rules
    groups: [
      { userAgent: '*', disallow: ['/admin'] }
    ]
  }
})
```

### Per-Page Control

```ts
// Disable indexing
useRobotsRule('noindex, nofollow')

// Object syntax with AI directives
useRobotsRule({
  noindex: true,
  nofollow: true,
  noai: true,           // Block AI training
  noimageai: true,      // Block AI image training
  'max-snippet': 150,   // Preview controls
  'max-image-preview': 'large'
})
```

Route rules:

```ts
export default defineNuxtConfig({
  routeRules: {
    '/admin/**': { robots: 'noindex, nofollow' },
    '/hidden': { robots: false }
  }
})
```

### Nuxt Content Frontmatter

```yaml
---
robots: noindex, nofollow
# Or structured:
robots:
  noindex: true
  nofollow: true
---
```

## Sitemap.xml

Auto-generated at `/sitemap.xml` from app routes.

### Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/admin/**', '/secret'],
    // For static sites - no runtime generation
    zeroRuntime: true
  }
})
```

### Dynamic URLs via API

```ts
// server/api/__sitemap__/urls.ts
import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'

export default defineSitemapEventHandler(async () => {
  const posts = await $fetch('/api/posts')
  return posts.map(post => ({
    loc: post.path,
    lastmod: post.updatedAt,
    // Image sitemap
    images: [{ loc: post.image, title: post.title }],
    // Video sitemap
    videos: [{ content_loc: post.videoUrl, title: post.title }]
  } satisfies SitemapUrlInput))
})
```

### Per-Page Control

Route rules:

```ts
export default defineNuxtConfig({
  routeRules: {
    '/blog/**': { sitemap: { changefreq: 'daily', priority: 0.9 } },
    '/hidden': { sitemap: false }
  }
})
```

Nuxt Content frontmatter:

```yaml
---
sitemap:
  changefreq: weekly
  priority: 0.8
  lastmod: 2025-01-15
---
```

### Multiple Sitemaps

For large sites:

```ts
export default defineNuxtConfig({
  sitemap: {
    sitemaps: {
      pages: { include: ['/**'], exclude: ['/blog/**'] },
      blog: { include: ['/blog/**'] }
    }
  }
})
```

Generates `/pages-sitemap.xml`, `/blog-sitemap.xml`, and `/sitemap_index.xml`.

### i18n Sitemaps

With `@nuxtjs/i18n`, auto-generates per-locale sitemaps with `hreflang` alternates.

## Debug

In development:

- Robots: Check `/robots.txt` directly
- Sitemap: Visit `/__sitemap__/debug.json` for raw data
