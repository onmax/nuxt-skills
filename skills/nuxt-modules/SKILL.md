---
name: nuxt-modules
description: Use when creating Nuxt modules - provides defineNuxtModule patterns, runtime injection, hooks, testing, and best practices
---

# Nuxt Module Development

Guide for creating Nuxt modules that extend framework functionality.

## When to Use

Building:
- Published npm modules (`@nuxtjs/`, `nuxt-`)
- Local project modules (`modules/` directory)
- Runtime extensions (components, composables, plugins)
- Server extensions (API routes, middleware)

## Quick Start

```bash
npx nuxi init -t module my-module
cd my-module && npm install
npm run dev        # Start playground
npm run dev:build  # Build in watch mode
npm run test       # Run tests
```

## Available Guidance

- **development.md** - Module anatomy, defineNuxtModule, Kit utilities, hooks
- **testing-and-publishing.md** - E2E testing, best practices, publishing

```bash
# Building module features?
cat ~/.claude/skills/nuxt-modules/development.md

# Testing or publishing?
cat ~/.claude/skills/nuxt-modules/testing-and-publishing.md
```

## Module Types

| Type | Location | Use Case |
|------|----------|----------|
| Published | npm package | `@nuxtjs/`, `nuxt-` distribution |
| Local | `modules/` dir | Project-specific extensions |
| Inline | `nuxt.config.ts` | Simple one-off hooks |

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
