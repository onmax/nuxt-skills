---
name: satori-skilld
description: "ALWAYS use when writing code importing \"satori\". Consult for debugging, best practices, or modifying satori."
metadata:
  version: 0.25.0
  generated_at: 2026-03-16
---

# vercel/satori `satori`

**Version:** 0.25.0 (Mar 2026)
**Deps:** @shuding/opentype.js@1.4.0-beta.0, css-background-parser@^0.1.0, css-box-shadow@1.0.0-3, css-gradient-parser@^0.0.17, css-to-react-native@^3.0.0, emoji-regex-xs@^2.0.1, escape-html@^1.0.3, linebreak@^1.1.0, parse-css-color@^0.2.1, postcss-value-parser@^4.2.0, yoga-layout@^3.2.1
**Tags:** beta: 0.0.30-beta.1 (Aug 2022), latest: 0.25.0 (Mar 2026)

**References:** [package.json](./.skilld/pkg/package.json) — exports, entry points • [README](./.skilld/pkg/README.md) — setup, basic usage • [Docs](./.skilld/docs/_INDEX.md) — API reference, guides • [GitHub Issues](./.skilld/issues/_INDEX.md) — bugs, workarounds, edge cases • [GitHub Discussions](./.skilld/discussions/_INDEX.md) — Q&A, patterns, recipes • [Releases](./.skilld/releases/_INDEX.md) — changelog, breaking changes, new APIs

## Search

Use `skilld search` instead of grepping `.skilld/` directories — hybrid semantic + keyword search across all indexed docs, issues, and releases. If `skilld` is unavailable, use `npx -y skilld search`.

```bash
skilld search "query" -p satori
skilld search "issues:error handling" -p satori
skilld search "releases:deprecated" -p satori
```

Filters: `docs:`, `issues:`, `releases:` prefix narrows by source type.

<!-- skilld:api-changes -->
## API Changes

This section documents version-specific API changes — prioritize recent major/minor releases.

- BREAKING: `satori/wasm` entrypoint removed — v0.16.0 removed the separate WASM export, now always inlined in the main bundle [source](./.skilld/releases/v0.16.0.md:L18)

- NEW: Standalone build (`satori/standalone`) — v0.18.0 added support for manual WASM loading via `init()` function, useful for environments with WASM loading restrictions [source](./.skilld/releases/v0.18.0.md:L15)

- NEW: `init()` function — v0.18.0 introduced for standalone build; accepts WASM binary and prepares the layout engine before using `satori()` [source](./.skilld/releases/v0.18.0.md:L15)

- NEW: `pointScaleFactor` option — v0.14.0 added to SatoriOptions for controlling pixel grid rounding on high-DPI displays, passed to Yoga's layout engine [source](./.skilld/releases/v0.14.0.md)

- NEW: CSS feature support in v0.16.0 — `box-sizing`, `display: contents`, `position: static`, `align-content: space-evenly`, improved `position: absolute` handling, and percentage values for `gap` [source](./.skilld/releases/v0.16.0.md:L11-L16)

- NEW: `objectFit` CSS property — v0.18.0 added support for controlling image scaling within element bounds [source](./.skilld/releases/v0.18.0.md:L14)

- NEW: `text-wrap: "pretty"` value — v0.13.0 added support for improved text wrapping with balanced line breaks [source](./.skilld/releases/v0.13.0.md)

- NEW: Color in `backgroundImage` gradients — v0.19.0 added color support for semi-transparent gradients [source](./.skilld/releases/v0.19.0.md:L19)

- NEW: Async component support — v0.15.2 added support for async/promise-based React components [source](./.skilld/releases/v0.15.2.md:L14)

- NEW: `forwardRef` wrapped components — v0.18.3 added support for components wrapped with React's `forwardRef()` [source](./.skilld/releases/v0.18.3.md:L14)

**Also changed:** `text-decoration-style: double` new v0.15.0 · `text-decoration-skip-ink` new v0.19.1 · `init()` accepts instantiated WASM instance v0.18.2
<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->
## Best Practices

- Reuse font definitions as static/module-level variables instead of recreating them on each render call — satori uses WeakMap to cache fonts and will miss the cache with a new array, causing a 2x performance penalty [source](./.skilld/issues/issue-590.md#2x-faster-with-satorioptionsfonts-as-a-global-variable)

- Use WOFF font format with limited character sets (e.g., Latin-only) to reduce bundle size for production deployments, especially on edge functions or when fonts impact file size limits [source](./.skilld/discussions/discussion-434.md#accepted-answer)

- Avoid wrapping text content in `<span>` elements for styling — use `flex-wrap: wrap` and `gap` for multi-colored or highlighted text instead, as spans break text wrapping [source](./.skilld/issues/issue-484.md#using-a-span-inside-some-text-breaks-wrapping)

- Serialize local images to data URIs when images aren't accessible via HTTP fetching — enables use of file-system images in server/edge environments without network requests [source](./.skilld/discussions/discussion-255.md#top-comments)

- Use `-webkit-line-clamp` CSS property for multiline text overflow with ellipsis to efficiently use canvas space while clamping long text [source](./.skilld/issues/issue-253.md#support-multiline-text-overflow-ellipsis)

- In Vite projects using `@vercel/og`, set `ssr.external: ["@vercel/og"]` in vite.config.ts to prevent bundling, which breaks internal font resolution paths on deployment [source](./.skilld/issues/issue-582.md#top-comments)

- For variable fonts, omit the `style` property in font options — only provide `name` and `data`, as style conflicts with variable font axis definitions [source](./.skilld/issues/issue-162.md#top-comments)

- Call `init()` before rendering in browser or edge environments to ensure WASM layout engine is properly loaded, preventing "yoga not initialized" errors [source](./.skilld/discussions/discussion-301.md#satori-is-not-initialized-expect-yoga-to-be-loaded-got-undefined)

- Pass custom Tailwind configuration via `tailwindConfig` option in SatoriOptions to override default theme colors, spacing, and utilities in generated images [source](./.skilld/issues/issue-503.md#access-to-custom-tailwind-config-through-imageresponse)

- Use `loadAdditionalAsset` callback to dynamically load language-specific fonts or grapheme images on demand, enabling multi-language support without bundling all fonts [source](./.skilld/pkg/dist/index.d.ts:L167)

- Enable `embedFont` option to inline font data directly in the SVG output, reducing external asset dependencies at the cost of larger SVG payload [source](./.skilld/pkg/dist/index.d.ts:L164)
<!-- /skilld:best-practices -->
