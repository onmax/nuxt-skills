# Messages

## Translate in components

Use `useI18n()` in script and `$t` in templates:

```json
{
  "greeting": "Hello, {name}!",
  "cart": {
    "items": "no items | one item | {count} items"
  }
}
```

```vue
<script setup lang="ts">
const { t } = useI18n()
const name = ref('Ada')
const itemCount = ref(2)

const greeting = computed(() => t('greeting', { name: name.value }))
</script>

<template>
  <h1>{{ greeting }}</h1>
  <p>{{ $t('cart.items', itemCount) }}</p>
</template>
```

Use stable semantic keys such as `checkout.submit` so copy changes leave the message API intact. Give every locale the same message tree so missing keys reveal translation gaps and structural drift.

## Dates and numbers

Define named formats once in `i18n/i18n.config.ts`:

```ts
export default defineI18nConfig(() => ({
  datetimeFormats: {
    en: {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
    },
    fr: {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
    },
  },
  numberFormats: {
    en: {
      currency: { style: 'currency', currency: 'USD' },
    },
    fr: {
      currency: { style: 'currency', currency: 'EUR' },
    },
  },
}))
```

```vue
<script setup lang="ts">
const { d, n } = useI18n()
</script>

<template>
  <p>{{ d(new Date(), 'short') }}</p>
  <p>{{ n(1299, 'currency') }}</p>
</template>
```

Named formats keep components independent from locale-specific punctuation, ordering, and currency placement.

## Shared and component-local messages

Put navigation, validation, and cross-page messages in locale files. Use a component `<i18n>` block when the messages belong only to that component:

```vue
<i18n lang="json">
{
  "en": { "label": "Search" },
  "fr": { "label": "Rechercher" }
}
</i18n>

<template>
  <label>{{ $t('label') }}</label>
</template>
```

This boundary keeps reusable global keys centralized while allowing genuinely local copy to travel with its component.

## Runtime messages

Use `defineI18nLocale()` when a locale resource comes from an API:

```ts
// i18n/locales/en.ts
export default defineI18nLocale((locale) => {
  return $fetch(`/api/locales/${locale}`)
})
```

Configure that resource with `file: 'en.ts'`, and keep response shapes identical across locales so message paths remain predictable.

Use `loadLocaleMessages(locale)` when the current view needs a non-active locale:

```ts
const { loadLocaleMessages, t } = useI18n()

await loadLocaleMessages('fr')
const frenchTitle = computed(() => t('title', 1, { locale: 'fr' }))
```

Cache and reuse remote results at the owning API boundary. Repeated manual loading adds latency and makes fallback behavior harder to reason about.

## Verification

Check one interpolation, plural, date, number, and missing-key case in both the default and secondary locale. The message branch is complete when the same key paths work in every locale and missing keys resolve through the configured fallback without console warnings.
