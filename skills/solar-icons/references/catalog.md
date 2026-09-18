# Catalog — how to search

## Data files

- `packages/core/src/metadata-descriptions.json`: array of `{ name, category, categoryTags, tags }`. `name` is kebab (`home`, `arrow-up`, `chat-round-money`). `category` is Figma category (e.g., `messages`, `arrows`). `tags` are per-icon synonyms. `categoryTags` are the category's shared tags.
- `@solar-icons/static` dist: `dist/metadata-descriptions.json` and `dist/icons/{style}/{kebab}.svg` — same data as source, published. CLI uses this as source of truth (`npx @solar-icons/cli overview`).

## CLI — source of truth (no hardcoded counts)

```bash
npx @solar-icons/cli overview --json          # { icons:1379, categories:37, styles:6, variations:8274, packages, figma, docs }
npx @solar-icons/cli search "shopping cart" --limit 20 --json
npx @solar-icons/cli search "arrow" --category arrows --json
npx @solar-icons/cli get home --style bold --framework react --json
npx @solar-icons/cli info arrow-up --json
npx @solar-icons/cli list --category home --limit 20 --json
```

For agents/MCP, always use `--json`. Text mode is for humans (`search` prints `name — category — tags`, `get` prints import snippet + `CDN:`).

## Search tips

- Prefer exact `name` match, then `tags` substring, then `categoryTags`.
- For compound names, strip trailing separators (`toCamelCase` strips `^-_`/ `_- $`).
- `Scale` exists twice (`arrows-action` + `devices`) — deduplicate by `pascalName` when generating barrels.
- V2 renames (31): see `/docs/v2/migration-to-v2/icon-renames` (plain→plane, etc.).

## Generated asset (not hand-edited, optional)

`assets/solar-icons-cheatsheet.json`: slim array `[{ name, pascal, category, tags }]` for LLM context. Generated from core metadata via `npx @solar-icons/cli overview --json` or `tsx scripts/generate-skill-index.ts`. Gitignored until explicitly committed on catalog bumps — the CLI is the preferred runtime source.
