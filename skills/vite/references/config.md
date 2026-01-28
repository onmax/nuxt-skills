# Configuration & CLI

## Config File

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  // options
})
```

Conditional config:

```ts
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return { /* dev config */ }
  }
  return { /* build config */ }
})
```

Async config:

```ts
export default defineConfig(async ({ command }) => {
  const data = await fetchConfig()
  return { define: { CONFIG: data } }
})
```

## Common Options

```ts
defineConfig({
  root: './',                    // Project root
  base: '/',                     // Public base path
  publicDir: 'public',           // Static assets dir
  cacheDir: 'node_modules/.vite',

  // Dependency pre-bundling
  optimizeDeps: {
    include: ['lodash-es'],
    exclude: ['@my/package'],
    force: true,  // Re-bundle on restart
  },

  // Path resolution
  resolve: {
    alias: {
      '@': '/src',
      '~': '/src',
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx'],
    mainFields: ['module', 'jsnext:main', 'jsnext', 'main'],
  },

  // Module handling
  json: {
    stringify: true,  // Smaller bundles
  },

  // Log level
  logLevel: 'info',  // 'info', 'warn', 'error', 'silent'
})
```

## Server Options

```ts
defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    open: true,
    https: true,
    cors: true,

    // Proxy API requests
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/socket.io': {
        target: 'ws://localhost:8080',
        ws: true,
      },
    },

    // File system access
    fs: {
      strict: true,
      allow: ['..'],
      deny: ['.env', '.env.*'],
    },

    // Warmup frequently used files
    warmup: {
      clientFiles: ['./src/main.ts', './src/App.vue'],
      ssrFiles: ['./src/server/entry.ts'],
    },

    // File watching
    watch: {
      ignored: ['**/large-folder/**'],
    },
  },
})
```

## Build Options

```ts
defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2020',            // 'esnext', 'es2015', etc.
    minify: 'esbuild',           // 'esbuild', 'terser', false
    cssMinify: true,
    sourcemap: true,             // true, 'inline', 'hidden'
    emptyOutDir: true,

    // Chunking
    rolldownOptions: {
      input: {
        main: 'src/main.ts',
        admin: 'src/admin.ts',
      },
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
        },
      },
    },

    // Inline threshold
    assetsInlineLimit: 4096,

    // Module format
    modulePreload: { polyfill: true },
  },
})
```

## Preview Options

```ts
defineConfig({
  preview: {
    port: 4173,
    host: true,
    strictPort: true,
    open: true,
    proxy: { /* same as server.proxy */ },
  },
})
```

## Plugins

```ts
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    react(),
    // Conditional plugin
    process.env.ANALYZE && analyzePlugin(),
  ],
})
```

Official plugins:

- `@vitejs/plugin-vue` - Vue 3 SFC
- `@vitejs/plugin-vue-jsx` - Vue 3 JSX
- `@vitejs/plugin-react` - React Fast Refresh
- `@vitejs/plugin-legacy` - Legacy browser support

Community plugins: [awesome-vite](https://github.com/vitejs/awesome-vite)

## CLI Commands

```bash
vite                    # Dev server
vite build              # Production build
vite preview            # Preview production build
vite optimize           # Pre-bundle dependencies

# Options
--config <file>         # Config file path
--base <path>           # Public base path
--mode <mode>           # Set mode (development, production)
--port <port>           # Server port
--host                  # Expose to network
--open [path]           # Open browser
--force                 # Force dependency re-bundling
--cors                  # Enable CORS
--strictPort            # Exit if port taken
--debug [feat]          # Debug logs
--profile               # CPU profiling
```

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "build:analyze": "vite build --mode analyze"
  }
}
```
