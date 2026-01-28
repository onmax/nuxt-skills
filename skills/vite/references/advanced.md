# Advanced

## JavaScript API

```ts
import { createServer, build, preview, resolveConfig } from 'vite'

// Dev server
const server = await createServer({
  configFile: false,
  root: __dirname,
  server: { port: 3000 },
})
await server.listen()
server.printUrls()

// Build
await build({
  root: './project',
  build: { outDir: 'dist' },
})

// Preview
const previewServer = await preview({
  preview: { port: 4173, open: true },
})

// Resolve config
const config = await resolveConfig({}, 'serve', 'development')
```

### ViteDevServer API

```ts
interface ViteDevServer {
  config: ResolvedConfig
  middlewares: Connect.Server      // Express-compatible
  httpServer: http.Server | null
  watcher: FSWatcher               // Chokidar
  ws: WebSocketServer              // HMR WebSocket

  transformRequest(url: string): Promise<TransformResult | null>
  transformIndexHtml(url: string, html: string): Promise<string>
  ssrLoadModule(url: string): Promise<Record<string, any>>
  ssrFixStacktrace(e: Error): void

  listen(port?: number): Promise<ViteDevServer>
  restart(): Promise<void>
  close(): Promise<void>
}
```

### Utility Functions

```ts
import { mergeConfig, loadEnv, normalizePath, searchForWorkspaceRoot } from 'vite'

// Merge configs
const merged = mergeConfig(baseConfig, overrideConfig)

// Load .env files
const env = loadEnv('development', process.cwd(), 'VITE_')

// Normalize Windows paths
normalizePath('foo\\bar')  // 'foo/bar'

// Find workspace root
const root = searchForWorkspaceRoot(process.cwd())
```

## Plugin API

```ts
export default function myPlugin(): Plugin {
  return {
    name: 'my-plugin',

    // Vite hooks
    config(config, { command, mode }) {
      return { /* merge into config */ }
    },
    configResolved(config) {
      // Store resolved config
    },
    configureServer(server) {
      // Add middleware
      server.middlewares.use((req, res, next) => {
        next()
      })
    },
    transformIndexHtml(html) {
      return html.replace('<title>', '<title>Modified ')
    },
    handleHotUpdate({ file, server, modules }) {
      // Custom HMR
    },

    // Rolldown hooks
    buildStart() {},
    resolveId(id, importer) {},
    load(id) {},
    transform(code, id) {},
    buildEnd() {},
    closeBundle() {},
  }
}
```

### Virtual Modules

```ts
export default function virtualPlugin(): Plugin {
  const virtualId = 'virtual:my-module'
  const resolvedId = '\0' + virtualId

  return {
    name: 'virtual-module',
    resolveId(id) {
      if (id === virtualId) return resolvedId
    },
    load(id) {
      if (id === resolvedId) {
        return `export const data = ${JSON.stringify(buildTimeData)}`
      }
    },
  }
}
```

Usage:

```ts
import { data } from 'virtual:my-module'
```

### HTML Injection

```ts
export default function injectPlugin(): Plugin {
  return {
    name: 'inject-tags',
    transformIndexHtml() {
      return {
        tags: [
          {
            tag: 'script',
            attrs: { src: '/inject.js' },
            injectTo: 'body',  // 'head' | 'body' | 'head-prepend' | 'body-prepend'
          },
        ],
      }
    },
  }
}
```

### Client-Server Communication

```ts
// Plugin (server)
configureServer(server) {
  server.ws.on('my:event', (data, client) => {
    client.send('my:reply', { received: true })
  })
}

// Client
if (import.meta.hot) {
  import.meta.hot.send('my:event', { message: 'hello' })
  import.meta.hot.on('my:reply', (data) => {
    console.log(data)
  })
}
```

### Transform Filtering

```ts
{
  transform: {
    filter: { id: /\.vue$/ },
    handler(code, id) {
      return transformVue(code)
    },
  },
}
```

## Plugin Ordering

```ts
export default function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    enforce: 'pre',   // Run before core plugins
    // enforce: 'post' - Run after core plugins
    // No enforce - Run with user plugins
  }
}
```

## Conditional Plugins

```ts
export default function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    apply: 'serve',   // Only in dev
    // apply: 'build' - Only in production
    // apply: (config, { command }) => command === 'serve'
  }
}
```

## Performance Optimization

### Browser Setup

- Use dev-only browser profile
- Disable DevTools "Disable Cache"
- Disable browser extensions

### Plugin Performance

1. Lazy load heavy dependencies
2. Avoid long operations in `buildStart`, `config`, `configResolved`
3. Check file extension before processing in `transform`

### Build Performance

```ts
defineConfig({
  build: {
    reportCompressedSize: false,  // Skip gzip calculation
    sourcemap: false,
  },
})
```

### Debug

```bash
vite --debug plugin-transform    # Transform timing
vite --profile                   # CPU profile → speedscope
```

## Named Plugin Conventions

- `vite-plugin-*` - Vite-specific
- `rollup-plugin-*` - Rollup-compatible
- `vite-plugin-vue-*` - Vue-specific
- `vite-plugin-react-*` - React-specific

## Module Graph

Access module dependency graph:

```ts
configureServer(server) {
  server.moduleGraph.getModuleById(id)
  server.moduleGraph.getModulesByFile(file)
  server.moduleGraph.invalidateModule(mod)
}
```
