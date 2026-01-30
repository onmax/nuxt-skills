---
name: vue
description: Use when editing .vue files, creating Vue 3 components, writing composables, or testing Vue code - provides Composition API patterns, props/emits best practices, VueUse integration, and reactive destructuring guidance
license: MIT
---

# Vue 3 Development

Reference for Vue 3 Composition API patterns, component architecture, and testing practices.

**Current stable:** Vue 3.5+ with enhanced reactivity performance (-56% memory, 10x faster array tracking), new SSR features, and improved developer experience.

## Overview

Progressive reference system for Vue 3 projects. Load only files relevant to current task to minimize context usage (~250 tokens base, 500-1500 per sub-file).

## When to Use

**Use this skill when:**

- Writing `.vue` components
- Creating composables (`use*` functions)
- Building client-side utilities
- Testing Vue components/composables

**Use `nuxt` skill instead for:**

- Server routes, API endpoints
- File-based routing, middleware
- Nuxt-specific patterns

**For styled UI components:** use `nuxt-ui` skill
**For headless accessible components:** use `reka-ui` skill
**For VueUse composables:** use `vueuse` skill

## Quick Reference

| Working on...            | Load file                    |
| ------------------------ | ---------------------------- |
| `.vue` in `components/`  | references/components.md     |
| File in `composables/`   | references/composables.md    |
| File in `utils/`         | references/utils-client.md   |
| `.spec.ts` or `.test.ts` | references/testing.md        |
| TypeScript patterns      | references/typescript.md     |
| Vue Router typing        | references/router.md         |
| Reactivity (ref, watch)  | references/reactivity.md     |
| Custom directives        | references/directives.md     |
| Provide/inject           | references/provide-inject.md |
| Edge cases, vue-tsc      | references/gotchas.md        |

## Loading Files

**Consider loading these reference files based on your task:**

- [ ] [references/components.md](references/components.md) - if working in `components/` or writing `.vue` files
- [ ] [references/composables.md](references/composables.md) - if creating composables (`use*` functions)
- [ ] [references/utils-client.md](references/utils-client.md) - if working in `utils/` or writing client utilities
- [ ] [references/testing.md](references/testing.md) - if writing `.spec.ts` or `.test.ts` files
- [ ] [references/typescript.md](references/typescript.md) - if working with Vue TypeScript patterns or generics
- [ ] [references/router.md](references/router.md) - if working with Vue Router or route typing
- [ ] [references/reactivity.md](references/reactivity.md) - if using ref, reactive, computed, watch, or watchEffect
- [ ] [references/directives.md](references/directives.md) - if creating or using custom directives
- [ ] [references/provide-inject.md](references/provide-inject.md) - if using provide/inject patterns
- [ ] [references/gotchas.md](references/gotchas.md) - if debugging edge cases or hydration issues

**DO NOT load all files at once.** Load only what's relevant to your current task.

## Available Guidance

**[references/components.md](references/components.md)** - Props with reactive destructuring, emits patterns, defineModel for v-model, slots shorthand

**[references/composables.md](references/composables.md)** - Composition API structure, VueUse integration, lifecycle hooks, async patterns, reactivity gotchas

**[references/utils-client.md](references/utils-client.md)** - Pure functions, formatters, validators, transformers, when NOT to use utils

**[references/testing.md](references/testing.md)** - Vitest + @vue/test-utils, component testing, composable testing, router mocking

**[references/typescript.md](references/typescript.md)** - InjectionKey for provide/inject, vue-tsc strict templates, tsconfig settings, generic components

**[references/router.md](references/router.md)** - Route meta types, typed params with unplugin-vue-router, scroll behavior, navigation guards

**[references/reactivity.md](references/reactivity.md)** - ref, reactive, computed, watch, watchEffect, reactivity fundamentals

**[references/directives.md](references/directives.md)** - Custom directive hooks, v-focus, v-click-outside, v-tooltip patterns

**[references/provide-inject.md](references/provide-inject.md)** - InjectionKey typing, app-level provide, readonly patterns

**[references/gotchas.md](references/gotchas.md)** - Common gotchas, vue-tsc edge cases, hydration issues, race conditions (from vuejs-ai/skills)
