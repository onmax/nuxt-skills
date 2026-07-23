# Configuration

## Inspect the existing setup

Read the installed `@nuxtjs/i18n` version before choosing an API. Then inspect:

- `nuxt.config.*` for module options, locales, routing, and detection
- `i18n/i18n.config.*` for Vue I18n options such as fallback and formats
- `i18n/locales/` or the configured `langDir` for message resources
- route and locale middleware that may already change the active locale

Keep locale codes as the shared identifiers across all four surfaces.

## Define locale identity

```ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    locales: [
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        file: 'en.json',
        dir: 'ltr',
      },
      {
        code: 'ar',
        language: 'ar-EG',
        name: 'العربية',
        file: 'ar.json',
        dir: 'rtl',
      },
    ],
  },
})
```

Use:

- `code` as the runtime and routing identifier
- `language` as the BCP 47 tag for browser matching and SEO
- `name` as the human-readable switcher label
- `file` or `files` for locale resources
- `dir` when the locale's writing direction differs from the default

Locale files resolve from `i18n/locales/` by default. `langDir` is relative to the `i18n/` restructure directory, so keep it relative.

## Module options and Vue I18n options

Routing, locale files, browser detection, domains, and SEO base URLs belong in `nuxt.config`:

```ts
export default defineNuxtConfig({
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json' },
      { code: 'fr', language: 'fr-FR', file: 'fr.json' },
    ],
  },
})
```

Fallbacks and number or date formats belong in `i18n/i18n.config.ts`:

```ts
export default defineI18nConfig(() => ({
  fallbackLocale: 'en',
}))
```

`defaultLocale` selects the default route locale. `fallbackLocale` selects messages when the active locale lacks a key; configure both deliberately.

## Browser language detection

Use root-only detection for public, indexable sites so explicit locale URLs remain stable:

```ts
export default defineNuxtConfig({
  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      fallbackLocale: 'en',
      redirectOn: 'root',
    },
  },
})
```

Set `detectBrowserLanguage: false` when the application, account, domain, or upstream middleware owns locale selection. Preserve a user's explicit choice through `setLocale()` or localized navigation, and reserve detection for the entry points that need it.

## Locale files and loading

Static locale files are lazy-loaded when they are listed with `file` or `files`:

```ts
export default defineNuxtConfig({
  i18n: {
    locales: [
      { code: 'en', files: ['en/common.json', 'en/app.json'] },
      { code: 'fr', files: ['fr/common.json', 'fr/app.json'] },
    ],
  },
})
```

Files load in array order, and later files override earlier keys. Put shared messages first and narrower overrides last.

## Verification

Run `npx nuxi prepare` after changing module configuration, then run the project's typecheck. Start Nuxt and verify:

- every configured locale file loads without warnings
- the default locale matches the unprefixed route when using `prefix_except_default`
- a missing secondary-locale key resolves through the intended fallback
- browser detection redirects only on the configured paths
- `lang` and `dir` reflect the active locale
