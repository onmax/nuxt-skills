# Routing and SEO

## Choose one route strategy

| Strategy                | Generated URLs                     | Use when                                     |
| ----------------------- | ---------------------------------- | -------------------------------------------- |
| `prefix_except_default` | `/about`, `/fr/about`              | The default locale should keep clean URLs    |
| `prefix`                | `/en/about`, `/fr/about`           | Every locale needs an explicit URL namespace |
| `prefix_and_default`    | `/about`, `/en/about`, `/fr/about` | The default locale needs both URL forms      |
| `no_prefix`             | `/about` for every locale          | URLs are intentionally locale-neutral        |

`prefix_except_default` is the module default and the usual public-site baseline. `no_prefix` relies on locale state rather than the URL, so use `setLocale()` for switching and plan caching and SEO around the shared route.

## Localized links

Use `<NuxtLinkLocale>` for application links:

```vue
<template>
  <nav>
    <NuxtLinkLocale to="/">Home</NuxtLinkLocale>
    <NuxtLinkLocale to="about">About</NuxtLinkLocale>
  </nav>
</template>
```

Use `useLocalePath()` when code needs the localized URL:

```ts
const localePath = useLocalePath()

await navigateTo(localePath({ name: 'products-id', params: { id: product.id } }))
```

Named routes preserve custom localized paths more reliably than hand-built strings.

## Locale switchers

Use `<SwitchLocalePathLink>` to navigate to the current page in another locale:

```vue
<script setup lang="ts">
const { locale, locales } = useI18n()

const availableLocales = computed(() => {
  return locales.value.filter(entry => entry.code !== locale.value)
})
</script>

<template>
  <nav aria-label="Language">
    <SwitchLocalePathLink
      v-for="entry in availableLocales"
      :key="entry.code"
      :locale="entry.code"
    >
      {{ entry.name }}
    </SwitchLocalePathLink>
  </nav>
</template>
```

This component resolves translated dynamic parameters during server rendering. Use `await setLocale(code)` for `no_prefix` applications or controls that intentionally change language without navigating.

## Custom route paths

Define translated static paths with page metadata:

```vue
<script setup lang="ts">
definePageMeta({
  i18n: {
    paths: {
      en: '/about',
      fr: '/a-propos',
    },
  },
})
</script>
```

Set `customRoutes: 'meta'` in `nuxt.config` when page metadata is the sole source of custom paths. Keep configured paths free of locale prefixes; the route strategy adds them.

For translated dynamic parameters, register each locale's value after loading the page data:

```vue
<script setup lang="ts">
const route = useRoute()
const { data: product } = await useFetch(`/api/products/${route.params.slug}`)

const setI18nParams = useSetI18nParams()
setI18nParams({
  en: { slug: product.value?.slugs.en },
  fr: { slug: product.value?.slugs.fr },
})
</script>
```

Render the switcher with `<SwitchLocalePathLink>` so server-rendered links receive the translated parameters before the response is sent.

## Locale SEO

Configure BCP 47 `language` values and a production `baseUrl`:

```ts
export default defineNuxtConfig({
  i18n: {
    baseUrl: 'https://example.com',
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json' },
      { code: 'fr', language: 'fr-FR', file: 'fr.json' },
    ],
  },
})
```

Apply locale metadata once in `app.vue` or the default layout:

```vue
<script setup lang="ts">
const i18nHead = useLocaleHead({ seo: true })

useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs,
  link: i18nHead.value.link,
  meta: i18nHead.value.meta,
}))
</script>
```

This keeps `html[lang]`, writing direction, canonical URLs, alternate-language links, and Open Graph locale tags aligned with the active route.

## Verification

For each supported locale, open one static and one dynamic route and verify:

- internal links keep the active locale
- the switcher resolves the equivalent page and translated dynamic parameter
- custom paths match `definePageMeta`
- the document language and direction match the locale
- canonical and `hreflang` URLs are absolute and point to valid localized routes
