---
name: vercel-satori
description: "ALWAYS use when writing code importing \"satori\". Consult for debugging, best practices, or modifying satori."
metadata:
  version: 0.19.2
  generated_by: Claude Code · Opus 4.6
---

# vercel/satori `satori`

**Version:** 0.19.2 (3 days ago)
**Deps:** @shuding/opentype.js@1.4.0-beta.0, css-background-parser@^0.1.0, css-box-shadow@1.0.0-3, css-gradient-parser@^0.0.17, css-to-react-native@^3.0.0, emoji-regex-xs@^2.0.1, escape-html@^1.0.3, linebreak@^1.1.0, parse-css-color@^0.2.1, postcss-value-parser@^4.2.0, yoga-layout@^3.2.1
**Tags:** beta: 0.0.30-beta.1 (3 years ago), latest: 0.19.2 (3 days ago)

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [GitHub Issues](./.skilld/issues/_INDEX.md) • [GitHub Discussions](./.skilld/discussions/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `npx -y skilld search` instead of grepping `.skilld/` directories — hybrid semantic + keyword search across all indexed docs, issues, and releases.

```bash
npx -y skilld search "query" -p satori
npx -y skilld search "issues:error handling" -p satori
npx -y skilld search "releases:deprecated" -p satori
```

Filters: `docs:`, `issues:`, `releases:` prefix narrows by source type.

## API Changes

⚠️ `satori/wasm` — removed in v0.16.0, WASM is now inlined in the main build. Use `satori` (default) or `satori/standalone` instead [source](./.skilld/releases/v0.16.0.md)

⚠️ `satori/standalone` `init()` — v0.18.0 added standalone build with `init(input: InitInput)` where `InitInput` accepts `ArrayBuffer | Buffer | WebAssembly.Module | Response | URL | RequestInfo`. Must call `await init(wasm)` before using satori. v0.19.2 fixed the `init` implementation [source](./.skilld/releases/v0.18.0.md)

⚠️ `init()` wasm instance — v0.18.2 added support for passing an already-instantiated `WebAssembly.Module` to `init()`, not just raw bytes [source](./.skilld/releases/v0.18.2.md)

✨ `pointScaleFactor` option — new in v0.14.0, controls pixel grid rounding via Yoga's point scale factor for high-DPI precision [source](./.skilld/releases/v0.14.0.md)

✨ `text-wrap: "pretty"` — new in v0.13.0, adds text-wrap pretty support [source](./.skilld/releases/v0.13.0.md)

✨ `text-decoration-style: double` — new in v0.15.0 [source](./.skilld/releases/v0.15.0.md)

✨ `text-decoration-skip-ink` — supported since v0.19.1 [source](./.skilld/releases/v0.19.1.md)

✨ `object-fit` on images — new in v0.18.0, supports `contain`, `cover`, `none` [source](./.skilld/releases/v0.18.0.md)

✨ `display: contents`, `position: static`, `box-sizing`, `align-content: space-evenly`, percentage `gap` — new CSS layout properties in v0.16.0 via yoga-layout upgrade [source](./.skilld/releases/v0.16.0.md)

✨ `backgroundImage` color support — v0.19.0 added color values in `backgroundImage` for semi-transparent gradients [source](./.skilld/releases/v0.19.0.md)

✨ async components — supported since v0.15.2, React components passed to satori can be async [source](./.skilld/releases/v0.15.2.md)

✨ `SatoriOptions` width/height — can now provide only `width` OR only `height` (not both required). Type is `{ width; height } | { width } | { height }` [source](./.skilld/pkg/README.md)

## Best Practices

✅ Hoist `fonts` array to module scope — satori uses a `WeakMap` font cache keyed by object identity; recreating the array per-call bypasses the cache and re-parses fonts every time, cutting throughput ~2x [source](./.skilld/issues/issue-590.md)

```ts
// Module-level — parsed once, cached via WeakMap
const fonts: SatoriOptions['fonts'] = [
  { name: 'Inter', data: interBuffer, weight: 400, style: 'normal' },
]

// Per-request — reuse the same reference
const svg = await satori(element, { width: 1200, height: 630, fonts })

```
✅ Use base64/ArrayBuffer for `<img>` src — satori fetches URL images at render time; inlining as `data:` URIs or passing `Buffer`/`ArrayBuffer` eliminates network I/O and avoids production-only "Unsupported image type: unknown" errors from CDN responses with wrong content-type headers [source](./.skilld/pkg/README.md) [source](./.skilld/issues/issue-626.md)

✅ Always set `width` and `height` on `<img>` — without explicit dimensions satori cannot determine image size and throws `Image size cannot be determined` [source](./.skilld/pkg/README.md)

✅ Avoid `<span>` inside text for inline styling — satori's Yoga-based layout treats nested inline elements as flex blocks, breaking word wrapping; use a flat `<div>` with `display: "flex"` and `flexWrap: "wrap"` wrapping separate text segments instead [source](./.skilld/issues/issue-484.md)

✅ Only TTF, OTF, WOFF fonts are supported — WOFF2 is **not** supported; variable fonts throw `TypeError: Cannot read properties of undefined (reading '259')` [source](./.skilld/pkg/README.md) [source](./.skilld/issues/issue-162.md)

✅ Use `satori/standalone` + manual WASM for restricted runtimes (Cloudflare Workers) — call `init(wasmBinary)` before `satori()`; as of 0.18.0 also accepts instantiated `WebAssembly.Module` [source](./.skilld/releases/v0.18.0.md) [source](./.skilld/releases/v0.18.2.md)

```ts
import satori, { init } from 'satori/standalone'
await init(yogaWasm) // ArrayBuffer | WebAssembly.Module
const svg = await satori(element, options)
```

✅ Default `display` is `flex`, not `block` — every element is a flex container by default (like React Native); use `display: "none"` or `display: "contents"` (added in 0.16.0) as alternatives [source](./.skilld/pkg/README.md) [source](./.skilld/releases/v0.16.0.md)

✅ Default `flexWrap` is `wrap`, not `nowrap` — unlike CSS default, satori defaults to `wrap`; explicitly set `flexWrap: "nowrap"` if you need single-line content [source](./.skilld/pkg/README.md)

✅ No `z-index` in SVG — element paint order is strictly document order; place elements that should appear on top later in the tree [source](./.skilld/pkg/README.md)

✅ Color functions `oklch()`, `calc()`, `currentColor` are unsupported or limited — `oklch()` in gradients throws parse errors; `calc()` is not implemented; `currentColor` only works on the `color` property itself [source](./.skilld/pkg/README.md) [source](./.skilld/discussions/discussion-636.md)
