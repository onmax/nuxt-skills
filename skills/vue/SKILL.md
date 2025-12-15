---
name: vue
description: Use when editing .vue files, creating Vue 3 components, writing composables, or testing Vue code - provides Composition API patterns, props/emits best practices, VueUse integration, and reactive destructuring guidance
---

# Vue 3 Development

Reference for Vue 3 Composition API patterns, component architecture, and testing practices.

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

## Quick Reference

| Working on...            | Load this file  |
| ------------------------ | --------------- |
| `.vue` in `components/`  | components.md   |
| File in `composables/`   | composables.md  |
| File in `utils/`         | utils-client.md |
| `.spec.ts` or `.test.ts` | testing.md      |

## Loading Files

**Load one file at a time based on file context:**

```bash
# Component work
cat ~/.claude/skills/vue/components.md

# Composable work
cat ~/.claude/skills/vue/composables.md

# Utils work
cat ~/.claude/skills/vue/utils-client.md

# Testing
cat ~/.claude/skills/vue/testing.md
```

**DO NOT load all files at once** - wastes context on irrelevant patterns.

## Available Guidance

**components.md** - Props with reactive destructuring, emits patterns, defineModel for v-model, slots shorthand

**composables.md** - Composition API structure, VueUse integration, lifecycle hooks, async patterns

**utils-client.md** - Pure functions, formatters, validators, transformers, when NOT to use utils

**testing.md** - Vitest + @vue/test-utils, component testing, composable testing, mocking patterns

## Examples

Working examples in `resources/examples/`:

- `component-example.vue` - Full component with all patterns
- `composable-example.ts` - Reusable composition function
