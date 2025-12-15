---
name: nuxt
description: Use when working on Nuxt 4+ projects - provides server routes, file-based routing, middleware patterns, Nuxt-specific composables, and configuration with latest docs
---

# Nuxt 4+ Development

Progressive guidance for Nuxt 4+ projects with latest patterns and conventions.

## When to Use

Working with:

- Server routes (API endpoints, server middleware, server utils)
- File-based routing (pages, layouts, route groups)
- Nuxt middleware (route guards, navigation)
- Nuxt plugins (app extensions)
- Nuxt-specific features (auto-imports, layers, modules)

## Available Guidance

Read specific files based on current work:

- **server.md** - API routes, server middleware, Nitro patterns, h3 helpers
- **routing.md** - File-based routing, route groups, typed router, definePage
- **middleware-plugins.md** - Route middleware, plugins, app lifecycle
- **nuxt-composables.md** - Nuxt composables (useRequestURL, useFetch, navigation)
- **nuxt-components.md** - NuxtLink, NuxtImg, NuxtTime (prefer over HTML elements)
- **nuxt-config.md** - Configuration, modules, auto-imports, layers

**For Vue composables:** See `vue` skill composables.md (VueUse, Composition API patterns)

## Usage Pattern

**Progressive loading - only read what you need:**

```bash
# Creating API endpoint?
cat ~/.claude/skills/nuxt/server.md

# Setting up pages/routing?
cat ~/.claude/skills/nuxt/routing.md

# Using composables/data fetching?
cat ~/.claude/skills/nuxt/nuxt-composables.md

# Adding middleware/plugins?
cat ~/.claude/skills/nuxt/middleware-plugins.md

# Configuring Nuxt?
cat ~/.claude/skills/nuxt/nuxt-config.md

# Setting up CI/ESLint?
cat ~/.claude/skills/nuxt/project-setup.md
```

**DO NOT read all files at once.** Load based on context:

- Working in `server/` → read server.md
- Working in `pages/` or `layouts/` → read routing.md
- Using `useFetch`, `useRequestURL`, navigation → read nuxt-composables.md
- Using `<a>`, `<img>`, `<time>` elements → read nuxt-components.md
- Working in `middleware/` or `plugins/` → read middleware-plugins.md
- Editing `nuxt.config.ts` → read nuxt-config.md

## Nuxt 4 vs Older Versions

**You are working with Nuxt 4+.** Key differences:

| Old (Nuxt 2/3)    | New (Nuxt 4)                    |
| ----------------- | ------------------------------- |
| `index.vue`       | `(descriptive-name).vue`        |
| `<Nuxt />`        | `<NuxtPage />`                  |
| `context.params`  | `getRouterParam(event, 'name')` |
| `window.origin`   | `useRequestURL().origin`        |
| String routes     | Typed router with route names   |
| Separate layouts/ | Parent routes with `<slot>`     |

**If you're unsure about Nuxt 4 patterns, read the relevant guidance file first.**

## Latest Documentation

**When to fetch latest docs:**

- New Nuxt 4 features not covered here
- Module-specific configuration
- Breaking changes or deprecations
- Advanced use cases

**Official sources:**

- Nuxt: https://nuxt.com/docs
- h3 (server engine): https://h3.unjs.io/
- Nitro: https://nitro.unjs.io/

## Token Efficiency

Main skill: ~300 tokens. Each sub-file: ~800-1500 tokens. Only load files relevant to current task.
