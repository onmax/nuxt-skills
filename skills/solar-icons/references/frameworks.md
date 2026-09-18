# Framework matrix — Solar Icons

| Package | Framework | Import example | Component name | Provider | Peer | Ref |
|---|---|---|---|---|---|---|
| `@solar-icons/react` | React ≥16.8 (19 tested) | `import { HomeBoldIcon } from "@solar-icons/react/bold/home"` | `HomeBoldIcon` (`Icon` suffix) | `<SolarProvider>` + `useSolar()` | `react`/`react-dom` | `react.md` |
| `@solar-icons/vue` | Vue 3+ | `import { HomeBoldIcon } from "@solar-icons/vue/bold/home"` | `HomeBoldIcon` | `app.use(SolarIconsPlugin)` writes `--solar-*` on `document.body` | `vue` | `vue.md` |
| `@solar-icons/svelte` | Svelte 5 (runes) | `import HomeBoldIcon from "@solar-icons/svelte/bold/home.svelte"` (or barrel) | `HomeBoldIcon.svelte` | `$bindable` provider | `svelte >=5.0.0` | `svelte.md` |
| `@solar-icons/solid` | SolidJS 1.6+ | `import { HomeBoldIcon } from "@solar-icons/solid/bold/home"` | `HomeBoldIcon` | `SolarProvider` (signal) | `solid-js` | `solid.md` |
| `@solar-icons/angular` | Angular 17–22 | `import { SolarHomeBold } from "@solar-icons/angular"` | `SolarHomeBold` (no Icon suffix, `Solar` prefix) | `<solar-provider>` | `@angular/core` 17.x–22.x | `angular.md` |
| `@solar-icons/react-native` | RN 0.72+ | `import { HomeBoldIcon }` | `HomeBoldIcon` + `alt` | `SolarProvider` (accessible) | `react-native` + `react-native-svg` | `react-native.md` |
| `@solar-icons/nuxt` | Nuxt 3+ | `nuxt.config: modules: ["@solar-icons/nuxt"]` | auto-import `SolarHomeBoldIcon` | module injects `SolarState` + `--solar-*` on `document.body` | `nuxt` + `vue` | `nuxt.md` |
| `@solar-icons/static` | any / no framework | `import url from "@solar-icons/static/bold/home.svg"` + sprite | N/A (files) | none | none | `static.md` |
| `@solar-icons/js` | vanilla JS | `import { createIcons, icons }` | N/A (DOM) | 10-line CSS-var helper | none | `js.md` |

Also: `@solar-icons/core` (private, source of truth), `@solar-icons/codemod` (V2 migration, conservative AST).

## Common provider tokens (web)

`--solar-color` (default `currentColor`), `--solar-size` (`24`), `--solar-stroke-width` (`1.5`), `--solar-secondary-color`, `--solar-secondary-opacity`. Set on `SolarProvider` wrapper (or `document.body` for Vue/Nuxt) and consumed via CSS inheritance — no re-renders.

## Dynamic vs static

- **Static (default):** one style per import, tree-shakable. CSS class `solar solar-{kebab}-{style}`.
- **Dynamic:** `import { DynamicIcon } from "@solar-icons/<pkg>/dynamic"` with `weight` prop (`"bold" | "linear" | ...`). Dynamic container class is `solar solar-{kebab}` (no style suffix) — style varies at runtime.

## Import casing

Always kebab-case: `@solar-icons/react/bold/heart`, not `Bold/Heart`. After a rename, `pnpm build` (dist is stale).
