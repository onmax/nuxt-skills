# Configuration & CLI

## Config File

Supported files (searched in order):

- `tsdown.config.ts` / `.mts` / `.cts`
- `tsdown.config.js` / `.mjs` / `.cjs`
- `tsdown.config.json`
- `tsdown` field in `package.json`

```ts
// tsdown.config.ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  dts: true,
  exports: true,
})
```

## Multiple Configurations

```ts
import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: 'src/node.ts',
    platform: 'node',
  },
  {
    entry: 'src/browser.ts',
    platform: 'browser',
  },
])
```

## Entry Points

```ts
// Single entry
defineConfig({
  entry: 'src/index.ts',
})

// Multiple entries
defineConfig({
  entry: ['src/entry1.ts', 'src/entry2.ts'],
})

// Entry aliases → dist/main.js, dist/utils.js
defineConfig({
  entry: {
    main: 'src/index.ts',
    utils: 'src/utils.ts',
  },
})

// Glob patterns
defineConfig({
  entry: 'src/**/*.ts',
})

// Mixed array and object entries
defineConfig({
  entry: [
    'src/index.ts',
    { cli: 'src/cli.ts' },
  ],
})
```

## CLI Commands

```bash
tsdown                          # Build
tsdown src/index.ts             # Specify entry
tsdown --watch                  # Watch mode
tsdown -w

tsdown --config ./path/to/config
tsdown --no-config              # Skip config file
```

## CLI Options

```bash
# Output
--format esm|cjs|iife|umd
--format esm --format cjs       # Multiple formats
-d ./build                      # Output dir
--out-dir ./build

# Declaration files
--dts

# Target
--target es2020
--target node20
--no-target                     # Preserve modern syntax

# Platform
--platform node|browser|neutral

# Optimization
--minify
--sourcemap
--treeshake
--no-treeshake

# Cleaning
--clean                         # Default: true
--no-clean

# External
--external lodash
--external "@my-scope/*"

# Watch
--watch [path]
--ignore-watch node_modules

# Env
--env.NODE_ENV=production
--env-file .env.production
--env-prefix APP_

# Post-build
--on-success "echo Done!"

# Copy assets
--copy public

# Package exports
--exports

# Validation
--publint
--attw
```

## CLI Flag Patterns

```bash
--foo              # foo: true
--no-foo           # foo: false
--foo.bar          # foo: { bar: true }
--format esm --format cjs  # format: ['esm', 'cjs']
```

## Config Loaders

```bash
tsdown --config-loader auto     # Default
tsdown --config-loader native   # Node.js TypeScript
tsdown --config-loader unrun    # More powerful
```

## Extend Vite/Vitest Config

Reuse `resolve` and `plugins`:

```bash
tsdown --from-vite              # Load vite.config.*
tsdown --from-vite vitest       # Load vitest.config.*
```

## Common Configurations

### Pure ESM Library

```ts
defineConfig({
  entry: 'src/index.ts',
  format: 'esm',
  dts: true,
  exports: true,
  target: 'es2020',
})
```

### Dual ESM/CJS

```ts
defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'cjs'],
  dts: true,
  exports: true,
})
```

### Node.js CLI

```ts
defineConfig({
  entry: 'src/cli.ts',
  format: 'esm',
  platform: 'node',
  dts: true,
  shims: true,  // __dirname, __filename in ESM
})
```

### Browser Library

```ts
defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'iife'],
  platform: 'browser',
  minify: true,
})
```
