# Output Options

## Format

Default: `esm`

```ts
defineConfig({
  format: 'esm',                 // ECMAScript Modules
  format: 'cjs',                 // CommonJS
  format: 'iife',                // Browser script
  format: 'umd',                 // Universal
  format: ['esm', 'cjs'],        // Multiple
})
```

Format-specific config:

```ts
defineConfig({
  format: {
    esm: { target: ['es2015'] },
    cjs: { target: ['node20'] },
  },
})
```

## Output Directory

```ts
defineConfig({
  outDir: 'dist',  // Default
})
```

```bash
tsdown -d ./build
tsdown --out-dir ./build
```

## Target

Syntax downleveling (no polyfills):

```ts
defineConfig({
  target: 'es2020',
  target: 'node20',
  target: ['chrome100', 'firefox90'],
})
```

Default: reads from `engines.node` in package.json.

Disable transformations:

```ts
defineConfig({
  target: false,  // Preserve modern syntax
})
```

## Platform

```ts
defineConfig({
  platform: 'node',     // Default, Node.js built-ins external
  platform: 'browser',  // Web browsers
  platform: 'neutral',  // Platform-agnostic
})
```

Module resolution:

- **node**: `mainFields: ['main', 'module']`
- **browser**: `mainFields: ['browser', 'module', 'main']`
- **neutral**: relies on `exports` field only

## Declaration Files (.d.ts)

```ts
defineConfig({
  dts: true,  // Enable
})
```

Auto-enabled if `types` or `typings` in package.json.

### Performance with isolatedDeclarations

For fastest `.d.ts` generation:

```json
// tsconfig.json
{
  "compilerOptions": {
    "isolatedDeclarations": true
  }
}
```

Uses oxc-transform instead of slower TypeScript.

### Declaration Maps

```ts
defineConfig({
  dts: {
    sourcemap: true,  // .d.ts.map files
  },
})
```

Or via tsconfig.json:

```json
{
  "compilerOptions": {
    "declarationMap": true
  }
}
```

### Vue Support

```ts
defineConfig({
  dts: { vue: true },  // Requires vue-tsc
})
```

## Dependencies

### Default Behavior

| Type               | Bundled?          |
| ------------------ | ----------------- |
| `dependencies`     | No (external)     |
| `peerDependencies` | No (external)     |
| `devDependencies`  | Yes (if imported) |
| Phantom deps       | Yes (if imported) |

### Skip All node_modules

```ts
defineConfig({
  skipNodeModulesBundle: true,
})
```

### Inline-Only Mode

Warn if dependencies are bundled (useful for libraries):

```ts
defineConfig({
  inlineOnly: true,  // Shows warnings for bundled deps
})
```

### Custom External

```ts
defineConfig({
  external: ['lodash', /^@my-scope\//],
})
```

### Force Bundle

```ts
defineConfig({
  noExternal: ['some-package'],  // Bundle despite being in deps
})
```

## Package Exports

Auto-generate `exports`, `main`, `module`, `types`:

```ts
defineConfig({
  exports: true,
})
```

### Export All Files

```ts
defineConfig({
  exports: {
    all: true,  // Not just entry files
  },
})
```

### Legacy Support

Control `main` and `module` field generation:

```ts
defineConfig({
  exports: {
    legacy: true,  // Default, generates main/module fields
    legacy: false, // Pure ESM, omits main/module if only ESM format
  },
})
```

Auto-fills `types` field only when `legacy: true`.

### Dev Exports

Point to source during development:

```ts
defineConfig({
  exports: {
    devExports: true,
  },
})
```

`exports` → source, `publishConfig.exports` → built.

### CSS Exports

```ts
defineConfig({
  css: {
    splitting: false,
    fileName: 'my-library.css',
  },
  exports: true,
})
```

### Custom Exports

```ts
defineConfig({
  exports: {
    customExports(pkg, context) {
      pkg['./foo'] = './foo.js'
      return pkg
    },
  },
})
```

## Cleaning

Output directory cleaned by default:

```ts
defineConfig({
  clean: true,   // Default
  clean: false,  // Keep existing
})
```

## Example package.json

```json
{
  "name": "my-lib",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    }
  },
  "files": ["dist"]
}
```
