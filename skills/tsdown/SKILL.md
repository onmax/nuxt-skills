---
name: tsdown
description: tsdown is a fast and elegant TypeScript library bundler powered by Rolldown and Oxc
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

| Task                                    | File                                  |
| --------------------------------------- | ------------------------------------- |
| Config file, CLI, entry points          | [config.md](references/config.md)     |
| Format, target, dts, exports            | [output.md](references/output.md)     |
| Shims, unbundle, watch, frameworks      | [features.md](references/features.md) |
| Plugins, hooks, programmatic, migration | [advanced.md](references/advanced.md) |

## Load Based on Task

**Setting up config?** → Load `config.md`
**Configuring output?** → Load `output.md`
**Using features?** → Load `features.md`
**Plugins/migration?** → Load `advanced.md`

## Cross-Skill References

- **Library patterns** → Use `ts-library` skill
- **Vue component libs** → Use `vue` skill
- **Package management** → Use `pnpm` skill
