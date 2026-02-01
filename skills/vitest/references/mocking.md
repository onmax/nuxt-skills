# Mocking

## Mock Functions

```ts
import { vi } from 'vitest'

const fn = vi.fn()
fn('hello')

expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledWith('hello')

// With implementation
const add = vi.fn((a, b) => a + b)
expect(add(1, 2)).toBe(3)

// Mock return values
fn.mockReturnValue(42)
fn.mockReturnValueOnce(1).mockReturnValueOnce(2)
fn.mockResolvedValue({ data: true })
fn.mockRejectedValue(new Error('fail'))
fn.mockImplementation((x) => x * 2)
fn.mockImplementationOnce(() => 'first call')
```

## Spying

```ts
const cart = { getTotal: () => 100 }

const spy = vi.spyOn(cart, 'getTotal')
cart.getTotal()

expect(spy).toHaveBeenCalled()
spy.mockReturnValue(200)
spy.mockRestore()  // Restore original

// Spy on getter/setter
vi.spyOn(obj, 'prop', 'get').mockReturnValue('value')
```

## Module Mocking

```ts
// vi.mock is hoisted to top of file
vi.mock('./api', () => ({
  fetchUser: vi.fn(() => ({ id: 1, name: 'Mock' })),
}))

import { fetchUser } from './api'

test('mocked module', () => {
  expect(fetchUser()).toEqual({ id: 1, name: 'Mock' })
})
```

### Partial Mock

```ts
vi.mock('./utils', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    specificFunction: vi.fn(),
  }
})
```

### Auto-mock with Spy

```ts
vi.mock('./calculator', { spy: true })

import { add } from './calculator'

test('spy on module', () => {
  const result = add(1, 2)  // Real implementation
  expect(result).toBe(3)
  expect(add).toHaveBeenCalledWith(1, 2)
})
```

### Manual Mocks (**mocks**)

```
src/
  __mocks__/
    axios.ts      # Mocks 'axios'
  api/
    __mocks__/
      client.ts   # Mocks './client'
    client.ts
```

```ts
vi.mock('axios')
vi.mock('./api/client')
```

## Dynamic Mocking (vi.doMock)

Not hoisted - for dynamic imports:

```ts
test('dynamic mock', async () => {
  vi.doMock('./config', () => ({ apiUrl: 'http://test.local' }))
  const { apiUrl } = await import('./config')
  expect(apiUrl).toBe('http://test.local')
  vi.doUnmock('./config')
})

// Wait for all dynamic imports to load
await vi.dynamicImportSettled()
```

## Hoisted Variables

```ts
const mockFn = vi.hoisted(() => vi.fn())

vi.mock('./module', () => ({
  getData: mockFn,
}))

test('hoisted mock', () => {
  mockFn.mockReturnValue('test')
  expect(getData()).toBe('test')
})
```

## Mock Timers

```ts
beforeEach(() => { vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers() })

test('timers', () => {
  const fn = vi.fn()
  setTimeout(fn, 1000)

  expect(fn).not.toHaveBeenCalled()
  vi.advanceTimersByTime(1000)
  expect(fn).toHaveBeenCalled()
})

// Other methods
vi.runAllTimers()
vi.runOnlyPendingTimers()
vi.advanceTimersToNextTimer()
vi.advanceTimersToNextFrame()  // requestAnimationFrame
vi.clearAllTimers()
vi.getTimerCount()

// Async timer methods
await vi.advanceTimersByTimeAsync(100)
await vi.runAllTimersAsync()
```

## Mock Dates

```ts
vi.setSystemTime(new Date('2024-01-01'))
expect(new Date().getFullYear()).toBe(2024)
vi.useRealTimers()  // Restore

vi.getMockedSystemTime()  // Get mocked date
vi.getRealSystemTime()    // Get real time (ms)
```

## Mock Globals & Environment

```ts
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({ json: () => ({ data: 'mock' }) })
))
vi.unstubAllGlobals()

vi.stubEnv('API_KEY', 'test-key')
expect(import.meta.env.API_KEY).toBe('test-key')
vi.unstubAllEnvs()
```

## Mock Object

```ts
const original = { method: () => 'real', nested: { fn: () => 'nested' } }

const mocked = vi.mockObject(original)
mocked.method.mockReturnValue('mocked')

const spied = vi.mockObject(original, { spy: true })
spied.method()  // 'real'
expect(spied.method).toHaveBeenCalled()
```

## Clearing Mocks

```ts
fn.mockClear()       // Clear call history
fn.mockReset()       // Clear history + implementation
fn.mockRestore()     // Restore original (for spies)

vi.clearAllMocks()
vi.resetAllMocks()
vi.restoreAllMocks()
```

## Config Auto-Reset

```ts
defineConfig({
  test: {
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
})
```

## Waiting Utilities

```ts
await vi.waitFor(async () => {
  const el = document.querySelector('.loaded')
  expect(el).toBeTruthy()
}, { timeout: 5000, interval: 100 })

const element = await vi.waitUntil(
  () => document.querySelector('.loaded'),
  { timeout: 5000 }
)
```

## TypeScript Helper

```ts
import { myFn } from './module'
vi.mock('./module')

vi.mocked(myFn).mockReturnValue('typed')
vi.mocked(myModule, { deep: true })
vi.mocked(fn, { partial: true }).mockResolvedValue({ ok: true })
```
