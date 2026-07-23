---
name: nuxt-i18n
description: Internationalize Nuxt applications with @nuxtjs/i18n. Use when configuring locales or browser detection, translating messages or routes, building locale switchers, handling fallbacks, lazy-loading messages, or adding locale SEO.
license: MIT
---

# Nuxt I18n

Nuxt I18n owns locale messages, localized routes, language detection, and locale metadata. Nuxt owns the surrounding page, rendering, and server lifecycle.

## Workflow

1. Inspect the installed `@nuxtjs/i18n` version, `nuxt.config.*`, `i18n/i18n.config.*`, locale files, and affected pages. The setup is understood when locale codes, files, `defaultLocale`, and the routing strategy agree.
2. Open the smallest matching guide below. Keep module options in `nuxt.config`, Vue I18n options in `i18n.config`, and translated messages in locale files.
3. Implement with localized links and module composables so routing, message loading, and SEO share one locale state.
4. Run `nuxi prepare` and the project's typecheck, then visit the affected route in the default and one secondary locale. The change is complete when both locales render the expected message, URL, language metadata, and fallback behavior.

## Routing

| Task                                                                                 | Open                                         |
| ------------------------------------------------------------------------------------ | -------------------------------------------- |
| Installation, locale objects, file layout, browser detection, or Vue I18n config     | [Configuration](references/configuration.md) |
| Translation keys, interpolation, plurals, dates, numbers, or runtime message loading | [Messages](references/messages.md)           |
| Route strategies, localized links, switchers, custom paths, dynamic slugs, or SEO    | [Routing and SEO](references/routing.md)     |
| Nuxt pages, middleware, data fetching, SSR state, or server routes                   | `nuxt` skill                                 |

## Baseline

```bash
npx nuxi@latest module add @nuxtjs/i18n
```

```ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
    ],
  },
})
```

```json
{
  "welcome": "Welcome"
}
```

Locale files resolve from `i18n/locales/` by default. Use the same locale code in configuration, route helpers, locale files, and fallback rules.
