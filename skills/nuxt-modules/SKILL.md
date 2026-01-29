---
name: nuxt-modules
description: "Use when creating Nuxt modules: (1) Published npm modules (@nuxtjs/, nuxt-), (2) Local project modules (modules/ directory), (3) Runtime extensions (components, composables, plugins), (4) Server extensions (API routes, middleware), (5) Releasing/publishing modules to npm, (6) Setting up CI/CD workflows for modules. Provides defineNuxtModule patterns, Kit utilities, hooks, E2E testing, and release automation."
license: MIT
---

# Nuxt Module Development

Guide for creating Nuxt modules that extend framework functionality.

**Related skills:** `nuxt` (basics), `vue` (runtime patterns)

## Quick Start

```bash
npx nuxi init -t module my-module
cd my-module && npm install
npm run dev        # Start playground
npm run dev:build  # Build in watch mode
npm run test       # Run tests
```

## Available Guidance

- **[references/development.md](references/development.md)** - Module anatomy, defineNuxtModule, Kit utilities, hooks
- **[references/testing-and-publishing.md](references/testing-and-publishing.md)** - E2E testing, best practices, releasing, publishing
- **[references/ci-workflows.md](references/ci-workflows.md)** - Copy-paste CI/CD workflow templates

## Loading Files

**Consider loading these reference files based on your task:**

- [ ] [references/development.md](references/development.md) - if building module features, using defineNuxtModule, or working with Kit utilities
- [ ] [references/testing-and-publishing.md](references/testing-and-publishing.md) - if writing E2E tests, publishing to npm, or following best practices
- [ ] [references/ci-workflows.md](references/ci-workflows.md) - if setting up CI/CD workflows for your module

**DO NOT load all files at once.** Load only what's relevant to your current task.

## Module Types

| Type      | Location         | Use Case                         |
| --------- | ---------------- | -------------------------------- |
| Published | npm package      | `@nuxtjs/`, `nuxt-` distribution |
| Local     | `modules/` dir   | Project-specific extensions      |
| Inline    | `nuxt.config.ts` | Simple one-off hooks             |

## Project Structure

```
my-module/
├── src/
│   ├── module.ts           # Entry point
│   └── runtime/            # Injected into user's app
│       ├── components/
│       ├── composables/
│       ├── plugins/
│       └── server/
├── playground/             # Dev testing
└── test/fixtures/          # E2E tests
```

## Resources

- [Module Guide](https://nuxt.com/docs/guide/going-further/modules)
- [Nuxt Kit](https://nuxt.com/docs/api/kit)
- [Module Starter](https://github.com/nuxt/starter/tree/module)
