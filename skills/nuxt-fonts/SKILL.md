---
name: nuxt-fonts
description: "ALWAYS use when writing code importing \"@nuxt/fonts\". Consult for debugging, best practices, or modifying @nuxt/fonts, nuxt/fonts, nuxt fonts, fonts."
metadata:
  version: 0.14.0
  generated_by: Claude Code · Opus 4.6
---

# nuxt/fonts `@nuxt/fonts`

**Version:** 0.14.0 (today)
**Deps:** @nuxt/devtools-kit@^3.2.1, @nuxt/kit@^4.2.2, consola@^3.4.2, defu@^6.1.4, fontless@^0.2.1, h3@^1.15.5, magic-regexp@^0.10.0, ofetch@^1.5.1, pathe@^2.0.3, sirv@^3.0.2, tinyglobby@^0.2.15, ufo@^1.6.3, unifont@^0.7.4, unplugin@^3.0.0, unstorage@^1.17.4
**Tags:** latest: 0.14.0 (today)

**References:** [package.json](./.skilld/pkg/package.json) — exports, entry points • [README](./.skilld/pkg/README.md) — setup, basic usage • [GitHub Issues](./.skilld/issues/_INDEX.md) — bugs, workarounds, edge cases • [Releases](./.skilld/releases/_INDEX.md) — changelog, breaking changes, new APIs

## Search

Use `npx -y skilld search` instead of grepping `.skilld/` directories — hybrid semantic + keyword search across all indexed docs, issues, and releases.

```bash
npx -y skilld search "query" -p @nuxt/fonts
npx -y skilld search "issues:error handling" -p @nuxt/fonts
npx -y skilld search "releases:deprecated" -p @nuxt/fonts
```

Filters: `docs:`, `issues:`, `releases:` prefix narrows by source type.

## API Changes

⚠️ `defaults.formats` — v0.14 defaults to `['woff2']` only; previous versions returned all formats (`woff2`, `woff`, `ttf`). `@font-face` `src` entries are fewer. Restore with `fonts: { defaults: { formats: ['woff2', 'woff', 'ttf'] } }` [source](./.skilld/releases/v0.14.0.md)

✨ `npm` provider — new built-in provider in v0.14 resolves fonts from `node_modules` (e.g. `@fontsource/*`). Auto-detected from `package.json` deps. `{ name: 'Roboto', provider: 'npm' }` [source](./.skilld/releases/v0.14.0.md)

✨ `providerOptions` — new per-family property in v0.14 passes provider-specific options: `{ name: 'My Font', provider: 'google', providerOptions: { google: { ... } } }` [source](./.skilld/releases/v0.14.0.md)

✨ `throwOnError` — new config option in v0.14. `fonts: { throwOnError: true }` makes font resolution errors throw instead of warn (default `false`) [source](./.skilld/releases/v0.14.0.md)

✨ `fonts:public-asset-context` hook — new in v0.13 for modules needing font URLs during prerender (e.g. OG image). Context has `renderedFontURLs: Map<filename, sourceUrl>` [source](./.skilld/releases/v0.13.0.md)

⚠️ Default font weight — v0.12 changed default `weights` from `[400]` to `['400 700']` (variable font range). May resolve more weights than before [source](./.skilld/releases/v0.12.0.md)

⚠️ `unifont` migration — v0.10 replaced internal provider system with `unifont`. Custom providers must use `defineFontProvider` from `'unifont'` instead of the old module-internal API [source](./.skilld/releases/v0.10.0.md)

⚠️ `processCSSVariables` — v0.11 changed default from `false` to `'font-prefixed-only'` (auto-processes `--font-*` CSS vars). Setting `true` for Tailwind v4 is no longer needed. Old `fonts.experimental.processCSSVariables` path removed [source](./.skilld/releases/v0.11.0.md)

⚠️ CJS removed — v0.11 dropped CommonJS outputs. Only ESM is supported. `require('@nuxt/fonts')` no longer works [source](./.skilld/releases/v0.11.0.md)

✨ `googleicons` provider — new in v0.8 for Material Symbols/Icons. `{ name: 'Material Symbols Outlined', provider: 'googleicons' }` [source](./.skilld/releases/v0.8.0.md)

## Best Practices

✅ Specify explicit weight list in `defaults` — default is `['400 700']` which silently drops other weights like 500/600; this is the #1 source of "missing bold/medium" bugs [source](./issues/issue-619.md)

```ts
fonts: {
  defaults: {
    weights: [400, 500, 600, 700],
  },
}

```
✅ Use weight ranges (`'100 900'`) for variable fonts — individual weights like `[400, 700]` download separate static files instead of a single variable font file [source](./docs/content/1.get-started/2.configuration.md)

```ts
fonts: {
  defaults: {
    weights: ['100 900'], // single variable font file
  },
}
```

✅ Use `@theme` (not `@theme inline`) for Tailwind v4 font declarations — `@theme inline` compiles to `--default-font-family` which Nuxt Fonts cannot detect for `@font-face` generation [source](./issues/issue-638.md)

```css
/* works */
@theme {
  --font-sans: "Inter", sans-serif;
}
```

✅ Remove `processCSSVariables: true` on v0.11.0+ — `--font`-prefixed CSS variables are processed by default; setting `true` enables processing of ALL CSS variables which hurts build performance [source](./docs/content/1.get-started/2.configuration.md)

✅ Include a generic family after font name for fallback metrics — the module uses the generic family (`sans-serif`, `serif`) to select which system font to morph into a size-matched fallback, reducing CLS [source](./docs/content/2.advanced.md)

```css
/* generates Arial-based fallback metrics */
font-family: Roboto, sans-serif;
/* generates Times New Roman-based fallback metrics */
font-family: Merriweather, serif;
```

✅ Set `provider: 'none'` to exclude a font from automatic resolution — prevents the module from fetching `@font-face` for fonts you manage yourself (e.g. icon fonts, fonts loaded via `<link>`) [source](./docs/content/1.get-started/2.configuration.md)

✅ Name local font files with weight/style suffixes — the local provider infers metadata from filenames; `roboto-700-italic.woff2` resolves to weight 700 italic, while `roboto.woff2` defaults to 400/normal/latin [source](./docs/content/1.get-started/4.providers.md)

✅ Use the `fonts:public-asset-context` hook for OG image font URLs — provides `renderedFontURLs` map during Vite build, enabling modules like `nuxt-og-image` to resolve font file paths at prerender time [source](./docs/content/2.advanced.md)

```ts
nuxt.hook('fonts:public-asset-context', (ctx) => {
  // ctx.renderedFontURLs: Map<filename, sourceUrl>
})
```

✅ Pin to a single provider with `provider` (singular) when only one source is needed — avoids resolution overhead from scanning all providers; `provider: 'google'` disables local/bunny/fontsource/etc [source](./docs/content/1.get-started/2.configuration.md)

Related: unjs-fontaine, unjs-unifont
