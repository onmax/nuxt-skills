# Testing

## Vitest Setup

```bash
pnpm add -D vitest
```

### Basic Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    testTimeout: 30_000,
    reporters: 'dot',
  },
})
```

### With Coverage

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/types.ts'],
      reporter: ['text', 'lcovonly', 'html'],
    },
  },
})
```

## Workspace Projects

For monorepos, test packages separately:

```typescript
export default defineConfig({
  test: {
    projects: [
      'packages/*/vitest.config.ts',
      {
        extends: './vitest.config.ts',
        test: { name: 'unit', environment: 'node' },
      },
      {
        extends: './vitest.config.ts',
        test: { name: 'browser', browser: { enabled: true } },
      },
    ],
  },
})
```

## Fixture-Based Testing

Test transforms with file fixtures:

```typescript
import { describe, expect, it } from 'vitest'
import { transform } from '../src'

const fixtures = import.meta.glob('./fixtures/*.ts', { as: 'raw' })

describe('transform', () => {
  for (const [path, getContent] of Object.entries(fixtures)) {
    it(path, async () => {
      const content = await getContent()
      const result = await transform(content)
      expect(result).toMatchSnapshot()
    })
  }
})
```

## Idempotency Testing

Ensure transforms are stable:

```typescript
it('transform is idempotent', async () => {
  const pass1 = (await transform(fixture))?.code ?? fixture
  expect(pass1).toMatchSnapshot()

  const pass2 = (await transform(pass1))?.code ?? pass1
  expect(pass2).toBe(pass1)  // Should not change
})
```

## Type-Level Testing

Test TypeScript types:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    typecheck: { enabled: true },
  },
})
```

```typescript
// test/types.test-d.ts
import { describe, expectTypeOf, it } from 'vitest'
import type { Input, Output } from '../src'

describe('types', () => {
  it('infers input correctly', () => {
    expectTypeOf<Input<typeof schema>>().toEqualTypeOf<{ id: string }>()
  })
})
```

## Multi-TS Version Testing

Test across TypeScript versions (TanStack pattern):

```yaml
# .github/workflows/ci.yml
jobs:
  test-types:
    strategy:
      matrix:
        ts: ['5.0', '5.2', '5.4', '5.6', '5.8']
    steps:
      - run: pnpm add -D typescript@${{ matrix.ts }}
      - run: pnpm typecheck
```

## Package Validation

Validate published package:

```bash
# Check exports are correct
pnpm dlx publint

# Check types work in different moduleResolutions
pnpm dlx @arethetypeswrong/cli --pack .
```

Add to tsdown config:

```typescript
export default defineConfig({
  attw: { profile: 'esm-only' },  // or 'node16'
})
```

## Test Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:types": "vitest typecheck"
  }
}
```

## Mocking

```typescript
import { vi } from 'vitest'

vi.mock('fs', () => ({
  readFileSync: vi.fn(() => 'mocked content'),
}))

// Spy on method
const spy = vi.spyOn(console, 'log')
expect(spy).toHaveBeenCalledWith('expected')
```

## Testing Plugins

Dogfood your own plugin in tests:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import MyPlugin from './src/vite'

export default defineConfig({
  plugins: [
    MyPlugin({ /* options */ }),
  ],
  test: {
    include: ['test/**/*.test.ts'],
  },
})
```
