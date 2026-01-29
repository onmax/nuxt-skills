# Build Tooling

## Tool Selection

| Tool                | Use case                                     |
| ------------------- | -------------------------------------------- |
| **tsdown**          | Most libraries - fast, simple, modern        |
| **unbuild**         | Complex builds, Nuxt modules, auto-externals |
| **rollup/rolldown** | Large projects needing fine control          |

## tsdown (Recommended)

```bash
pnpm add -D tsdown
```

### Basic Config

```typescript
// tsdown.config.ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
})
```

### Multiple Entries

```typescript
export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts', 'src/utils.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  external: ['vue', 'vite'],
})
```

### Plugin Pattern (unplugin-\*)

```typescript
export default defineConfig({
  entry: ['src/*.ts'],          // Glob all entries
  format: ['esm', 'cjs'],
  dts: true,
  exports: true,                // Auto-generate package.json exports
  attw: { profile: 'esm-only' }, // Type checking profile
})
```

### Advanced Options

```typescript
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    resolve: ['@antfu/utils'],  // Inline specific deps in declarations
  },
  external: ['vue'],
  define: {
    __DEV__: 'false',
  },
  hooks: {
    'build:done': async () => {
      // Post-build tasks
    },
  },
})
```

## unbuild

```bash
pnpm add -D unbuild
```

### Basic Config

```typescript
// build.config.ts
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
```

### With Externals

```typescript
export default defineBuildConfig({
  entries: ['src/index', 'src/cli'],
  declaration: true,
  externals: ['vue', 'vite'],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
    dts: { respectExternal: true },
  },
})
```

## Output Formats

### ESM Only (modern)

```typescript
export default defineConfig({
  format: ['esm'],
})
```

### Dual CJS/ESM (recommended)

```typescript
export default defineConfig({
  format: ['esm', 'cjs'],
})
```

### With IIFE for CDN

```typescript
export default defineConfig([
  { format: ['esm', 'cjs'], dts: true },
  { format: 'iife', globalName: 'MyLib', minify: true },
])
```

## Define Flags

Common compile-time flags:

```typescript
export default defineConfig({
  define: {
    __DEV__: `(process.env.NODE_ENV !== 'production')`,
    __TEST__: 'false',
    __BROWSER__: 'true',
    __VERSION__: JSON.stringify(pkg.version),
  },
})
```

## Build Scripts

```json
{
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch",
    "prepublishOnly": "pnpm build"
  }
}
```

## Troubleshooting

### CJS default export issues

Some bundlers need explicit default:

```typescript
export default defineConfig({
  hooks: {
    'build:done': async () => {
      // Patch CJS files if needed
    },
  },
})
```

### Missing types in output

Ensure `dts: true` and check `isolatedDeclarations` in tsconfig.

### External not working

Check package is in `peerDependencies` and listed in `external`.
