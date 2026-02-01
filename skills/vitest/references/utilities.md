# Utilities

## Expect API

```ts
import { expect } from 'vitest'

// Equality
expect(1 + 1).toBe(2)              // Strict ===
expect({ a: 1 }).toEqual({ a: 1 }) // Deep equality
expect({ a: 1 }).toStrictEqual({ a: 1 }) // Checks undefined props

// Truthiness
expect(true).toBeTruthy()
expect(false).toBeFalsy()
expect(null).toBeNull()
expect(undefined).toBeUndefined()
expect('value').toBeDefined()

// Special
expect('a').toBeOneOf(['a', 'b', 'c'])
expect(value).toSatisfy((v) => v > 0)

// Numbers
expect(10).toBeGreaterThan(5)
expect(10).toBeGreaterThanOrEqual(10)
expect(5).toBeLessThan(10)
expect(0.1 + 0.2).toBeCloseTo(0.3, 5)

// Strings
expect('hello world').toMatch(/world/)
expect('hello').toContain('ell')

// Arrays
expect([1, 2, 3]).toContain(2)
expect([{ a: 1 }]).toContainEqual({ a: 1 })
expect([1, 2, 3]).toHaveLength(3)

// Objects
expect({ a: 1, b: 2 }).toHaveProperty('a')
expect({ a: 1, b: 2 }).toHaveProperty('a', 1)
expect({ a: { b: 1 } }).toHaveProperty('a.b', 1)
expect({ a: 1 }).toMatchObject({ a: 1 })

// Types
expect('string').toBeTypeOf('string')
expect(new Date()).toBeInstanceOf(Date)

// Negation
expect(1).not.toBe(2)
```

## Error Assertions

```ts
// Sync - wrap in function
expect(() => throwError()).toThrow()
expect(() => throwError()).toThrow('message')
expect(() => throwError()).toThrow(/pattern/)
expect(() => throwError()).toThrow(CustomError)

// Async - use rejects
await expect(asyncThrow()).rejects.toThrow('error')
```

## Promise Assertions

```ts
await expect(Promise.resolve(1)).resolves.toBe(1)
await expect(Promise.reject('error')).rejects.toBe('error')
```

## Spy/Mock Assertions

```ts
const fn = vi.fn()
fn('arg1', 'arg2')
fn('arg3')

expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledTimes(2)
expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
expect(fn).toHaveBeenLastCalledWith('arg3')
expect(fn).toHaveBeenNthCalledWith(1, 'arg1', 'arg2')
expect(fn).toHaveReturned()
expect(fn).toHaveReturnedWith(value)

// Call order
const fn1 = vi.fn()
const fn2 = vi.fn()
fn1()
fn2()
expect(fn1).toHaveBeenCalledBefore(fn2)
expect(fn2).toHaveBeenCalledAfter(fn1)
```

## Asymmetric Matchers

```ts
expect({ id: 1, name: 'test' }).toEqual({
  id: expect.any(Number),
  name: expect.any(String),
})

expect({ a: 1, b: 2, c: 3 }).toEqual(expect.objectContaining({ a: 1 }))
expect([1, 2, 3, 4]).toEqual(expect.arrayContaining([1, 3]))
expect('hello world').toEqual(expect.stringContaining('world'))
expect('hello world').toEqual(expect.stringMatching(/world$/))
expect({ value: null }).toEqual({ value: expect.anything() })
expect([1, 2]).toEqual(expect.not.arrayContaining([3]))
expect(0.1 + 0.2).toEqual(expect.closeTo(0.3, 5))  // Floating point
```

## Soft & Poll Assertions

```ts
// Continue after failure
expect.soft(1).toBe(2)  // Marks failed but continues
expect.soft(2).toBe(3)  // Also runs

// Retry until passes
await expect.poll(() => fetchStatus()).toBe('ready')
await expect.poll(
  () => document.querySelector('.element'),
  { interval: 100, timeout: 5000 }
).toBeTruthy()
```

## Assertion Count

```ts
test('async assertions', async () => {
  expect.assertions(2)      // Exactly 2 must run
  expect.hasAssertions()    // At least 1 must run
})
```

## Custom Matchers

```ts
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling
    return {
      pass,
      message: () => `expected ${received} to be within ${floor} - ${ceiling}`,
    }
  },
})

test('custom', () => { expect(100).toBeWithinRange(90, 110) })
```

## Snapshots

```ts
expect(data).toMatchSnapshot()
expect(data).toMatchInlineSnapshot(`{ "id": 1 }`)
await expect(result).toMatchFileSnapshot('./expected.json')
expect(() => { throw new Error('fail') }).toThrowErrorMatchingSnapshot()

// With hints
expect(header).toMatchSnapshot('header')

// Shape matching
expect(data).toMatchSnapshot({
  id: expect.any(Number),
  created: expect.any(Date),
})
```

Update snapshots: `vitest -u` or press `u` in watch mode.

### Custom Serializers

```ts
expect.addSnapshotSerializer({
  test(val) { return val && typeof val.toJSON === 'function' },
  serialize(val, config, indentation, depth, refs, printer) {
    return printer(val.toJSON(), config, indentation, depth, refs)
  },
})
```

## Coverage

```bash
vitest run --coverage
```

```ts
defineConfig({
  test: {
    coverage: {
      provider: 'v8',  // or 'istanbul'
      enabled: true,
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['node_modules/', 'tests/', '**/*.d.ts'],
      all: true,  // Report uncovered files
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
})
```

Ignore code:

```ts
/* v8 ignore next -- @preserve */
function ignored() {}

/* istanbul ignore next -- @preserve */
function ignored() {}
```

## Filtering

```bash
vitest user                      # Files containing "user"
vitest src/user.test.ts:25       # Specific line
vitest -t "login"                # Tests matching pattern
vitest --changed                 # Uncommitted changes
vitest --changed HEAD~1          # Since commit
vitest related src/utils.ts --run  # Tests importing file
vitest --tags db                 # By tag
```

```ts
test('db test', { tags: ['db', 'slow'] }, async () => {})
```

## Concurrency

```ts
defineConfig({
  test: {
    fileParallelism: true,
    maxWorkers: 4,
    pool: 'threads',  // 'threads', 'forks', 'vmThreads'
    maxConcurrency: 5,  // Max concurrent tests per file
    isolate: true,
    sequence: {
      shuffle: true,
      seed: 12345,
      hooks: 'stack',
      concurrent: true,
    },
  },
})
```

```ts
describe.concurrent('parallel', () => {
  test('test 1', async ({ expect }) => {})
  test('test 2', async ({ expect }) => {})
})

describe.shuffle('random order', () => {})
```
