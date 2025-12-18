---
name: personal-ts-setup
description: Personal/opinionated TypeScript setup for Nuxt apps, Vite apps, TS libraries, and monorepos. Covers pnpm catalogs, @antfu/eslint-config, bumpp/changelogen releases, CI workflows. Use when scaffolding new projects or setting up tooling.
license: MIT
---

# Personal TypeScript Project Setup

**OPINIONATED**: This skill reflects personal preferences, not universal best practices.

## When to Use

- Scaffolding new TypeScript project (Nuxt, Vite, TS library)
- Setting up pnpm catalogs for dependency management
- Configuring ESLint with @antfu/eslint-config
- Adding release workflow (bumpp, changelogen)
- Setting up GitHub Actions CI

**For Nuxt-specific patterns:** use `nuxt` skill
**For Nuxt module development:** use `nuxt-modules` skill
**For Vue component patterns:** use `vue` skill

## Project Types

| Type        | Scaffold                 | Template                           |
| ----------- | ------------------------ | ---------------------------------- |
| Nuxt app    | `npx nuxi@latest init`   | https://nuxt.new/                  |
| Vite app    | `npm create vite@latest` | -                                  |
| TS library  | Clone starter-ts         | ~/templates/antfu/starter-ts       |
| TS monorepo | Clone starter-monorepo   | ~/templates/antfu/starter-monorepo |
| Nuxt module | `npx nuxi module init`   | -                                  |

## Quick Reference

| Working on...           | Load file                                                              |
| ----------------------- | ---------------------------------------------------------------------- |
| Scaffolding new project | [references/project-scaffolding.md](references/project-scaffolding.md) |
| Dependency organization | [references/pnpm-catalogs.md](references/pnpm-catalogs.md)             |
| Linting setup           | [references/eslint-config.md](references/eslint-config.md)             |
| Publishing packages     | [references/release-workflow.md](references/release-workflow.md)       |
| CI/CD setup             | [references/ci-workflows.md](references/ci-workflows.md)               |
| TypeScript config       | [references/tsconfig-patterns.md](references/tsconfig-patterns.md)     |

## Setup Checklist

- [ ] pnpm with catalogs (pnpm-workspace.yaml)
- [ ] @antfu/eslint-config (formatters, pnpm, vue)
- [ ] simple-git-hooks + lint-staged
- [ ] TypeScript strict mode, bundler moduleResolution
- [ ] Proper ESM exports with types
- [ ] CI workflow (lint, typecheck, test)
