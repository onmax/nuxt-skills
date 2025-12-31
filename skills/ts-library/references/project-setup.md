# Project Setup

## Single Package

```bash
# Clone starter template
cp -r ~/templates/antfu/starter-ts my-lib
cd my-lib && rm -rf .git && git init
pnpm install
```

Or manual setup:

```bash
mkdir my-lib && cd my-lib
pnpm init
pnpm add -D typescript tsdown vitest eslint @antfu/eslint-config
```

### Directory Structure

```
my-lib/
├── src/
│   ├── index.ts      # Main entry
│   └── types.ts      # Type definitions
├── test/
│   └── index.test.ts
├── dist/             # Build output (gitignored)
├── package.json
├── tsconfig.json
├── tsdown.config.ts
├── eslint.config.ts
└── vitest.config.ts
```

## Monorepo

```bash
cp -r ~/templates/antfu/starter-monorepo my-monorepo
cd my-monorepo && rm -rf .git && git init
pnpm install
```

### Structure

```
my-monorepo/
├── packages/
│   ├── core/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsdown.config.ts
│   └── cli/
│       ├── src/
│       └── package.json
├── playground/          # Integration tests
├── pnpm-workspace.yaml
├── package.json         # Root scripts, devDeps
├── tsconfig.json        # Base config
└── eslint.config.ts
```

### pnpm-workspace.yaml

```yaml
packages:
  - packages/*
  - playground

catalogs:
  build:
    tsdown: ^0.15.0
    unbuild: ^3.0.0
  lint:
    eslint: ^9.0.0
    '@antfu/eslint-config': ^4.0.0
  test:
    vitest: ^3.0.0
  types:
    typescript: ^5.7.0
```

## pnpm Catalogs

Organize dependencies by purpose (from antfu's blog post):

| Category | Contents                           |
| -------- | ---------------------------------- |
| build    | tsdown, unbuild, rollup plugins    |
| lint     | eslint, @antfu/eslint-config       |
| test     | vitest, @vue/test-utils            |
| types    | typescript, @types/\*              |
| prod     | Runtime deps: consola, defu, pathe |

### Using Catalogs

```json
{
  "devDependencies": {
    "tsdown": "catalog:build",
    "eslint": "catalog:lint",
    "vitest": "catalog:test",
    "typescript": "catalog:types"
  }
}
```

## ESLint Setup

```bash
pnpm add -D eslint @antfu/eslint-config
```

```typescript
// eslint.config.ts
import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  pnpm: true,
  formatters: true,
})
```

## Git Hooks

```bash
pnpm add -D simple-git-hooks lint-staged
```

```json
{
  "simple-git-hooks": { "pre-commit": "pnpm lint-staged" },
  "lint-staged": { "*": "eslint --fix" },
  "scripts": { "prepare": "simple-git-hooks" }
}
```

Run `pnpm prepare` after adding.

## Scripts

```json
{
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "release": "bumpp",
    "prepublishOnly": "pnpm build"
  }
}
```
