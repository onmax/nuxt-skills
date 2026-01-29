# Package Exports

## Basic Single Entry

```json
{
  "name": "my-lib",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.mts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.mts",
  "sideEffects": false,
  "files": ["dist"]
}
```

## Multiple Entry Points

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.mts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./utils": {
      "types": "./dist/utils.d.mts",
      "import": "./dist/utils.mjs",
      "require": "./dist/utils.cjs"
    },
    "./*": "./dist/*"
  }
}
```

## Plugin Entry Pattern (unplugin-\*)

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.mts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./vite": {
      "types": "./dist/vite.d.mts",
      "import": "./dist/vite.mjs",
      "require": "./dist/vite.cjs"
    },
    "./webpack": {
      "types": "./dist/webpack.d.mts",
      "import": "./dist/webpack.mjs",
      "require": "./dist/webpack.cjs"
    },
    "./nuxt": {
      "types": "./dist/nuxt.d.mts",
      "import": "./dist/nuxt.mjs",
      "require": "./dist/nuxt.cjs"
    }
  }
}
```

## Environment-Aware Exports

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "node": {
        "import": { "production": "./dist/index.prod.mjs", "development": "./dist/index.mjs" },
        "require": { "production": "./dist/index.prod.cjs", "development": "./dist/index.cjs" }
      },
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

## typesVersions Fallback

For older TypeScript versions without exports support:

```json
{
  "typesVersions": {
    "*": {
      "*": ["./dist/*", "./*"]
    }
  }
}
```

## Field Reference

| Field         | Purpose                          |
| ------------- | -------------------------------- |
| `exports`     | Modern entry points (Node 12.7+) |
| `main`        | CJS fallback for older bundlers  |
| `module`      | ESM fallback for bundlers        |
| `types`       | TypeScript fallback              |
| `sideEffects` | `false` enables tree-shaking     |
| `files`       | What gets published to npm       |

## Condition Order

Order matters! Put most specific first:

```json
{
  ".": {
    "types": "...",      // Always first
    "import": "...",     // ESM
    "require": "..."     // CJS fallback
  }
}
```

## Peer Dependencies

External deps that consumers must provide:

```json
{
  "peerDependencies": {
    "vue": "^3.0.0"
  },
  "peerDependenciesMeta": {
    "vue": { "optional": true }
  }
}
```

## Package Validation

```bash
# Check exports are correct
pnpm dlx publint
pnpm dlx @arethetypeswrong/cli
```

Add to CI for continuous validation.
