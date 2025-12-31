---
name: ts-library
description: Use when authoring TypeScript libraries - covers project setup, package exports, build tooling (tsdown/unbuild), API design patterns, type inference tricks, testing, and release workflows. Patterns extracted from 20+ high-quality ecosystem libraries.
license: MIT
---

# TypeScript Library Development

Patterns for authoring high-quality TypeScript libraries, extracted from studying unocss, shiki, unplugin, vite, vitest, vueuse, zod, trpc, drizzle-orm, and more.

## When to Use

- Starting a new TypeScript library (single or monorepo)
- Setting up package.json exports for dual CJS/ESM
- Configuring tsconfig for library development
- Choosing build tools (tsdown, unbuild)
- Designing type-safe APIs (builder, factory, plugin patterns)
- Writing advanced TypeScript types
- Setting up vitest for library testing
- Configuring release workflow and CI

**For Nuxt module development:** use `nuxt-modules` skill

## Quick Reference

| Working on...         | Load file                                                          |
| --------------------- | ------------------------------------------------------------------ |
| New project setup     | [references/project-setup.md](references/project-setup.md)         |
| Package exports       | [references/package-exports.md](references/package-exports.md)     |
| tsconfig options      | [references/typescript-config.md](references/typescript-config.md) |
| Build configuration   | [references/build-tooling.md](references/build-tooling.md)         |
| API design patterns   | [references/api-design.md](references/api-design.md)               |
| Type inference tricks | [references/type-patterns.md](references/type-patterns.md)         |
| Testing setup         | [references/testing.md](references/testing.md)                     |
| Release workflow      | [references/release.md](references/release.md)                     |
| CI/CD setup           | [references/ci-workflows.md](references/ci-workflows.md)           |

## Key Principles

- ESM-first: `"type": "module"` with `.mjs` outputs
- Dual format: always support both CJS and ESM consumers
- `moduleResolution: "Bundler"` for modern TypeScript
- tsdown for most builds, unbuild for complex cases
- Smart defaults: detect environment, don't force config
- Tree-shakeable: lazy getters, proper `sideEffects: false`

_Token efficiency: Main skill ~300 tokens, each reference ~800-1200 tokens_
