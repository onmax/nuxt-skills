---
name: vitest
description: A blazing fast unit testing framework powered by Vite
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

## Load Based on Task

**Setting up tests?** → Load `config.md`
**Writing test cases?** → Load `test-api.md`
**Mocking dependencies?** → Load `mocking.md`
**Assertions/snapshots?** → Load `utilities.md`
**DOM/browser/types?** → Load `advanced.md`

## Cross-Skill References

- **Vue component testing** → Use `vue` skill for component patterns
- **Library testing** → Use `ts-library` skill for library patterns
- **Vite configuration** → Use `vite` skill for shared config
