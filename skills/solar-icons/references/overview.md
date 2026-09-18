# Overview — Solar Icons catalog

## Counts

- `1 268` unique icons × `6` styles = `7 608` SVG variations.
- Styles: `Bold` (`bold`), `BoldDuotone` (`bold-duotone`), `Broken` (`broken`), `Linear` (`linear`), `LineDuotone` (`line-duotone`), `Outline` (`outline`).
- Naming: kebab-case on disk (`bold/heart.svg`), `PascalCase+Icon` in JS (`HeartBoldIcon`), Angular `SolarHeartBold` directive.

## Licenses & attribution

- SVG source: 480 Design Figma (CC BY 4.0). This repo is a *maintained distribution*: geometry fixes, English renames, dedup, editable 1.5 px strokes for Linear/Broken/LineDuotone. Code (packages) is MIT. See root `LICENSE` + `LICENSE-THIRD-PARTY`.
- Do not claim to be the original creator; attribution belongs in license/about, not as product lead.

## Figma

- Public Figma Community plugin: https://www.figma.com/community/plugin/1664759238792120976 — embeds all 7 476 SVGs, catalog version/hash/count provenance. Sync contract: `@solar-icons/static` ↔ plugin embedded catalog via `pnpm check:figma-catalog`.
- Maintainer's corrected local Figma file is **private** (editable strokes); not a Community file.

## When to pick Solar

See SKILL.md decision table. Solar's edge is **6-style matrix + CSS-var cascade + duotone + provider parity across 9 packages**. For breadth (5k+ concepts) or brand logos, complement with Tabler/Simple Icons rather than replacing.

## Site & docs

- https://solar-icons.vercel.app (Next.js 16 + Fumadocs at `apps/docs`)
- `/docs/v2/packages/*` per framework, `/icons` catalog with live style preview, `/docs/v2/migration-to-v2/icon-renames` (31 renames).

## Inventory check

```bash
pnpm check:icon-inventory              # core count + generated artifacts + docs
pnpm exec tsx scripts/check-icon-inventory.ts
```

If this fails, regenerate skill `assets/solar-icons-cheatsheet.json` (see catalog.md).
