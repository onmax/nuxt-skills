# Development

## Dev Server Features

- Native ESM serving (no bundling in dev)
- Instant HMR (Hot Module Replacement)
- TypeScript transpilation
- CSS HMR
- Vue/React/Svelte SFC support

## Dependency Pre-Bundling

Vite pre-bundles dependencies for:

- CommonJS to ESM conversion
- Many-module dependencies (lodash-es)
- Faster cold starts

```ts
defineConfig({
  optimizeDeps: {
    include: [
      'lodash-es',              // Pre-bundle specific deps
      'vue > @vue/runtime-dom', // Nested deps
    ],
    exclude: ['@my/local-pkg'], // Skip pre-bundling
    force: true,                // Re-bundle on restart
    esbuildOptions: {
      target: 'esnext',
    },
  },
})
```

Auto-discovery runs on server start. Use `--force` to re-bundle.

## File System Access

```ts
defineConfig({
  server: {
    fs: {
      strict: true,            // Only allow listed dirs
      allow: [
        '../shared',           // Allow parent directory
        searchForWorkspaceRoot(process.cwd()),  // Monorepo root
      ],
      deny: ['.env', '.env.*', '*.pem'],
    },
  },
})
```

## HMR Configuration

```ts
defineConfig({
  server: {
    hmr: {
      overlay: true,           // Error overlay
      port: 24678,             // WebSocket port
      protocol: 'ws',          // 'ws' or 'wss'
      host: 'localhost',
      clientPort: 443,         // For reverse proxy
    },
  },
})
```

Disable HMR:

```ts
defineConfig({
  server: {
    hmr: false,
  },
})
```

## HMR API Usage

```ts
// Basic accept
if (import.meta.hot) {
  import.meta.hot.accept()
}

// Accept with handler
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // Handle update
  })
}

// Preserve state
let count = import.meta.hot?.data?.count ?? 0

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    data.count = count
  })
  import.meta.hot.accept()
}

// Custom events (plugin communication)
if (import.meta.hot) {
  import.meta.hot.on('custom:event', (payload) => {
    console.log(payload)
  })
}
```

## Web Workers

```ts
// Constructor (recommended)
const worker = new Worker(
  new URL('./worker.ts', import.meta.url),
  { type: 'module' }
)

// Query suffix
import MyWorker from './worker?worker'
const worker = new MyWorker()

// Inline (bundled, no separate file)
import InlineWorker from './worker?worker&inline'
```

Worker file:

```ts
// worker.ts
self.onmessage = (e: MessageEvent) => {
  const result = heavyComputation(e.data)
  self.postMessage(result)
}
```

SharedWorker:

```ts
import SharedWorker from './shared?sharedworker'
const worker = new SharedWorker()
```

## Watch Mode

```ts
defineConfig({
  server: {
    watch: {
      usePolling: true,        // For network drives, containers
      interval: 100,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },
})
```

## HTTPS

```ts
import basicSsl from '@vitejs/plugin-basic-ssl'

defineConfig({
  plugins: [basicSsl()],
  server: {
    https: true,
  },
})
```

Custom certificates:

```ts
import fs from 'node:fs'

defineConfig({
  server: {
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem'),
    },
  },
})
```

## Network Access

```bash
vite --host                    # Expose to network
vite --host 0.0.0.0            # Specific interface
```

```ts
defineConfig({
  server: {
    host: true,                // Same as --host
    port: 3000,
    strictPort: true,          // Fail if port taken
  },
})
```

## Performance Tips

1. **Explicit file extensions** - Reduce resolve operations

   ```ts
   import './Component.tsx'  // Instead of './Component'
   ```

2. **Warm up frequently used files**

   ```ts
   server: {
     warmup: {
       clientFiles: ['./src/main.ts', './src/App.vue'],
     },
   }
   ```

3. **Avoid barrel files** - Direct imports are faster

   ```ts
   import { util } from './utils/util.ts'  // Not './utils'
   ```

4. **Limit watched files**

   ```ts
   server: {
     watch: {
       ignored: ['**/large-folder/**'],
     },
   }
   ```

5. **Disable unused features**
   ```ts
   css: { devSourcemap: false }
   ```

## Profiling

```bash
vite --debug                   # Debug logs
vite --debug plugin-transform  # Transform times
vite --profile                 # CPU profile
```

Use [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) for plugin debugging.
