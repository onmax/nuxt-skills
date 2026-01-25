# SEO Utilities

Additional utilities from nuxt-seo-utils and nuxt-link-checker.

## Canonical URLs

Automatic canonical URLs based on site config.

```ts
export default defineNuxtConfig({
  seoUtils: {
    canonicalQueryWhitelist: ['page', 'sort'],  // Keep these query params
    redirectToCanonicalSiteUrl: true  // 301 to canonical domain
  }
})
```

Override per-page:

```ts
useHead({
  link: [{ rel: 'canonical', href: 'https://example.com/preferred-url' }]
})
```

## Breadcrumbs

Generate breadcrumb items from current route:

```ts
const items = useBreadcrumbItems()
// [{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: 'My Post' }]
```

For schema.org integration, see [schema-org.md](schema-org.md#breadcrumbs).

Render in template:

```vue
<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex gap-2">
      <li v-for="(item, i) in items" :key="i">
        <NuxtLink v-if="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        <span v-else>{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
```

Customize labels in route meta:

```ts
// pages/blog/[slug].vue
definePageMeta({
  breadcrumb: { label: 'Article' }
})
```

## Title Templates

Set site-wide title template:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: '%s | My Site'
    }
  }
})
```

Override per-page:

```ts
useHead({
  title: 'Page Title',
  titleTemplate: '%s - Different Template'
})
```

## Meta Defaults

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: 'author', content: 'My Name' },
        { property: 'og:site_name', content: 'My Site' }
      ]
    }
  }
})
```

## Link Checker

Build-time validation of links.

```ts
export default defineNuxtConfig({
  linkChecker: {
    failOnError: true,  // Default: fail build on errors
    exclude: ['/api/**'],
    skipInspections: ['missing-hash'],
    report: { html: true }  // Generate HTML report
  }
})
```

**Inspections:**

- `no-error-response` - 404/500 errors
- `no-baseless` - Missing base URL
- `no-javascript` - javascript: links
- `trailing-slash` - Inconsistent slashes
- `missing-hash` - Invalid anchor targets
- `no-uppercase-chars` - URL casing
- `absolute-site-urls` - Hardcoded domain

### Ignoring Links

```html
<a href="/maybe-broken" data-link-checker-ignore>Link</a>
```

## File-Based Icons

Place favicon files in `public/`:

```
public/
├── favicon.ico
├── favicon.svg        # Modern browsers
├── apple-touch-icon.png
└── site.webmanifest
```

Auto-detected and added to `<head>`.

For SVG favicon with dark mode support:

```svg
<!-- public/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    path { fill: #000; }
    @media (prefers-color-scheme: dark) {
      path { fill: #fff; }
    }
  </style>
  <path d="..."/>
</svg>
```

## Social Meta Tags

Automatic Open Graph and Twitter cards from site config (see [site-config.md](site-config.md)).

Override per-page:

```ts
useSeoMeta({
  title: 'Page Title',
  description: 'Page description',
  ogImage: '/images/page-og.png',
  twitterCard: 'summary_large_image'
})
```

## Trailing Slash Redirect

Enforce consistent URLs:

```ts
export default defineNuxtConfig({
  site: {
    trailingSlash: false  // Redirect /blog/ to /blog
  }
})
```

## Debug Panel

Enable comprehensive debug panel:

```ts
export default defineNuxtConfig({
  seo: { debug: true }
})
```

Shows in dev:

- Current meta tags
- Schema.org data
- OG image preview
- Sitemap/robots status
