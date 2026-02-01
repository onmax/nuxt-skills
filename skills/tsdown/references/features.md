# Features

## Tree Shaking

Enabled by default - removes unused code.

```ts
defineConfig({
  treeshake: true,   // Default
  treeshake: false,  // Disable
})
```

## Minification

```ts
defineConfig({
  minify: true,
})
```

Uses Oxc (fast, currently alpha).

## Source Maps

```ts
defineConfig({
  sourcemap: true,
})
```

Auto-enabled if `declarationMap: true` in tsconfig.json.

## Shims

### CJS in ESM

`__dirname` and `__filename` not available in ESM:

```ts
defineConfig({
  shims: true,  // Provides __dirname, __filename
})
```

### require in ESM

Auto-injected when `platform: 'node'`:

```js
// Generated:
const require = createRequire(import.meta.url)
```

### ESM in CJS

Always enabled - `import.meta.url`, `import.meta.dirname`, `import.meta.filename` work in CJS.

### CJS Default Export

When CJS output has only default export:

```ts
// Source
export default function greet() {}

// CJS Output
module.exports = greet

// Declaration
declare function greet(): void
export = greet
```

## Unbundle Mode

Transpile-only - preserves file structure:

```ts
defineConfig({
  entry: ['src/index.ts'],
  unbundle: true,
})
```

Input:

```
src/
  index.ts
  mod.ts
```

Output:

```
dist/
  index.js
  mod.js
```

## Watch Mode

```ts
defineConfig({
  watch: true,
  // Or specific paths
  watch: ['./src', './lib'],
})
```

```bash
tsdown --watch
tsdown --watch ./src
tsdown --ignore-watch node_modules
```

### Post-Build Command

```bash
tsdown --watch --on-success "node dist/index.mjs"
```

## Copy Assets

```bash
tsdown --copy public
```

## Environment Variables

```bash
tsdown --env.NODE_ENV=production
tsdown --env-file .env.production
tsdown --env-prefix APP_
```

## Node Protocol

Control Node.js built-in imports:

```ts
defineConfig({
  nodeProtocol: true,     // fs → node:fs
  nodeProtocol: 'strip',  // node:fs → fs
  nodeProtocol: false,    // Keep as-is (default)
})
```

## CSS

```ts
defineConfig({
  css: {
    splitting: false,      // Single CSS file
    fileName: 'styles.css',
  },
})
```

CSS targeting (requires `unplugin-lightningcss`):

```bash
pnpm add -D unplugin-lightningcss
```

## JSX

Built-in support via Rolldown:

```ts
defineConfig({
  inputOptions: {
    transform: {
      jsx: 'react',  // Classic transform
    },
  },
})
```

## Framework Support

### React

```ts
// tsdown.config.ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  platform: 'neutral',
  dts: true,
})
```

React Compiler:

```bash
pnpm add -D @rollup/plugin-babel babel-plugin-react-compiler
```

```ts
import pluginBabel from '@rollup/plugin-babel'

defineConfig({
  plugins: [
    pluginBabel({
      babelHelpers: 'bundled',
      parserOpts: {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      },
      plugins: ['babel-plugin-react-compiler'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
  ],
})
```

### Vue

```bash
pnpm add -D unplugin-vue vue-tsc
```

```ts
import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: ['./src/index.ts'],
  platform: 'neutral',
  plugins: [Vue({ isProduction: true })],
  dts: { vue: true },
})
```

### WebAssembly

```bash
pnpm add -D rolldown-plugin-wasm
```

```ts
import { defineConfig } from 'tsdown'
import wasm from 'rolldown-plugin-wasm'

export default defineConfig({
  plugins: [
    wasm({
      maxFileSize: 14000,  // Inline if < 14KB
      targetEnv: 'auto',   // 'auto' | 'node' | 'browser'
    }),
  ],
})
```

Import methods:

```ts
import { add } from './add.wasm'              // Direct
import init from './module.wasm?init'         // Async
import initSync from './module.wasm?init&sync' // Sync
```

Supports wasm-bindgen for `bundler` and `web` targets.

## Quick Start Templates

```bash
npx create-tsdown@latest -t vue
npx create-tsdown@latest -t react
npx create-tsdown@latest -t react-compiler
```
