---
name: solar-icons
description: Add Solar Icons via @solar-icons/cli to any React, Vue, Svelte, Solid, Angular, React Native, Nuxt, Static, or vanilla JS project. Use when installing @solar-icons/react|vue|svelte|solid|angular|react-native|nuxt|static|js, choosing an icon, picking Bold|Linear|Outline|BoldDuotone|LineDuotone|Broken, or wiring SolarProvider, useSolar, secondaryColor, secondaryOpacity, strokeWidth, color, size. Triggers on solar icons, solar-icons, Icon suffix, kebab-case imports, duotone, and CSS variables --solar-*.
license: MIT
metadata:
  author: saoudi-h
  version: "2.1.0"
allowed-tools: Bash(npx @solar-icons/cli *) Read Grep Glob Bash(pnpm:*)
---

# Solar Icons

Solar Icons is the **maintained distribution of the Solar icon set** — `1 268` icons × `6` styles = `7 608` SVGs — packaged per framework with CSS-variable theming and tree-shakable imports. Source of truth for counts and catalog is `@solar-icons/static` (and `npx @solar-icons/cli overview`).

- **Site:** https://solar-icons.vercel.app
- **Icons:** https://solar-icons.vercel.app/icons
- **Docs:** https://solar-icons.vercel.app/docs
- **Figma:** https://www.figma.com/community/plugin/1664759238792120976/solar-icons
- **Packages:** `@solar-icons/react` • `@solar-icons/vue` • `@solar-icons/svelte` • `@solar-icons/solid` • `@solar-icons/angular` • `@solar-icons/react-native` • `@solar-icons/nuxt` • `@solar-icons/static` • `@solar-icons/js` • `@solar-icons/cli`

> Install: `npx skills add saoudi-h/solar-icons --skill solar-icons` · CLI: `npx @solar-icons/cli --help`

## When to use

- Adding or migrating an icon library (Lucide, Phosphor, Tabler, Heroicons) and need a Solar replacement.
- Choosing or switching a style: `Bold` • `Linear` • `Outline` • `BoldDuotone` • `LineDuotone` • `Broken`.
- Wiring theming: `SolarProvider`, `useSolar`, `secondaryColor` / `secondaryOpacity`, `strokeWidth`, `color`, `size`, `--solar-*`.
- Debugging missing/duplicated icons, stale `dist/`, or kebab-case import errors.

## Quick decision — Solar vs others

| Need | Pick Solar when |
|---|---|
| 1 style, minimal bundle | Lucide is fine; Solar's Linear/Broken are close analogues — see `references/overview.md` |
| 6 weights + duotone as design tokens | **Solar** (6 styles, editable 1.5 px strokes, duotone accent) or Phosphor |
| 4k+ breadth | Tabler/Hugeicons — check coverage before switching; Solar covers 1 268 concepts |
| Brand logos | Solar does **not** ship logos — pair with Simple Icons |

## Packages at a glance (per-file, style in path — generic name)

| Package | Import (per-file, recommended) | Provider | Ref |
|---|---|---|---|
| `@solar-icons/react` | `import { HomeIcon } from "@solar-icons/react/bold/home"` | `<SolarProvider>` + `useSolar()` | `references/react.md` |
| `@solar-icons/vue` | `import { HomeIcon } from "@solar-icons/vue/bold/home"` | `app.use(SolarIconsPlugin)` | `references/vue.md` |
| `@solar-icons/svelte` | `import HomeIcon from "@solar-icons/svelte/bold/heart"` (default) | Svelte 5 runes | `references/svelte.md` |
| `@solar-icons/solid` | `import { HomeIcon } from "@solar-icons/solid/bold/home"` | `SolarProvider` (signal) | `references/solid.md` |
| `@solar-icons/angular` | `import { SolarHomeBold } from "@solar-icons/angular"` | `<solar-provider>` directive | `references/angular.md` |
| `@solar-icons/react-native` | `import { HomeIcon } from "@solar-icons/react-native/bold/home"` | `alt` → `accessibilityLabel` | `references/react-native.md` |
| `@solar-icons/nuxt` | `nuxt.config: modules: ["@solar-icons/nuxt"]` | `provider: true` default | `references/nuxt.md` |
| `@solar-icons/static` | `import url from "@solar-icons/static/bold/home.svg"` | none | `references/static.md` |
| `@solar-icons/js` | `import { createIcons } from "@solar-icons/js"` | 10-line helper | `references/js.md` |

Top-level alternative (style in name, single import): `import { HomeBoldIcon } from "@solar-icons/react"` — see `references/frameworks.md`. Rule: **kebab-case** (`bold/home`, `bold-duotone/arrow-up`). `Bold/Home` is stale (V2-13). If imports fail, `pnpm build`.

## Workflow — add icons to a project

1. **Detect framework** (`package.json`): `react` → `@solar-icons/react`, `vue` → `vue`, `svelte` → `svelte`, `solid-js` → `solid`, `@angular/core` → `angular`, `react-native` → `react-native`, `nuxt` → `nuxt`, none → `static`/`js`.
2. **Install** with the project's PM (`pnpm add @solar-icons/<pkg>`; respect `packageManager` field).
3. **Search** via CLI (offline, no API key):
   ```bash
   npx @solar-icons/cli search "shopping cart" --limit 20
   npx @solar-icons/cli search "arrow" --limit 10 --style linear --json
   npx @solar-icons/cli search "home" --framework react   # with import snippet
   ```
4. **Pick a style**: static page → per-file import; toggle/state → `dynamic` + `weight` prop.
5. **Get snippet / SVG**:
   ```bash
   npx @solar-icons/cli get home --style bold --framework react
   npx @solar-icons/cli get home --style linear --out ./src/icons/home.svg --json
   npx @solar-icons/cli info arrow-up --json   # all frameworks + styles + CDN
   ```
6. **Wire provider** if you need global tokens: `references/<framework>.md` for `--solar-*`. Never pass raw `style` overrides when provider tokens suffice.
7. **Verify**: `pnpm --filter @solar-icons/<pkg> run build && pnpm --filter @solar-icons/<pkg> run test` or check demo app.

## CLI — single source of truth

All catalog data comes from `@solar-icons/static` (not hardcoded):

```bash
npx @solar-icons/cli overview --json   # { icons:1379, categories:37, styles:6, variations:8274, packages:[...], figma, docs }
npx @solar-icons/cli list --category home --limit 20 --json
npx @solar-icons/cli categories --json
npx @solar-icons/cli styles --json
```

`--json` is machine-readable for agents and the future MCP server (`packages/mcp-server` will import `src/index.ts` from `@solar-icons/cli`).

## Core rules (don’t guess)

- **Never mix styles inside one component name.** `HomeBoldIcon` is Bold; for runtime switching use `dynamic`: `import { HeartIcon } from "@solar-icons/react/dynamic"` + `weight="linear"` prop.
- **Duotone needs both props:** `secondaryColor` + `secondaryOpacity` (default `0.5`). Only `BoldDuotone` / `LineDuotone` honor them.
- **Stroke width** only `Linear`, `Broken`, `LineDuotone` (default `1.5`).
- **`Scale` exists in two categories** (`arrows-action` + `devices`) — deduplicate barrel imports via `seen` Set when codegenning.
- **After renaming a style dir, rebuild** — `dist/` stale until `pnpm build`.
- **Angular host class:** static icons own `solar solar-{kebab}-{style}`; dynamic component does not set host class (see `references/angular.md`).
- **Static site rule:** sprite `<svg><use href="…#solar-home-bold">` + `alt` on `<img>`.

## Provider quick ref

```tsx
// React / Solid / Vue / Svelte — CSS variables on the wrapper
<SolarProvider color="currentColor" size={24} strokeWidth={1.5} secondaryColor="#888" secondaryOpacity={0.5}>
  <HomeIcon />  {/* from "@solar-icons/react/bold/home" */}
</SolarProvider>

// Dynamic switching
import { HeartIcon } from "@solar-icons/react/dynamic"
<HeartIcon name="home" weight="linear" />
```

For framework specifics, load the matching reference: `references/react.md`, `vue.md`, `svelte.md`, `solid.md`, `angular.md`, `react-native.md`, `nuxt.md`, `static.md`, `js.md`.

## Troubleshooting

- `Cannot find module '@solar-icons/react/Bold/Home'` → rename to `@solar-icons/react/bold/home` and `pnpm build`.
- Transparent 24×24 PNG → use SVG clean source (`@solar-icons/static`) + canvas snapshot (not canvas on CSS-var SVG alone).
- `svelte` or `ngc` errors after bump → see `references/svelte.md` / `angular.md` (TS6 vs TS7 split).
- Icon count drift → `npx @solar-icons/cli overview` vs `pnpm check:icon-inventory`; regenerate `assets/solar-icons-cheatsheet.json` if needed.

More: `references/troubleshooting.md`.

## Further reading

- `references/overview.md` — catalog, licenses, attribution, Figma plugin note
- `references/frameworks.md` — 9-package matrix + peer ranges
- `references/catalog.md` — categories, tags, search field semantics (and CLI as source)
- `references/<framework>.md` — install → import → provider → props → gotchas per framework
