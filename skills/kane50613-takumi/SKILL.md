---
name: kane50613-takumi
description: "ALWAYS use when writing code importing \"@takumi-rs/core\". Consult for debugging, best practices, or modifying @takumi-rs/core, takumi-rs/core, takumi-rs core, takumi rs core, takumi."
metadata:
  version: 0.68.2
  generated_by: Claude Code · Opus 4.6
---

# kane50613/takumi `@takumi-rs/core`

**Version:** 0.68.2 (today)
**Tags:** latest: 0.68.2 (today)

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [GitHub Issues](./.skilld/issues/_INDEX.md) • [GitHub Discussions](./.skilld/discussions/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `npx -y skilld search` instead of grepping `.skilld/` directories — hybrid semantic + keyword search across all indexed docs, issues, and releases.

```bash
npx -y skilld search "query" -p @takumi-rs/core
npx -y skilld search "issues:error handling" -p @takumi-rs/core
npx -y skilld search "releases:deprecated" -p @takumi-rs/core
```

Filters: `docs:`, `issues:`, `releases:` prefix narrows by source type.

## API Changes

⚠️ `renderAsync()` — deprecated, use `render()` instead (async naming convention change) [source](./pkg-core/README.md)

⚠️ `loadFontAsync()` — deprecated, use `loadFont()` instead [source](./releases/@takumi-rs/core@0.67.2.md)

⚠️ `loadFontsAsync()` — deprecated, use `loadFonts()` instead [source](./releases/@takumi-rs/core@0.67.2.md)

⚠️ `putPersistentImageAsync()` — deprecated, use `putPersistentImage()` instead [source](./releases/@takumi-rs/core@0.66.12.md)

⚠️ `PersistentImage` type — deprecated, use `ImageSource` instead [source](./releases/@takumi-rs/core@0.68.0.md)

⚠️ `OutputFormat` uppercase variants `'WebP'`, `'Jpeg'`, `'Png'` — deprecated, use lowercase `'webp'`, `'jpeg'`, `'png'` [source](./releases/@takumi-rs/core@0.68.0.md)

⚠️ `purgeResourcesCache()` / `purgeFontCache()` — deprecated no-ops, do nothing; remove calls [source](./releases/@takumi-rs/core@0.68.0.md)

✨ `loadFontSync()` — new in v0.67.2, synchronous font loading [source](./releases/@takumi-rs/core@0.67.2.md)

✨ `measure()` — returns `MeasuredNode` with layout info (width, height, transform, text runs) [source](./issues/issue-1.md)

✨ `renderAnimation()` — renders `AnimationFrameSource[]` to animated webp/apng; images must be passed via `ConstructRendererOptions.persistentImages` (not per-call) [source](./discussions/discussion-375.md)

✨ `extractResourceUrls()` — standalone function to collect image URLs from a node tree before render [source](./releases/@takumi-rs/core@0.68.0.md)

✨ `Font` type accepts bare `Uint8Array | ArrayBuffer` — no need to wrap in `FontDetails` if name/weight/style auto-detection is fine [source](./releases/@takumi-rs/core@0.68.0.md)

## Best Practices

✅ Pass `persistedImages` to the `Renderer` constructor for animations — `renderAnimation()` does not accept them at call time, only the constructor does [source](./.skilld/discussions/discussion-375.md)

```ts
const renderer = new Renderer({
  fonts,
  persistedImages: [{ src: 'logo.png', data: logoBuffer }],
})
await renderer.renderAnimation(frames, { width: 1200, height: 630 })

```
✅ Pre-fetch images and pass as `fetchedResources` or `persistedImages` — passing a URL string as `img src` without pre-fetching the buffer causes `"Failed to get Buffer pointer and length"` crashes [source](./.skilld/issues/issue-349.md)

```ts
const imgData = await fetch(url).then(r => r.arrayBuffer())
await renderer.render(node, {
  fetchedResources: [{ src: url, data: new Uint8Array(imgData) }],
})
```

✅ Always provide at least one font — constructing `Renderer` without fonts causes a crash; there is no built-in default font [source](./.skilld/issues/issue-134.md)

✅ Use `loadFontSync` for synchronous font loading (v0.67.2+) — avoids async overhead when fonts are already in memory [source](./.skilld/releases/@takumi-rs/core@0.67.2.md)

```ts
renderer.loadFontSync({ data: fontBuffer, name: 'Inter', weight: 400 })
```

✅ Avoid variable fonts — they are not supported; use separate static font files per weight [source](./.skilld/issues/issue-134.md)

✅ Use `extractResourceUrls(node)` to discover image URLs before rendering — lets you pre-fetch all required images in parallel [source](./.skilld/pkg-core/README.md)

```ts
const urls = extractResourceUrls(node)
const resources = await Promise.all(
  urls.map(async src => ({ src, data: new Uint8Array(await fetch(src).then(r => r.arrayBuffer())) }))
)
await renderer.render(node, { fetchedResources: resources })
```

✅ Use lowercase format strings `'png' | 'webp' | 'jpeg'` — uppercase variants (`'Png'`, `'WebP'`, `'Jpeg'`) are deprecated and may be removed [source](./.skilld/pkg-core/README.md)

✅ Use `@takumi-rs/wasm` for edge runtimes (Cloudflare Workers, Vercel Edge) — `@takumi-rs/core` uses native `.node` bindings via napi-rs and does not work in edge/WASM environments [source](./.skilld/discussions/discussion-282.md)

✅ Pass `AbortSignal` to `render`/`loadFont`/`loadFonts` — all async methods accept an optional signal for caller-controlled cancellation [source](./.skilld/pkg-core/README.md)

✅ `PersistentImage` type is deprecated — use `ImageSource` instead (same shape: `{ src: string, data: Uint8Array | ArrayBuffer }`) [source](./.skilld/pkg-core/README.md)
