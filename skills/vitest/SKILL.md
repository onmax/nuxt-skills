---
name: vitest
description: Use when writing unit/integration tests for Vite projects - provides Vitest configuration, test APIs, mocking patterns, and coverage setup
license: MIT
---

# Vitest

Vite-native testing framework with Jest-compatible API.

## When to Use

- Writing unit/integration tests for Vite projects
- Testing Vue/React/Svelte components
- Mocking modules, timers, or dates
- Running concurrent/parallel tests
- Type testing with TypeScript

## Quick Start

```bash
npm i -D vitest
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',  // or 'jsdom' for DOM tests
  },
})
```

```ts
// example.test.ts
import { describe, expect, it, vi } from 'vitest'

describe('math', () => {
  it('adds numbers', () => {
    expect(1 + 1).toBe(2)
  })
})
```

## Reference Files

| Task                                     | File                                    |
| ---------------------------------------- | --------------------------------------- |
| Configuration, CLI, projects             | [config.md](references/config.md)       |
| test/describe, hooks, fixtures           | [test-api.md](references/test-api.md)   |
| vi.fn, vi.mock, timers, spies            | [mocking.md](references/mocking.md)     |
| expect, snapshots, coverage, filtering   | [utilities.md](references/utilities.md) |
| Environments, type testing, browser mode | [advanced.md](references/advanced.md)   |

## Loading Files

**Consider loading these reference files based on your task:**

- [ ] [references/config.md](references/config.md) - if setting up vitest.config.ts, CLI, or workspace projects
- [ ] [references/test-api.md](references/test-api.md) - if writing test/describe blocks, using hooks, or test fixtures
- [ ] [references/mocking.md](references/mocking.md) - if mocking modules, timers, dates, or using spies
- [ ] [references/utilities.md](references/utilities.md) - if writing assertions, snapshots, or configuring coverage
- [ ] [references/advanced.md](references/advanced.md) - if configuring test environments, type testing, or browser mode

**DO NOT load all files at once.** Load only what's relevant to your current task.

## Cross-Skill References

- **Vue component testing** → Use `vue` skill for component patterns
- **Library testing** → Use `ts-library` skill for library patterns
- **Vite configuration** → Use `vite` skill for shared config
