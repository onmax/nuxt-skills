# Site Config

Foundation module providing shared configuration for all SEO modules.

## Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  site: {
    url: 'https://example.com',       // Required for absolute URLs
    name: 'My Site',                  // Site name (used in titles, schema)
    description: 'Site description',  // Default meta description
    defaultLocale: 'en',              // Default language
    indexable: true,                  // Allow search engine indexing
    trailingSlash: false,             // URL trailing slash preference
  }
})
```

## Environment-Based Indexing

Control indexing per environment using `NUXT_SITE_*` env vars:

```bash
# .env.production
NUXT_SITE_URL=https://example.com
NUXT_SITE_ENV=production

# .env.staging
NUXT_SITE_URL=https://staging.example.com
NUXT_SITE_ENV=staging
```

The module auto-detects `env` and sets `indexable: false` for non-production environments.

For explicit control:

```ts
export default defineNuxtConfig({
  site: {
    url: process.env.NUXT_SITE_URL,
    // Explicit: only index when explicitly set to 'true'
    indexable: process.env.NUXT_SITE_INDEXABLE === 'true'
  }
})
```

**Note:** `!== 'false'` defaults to `true` when env var is undefined - use `=== 'true'` for fail-safe behavior.

## Runtime Access

```ts
const site = useSiteConfig()
console.log(site.url, site.name, site.description)
```

Works in components, composables, and server routes.

## i18n Integration

Automatically integrates with `@nuxtjs/i18n`:

```ts
export default defineNuxtConfig({
  site: {
    url: 'https://example.com',
    defaultLocale: 'en',
  },
  i18n: {
    locales: [
      { code: 'en', language: 'en-US' },
      { code: 'fr', language: 'fr-FR' },
    ]
  }
})
```

Locale-specific overrides in `site` object:

```ts
site: {
  name: 'My Site',
  locales: {
    fr: { name: 'Mon Site' }
  }
}
```

## Override Per-Page

Use route rules for page-specific config:

```ts
export default defineNuxtConfig({
  routeRules: {
    '/admin/**': { site: { indexable: false } },
    '/fr/**': { site: { name: 'Mon Site', defaultLocale: 'fr' } }
  }
})
```
