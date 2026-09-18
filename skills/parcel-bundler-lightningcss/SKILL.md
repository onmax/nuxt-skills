---
name: parcel-bundler-lightningcss
description: "ALWAYS use when writing code importing \"lightningcss\". Consult for debugging, best practices, or modifying lightningcss."
metadata:
  version: 1.31.1
  generated_by: Claude Code · Opus 4.6
---

# parcel-bundler/lightningcss `lightningcss`

**Version:** 1.31.1 (3 weeks ago)
**Deps:** detect-libc@^2.0.3
**Tags:** latest: 1.31.1 (3 weeks ago)

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [GitHub Issues](./.skilld/issues/_INDEX.md) • [GitHub Discussions](./.skilld/discussions/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `npx -y skilld search` instead of grepping `.skilld/` directories — hybrid semantic + keyword search across all indexed docs, issues, and releases.

```bash
npx -y skilld search "query" -p lightningcss
npx -y skilld search "issues:error handling" -p lightningcss
npx -y skilld search "releases:deprecated" -p lightningcss
```

Filters: `docs:`, `issues:`, `releases:` prefix narrows by source type.

## API Changes

✨ `scroll-state()` container queries — new in v1.31.0, enables scroll-position-driven styling [source](./releases/v1.31.0.md)

✨ `:state()` pseudo-class — new in v1.31.0 [source](./releases/v1.31.0.md)

✨ `::picker`, `::picker-icon`, `::checkmark` pseudo-elements — new in v1.30.0 [source](./releases/v1.30.0.md)

⚠️ Relative color syntax — v1.30.0 changed parsing to match updated spec: colors now accept numbers instead of percentages in relative color calculations. Old percentage-based code may silently produce wrong results [source](./releases/v1.30.0.md)

⚠️ `StyleSheet` visitor + custom properties — regression in v1.30.2, `StyleSheet(stylesheet) { return stylesheet }` throws "failed to deserialize Specifier" when CSS contains `var()`. Pin to v1.30.1 as workaround [source](./issues/issue-1065.md)

✨ `light-dark()` feature flag — v1.29.0 added explicit flag to enable/disable transpiling `light-dark()` (previously always transpiled based on targets) [source](./releases/v1.29.0.md)

✨ View Transitions Level 2 — v1.29.0 added `@view-transition` rule, `view-transition-class`, `view-transition-group` properties, and class selectors in view transition pseudos [source](./releases/v1.29.0.md)

✨ `@font-feature-values` — parsing support added in v1.29.0 [source](./releases/v1.29.0.md)

✨ CSS Modules `cssModules.container` option — v1.28.0 added option to avoid hashing `@container` names [source](./releases/v1.28.0.md)

⚠️ CSS Modules `@value` at-rule — v1.28.0 now emits an error for the deprecated `@value` rule. Use `composes` or custom properties instead [source](./releases/v1.28.0.md)

✨ CSS Modules `[content-hash]` pattern — v1.27.0, hashes file contents instead of path. Use for deduplicating multiple versions of same library [source](./releases/v1.27.0.md)

✨ CSS Modules `pure` mode — v1.27.0, enforces class/id selector in every rule [source](./releases/v1.27.0.md)

⚠️ CSS nesting — v1.22.0 moved nesting out of `drafts` config, enabled by default. No longer need `drafts: { nesting: true }` [source](./releases/v1.22.0.md)

✨ `light-dark()` function — v1.24.0 added transpilation to CSS variable fallback for older browsers. Requires `color-scheme` on ancestor element [source](./releases/v1.24.0.md)

✨ `StyleSheet` / `StyleSheetExit` visitors — v1.23.0, enables visiting entire stylesheet for rule sorting/appending. Expensive due to full AST serialization [source](./releases/v1.23.0.md)

✨ `composeVisitors()` — supports `StyleSheet` / `StyleSheetExit` / `Rule.custom.*` since v1.29.0 fix [source](./releases/v1.29.0.md)

✨ `animation-timeline` property — v1.25.0 [source](./releases/v1.25.0.md)

✨ Granular CSS Modules scoping — v1.25.0 added options to disable scoping for `grid`, `animation`, `custom_idents` individually [source](./releases/v1.25.0.md)

## Best Practices

✅ Use granular visitors instead of `StyleSheet` — the `StyleSheet`/`StyleSheetExit` visitor serializes the **entire AST** across the Rust↔JS boundary, which is expensive. Use targeted visitors (`Color`, `Rule`, `Declaration`, etc.) to minimize serialization overhead [source](./../../.skilld/references/lightningcss@1.31.1/releases/v1.23.0.md)

✅ Delete rules by returning `[]` from a `Rule` visitor — returning empty array removes the rule entirely. `MediaQuery` visitor operates on individual queries, not the enclosing rule, so use `Rule` to strip whole at-rules [source](./../../.skilld/references/lightningcss@1.31.1/discussions/discussion-679.md)

```ts
visitor: {
  Rule(rule) {
    if (rule.type === 'media' && rule.value.query.mediaQueries.some(q => q.mediaType === 'print'))
      return []
    return rule
  }
}

```
✅ Use `{ raw: string }` return type for injecting arbitrary CSS values — visitor return values accept `{ raw: '...' }` alongside typed AST nodes, which lightningcss will parse as CSS. Essential for `Variable` visitor substitutions [source](./../../.skilld/references/lightningcss@1.31.1/node_modules/lightningcss/node/index.d.ts)

✅ Beware whitespace stripping before visitors run when substituting variables — minification removes whitespace around `var()` before visitors execute, so `margin: var(--x) 0` becomes `margin:var(--x)0`, then after substitution `margin:2rem0` (invalid). No built-in fix; workaround: insert placeholder whitespace in `raw` values and post-process [source](./../../.skilld/references/lightningcss@1.31.1/issues/issue-976.md)

✅ Pin to v1.30.1 if using `StyleSheet` visitor or custom at-rules with `var()` — v1.30.2 introduced a regression: "failed to deserialize; expected an object-like struct named Specifier" when CSS contains custom properties and a `StyleSheet` visitor or custom at-rule visitor is active. Fixed in v1.31.0 [source](./../../.skilld/references/lightningcss@1.31.1/issues/issue-1065.md)

✅ Use `composeVisitors()` to merge multiple visitor plugins — accepts an array of visitor objects and produces a single composed visitor. Since v1.29.0, composed visitors also correctly call `StyleSheet`/`StyleSheetExit`/`Rule.custom.*` callbacks [source](./../../.skilld/references/lightningcss@1.31.1/releases/v1.29.0.md)

✅ Define custom at-rules with `customAtRules` + `Rule.custom` visitor for mixin patterns — use `prelude: '<custom-ident>'` and `body: 'style-block'` for at-rules that contain declarations and nested rules. Return `rule.body.value` to inline the mixin content [source](./../../.skilld/references/lightningcss@1.31.1/discussions/discussion-945.md)

```ts
transform({
  code: Buffer.from(css),
  filename: 'style.css',
  customAtRules: {
    mixin: { prelude: '<custom-ident>', body: 'style-block' },
    apply: { prelude: '<custom-ident>' }
  },
  visitor: {
    Rule: {
      custom: {
        mixin(rule) { mixins.set(rule.prelude.value, rule.body.value); return [] },
        apply(rule) { return mixins.get(rule.prelude.value) ?? [] }
      }
    }
  }
})
```

✅ `@property` must be at top-level — nesting `@property` inside `@layer` or other at-rules produces "Unknown at rule" warnings. v1.31.0 added support for nesting `@property` inside *some* at-rules, but `@layer` remains unsupported per spec [source](./../../.skilld/references/lightningcss@1.31.1/issues/issue-968.md)

✅ Set `errorRecovery: true` to collect warnings instead of throwing — invalid rules/declarations are omitted from output and returned as `warnings[]` in the result. Essential when processing untrusted/third-party CSS [source](./../../.skilld/references/lightningcss@1.31.1/node_modules/lightningcss/node/index.d.ts)

✅ Use `[content-hash]` over `[hash]` in CSS Modules pattern for dedup safety — `[hash]` uses file path (breaks across environments), while `[content-hash]` (added v1.27.0) uses file contents, allowing multiple versions of the same library without class name conflicts [source](./../../.skilld/references/lightningcss@1.31.1/releases/v1.27.0.md)
