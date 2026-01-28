# Features

## Native ESM Imports

Vite serves source files directly via native ES modules in dev.

```ts
// Bare imports resolved from node_modules
import _ from 'lodash'

// Relative imports
import { util } from './utils'

// Absolute paths from project root
import App from '/src/App.vue'
```

## TypeScript Support

Native TypeScript support - no config needed.

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    target: 'esnext',
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
```

Type checking is transpile-only. Run `vue-tsc` or `tsc --noEmit` separately.

## CSS

### CSS Modules

```css
/* styles.module.css */
.red { color: red; }
```

```ts
import classes from './styles.module.css'
console.log(classes.red)
```

### Preprocessors

Install the preprocessor:

```bash
npm i -D sass less stylus
```

```vue
<style lang="scss">
$color: red;
.btn { color: $color; }
</style>
```

### PostCSS

Create `postcss.config.js`:

```js
export default {
  plugins: {
    autoprefixer: {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
  },
}
```

### Lightning CSS

```ts
defineConfig({
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: { chrome: 80 },
    },
  },
})
```

## Static Assets

```ts
// URL (dev: raw path, build: hashed)
import imgUrl from './img.png'
img.src = imgUrl

// Raw content
import text from './file.txt?raw'

// As URL (for workers)
import workerUrl from './worker.js?url'

// Inline as base64
import dataUrl from './small.png?inline'
```

### public Directory

Files in `public/` served at root, not processed.

```html
<img src="/logo.png" />
```

## JSON

```ts
// Full import
import pkg from './package.json'

// Named imports (tree-shaken)
import { version } from './package.json'
```

## Glob Import

```ts
// Eager load all
const modules = import.meta.glob('./modules/*.ts', { eager: true })

// Lazy load (dynamic import)
const modules = import.meta.glob('./modules/*.ts')
for (const path in modules) {
  const mod = await modules[path]()
}

// With options
const modules = import.meta.glob('./modules/*.ts', {
  import: 'default',           // Named export
  query: { raw: true },        // Query params
  exhaustive: true,            // Include node_modules
})

// Negative patterns
const modules = import.meta.glob(['./dir/*.ts', '!**/ignored.ts'])

// As strings
const modules = import.meta.glob('./modules/*.ts', {
  query: '?raw',
  import: 'default',
})
```

## Environment Variables

### .env Files

```ini
# .env
VITE_APP_TITLE=My App
VITE_API_URL=http://api.example.com
```

Load order: `.env` < `.env.local` < `.env.[mode]` < `.env.[mode].local`

### Usage

```ts
console.log(import.meta.env.VITE_APP_TITLE)
console.log(import.meta.env.MODE)       // 'development' | 'production'
console.log(import.meta.env.DEV)        // boolean
console.log(import.meta.env.PROD)       // boolean
console.log(import.meta.env.SSR)        // boolean
console.log(import.meta.env.BASE_URL)   // base path
```

### TypeScript Types

```ts
// env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### Define at Build Time

```ts
defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
})
```

## HMR API

```ts
if (import.meta.hot) {
  // Accept self
  import.meta.hot.accept()

  // Accept deps
  import.meta.hot.accept('./module.js', (newModule) => {
    console.log('module updated', newModule)
  })

  // Dispose handler
  import.meta.hot.dispose((data) => {
    cleanup()
  })

  // Preserve data across updates
  import.meta.hot.data.count = count

  // Custom events
  import.meta.hot.on('my-event', (data) => {})
  import.meta.hot.send('my-event', data)

  // Invalidate and trigger re-import
  import.meta.hot.invalidate()

  // Decline HMR (full reload)
  import.meta.hot.decline()
}
```

## Web Workers

```ts
// Constructor pattern
const worker = new Worker(new URL('./worker.ts', import.meta.url))

// Import suffix
import MyWorker from './worker?worker'
const worker = new MyWorker()

// Inline (no file)
import InlineWorker from './worker?worker&inline'

// Shared worker
import SharedWorker from './worker?sharedworker'
```

```ts
// worker.ts
self.onmessage = (e) => {
  self.postMessage(e.data * 2)
}
```
