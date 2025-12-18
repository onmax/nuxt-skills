# pnpm Catalogs

Categorize dependencies for clean organization (antfu pattern).

## Setup

```yaml
# pnpm-workspace.yaml
packages:
  - packages/*

catalogs:
  default: {}
```

## Common Categories

| Category | Contents                                  |
| -------- | ----------------------------------------- |
| build    | unbuild, tsdown, rollup plugins           |
| lint     | eslint, @antfu/eslint-config, lint-staged |
| test     | vitest, @vue/test-utils, playwright       |
| types    | typescript, @types/\*                     |
| frontend | vue, nuxt, @nuxt/\*, reka-ui              |
| prod     | Runtime: consola, defu, pathe             |
| release  | bumpp, changelogen                        |

## Root package.json

```json
{
  "catalogs": {
    "build": { "unbuild": "^3.0.0" },
    "lint": { "eslint": "^9.0.0", "@antfu/eslint-config": "^4.0.0" },
    "test": { "vitest": "^3.0.0" },
    "types": { "typescript": "^5.7.0" }
  }
}
```

## Using Catalogs

```json
{
  "devDependencies": {
    "eslint": "catalog:lint",
    "vitest": "catalog:test",
    "typescript": "catalog:types"
  }
}
```

## Single Package with Catalogs

Even single packages benefit from catalogs:

```yaml
# pnpm-workspace.yaml
packages: []
catalogs:
  default: {}
```

Same package.json pattern applies. Keeps versions organized by purpose.

## Tips

- Use `catalog:default` for uncategorized deps
- Root package.json defines all versions once
- `pnpm why <pkg>` to debug version issues
