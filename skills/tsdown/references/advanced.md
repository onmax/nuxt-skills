# Advanced

## Plugins

### Supported Types

- **Rolldown** - Native support
- **Unplugin** - Most `unplugin-*` work
- **Rollup** - Most work (may need type cast)
- **Vite** - May work if not using Vite internals

```ts
import UnpluginVue from 'unplugin-vue/rolldown'
import SomeRollupPlugin from 'some-rollup-plugin'

defineConfig({
  plugins: [
    UnpluginVue({ isProduction: true }),
    SomeRollupPlugin() as any,  // Type cast for Rollup plugins
  ],
})
```

### Custom Plugin

```ts
defineConfig({
  plugins: [
    {
      name: 'my-plugin',
      transform(code, id) {
        if (id.endsWith('.txt')) {
          return `export default ${JSON.stringify(code)}`
        }
      },
    },
  ],
})
```

See [Rolldown Plugin API](https://rolldown.rs/guide/plugin-development).

## Hooks

Build lifecycle:

```ts
// Object syntax
defineConfig({
  hooks: {
    'build:prepare': (context) => {
      console.log('Preparing build...')
    },
    'build:before': (context, format) => {
      console.log(`Building ${format}...`)
    },
    'build:done': async (context) => {
      await generateDocs()
      console.log('Build complete!')
    },
  },
})

// Function syntax
defineConfig({
  hooks(hooks) {
    hooks.hook('build:prepare', () => {
      console.log('Starting...')
    })
  },
})
```

## Programmatic API

```ts
import { build } from 'tsdown'

await build({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  dts: true,
  exports: true,
})
```

Multiple builds:

```ts
await build([
  { entry: ['src/node.ts'], platform: 'node', outDir: 'dist/node' },
  { entry: ['src/browser.ts'], platform: 'browser', outDir: 'dist/browser' },
])
```

## Rolldown Options

### inputOptions

```ts
defineConfig({
  inputOptions: {
    cwd: './custom-directory',
    resolve: {
      mainFields: ['module', 'main'],
      alias: { '@': './src' },
    },
    transform: {
      jsx: 'react',
    },
  },
})
```

Function syntax for format-specific:

```ts
defineConfig({
  inputOptions(options, format) {
    if (format === 'cjs') {
      options.cwd = './cjs-specific'
    }
    return options
  },
})
```

### outputOptions

```ts
defineConfig({
  outputOptions: {
    legalComments: 'inline',  // Preserve license headers
  },
})
```

Format-specific:

```ts
defineConfig({
  outputOptions(options, format) {
    if (format === 'esm') {
      options.legalComments = 'inline'
    }
    return options
  },
})
```

## Migration from tsup

### Automatic

```bash
npx tsdown-migrate
npx tsdown-migrate packages/*  # Monorepo
npx tsdown-migrate --dry-run   # Preview
```

### Changed Defaults

| Option   | tsup    | tsdown                        |
| -------- | ------- | ----------------------------- |
| `format` | -       | `esm`                         |
| `clean`  | `false` | `true`                        |
| `dts`    | `false` | Auto-enabled if `types` field |
| `target` | -       | Reads `engines.node`          |

### Breaking Changes (v0.19+)

- **Removed**: `dts.resolve` option (v0.20+)
- **Removed**: `silent` option - use log levels instead
- **Renamed**: `debugLogs` → `debug`
- **Renamed**: `debug.devtools` → `devtools.ui`
- **Exports**: `exports.legacy` controls `main`/`module` field generation
- **Exports**: `exports.exclude` now excludes extension names

### No Stub Mode

tsdown doesn't support stub mode. Alternatives:

1. **Watch mode**: `tsdown --watch`
2. **Dev exports**: `exports: { devExports: true }`
3. **TypeScript runners**: vite-node, tsx, jiti, Node.js v22.18+

## Performance Tips

1. Enable `isolatedDeclarations` in tsconfig for fast `.d.ts`
2. Use `skipNodeModulesBundle: true` if not bundling deps
3. Disable sourcemaps in production if not needed

## Package Validation

### publint

Validates `package.json` exports configuration:

```ts
defineConfig({
  publint: true,  // Enable
  publint: 'warning',  // Set severity: 'warning' | 'error' | 'suggestion'
  publint: 'ci-only',  // Run only in CI
})
```

```bash
tsdown --publint
```

### attw (Are The Types Wrong?)

Validates TypeScript declarations across module resolutions:

```ts
defineConfig({
  attw: {
    profile: 'strict',  // 'strict' | 'node16' | 'esm-only'
    level: 'error',     // 'warn' | 'error'
    ignoreRules: ['false-cjs', 'named-exports'],
  },
  attw: 'ci-only',  // Run only in CI
})
```

```bash
tsdown --attw
```

## Debugging

```bash
# Verbose output
DEBUG=tsdown:* tsdown

# Dry run (migration)
npx tsdown-migrate --dry-run
```

### Devtools

Rolldown devtools for debugging:

```ts
defineConfig({
  devtools: {
    ui: true,  // Enable UI (renamed from debug.devtools)
  },
})
```
