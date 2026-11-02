---
name: nuxt-protokit
description: Use when building schema-driven prototypes with nuxt-protokit (@websideproject/nuxt-protokit) - provides definePrototype, usePrototype, ProtoTool, collections, derived values, and visualizations for rapid SaaS tool prototyping.
license: MIT
---

# nuxt-protokit

Schema-driven rapid prototyping for Nuxt 4. Turn a TypeScript schema into a persistent, interactive SaaS tool in minutes — backed by Y.js CRDT + IndexedDB, auto-synced across tabs, with optional server sync.

## When to Use

- Defining a `PrototypeSchema` with fields, collections, derived values, or visualizations
- Writing `usePrototype()` or `useProtoCollection()` composables
- Using `<ProtoTool>`, `<ProtoDashboard>`, `<ProtoCrudModal>`, `<ProtoCalendar>`, `<ProtoViz>` components
- Configuring offline persistence, encryption, namespace isolation, or corruption recovery
- Creating custom field/viz extensions with `defineProtokitExtension`
- Using headless mode (`defineHeadlessSchema`) without UI components

## Quick Start

```ts
// schema.ts
import { definePrototype } from '@websideproject/nuxt-protokit'

export const schema = definePrototype({
  key: 'my-tool',
  title: 'My Tool',
  shortTitle: 'My Tool',
  description: 'Description',
  icon: 'i-heroicons-calculator',
  fields: {
    revenue:  { type: 'number', label: 'Revenue',  default: 0, format: 'money' },
    growth:   { type: 'range',  label: 'Growth %', default: 10, min: 0, max: 100 },
    plan:     { type: 'select', label: 'Plan',     default: 'starter',
                options: ['starter', 'pro', 'enterprise'] },
  },
  derived: {
    projectedRevenue: {
      deps: ['revenue', 'growth'],
      compute: ctx => ctx.fields.revenue * (1 + ctx.fields.growth / 100),
    },
  },
})
```

```vue
<!-- pages/my-tool.vue -->
<script setup>
import { schema } from '~/schema'
const proto = usePrototype(schema)
</script>

<template>
  <ProtoTool :schema="schema" :prototype="proto" />
</template>
```

## Available Guidance

| File | Topics |
|------|--------|
| **[references/schema.md](references/schema.md)** | PrototypeSchema, all field types, CollectionSchema, DerivedDef, DashboardLayout, ProtoAction |
| **[references/composables.md](references/composables.md)** | usePrototype, useProtoCollection, useProtoDoc, namespace, encryption options |
| **[references/components.md](references/components.md)** | ProtoTool, ProtoDashboard, ProtoCrudModal, ProtoCalendar, ProtoViz, ProtoActionBar |
| **[references/visualizations.md](references/visualizations.md)** | All 12 viz types with config interfaces and examples |
| **[references/offline-first.md](references/offline-first.md)** | Y.js + IndexedDB, multi-tab sync, encryption, corruption recovery, server sync |
| **[references/extensions.md](references/extensions.md)** | defineProtokitExtension, custom field/viz type registration |
| **[references/headless.md](references/headless.md)** | defineHeadlessSchema, programmatic usage without UI components |
| **[references/module-authoring.md](references/module-authoring.md)** | Building a Nuxt module that ships custom fields/viz: protokit:register-extension hook, plugin pattern |

## Progressive Loading

Load only what you need:

- Defining fields, collections, or layout? → [references/schema.md](references/schema.md)
- Writing `usePrototype` or composable options? → [references/composables.md](references/composables.md)
- Using `<ProtoTool>`, `<ProtoCrudModal>`, `<ProtoCalendar>`? → [references/components.md](references/components.md)
- Configuring `visualizations: []` in schema? → [references/visualizations.md](references/visualizations.md)
- Encryption, multi-tenant, corruption? → [references/offline-first.md](references/offline-first.md)
- Custom field or viz type? → [references/extensions.md](references/extensions.md)
- No UI, programmatic storage? → [references/headless.md](references/headless.md)
- Building a Nuxt module that ships extensions? → [references/module-authoring.md](references/module-authoring.md)

**DO NOT read all files at once.** Load based on current task.

## Related Skills

- **`nuxt`** — Nuxt 4 routing, server routes, middleware
- **`nuxt-ui`** — @nuxt/ui components for surrounding page layout
- **`vue`** — Vue 3 composables, reactivity patterns

## Module Config (`nuxt.config.ts`)

```ts
export default defineNuxtConfig({
  modules: ['@websideproject/nuxt-protokit'],
  protokit: {
    serverSync: true,          // default — syncs to /api/yjs
    // serverSync: false       // local-only, no HTTP
    // serverSync: { enabled: true, baseUrl: '/api/yjs' }
  }
})
```

_Token efficiency: Main skill ~400 tokens. Each reference file ~800–1400 tokens._
