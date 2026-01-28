# Build

## Production Build

```bash
vite build
```

```ts
defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'modules',              // ESM browsers
    minify: 'esbuild',              // or 'terser'
    cssMinify: true,
    sourcemap: false,               // true, 'inline', 'hidden'
    emptyOutDir: true,
    reportCompressedSize: true,     // false for faster builds

    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },
})
```

## Multi-Page App

```ts
defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: 'index.html',
        nested: 'nested/index.html',
      },
    },
  },
})
```

## Library Mode

```ts
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyLib',
      fileName: 'my-lib',          // → my-lib.es.js, my-lib.umd.js
      formats: ['es', 'umd'],
    },
    rolldownOptions: {
      external: ['vue', 'react'],  // Don't bundle
      output: {
        globals: {
          vue: 'Vue',
          react: 'React',
        },
      },
    },
  },
})
```

### package.json for Library

```json
{
  "name": "my-lib",
  "type": "module",
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    }
  },
  "files": ["dist"]
}
```

## SSR Build

```ts
defineConfig({
  build: {
    ssr: true,                      // or 'src/entry-server.ts'
    ssrEmitAssets: true,
  },
})
```

### SSR Entry

```ts
// src/entry-server.ts
import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'

export async function render(url: string) {
  const { app, router } = createApp()
  await router.push(url)
  await router.isReady()
  const html = await renderToString(app)
  return { html }
}
```

### Server Integration

```ts
import express from 'express'
import { createServer as createViteServer } from 'vite'

const app = express()

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'custom',
})

app.use(vite.middlewares)

app.use('*', async (req, res) => {
  // 1. Read index.html
  let template = fs.readFileSync('index.html', 'utf-8')

  // 2. Apply Vite transforms
  template = await vite.transformIndexHtml(req.url, template)

  // 3. Load SSR entry
  const { render } = await vite.ssrLoadModule('/src/entry-server.ts')

  // 4. Render
  const { html } = await render(req.url)

  // 5. Inject
  const page = template.replace('<!--ssr-outlet-->', html)
  res.send(page)
})
```

### SSR Externals

```ts
defineConfig({
  ssr: {
    external: ['lodash'],           // Don't bundle
    noExternal: ['@my/ui-lib'],     // Bundle despite node_modules
  },
})
```

## Backend Integration

For traditional backends (Rails, Laravel, etc.):

```ts
defineConfig({
  server: {
    cors: { origin: 'http://my-backend.example.com' },
  },
  build: {
    manifest: true,                 // Generate manifest.json
    rolldownOptions: {
      input: '/path/to/main.js',
    },
  },
})
```

Manifest output (`.vite/manifest.json`):

```json
{
  "views/foo.js": {
    "file": "assets/foo-abc123.js",
    "src": "views/foo.js",
    "isEntry": true,
    "imports": ["_shared-def456.js"],
    "css": ["assets/foo-789abc.css"]
  }
}
```

Use manifest to generate correct `<script>` and `<link>` tags in backend templates.

## Chunking Strategies

```ts
defineConfig({
  build: {
    rolldownOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['@ui/components'],
        },

        // Or function for dynamic chunking
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
})
```

## Asset Handling

```ts
defineConfig({
  build: {
    assetsInlineLimit: 4096,        // Inline < 4KB
    rolldownOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: 'entries/[name]-[hash].js',
      },
    },
  },
})
```

## Legacy Browser Support

```bash
npm i -D @vitejs/plugin-legacy
```

```ts
import legacy from '@vitejs/plugin-legacy'

defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```
