---
name: unjs-unifont
description: "ALWAYS use when writing code importing \"unifont\". Consult for debugging, best practices, or modifying unifont."
metadata:
  version: 0.7.4
---

# unjs/unifont `unifont`

**Version:** 0.7.4 (today)
**Deps:** css-tree@^3.1.0, ofetch@^1.5.1, ohash@^2.0.11
**Tags:** latest: 0.7.4 (today)

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [GitHub Issues](./.skilld/issues/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `npx -y skilld search` instead of grepping `.skilld/` directories — hybrid semantic + keyword search across all indexed docs, issues, and releases.

```bash
npx -y skilld search "query" -p unifont
npx -y skilld search "issues:error handling" -p unifont
npx -y skilld search "releases:deprecated" -p unifont
```

Filters: `docs:`, `issues:`, `releases:` prefix narrows by source type.

## API Changes

✨ `providers.npm()` — new provider in v0.7.4, resolves fonts from local/remote npm packages (e.g. `@fontsource/*`). Accepts `NpmProviderOptions` (`cdn`, `remote`, `readFile`, `root`). Per-font options via `NpmFamilyOptions` (`package`, `version`, `file`) [source](./releases/v0.7.4.md)

⚠️ `resolveFontFace()` — removed in v0.7.0, use `resolveFont()` instead [source](./releases/v0.7.1.md)

✨ `resolveFont()` `formats` option — new in v0.7.0, filter returned font formats (`'woff2' | 'woff' | 'otf' | 'ttf' | 'eot'`), defaults to `['woff2']` [source](./releases/v0.7.1.md)

✨ `resolveFont()` `options` param — new in v0.7.0, pass provider-specific per-font options (e.g. `{ google: { experimental: { glyphs: [...] } } }`) [source](./releases/v0.7.1.md)

✨ `InitializedProvider`, `ResolveFontResult` — exported types since v0.7.0 [source](./releases/v0.7.1.md)

✨ `throwOnError` option on `createUnifont()` — new in v0.7.0, throws on provider init/resolve/list failures instead of logging [source](./releases/v0.7.1.md)

✨ `FontFaceMeta.subset` — new in v0.6.0, font faces include subset name (`latin`, `cyrillic`, etc.) [source](./releases/v0.6.0.md)

✨ `resolveFont()` `subsets` option — new in v0.5.0 (google provider), filter by unicode subset [source](./releases/v0.5.0.md)

⚠️ Variable font face filtering — v0.4.0 breaking change, only downloads variable font faces when necessary (may return fewer results than before) [source](./releases/v0.4.0.md)

✨ `FontFaceMeta.init` — new in v0.3.0, `RequestInit` object for authorized font fetching [source](./releases/v0.3.0.md)

✨ `unifont.listFonts()` — new in v0.3.0, returns available font family names from providers [source](./releases/v0.3.0.md)

✨ `experimental.glyphs` — new in v0.3.0 (google/googleicons), subset fonts by specific glyph strings to reduce file size [source](./releases/v0.3.0.md)

⚠️ `GoogleOptions` / `GoogleiconsOptions` — deprecated type aliases, use `GoogleProviderOptions` / `GoogleiconsProviderOptions` [source: d.mts]

⚠️ `resolveFontFace` renamed to `resolveFont` in v0.1.0, old name kept as compat until removed in v0.7.0 [source](./releases/v0.1.0.md)

## Best Practices

✅ Use `unstorage` for persistent caching — default is in-memory only, so fonts re-fetch every cold start [source](./.skilld/pkg/README.md)

```ts
import { createUnifont, providers } from 'unifont'
import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs-lite'

const unifont = await createUnifont([providers.google()], {
  storage: createStorage({ driver: fsDriver({ base: 'node_modules/.cache/unifont' }) }),
})

```
✅ Restrict `subsets` to what you need — defaults to 7 subsets (`cyrillic-ext`, `cyrillic`, `greek-ext`, `greek`, `vietnamese`, `latin-ext`, `latin`), generating many font face entries per weight [source](./.skilld/pkg/README.md)

```ts
const { fonts } = await unifont.resolveFont('Poppins', { subsets: ['latin'] })
```

✅ Request only needed `weights` — defaults to `['400']` but Google provider previously downloaded full variable range (`100..900`) when variable font existed. Fixed in v0.4.0, but explicit weights remain safest [source](./.skilld/releases/v0.4.0.md)

✅ Use `experimental.glyphs` for subset-by-characters — dramatically reduces font size when you only need specific text (e.g., OG image titles). Added in v0.3.0 [source](./.skilld/releases/v0.3.0.md)

```ts
const { fonts } = await unifont.resolveFont('Poppins', {
  options: { google: { experimental: { glyphs: ['Hello', 'World'] } } },
})
```

✅ Use the `npm` provider with `readFile` for local-first font resolution — new in v0.7.4, resolves from `node_modules` before CDN. Set `remote: false` to skip CDN entirely [source](./.skilld/pkg/README.md)

```ts
import { readFile } from 'node:fs/promises'
providers.npm({
  readFile: path => readFile(path, 'utf-8').catch(() => null),
  remote: false,
})
```

✅ Pass 3rd arg to `resolveFont` to target a specific provider — avoids unnecessary lookups when you know which provider has the font. Returns `provider` name in result [source](./.skilld/pkg/README.md)

```ts
const { fonts, provider } = await unifont.resolveFont('Poppins', {}, ['google'])
```

✅ Use `defineFontProvider` with `ctx.storage.getItem(key, init)` for cache-through — the two-arg overload fetches-and-stores in one call, avoiding manual get/set patterns [source](./.skilld/pkg/README.md)

```ts
const fonts = await ctx.storage.getItem('my-provider:meta.json', () =>
  fetch('https://api.example.com/fonts.json').then(r => r.json())
)
```

✅ Include provider options in custom cache keys via `hash()` — cache keys that omit provider config cause stale data when options change (e.g., `glyphs`). Built-in providers fixed this in v0.7.1 but custom providers must do it manually [source](./.skilld/issues/issue-184.md)

```ts
import { hash } from 'ohash'
const key = `my-provider:${fontFamily}-${hash(options)}-data.json`
```

✅ Avoid concurrent `resolveFont` calls that may trigger provider re-initialization — Adobe provider had a race condition where concurrent calls saw empty state during kit refresh. Fixed in v0.7.4 for Adobe, but custom providers with mutable shared state should guard against this [source](./.skilld/issues/issue-329.md)

✅ Use `meta.init` on `FontFaceData` for authenticated font sources — `RequestInit` (headers, etc.) is passed through to font fetch calls. Added in v0.3.0 [source](./.skilld/releases/v0.3.0.md)
