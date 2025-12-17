# TypeScript Configuration

## Library Base Config

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src",
    "types": ["node"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## Package.json Exports

```json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs"
    }
  },
  "main": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "sideEffects": false,
  "files": ["dist"]
}
```

## Key Options

| Option               | Value   | Why                               |
| -------------------- | ------- | --------------------------------- |
| target               | ESNext  | Modern output, bundlers downgrade |
| moduleResolution     | bundler | Works with modern bundlers        |
| strict               | true    | Catch errors early                |
| verbatimModuleSyntax | true    | Explicit type imports             |
| skipLibCheck         | true    | Faster builds                     |

## Nuxt App

Nuxt generates tsconfig. Extend it:

```json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true
  }
}
```

## Monorepo Config

Root:

```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "verbatimModuleSyntax": true
  }
}
```

Package:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "references": [{ "path": "../utils" }]
}
```
