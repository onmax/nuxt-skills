---
name: tsdown
description: Use when bundling TypeScript libraries - provides tsdown configuration, dual ESM/CJS output, .d.ts generation, package validation, and plugin authoring
license: MIT
---

# tsdown

Rolldown + Oxc powered TypeScript bundler. Drop-in tsup replacement.

## When to Use

- Building TypeScript libraries
- Generating .d.ts declarations
- Publishing npm packages
- Dual ESM/CJS output
- Vue/React component libraries

## Quick Start

```bash
npm i -D tsdown typescript
```

```ts
// tsdown.config.ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  format: 'esm',
  dts: true,
  exports: true,
})
```

```bash
tsdown           # Build
tsdown --watch   # Watch mode
```

## Reference Files

| Task                                          | File                                  |
| --------------------------------------------- | ------------------------------------- |
| Config file, CLI, entry points                | [config.md](references/config.md)     |
| Format, target, dts, exports, validation      | [output.md](references/output.md)     |
| Shims, unbundle, watch, frameworks, WASM      | [features.md](references/features.md) |
| Plugins, hooks, lint, programmatic, migration | [advanced.md](references/advanced.md) |

## Loading Files

**Consider loading these reference files based on your task:**

- [ ] [references/config.md](references/config.md) - if setting up tsdown.config.ts, CLI, or entry points
- [ ] [references/output.md](references/output.md) - if configuring output format, target, .d.ts, exports, or validation
- [ ] [references/features.md](references/features.md) - if using shims, unbundle, watch mode, framework integrations, or WebAssembly
- [ ] [references/advanced.md](references/advanced.md) - if writing plugins, using linting/validation, programmatic API, or migrating from tsup

**DO NOT load all files at once.** Load only what's relevant to your current task.

## Cross-Skill References

- **Library patterns** → Use `ts-library` skill
- **Vue component libs** → Use `vue` skill
- **Package management** → Use `pnpm` skill
