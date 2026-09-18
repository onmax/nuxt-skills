---
name: lightningcss-skilld
description: "ALWAYS use when writing code importing \"lightningcss\". Consult for debugging, best practices, or modifying lightningcss."
metadata:
  version: 1.32.0
  generated_at: 2026-03-16
---

# parcel-bundler/lightningcss `lightningcss`

**Version:** 1.32.0 (Mar 2026)
**Deps:** detect-libc@^2.0.3
**Tags:** latest: 1.32.0 (Mar 2026)

**References:** [package.json](./.skilld/pkg/package.json) — exports, entry points • [README](./.skilld/pkg/README.md) — setup, basic usage • [Docs](./.skilld/docs/_INDEX.md) — API reference, guides • [GitHub Issues](./.skilld/issues/_INDEX.md) — bugs, workarounds, edge cases • [GitHub Discussions](./.skilld/discussions/_INDEX.md) — Q&A, patterns, recipes • [Releases](./.skilld/releases/_INDEX.md) — changelog, breaking changes, new APIs

## Search

Use `skilld search` instead of grepping `.skilld/` directories — hybrid semantic + keyword search across all indexed docs, issues, and releases. If `skilld` is unavailable, use `npx -y skilld search`.

```bash
skilld search "query" -p lightningcss
skilld search "issues:error handling" -p lightningcss
skilld search "releases:deprecated" -p lightningcss
```

Filters: `docs:`, `issues:`, `releases:` prefix narrows by source type.

<!-- skilld:api-changes -->
## API Changes

This section documents version-specific API changes in lightningcss v1.x — prioritize recent major/minor releases.

### Breaking/Significant Changes

- BREAKING: Relative color parsing changed in v1.30 — colors now require numbers instead of percentages in relative color calculations (e.g., `rgb(from red 100% 0 0)` becomes `rgb(from red 100 0 0)`). Code using percentages in relative color values will silently produce wrong results. [source](./.skilld/releases/v1.30.0.md#features)

### New APIs

- NEW: `VisitorFunction<C>` — v1.32 allows visitors to be functions that receive `VisitorOptions` parameter, enabling access to `addDependency()` for tracking file watchers and cache invalidation [source](./.skilld/pkg/node/index.d.ts:L221)

- NEW: Resolver `resolve()` method return value — v1.32 allows custom resolvers to return `{external: string}` to mark imports as external, preventing bundling while keeping `@import` in output [source](./.skilld/releases/v1.32.0.md#added)

- NEW: `mix-blend-mode` property — v1.32 adds full support for the `mix-blend-mode` property with all blend mode values [source](./.skilld/releases/v1.32.0.md#added)

- NEW: `@view-transition` rule — v1.29 implements view transitions level 2, including the rule, `view-transition-class`, and `view-transition-group` properties for scoped animations without additional CSS [source](./.skilld/releases/v1.29.0.md#added)

- NEW: `@font-feature-values` rule — v1.29 adds parsing support for `@font-feature-values` at-rule, enabling `@supports font-feature-values()` checks [source](./.skilld/releases/v1.29.0.md#added)

- NEW: `light-dark()` feature flag — v1.29 adds `Features.LightDark` flag to explicitly control transpilation of the `light-dark()` function for backwards compatibility. Flag enables control via `include`/`exclude` options [source](./.skilld/docs/transpilation.md:L111)

- NEW: `:state()` pseudo-class — v1.31 adds support for `:state()` pseudo-class for custom element state matching [source](./.skilld/releases/v1.31.0.md#features)

- NEW: Scroll-state container queries — v1.31 implements scroll-state container queries allowing style rules based on scroll position [source](./.skilld/releases/v1.31.0.md#features)

- NEW: `::picker`, `::picker-icon`, `::checkmark` pseudo-elements — v1.30 adds support for these form control pseudo-elements [source](./.skilld/releases/v1.30.0.md#features)

- NEW: `@property` nesting support — v1.31 allows `@property` to be nested inside at-rules like `@media` [source](./.skilld/releases/v1.31.0.md#features)

- NEW: `print-color-adjust` property — v1.31 adds support for the `print-color-adjust` property to control color/background printing behavior [source](./.skilld/releases/v1.31.0.md#features)

- NEW: `<string>` type in `@property` syntax — v1.31 allows `<string>` values in `@property` syntax definitions [source](./.skilld/releases/v1.31.0.md#features)

- NEW: `[content-hash]` CSS modules pattern — v1.27 adds content-based hashing option for CSS module pattern, supporting multiple library versions without hash conflicts [source](./.skilld/releases/v1.27.0.md#added)

- NEW: `pure` mode lints for CSS Modules — v1.27 adds pure mode option to enforce at least one class/id selector in each rule [source](./.skilld/releases/v1.27.0.md#added)

### CSS Syntax & Lowering

- NEW: Selector nesting with pseudo-elements — v1.30 enables nesting style rules that end with pseudo-elements (e.g., `::before`, `::after`) [source](./.skilld/releases/v1.30.0.md#features)

- NEW: Interleaved declarations and nested rules — v1.30 allows mixing declarations and nested rules in the same style block (not just declarations then nested rules) [source](./.skilld/releases/v1.30.0.md#features)

- NEW: Reduction of `min()`, `max()`, `clamp()` with number arguments — v1.31 optimizes these functions when all arguments are numbers by computing at build-time [source](./.skilld/releases/v1.31.0.md#features)

- NEW: Name-only `@container` queries — v1.31 supports `@container name` syntax without container-type requirement [source](./.skilld/releases/v1.31.0.md#features)

### Deprecated APIs

- DEPRECATED: `@value` at-rule — v1.28 emits error for deprecated CSS Modules `@value` at-rule (CSS spec uses `@property` instead) [source](./.skilld/releases/v1.28.0.md#added)

**Also changed:** Granular CSS modules options (v1.25 — `grid`, `animation`, `customIdents` scoping flags) · `animation-timeline` property (v1.25) · `animation-range` properties (v1.26) · CSS module `[content-hash]` pattern (v1.27) · `@container` name hashing in CSS modules option (v1.28) · CustomAtRule.loc TypeScript type fix (v1.29) · skip unnecessary `@supports` rules when nested (v1.30) · color-scheme keyword serialization fixes (v1.32) · transform property serialization fixes (v1.32) · scale property percentage handling (v1.32)
<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->
## Best Practices

- Reuse the `targets` object across all files in a build process — computing targets is expensive, and reusing the same object eliminates redundant browser compatibility lookups [source](./.skilld/docs/transpilation.md#browser-targets:L15:L31)

- Use specific visitor property names in object form instead of a general function — this minimizes JavaScript calls by only invoking visitors for properties you care about, dramatically improving performance [source](./.skilld/docs/transforms.md#value-types:L43:L78)

- Return `raw` CSS strings from visitors to avoid constructing full AST objects — Lightning CSS parses the string for you, making it simpler to return complex values from custom transforms [source](./.skilld/docs/transforms.md#raw-values:L141:L165)

- Compose multiple visitor plugins using `composeVisitors()` instead of manually merging visitor objects — this enables publishing reusable visitor plugins and keeps logic separate while executing in a single AST pass [source](./.skilld/docs/transforms.md#composing-visitors:L213:L260)

- Use custom resolvers with `bundleAsync()` and return `{external: string}` to mark imports as external, preserving specific `@import` rules in the bundle instead of inlining them [source](./.skilld/releases/v1.32.0.md:L11)

- Pass a function to the `visitor` option to emit file or glob dependencies — this enables bundlers and watchers to invalidate caches when dependencies change, essential for correct rebuild behavior [source](./.skilld/docs/transforms.md#dependencies:L356:L409)

- Convert browserslist queries to Lightning CSS targets once per build using `browserslistToTargets()` — this ensures consistent browser target configuration across your pipeline and automatically tracks market share changes [source](./.skilld/docs/transpilation.md#browser-targets:L17:L29)

- Enable `errorRecovery` when processing third-party CSS with known invalid syntax — this gracefully omits invalid rules/declarations and returns warnings instead of failing the entire build [source](./.skilld/docs/docs.md#error-recovery:L170:L172)

- Return an empty array `[]` from a `Rule` visitor to completely remove at-rules (e.g. `@media print`) and their entire contents — this is the correct pattern for filtering conditional rules [source](./.skilld/discussions/discussion-679.md:L33:L52)

- Use `readFileSync` instead of `readFile` in custom resolvers when possible — synchronous reads avoid the performance overhead of async file I/O, especially important when bundling many files [source](./.skilld/docs/bundling.md#custom-resolvers:L156:L177)

- Be as specific as possible about visitor types (e.g. prefer `Length` over generic `Token` visitors) — narrowing the scope of what you visit reduces the frequency of JavaScript callbacks into the expensive JS/Rust boundary [source](./.skilld/docs/transforms.md#visitors:L13:L16)
<!-- /skilld:best-practices -->
