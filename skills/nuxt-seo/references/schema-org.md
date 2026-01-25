# Schema.org Structured Data

JSON-LD structured data for rich search results.

## Site Identity

Configure once in `nuxt.config.ts`:

```ts
import { defineOrganization } from 'nuxt-schema-org/schema'

export default defineNuxtConfig({
  schemaOrg: {
    identity: defineOrganization({
      name: 'My Company',
      url: 'https://example.com',
      logo: '/logo.png',
      sameAs: ['https://twitter.com/mycompany', 'https://github.com/mycompany']
    })
  }
})
```

For personal sites:

```ts
import { definePerson } from 'nuxt-schema-org/schema'

export default defineNuxtConfig({
  schemaOrg: {
    identity: definePerson({
      name: 'John Doe',
      url: 'https://johndoe.com',
      image: '/avatar.jpg',
      sameAs: ['https://twitter.com/johndoe']
    })
  }
})
```

## Page-Level Schema

Define functions are **auto-imported** in components (no import needed):

```ts
// Article page
useSchemaOrg([
  defineArticle({
    headline: 'My Article Title',
    description: 'Article description',
    image: '/article-image.jpg',
    datePublished: '2025-01-15',
    dateModified: '2025-01-20',
    author: { name: 'John Doe', url: 'https://johndoe.com' }
  })
])
```

```ts
// Product page (include url in offers for Google validation)
useSchemaOrg([
  defineProduct({
    name: 'Product Name',
    description: 'Product description',
    image: '/product.jpg',
    offers: {
      price: 99.99,
      priceCurrency: 'USD',
      availability: 'InStock',
      url: 'https://example.com/product'
    }
  })
])
```

## Define Functions

| Function                | Use Case               |
| ----------------------- | ---------------------- |
| `defineArticle()`       | Blog posts, news       |
| `defineProduct()`       | E-commerce products    |
| `defineFAQPage()`       | FAQ pages              |
| `defineHowTo()`         | Tutorial/guide pages   |
| `defineRecipe()`        | Recipe pages           |
| `defineEvent()`         | Events                 |
| `defineLocalBusiness()` | Business info          |
| `defineVideo()`         | Video content          |
| `defineBreadcrumb()`    | Breadcrumb navigation  |
| `defineWebPage()`       | Generic page           |
| `defineWebSite()`       | Site-wide (auto-added) |
| `defineJobPosting()`    | Job listings           |
| `defineSoftwareApp()`   | Software/apps          |
| `defineService()`       | Services               |

## Data Inference

Module auto-infers from page head:

- `title` → WebPage name
- `description` → WebPage description
- `og:image` → WebPage image

## Breadcrumbs

Auto-generated from route path, or customize:

```ts
useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: 'Blog', item: '/blog' },
      { name: 'My Post', item: '/blog/my-post' }
    ]
  })
])
```

Or use the `useBreadcrumbItems()` composable (from seo-utils):

```ts
const items = useBreadcrumbItems()
useSchemaOrg([defineBreadcrumb({ itemListElement: items })])
```

## FAQ Page

```ts
useSchemaOrg([
  defineFAQPage({
    mainEntity: [
      { name: 'What is your return policy?', acceptedAnswer: 'You can return within 30 days.' },
      { name: 'How do I contact support?', acceptedAnswer: 'Email us at support@example.com' }
    ]
  })
])
```

## Nuxt Content

Frontmatter:

```yaml
---
title: My Article
schemaOrg:
  - type: BlogPosting
    headline: My Article
    datePublished: 2025-01-15
    author:
      type: Person
      name: John Doe
---
```

With `asSeoCollection()` (see main SKILL.md), ensure schema renders:

```vue
<script setup>
const { data: page } = await useAsyncData(() => queryCollection('posts').path(route.path).first())
useHead(page.value?.head || {})
</script>
```

## Debug & Validation

- Debug endpoint: `/__schema-org__/debug.json` in dev
- Config: `schemaOrg: { debug: true }`
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

## Route Rules

```ts
export default defineNuxtConfig({
  routeRules: {
    '/blog/**': {
      schemaOrg: { type: 'Article' }
    }
  }
})
```
