# Advanced

## Test Environments

Available: `node` (default), `jsdom`, `happy-dom`, `edge-runtime`

```ts
defineConfig({
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: { url: 'http://localhost' },
    },
  },
})
```

Install packages:

```bash
npm i -D jsdom       # Full browser simulation
npm i -D happy-dom   # Faster, fewer APIs
```

Per-file environment:

```ts
// @vitest-environment jsdom

test('DOM test', () => {
  const div = document.createElement('div')
  expect(div).toBeInstanceOf(HTMLDivElement)
})
```

Multiple environments via projects:

```ts
defineConfig({
  test: {
    projects: [
      { test: { name: 'unit', include: ['tests/unit/**'], environment: 'node' } },
      { test: { name: 'dom', include: ['tests/dom/**'], environment: 'jsdom' } },
    ],
  },
})
```

### Custom Environment

```ts
// vitest-environment-custom/index.ts
import type { Environment } from 'vitest/runtime'

export default <Environment>{
  name: 'custom',
  viteEnvironment: 'ssr',
  setup() {
    globalThis.myGlobal = 'value'
    return {
      teardown() { delete globalThis.myGlobal },
    }
  },
}
```

## Type Testing

Test TypeScript types with `.test-d.ts` files:

```ts
// math.test-d.ts
import { expectTypeOf } from 'vitest'
import { add } from './math'

test('add returns number', () => {
  expectTypeOf(add).returns.toBeNumber()
})
```

### expectTypeOf API

```ts
// Basic types
expectTypeOf<string>().toBeString()
expectTypeOf<number>().toBeNumber()
expectTypeOf<boolean>().toBeBoolean()
expectTypeOf<null>().toBeNull()
expectTypeOf<undefined>().toBeUndefined()
expectTypeOf<never>().toBeNever()
expectTypeOf<any>().toBeAny()
expectTypeOf<unknown>().toBeUnknown()
expectTypeOf<[]>().toBeArray()
expectTypeOf<Function>().toBeFunction()

// Value types
const value = 'hello'
expectTypeOf(value).toBeString()
expectTypeOf(obj).toMatchTypeOf<{ name: string }>()
expectTypeOf(obj).toHaveProperty('name')

// Functions
expectTypeOf(greet).parameters.toEqualTypeOf<[string]>()
expectTypeOf(greet).returns.toBeString()
expectTypeOf(greet).parameter(0).toBeString()

// Equality
expectTypeOf<B>().toMatchTypeOf<A>()     // Subset matching
expectTypeOf<A>().toEqualTypeOf<B>()     // Exact match
expectTypeOf<A>().not.toEqualTypeOf<B>()

// Nullable
expectTypeOf<string | null>().toBeNullable()
```

### assertType

```ts
import { assertType } from 'vitest'

// @ts-expect-error - should fail type check
assertType<string>(result)

assertType<User | null>(result)  // Correct
```

Run: `vitest typecheck` or `vitest --typecheck`

## Projects (Workspaces)

```ts
defineConfig({
  test: {
    projects: [
      'packages/*',  // Glob for package configs
      {
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.ts'],
          environment: 'node',
        },
      },
    ],
  },
})
```

### Providing Values

```ts
defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'staging',
          provide: { apiUrl: 'https://staging.api.com' },
        },
      },
    ],
  },
})

// In tests
import { inject } from 'vitest'
const url = inject('apiUrl')
```

### Running Specific Projects

```bash
vitest --project unit
vitest --project unit --project e2e
vitest --project.ignore browser
```

## Browser Mode

Real browser testing (separate from environments):

```ts
defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chromium',  // or 'firefox', 'webkit'
      provider: 'playwright',
    },
  },
})
```

## CSS in Tests

```ts
defineConfig({
  test: {
    css: true,
    // Or with options
    css: {
      include: /\.module\.css$/,
      modules: { classNameStrategy: 'non-scoped' },
    },
  },
})
```

## External Dependencies

Fix deps that fail with CSS/asset errors:

```ts
defineConfig({
  test: {
    server: {
      deps: {
        inline: ['problematic-package'],
      },
    },
  },
})
```

## Global Setup

```ts
defineConfig({
  test: {
    globalSetup: ['./tests/global-setup.ts'],
  },
})

// tests/global-setup.ts
export default async function setup() {
  // Run before all tests
  return async () => {
    // Teardown after all tests
  }
}
```

## Benchmarking

```ts
import { bench, describe } from 'vitest'

describe('sort', () => {
  bench('native', () => {
    [1, 5, 4, 2, 3].sort((a, b) => a - b)
  })

  bench('lodash', () => {
    _.sortBy([1, 5, 4, 2, 3])
  })
})
```

Run: `vitest bench`
