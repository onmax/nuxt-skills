# API Design Patterns

## Options Pattern

User-facing options with internal resolved version:

```typescript
export interface Options {
  verbose?: boolean
  include?: string[]
  exclude?: string[]
}

export interface ResolvedOptions extends Required<Options> {
  root: string
}

function resolveOptions(options: Options = {}): ResolvedOptions {
  return {
    verbose: options.verbose ?? false,
    include: options.include ?? ['**/*'],
    exclude: options.exclude ?? ['node_modules'],
    root: process.cwd(),
  }
}
```

## Factory Functions

Create configured instances:

```typescript
export function createContext(options: Options = {}) {
  const resolved = resolveOptions(options)
  const filter = createFilter(resolved.include, resolved.exclude)

  return {
    options: resolved,
    filter,
    transform(code: string, id: string) { /* ... */ },
    async scanDirs() { /* ... */ },
  }
}

// Usage
const ctx = createContext({ verbose: true })
await ctx.scanDirs()
```

## Builder Pattern

Chainable API with type accumulation:

```typescript
export function createBuilder<TContext = unknown>() {
  return {
    context<T>(): Builder<T, unknown, unknown> {
      return this as any
    },
    input<T>(schema: T): Builder<TContext, T, unknown> {
      return this as any
    },
    output<T>(schema: T): Builder<TContext, unknown, T> {
      return this as any
    },
    build(): Procedure<TContext> { /* ... */ },
  }
}

// Usage - types flow through chain
const procedure = createBuilder()
  .context<{ user: User }>()
  .input(z.object({ id: z.string() }))
  .build()
```

## Plugin Pattern (unplugin)

Universal plugin from single implementation:

```typescript
import { createUnplugin } from 'unplugin'

export default createUnplugin<Options>((options) => {
  const ctx = createContext(options)

  return {
    name: 'my-plugin',
    enforce: 'pre',

    transformInclude(id) {
      return ctx.filter(id)
    },

    transform(code, id) {
      return ctx.transform(code, id)
    },

    // Bundler-specific hooks
    vite: {
      configResolved(config) { /* Vite-specific */ },
    },
    webpack(compiler) {
      compiler.hooks.watchRun.tap('my-plugin', () => { /* ... */ })
    },
  }
})
```

Export per-bundler entries:

```typescript
// src/vite.ts
import unplugin from '.'
export default unplugin.vite

// src/webpack.ts
import unplugin from '.'
export default unplugin.webpack
```

## Lazy Getters (Tree-shaking)

Defer bundler-specific code until accessed:

```typescript
export function createPlugin<T>(factory: PluginFactory<T>) {
  return {
    get vite() { return getVitePlugin(factory) },
    get webpack() { return getWebpackPlugin(factory) },
    get rollup() { return getRollupPlugin(factory) },
  }
}
```

Only the accessed getter runs, rest is tree-shaken.

## Smart Defaults

Detect environment instead of requiring config:

```typescript
import { isPackageExists } from 'local-pkg'

function resolveOptions(options: Options) {
  return {
    vue: options.vue ?? isPackageExists('vue'),
    react: options.react ?? isPackageExists('react'),
    typescript: options.typescript ?? isPackageExists('typescript'),
  }
}
```

## Resolver Pattern

Flexible resolution with function or object:

```typescript
export type Resolver = ResolverFunction | ResolverObject

export type ResolverFunction = (name: string) => ResolveResult | undefined
export interface ResolverObject {
  type: 'component' | 'directive'
  resolve: ResolverFunction
}

export function ElementPlusResolver(): Resolver[] {
  return [
    { type: 'component', resolve: (name) => resolveComponent(name) },
    { type: 'directive', resolve: (name) => resolveDirective(name) },
  ]
}
```

## Fluent API (Validation)

Method chaining with clone for immutability:

```typescript
class Schema<T> {
  private _def: SchemaDef

  min(value: number): Schema<T> {
    return new Schema({ ...this._def, min: value })
  }

  max(value: number): Schema<T> {
    return new Schema({ ...this._def, max: value })
  }

  optional(): Schema<T | undefined> {
    return new Schema({ ...this._def, optional: true })
  }
}

// Usage
const schema = z.string().min(5).max(10).optional()
```

## Barrel Exports

Clean public API:

```typescript
// src/index.ts
export * from './config'
export * from './types'
export { createContext } from './context'
export { default } from './plugin'
```
