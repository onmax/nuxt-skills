---
name: takumi-rs-core-skilld
description: "ALWAYS use when writing code importing \"@takumi-rs/core\". Consult for debugging, best practices, or modifying @takumi-rs/core, takumi-rs/core, takumi-rs core, takumi rs core, takumi."
metadata:
  version: 1.0.0-beta.3
  generated_by: Claude Code · Haiku 4.5
  generated_at: 2026-03-17
---

# kane50613/takumi `@takumi-rs/core`

**Version:** 1.0.0-beta.3
**Deps:** @takumi-rs/helpers@0.73.1
**Tags:** latest: 0.73.1, beta: 1.0.0-beta.3

**References:** [package.json](./.skilld/pkg/package.json) — exports, entry points • [README](./.skilld/pkg/README.md) — setup, basic usage • [Docs](./.skilld/docs/_INDEX.md) — API reference, guides • [GitHub Issues](./.skilld/issues/_INDEX.md) — bugs, workarounds, edge cases • [GitHub Discussions](./.skilld/discussions/_INDEX.md) — Q&A, patterns, recipes • [Releases](./.skilld/releases/_INDEX.md) — changelog, breaking changes, new APIs

## Search

Use `skilld search` instead of grepping `.skilld/` directories — hybrid semantic + keyword search across all indexed docs, issues, and releases. If `skilld` is unavailable, use `npx -y skilld search`.

```bash
skilld search "query" -p @takumi-rs/core
skilld search "issues:error handling" -p @takumi-rs/core
skilld search "releases:deprecated" -p @takumi-rs/core
```

Filters: `docs:`, `issues:`, `releases:` prefix narrows by source type.

<!-- skilld:api-changes -->

## API Changes

This section documents version-specific API changes in @takumi-rs/core v1.0.0-beta.3. Focus on breaking changes and new APIs that differ from v0.x versions.

## Breaking Changes

- BREAKING: `display` defaults to `inline` instead of `flex` — v1.0.0 changed default layout behavior. Explicitly add `display: flex` or `flex` Tailwind class to containers. [source](./.skilld/references/@takumi-rs/core@1.0.0-beta.3/docs/content/docs/upgrade/v1.mdx:L26:32)

- BREAKING: Image format options are now lowercase only — `'WebP'` → `'webp'`, `'PNG'` → `'png'`, `'JPEG'` → `'jpeg'`. All uppercase variants removed. [source](./.skilld/references/@takumi-rs/core@1.0.0-beta.3/docs/content/docs/upgrade/v1.mdx:L34:48)

- BREAKING: `AnyNode` type removed — use `Node` instead. Generic union type eliminated for type clarity. [source](./.skilld/references/@takumi-rs/core@1.0.0-beta.3/docs/content/docs/upgrade/v1.mdx:L50:56)

- BREAKING: `PersistentImage` type removed — use `ImageSource` interface instead. Renamed for consistency with web standards terminology. [source](./.skilld/references/@takumi-rs/core@1.0.0-beta.3/docs/content/docs/upgrade/v1.mdx:L50:56)

- BREAKING: `purgeResourcesCache()` function removed — no longer needed with v1's resource management improvements. [source](./.skilld/references/@takumi-rs/core@1.0.0-beta.3/docs/content/docs/upgrade/v1.mdx:L50:56)

## New APIs

- NEW: `emoji` option in `ImageResponse` constructor — controls emoji rendering strategy. Accepts `'twemoji' | 'blobmoji' | 'noto' | 'openmoji'` or `'from-font'` to use system fonts. Available since v1.0.0-beta.3. [source](./.skilld/references/@takumi-rs/core@1.0.0-beta.3/docs/content/docs/index.mdx:L47:51)

- NEW: High-level `ImageResponse` class API — unified interface extending standard Response object. Works in Node.js, Edge, and browser runtimes with automatic environment detection. [source](./.skilld/references/@takumi-rs/core@1.0.0-beta.3/docs/content/docs/reference.mdx:L7:11)

- NEW: `fromJsx()` helper function from `@takumi-rs/helpers/jsx` — converts JSX to Takumi node tree with extracted stylesheets. Replaces Satori's JSX→SVG pipeline. [source](./.skilld/references/@takumi-rs/core@1.0.0-beta.3/docs/content/docs/migration/satori.mdx:L32:33)

- NEW: WASM runtime support via `@takumi-rs/image-response/wasm` import and `@takumi-rs/wasm` package — enables Takumi in Edge, Workers, and browser environments with `module` parameter. [source](./.skilld/references/@takumi-rs/core@1.0.0-beta.3/docs/content/docs/index.mdx:L56:78)

- NEW: Default fonts included — Geist and Geist Mono fonts loaded automatically by default. Specify custom fonts via `fonts` option or pass `loadDefaultFonts: false` to opt out. [source](./.skilld/references/@takumi-rs/core@1.0.0-beta.3/docs/content/docs/migration/image-response.mdx:L36:37)

## Installation Changes

- NEW: `@takumi-rs/image-response` package — high-level API for JSX-based image generation. Replaces direct `Renderer` usage in most cases. [source](./.skilld/references/@takumi-rs/core@1.0.0-beta.3/docs/content/docs/index.mdx:L18:22)

- NEW: `@takumi-rs/helpers` package — utilities for JSX→Node conversion and DOM manipulation. [source](./.skilld/references/@takumi-rs/core@1.0.0-beta.3/docs/content/docs/migration/satori.mdx:L17:18)

## Node.js Binding Updates

In Rust, `RenderOptionsBuilder` removed in favor of `RenderOptions::builder()` for more robust builder pattern implementation.

**Also changed:** WASM module import path changed · `@takumi-rs/wasm/next` for Next.js · `@takumi-rs/wasm/takumi_wasm_bg.wasm` for Workers · `renderer` parameter now accepts pre-instantiated Renderer · `module` parameter required for WASM environments · `signal` parameter for AbortSignal support added

<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->

## Best Practices

- Reuse the `Renderer` instance across multiple renders rather than creating new instances each time — significantly improves performance by maintaining resource caches. For Cloudflare Workers, initialize the renderer outside the `fetch()` handler to avoid repeated initialization on every request. [source](./.skilld/docs/content/docs/performance-and-optimization.mdx#the-renderer)

- Preload frequently used images via persistent images to avoid redundant decoding on every render — pass images to the renderer constructor as `persistentImages` and reference them by key in `src` attributes or CSS `background-image`/`mask-image` properties. [source](./.skilld/docs/content/docs/load-images.mdx#persistent-images)

- Prefer TTF fonts over WOFF2 for better rendering performance — WOFF2 requires decompression before use while TTF can be used directly. Only use WOFF2 if minimizing file size is more critical than render speed. [source](./.skilld/docs/content/docs/performance-and-optimization.mdx#fonts)

- Manually extract and fetch external image URLs using `extractResourceUrls()` and `fetchResources()` — Takumi does not handle fetching internally, so you must call these helpers and pass `fetchedResources` to `render()` or `renderAnimation()`. [source](./.skilld/docs/content/docs/load-images.mdx#external-images)

- Use stylesheet `@keyframes` instead of structured `keyframes` objects when animation definitions should travel with the JSX tree — stylesheets stay embedded in the node while structured keyframes require passing to the renderer separately. [source](./.skilld/docs/content/docs/keyframe-animation.mdx#css-stylesheets)

- Pass `persistentImages` to the Renderer constructor, not the render call, for use with `renderAnimation()` — images passed during construction are available to all animation frames, avoiding per-frame overhead. [source](./.skilld/discussions/discussion-375.md#accepted-answer)

- Enable `drawDebugBorder` option when debugging layout problems — renders visible borders around layout elements to diagnose incorrect spacing, sizing, or positioning issues. [source](./.skilld/docs/content/docs/troubleshooting.mdx#general-issues)

- Use `extractEmojis()` helper with a provider (twemoji, noto, etc.) for dynamic emoji rendering when not using the `ImageResponse` API — the function separates emoji segments from text nodes and prepares them for fetching. [source](./.skilld/docs/content/docs/typography-and-fonts.mdx#dynamic-fetching)

- Omit `height` in `ImageResponse` or `render()` to enable auto-sizing based on content — Takumi can calculate height automatically when width is provided, useful for dynamic-height layouts like variable-length lists or text blocks. [source](./.skilld/docs/content/docs/layout-engine.mdx#auto-sizing)
<!-- /skilld:best-practices -->
