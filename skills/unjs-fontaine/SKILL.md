---
name: unjs-fontaine
description: "ALWAYS use when writing code importing \"fontless\". Consult for debugging, best practices, or modifying fontless, fontaine."
metadata:
  version: 0.2.1
---

# unjs/fontaine `fontless`

**Version:** 0.2.1 (today)
**Deps:** consola@^3.4.2, css-tree@^3.1.0, defu@^6.1.4, esbuild@^0.27.0, jiti@^2.6.1, lightningcss@^1.30.2, magic-string@^0.30.21, ohash@^2.0.11, pathe@^2.0.3, ufo@^1.6.1, unifont@^0.7.4, unstorage@^1.17.1, fontaine@0.8.0
**Tags:** latest: 0.2.1 (today)

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [GitHub Issues](./.skilld/issues/_INDEX.md) • [GitHub Discussions](./.skilld/discussions/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `npx -y skilld search` instead of grepping `.skilld/` directories — hybrid semantic + keyword search across all indexed docs, issues, and releases.

```bash
npx -y skilld search "query" -p fontless
npx -y skilld search "issues:error handling" -p fontless
npx -y skilld search "releases:deprecated" -p fontless
```

Filters: `docs:`, `issues:`, `releases:` prefix narrows by source type.

## API Changes

⚠️ `fontaine` → `fontless` — the package was renamed/extracted; import `{ fontless }` from `"fontless"` not `"fontaine"`. The `fontaine` package still exists but only provides font metrics utilities, not the Vite plugin [source](./.skilld/discussions/discussion-620.md)

✨ `fontless()` — new Vite plugin export in v0.1.0, replaces old `FontaineTransform()` from fontaine. Usage: `import { fontless } from 'fontless'` [source](./.skilld/releases/fontless@0.1.0.md)

✨ `npm` provider — v0.2.1 added support for resolving fonts from local npm packages via `providers: { npm: true }` [source](./.skilld/releases/fontless@0.2.1.md)

✨ `defaults.formats` — v0.2.0 added `formats` option to control resolved font formats. Defaults to `['woff2']` [source](./.skilld/releases/fontless@0.2.0.md)

✨ `providerOptions` — v0.2.0 added per-family `providerOptions` field to pass provider-specific options (e.g. `{ google: { ... } }`) when resolving a font [source](./.skilld/releases/fontless@0.2.0.md)

⚠️ `experimental.processCSSVariables` — deprecated, use top-level `processCSSVariables` instead. Setting to `true` is no longer needed for Tailwind v4 [source](./.skilld/releases/fontless@0.1.0.md)

✨ `processCSSVariables` — promoted from experimental to top-level option. Accepts `boolean | 'font-prefixed-only'` (default: `'font-prefixed-only'`) [source](./.skilld/releases/fontless@0.1.0.md)

✨ `createResolver()` — exported utility for programmatic font resolution outside the Vite plugin. Takes `ResolverContext`, returns `Promise<Resolver>` [source](./.skilld/releases/fontless@0.1.0.md)

✨ `transformCSS()` — exported utility to transform CSS with font injection. Used internally by the plugin, available for custom integrations [source](./.skilld/releases/fontless@0.1.0.md)

✨ `DEFAULT_CATEGORY_FALLBACKS` — category-aware fallback presets (sans-serif, serif, monospace, cursive, fantasy, system-ui, etc.) re-exported from `fontaine`. Configure via `defaults.fallbacks` [source](./.skilld/releases/fontless@0.1.0.md)

⚠️ unifont v0.7 — v0.2.0 upgraded to unifont v0.7; provider type signatures changed. Custom `ProviderFactory` implementations may need updates [source](./.skilld/releases/fontless@0.2.0.md)

## Best Practices

✅ Set `defaults.formats` to `['woff2']` (the default) — google provider previously included both `woff2` and `woff`, causing browsers to download the larger `woff` file unnecessarily [source](./issues/issue-656.md)

✅ Use `processCSSVariables: 'font-prefixed-only'` (default) for Tailwind v4 — fontless detects `--font-*` CSS variables in `@theme` blocks. Setting `true` is no longer needed or recommended; the old `experimental.processCSSVariables` is deprecated [source](./pkg/README.md)

```css
/* Tailwind v4: detected automatically with default config */
@theme {
  --font-sans: 'DM Sans', sans-serif;
}

```
✅ Set `provider: 'none'` on self-hosted fonts to skip provider resolution — prevents fontless from searching all providers for fonts you load manually [source](./pkg/README.md)

```ts
fontless({
  families: [
    { name: 'Custom Font', provider: 'none' },
    { name: 'My Font', src: '/fonts/my-font.woff2' },
  ]
})
```

✅ Use `priority` array to control provider resolution order — fontless checks providers sequentially and stops at first match. Put your preferred CDN first to avoid unexpected provider selection [source](./pkg/README.md)

```ts
fontless({
  priority: ['bunny', 'google'], // bunny checked before google
})
```

✅ Override `defaults.fallbacks` per generic family, not globally — category-aware presets (from fontaine) provide optimized system font stacks per category (`sans-serif`, `serif`, `monospace`, etc.). Only override the specific category you need [source](./pkg/README.md)

```ts
fontless({
  defaults: {
    fallbacks: {
      'sans-serif': ['Arial', 'Helvetica Neue'], // only override sans-serif
      // serif, monospace, etc. keep their optimized defaults
    }
  }
})
```

✅ Specify `weights` per family for variable fonts — default is `[400]` only. Variable fonts that support a weight range won't get their full range unless explicitly configured [source](./issues/issue-658.md)

```ts
fontless({
  families: [
    { name: 'Inter', weights: ['100..900'] } // variable weight range
  ]
})
```

✅ Preload is automatic for the highest-priority format but disabled for subsetted fonts — to avoid over-preloading. Override with `preload: true` on specific families if your subset is small enough [source](./pkg/README.md)

✅ Use `createResolver` + `transformCSS` for non-Vite integrations — fontless exports these as standalone utilities. `createResolver` returns a function that resolves font families to `FontFaceData[]`, and `transformCSS` handles CSS injection [source](./pkg/README.md)

✅ Fonts from npm packages now resolve via the `npm` provider (v0.2.1) — previously fontless couldn't process fonts imported from `node_modules` (e.g., fontsource packages). The `npm` provider was added to handle this [source](./releases/fontless@0.2.1.md) [source](./issues/issue-258.md)

✅ Plugin is skipped during `vite preview` — fontless only runs in dev and build modes. Don't expect font processing in preview [source](./releases/fontless@0.1.0.md)

Related: parcel-bundler-lightningcss, unjs-unifont
