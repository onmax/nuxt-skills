# Troubleshooting

## `Cannot find module '@solar-icons/react/Bold/Home'`

Renamed in V2-13 to kebab-case. Use `@solar-icons/react/bold/home`. Then `pnpm build`.

## Transparent 24×24 PNG on download/copy

Canvas can't resolve CSS vars on a `currentColor` SVG. Use SVG clean source from `@solar-icons/static` (or `https://cdn.jsdelivr.net/npm/@solar-icons/static@2.1.0/dist/svgs/bold/home.svg`) for sharing, and take a PNG snapshot only after inlining computed styles.

## `dist/` stale after `git pull`

```bash
pnpm build
# or per package:
pnpm --filter @solar-icons/react run build
```

## `all-icons.types.ts` is one line

Expected — codegen joins names with ` | ` on one line. Don't reformat.

## `fixture.nativeElement` in Angular tests

Wrapper div, not host SVG. Use `fixture.nativeElement.querySelector('svg[solarArrowUp]')`. Read `class` via `getAttribute('class')?.split(/\s+/)`, not `classList` (jsdom gives `SVGAnimatedString`).

## Angular `useSolar()` race

Child in `<solar-provider>` calling `useSolar().setColor()` in constructor is overridden by provider effect. Initialize in `ngOnInit` or handlers.

## Nuxt `provider: false` ignores styling options

Expected — when `provider: false`, you must provide `createSolarIcons` plugin or `<SolarProvider>` yourself. Otherwise `color/size/strokeWidth` are warned and ignored.

## Provider doesn't affect icons

Wrap the icons *inside* `<SolarProvider>`; it sets `--solar-*` on its wrapper. For Vue/Nuxt, vars live on `document.body` client-side.

## RN `npm test` says `ERR_PNPM_NO_SCRIPT`

Use `npx vitest run` inside `packages/react-native` (`vitest.config.ts` picks up `tests/`).

## TypeScript 7 vs 6 split

Most packages use TS 7 native `tsc`; `vue`/`svelte`/`nuxt`/`angular` stay on TS 6 for `vue-tsc`/`svelte2tsx`/`ngc`. Normal.
