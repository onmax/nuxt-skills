# Test API

## Basic Tests

```ts
import { describe, expect, it, test } from 'vitest'

test('adds numbers', () => {
  expect(1 + 1).toBe(2)
})

// Alias: it
it('works the same', () => {
  expect(true).toBe(true)
})
```

## Async Tests

```ts
test('async test', async () => {
  const result = await fetchData()
  expect(result).toBeDefined()
})
```

## Test Options

```ts
test('with options', { timeout: 10_000, retry: 2 }, async () => {})
test('with tags', { tags: ['db', 'slow'] }, async () => {})
```

## Modifiers

```ts
test.skip('skipped', () => {})
test.only('only this runs', () => {})
test.todo('implement later')
test.fails('expected to fail', () => { expect(1).toBe(2) })
test.skipIf(process.env.CI)('not in CI', () => {})
test.runIf(process.env.CI)('only in CI', () => {})

// Dynamic skip
test('dynamic', ({ skip }) => {
  skip(someCondition, 'reason')
})
```

## Concurrent & Sequential

```ts
test.concurrent('parallel 1', async ({ expect }) => {})
test.concurrent('parallel 2', async ({ expect }) => {})
test.sequential('must run alone', async () => {})
```

**Important:** Use `{ expect }` from context for concurrent tests.

## Parameterized Tests

```ts
test.each([
  [1, 1, 2],
  [1, 2, 3],
])('add(%i, %i) = %i', (a, b, expected) => {
  expect(a + b).toBe(expected)
})

test.each([
  { a: 1, b: 1, expected: 2 },
  { a: 1, b: 2, expected: 3 },
])('add($a, $b) = $expected', ({ a, b, expected }) => {
  expect(a + b).toBe(expected)
})

// test.for - preferred, doesn't spread arrays
test.for([
  [1, 1, 2],
  [1, 2, 3],
])('add(%i, %i) = %i', ([a, b, expected], { expect }) => {
  expect(a + b).toBe(expected)
})
```

## Describe/Suite

```ts
describe('Math', () => {
  test('adds', () => expect(1 + 1).toBe(2))
  test('subtracts', () => expect(3 - 1).toBe(2))
})

// Nested
describe('User', () => {
  describe('when logged in', () => {
    test('shows dashboard', () => {})
  })
})

// Modifiers
describe.skip('skipped', () => {})
describe.only('only this', () => {})
describe.concurrent('parallel', () => {})
describe.shuffle('random order', () => {})  // Randomize test order
describe.each([{ name: 'Chrome' }, { name: 'Firefox' }])('$name', ({ name }) => {})
```

## Lifecycle Hooks

```ts
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'

beforeAll(async () => { await setupDatabase() })
afterAll(async () => { await teardownDatabase() })
beforeEach(async () => { await clearTestData() })
afterEach(async () => { await cleanupMocks() })

// Return cleanup function
beforeAll(async () => {
  const server = await startServer()
  return async () => { await server.close() }
})
```

## Around Hooks

Wrap test execution with setup/teardown logic:

```ts
import { aroundEach, aroundAll } from 'vitest'

aroundEach(async (runTest) => {
  await db.beginTransaction()
  await runTest()  // Must be called!
  await db.rollback()
})

aroundAll(async (runAll) => {
  const server = await startServer()
  await runAll()
  await server.close()
})
```

## Test Hooks

```ts
import { onTestFailed, onTestFinished } from 'vitest'

test('with cleanup', () => {
  const db = connect()
  onTestFinished(() => db.close())
  onTestFailed(({ task }) => { console.log('Failed:', task.result?.errors) })
})

// Reusable pattern
function useTestDb() {
  const db = connect()
  onTestFinished(() => db.close())
  return db
}
```

## Custom Fixtures

```ts
import { test as base } from 'vitest'

const test = base.extend<{ db: Database; user: User }>({
  db: async ({}, use) => {
    const db = await createDb()
    await use(db)
    await db.close()
  },
  user: async ({ db }, use) => {
    const user = await db.createUser({ name: 'Test' })
    await use(user)
    await db.deleteUser(user.id)
  },
})

test('query', async ({ db, user }) => {
  const found = await db.findUser(user.id)
  expect(found).toEqual(user)
})

// Fixture options
const test = base.extend({
  setup: [async ({}, use) => { await use() }, { auto: true }],  // Always run
  connection: [async ({}, use) => { /* ... */ }, { scope: 'file' }],  // Once per file
})
```

## Hook Execution Order

1. `beforeAll` (in order)
2. `beforeEach` (in order)
3. Test
4. `afterEach` (reverse order)
5. `afterAll` (reverse order)

Configure with `sequence.hooks: 'stack' | 'list' | 'parallel'`
