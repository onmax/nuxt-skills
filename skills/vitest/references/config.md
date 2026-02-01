# Configuration & CLI

## Config File Setup

Vitest reads from `vitest.config.ts` or `vite.config.ts`.

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // test options
  },
})
```

With existing Vite config:

```ts
// vite.config.ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
```

Merge configs:

```ts
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: { environment: 'jsdom' },
}))
```

## Common Options

```ts
defineConfig({
  test: {
    globals: true,                    // Enable global APIs without imports
    environment: 'node',              // 'node', 'jsdom', 'happy-dom'
    setupFiles: ['./tests/setup.ts'], // Run before each test file
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    testTimeout: 5000,
    hookTimeout: 10000,
    watch: true,
    coverage: {
      provider: 'v8',                 // or 'istanbul'
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
    },
    isolate: true,                    // Each file in separate process
    fileParallelism: true,            // Run test files in parallel
    pool: 'threads',                  // 'threads', 'forks', 'vmThreads'
    poolOptions: {
      threads: { maxThreads: 4, minThreads: 1 },
    },
    clearMocks: true,
    restoreMocks: true,
    retry: 0,
    bail: 0,
  },
})
```

## Conditional Config

```ts
export default defineConfig(({ mode }) => ({
  plugins: mode === 'test' ? [] : [myPlugin()],
  test: { /* options */ },
}))
```

## Projects (Monorepos)

```ts
defineConfig({
  test: {
    projects: [
      'packages/*',
      {
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'integration',
          include: ['tests/integration/**/*.test.ts'],
          environment: 'jsdom',
        },
      },
    ],
  },
})
```

## CLI Commands

```bash
vitest                    # Watch mode in dev, run mode in CI
vitest run                # Single run without watch
vitest run --coverage     # With coverage
vitest related src/index.ts --run  # Tests importing specific files
vitest bench              # Benchmark tests only
vitest list --json        # List tests without running
vitest typecheck          # Type tests only
```

## Common CLI Options

```bash
--config <path>           # Config file path
--project <name>          # Run specific project
-t, --testNamePattern     # Filter by test name
--changed                 # Only changed files
--changed HEAD~1          # Since last commit
--reporter <name>         # default, verbose, dot, json, html
--coverage                # Enable coverage
--shard <index>/<count>   # Split across machines
--bail <n>                # Stop after n failures
--retry <n>               # Retry failed tests
--environment <env>       # jsdom, happy-dom, node
--globals                 # Enable global APIs
--inspect                 # Node inspector
--silent                  # Suppress output
```

## Sharding for CI

```bash
# Split across 3 machines
vitest run --shard=1/3 --reporter=blob
vitest run --shard=2/3 --reporter=blob
vitest run --shard=3/3 --reporter=blob

# Merge reports
vitest --merge-reports --reporter=junit
```

## Watch Mode Shortcuts

- `a` - Run all tests
- `f` - Run only failed
- `u` - Update snapshots
- `p` - Filter by filename
- `t` - Filter by test name
- `q` - Quit

## Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:ui": "vitest --ui",
    "coverage": "vitest run --coverage"
  }
}
```
