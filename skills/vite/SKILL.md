---
name: vite
description: Vite is a next-generation frontend build tool that provides a fast dev server with HMR and optimized production builds
license: MIT
---

# Vite

Next-gen frontend build tool with native ESM dev server and Rolldown-powered builds.

## When to Use

- Setting up frontend project build tooling
- Configuring dev server, HMR, proxies
- Building for production (SPA, MPA, library, SSR)
- Writing Vite plugins
- Integrating with backend frameworks

## Quick Start

```bash
npm create vite@latest my-app
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
  },
})
```

```bash
vite          # Dev server
vite build    # Production build
vite preview  # Preview build
```

## Reference Files

| Task                                    | File                                  |
| --------------------------------------- | ------------------------------------- |
| Config file, options, CLI, plugins      | [config.md](references/config.md)     |
| ESM, CSS, assets, env vars, glob import | [features.md](references/features.md) |
| Dev server, HMR, workers, performance   | [dev.md](references/dev.md)           |
| Production, library mode, SSR, chunking | [build.md](references/build.md)       |
| JS API, plugin authoring, module graph  | [advanced.md](references/advanced.md) |

## Loading Files

**Consider loading these reference files based on your task:**

- [ ] [references/config.md](references/config.md) - if setting up vite.config.ts, configuring plugins, or using CLI
- [ ] [references/features.md](references/features.md) - if using ESM, CSS, assets, env vars, or glob imports
- [ ] [references/dev.md](references/dev.md) - if configuring dev server, HMR, workers, or optimizing performance
- [ ] [references/build.md](references/build.md) - if building for production, library mode, SSR, or chunking
- [ ] [references/advanced.md](references/advanced.md) - if writing plugins, using JS API, or working with module graph

**DO NOT load all files at once.** Load only what's relevant to your current task.

## Cross-Skill References

- **Testing** → Use `vitest` skill (Vite-native testing)
- **Vue projects** → Use `vue` skill for component patterns
- **Library bundling** → Use `tsdown` skill for TypeScript libs
