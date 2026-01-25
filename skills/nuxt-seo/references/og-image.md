# OG Image Generation

Dynamic Open Graph image generation using Vue components.

## Quick Start

```ts
// Component-first (recommended)
defineOgImage('NuxtSeo', { title: 'My Page Title' })

// Object syntax
defineOgImage({ component: 'NuxtSeo', title: 'My Page Title' })

// Disable OG image
defineOgImage(false)
```

## Built-in Template

The `NuxtSeo` template supports:

```ts
defineOgImage('NuxtSeo', {
  title: 'Hello World',
  description: 'My description',
  theme: '#3b82f6',
  colorMode: 'dark',
  icon: 'carbon:cloud',
  siteName: 'My Site',
  siteLogo: '/logo.png'
})
```

## Multiple Images Per Page

Use `key` for platform-specific images:

```ts
// Default OG image (1200x600)
defineOgImage('NuxtSeo', { title: 'Default' })

// Square for WhatsApp (800x800)
defineOgImage('NuxtSeo', {
  title: 'Square',
  key: 'square',
  width: 800,
  height: 800
})
```

## Custom Vue Components

Create in `components/OgImage/`:

```vue
<!-- components/OgImage/Blog.vue -->
<script setup lang="ts">
defineProps<{ title: string; author: string }>()
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 p-12">
    <h1 class="text-6xl font-bold text-white text-center">{{ title }}</h1>
    <p class="text-2xl text-white/80 mt-4">By {{ author }}</p>
  </div>
</template>
```

Use in pages:

```ts
defineOgImage('OgImageBlog', { title: 'My Post', author: 'John' })
```

## Renderers

| Renderer | Speed | CSS Support | Edge | Best For                   |
| -------- | ----- | ----------- | ---- | -------------------------- |
| satori   | Fast  | Partial     | ✅   | Default, most templates    |
| chromium | Slow  | Full        | ❌   | Complex designs, prerender |

```ts
export default defineNuxtConfig({
  ogImage: {
    defaults: { renderer: 'satori' }
  }
})
```

### Satori Limitations

- No `display: grid` - use `flex`
- No `position: absolute` without explicit dimensions
- Fonts: use `@nuxt/fonts` with `global: true` for best results

## Configuration

```ts
export default defineNuxtConfig({
  ogImage: {
    defaults: {
      component: 'NuxtSeo',
      width: 1200,
      height: 600,
      cacheMaxAgeSeconds: 60 * 60 * 24 * 3  // 3 days
    },
    // For static sites
    zeroRuntime: true
  }
})
```

## Nuxt Content

Frontmatter:

```yaml
---
ogImage:
  component: OgImageBlog
  props:
    author: John Doe
---
```

With `asSeoCollection()` (see main SKILL.md):

```vue
<script setup>
const { data: page } = await useAsyncData(() => queryCollection('posts').path(route.path).first())
if (page.value?.ogImage)
  defineOgImage(page.value.ogImage)
</script>
```

## Debug

- Preview: `/__og-image__/image/[path]/og.png`
- Inspector: Enable `ogImage: { debug: true }` in config

## Screenshots

Capture page as OG image (requires Chromium):

```ts
defineOgImageScreenshot({
  colorScheme: 'dark',
  mask: '.navigation, .footer',
  selector: '.article-content'
})
```

## Route Rules

```ts
export default defineNuxtConfig({
  routeRules: {
    '/blog/**': { ogImage: { component: 'OgImageBlog' } },
    '/admin/**': { ogImage: false }
  }
})
```

## Deployment

Community templates are dev-only. Before deploying, eject:

```bash
npx nuxt-og-image eject NuxtSeo
```
