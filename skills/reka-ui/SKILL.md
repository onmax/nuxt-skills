---
name: reka-ui
description: Use when building with Reka UI (headless Vue components) - provides component API, accessibility patterns, composition (asChild), controlled/uncontrolled state, virtualization, and styling integration. Formerly Radix Vue.
license: MIT
---

# Reka UI

Unstyled, accessible Vue 3 component primitives. WAI-ARIA compliant. Previously Radix Vue.

**Current version:** v2.7.0 (December 2025)

## When to Use

- Building headless/unstyled components from scratch
- Need WAI-ARIA compliant components
- Using Nuxt UI, shadcn-vue, or other Reka-based libraries
- Implementing accessible forms, dialogs, menus, popovers

**For Vue patterns:** use `vue` skill

## Available Guidance

| File                                                     | Topics                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------- |
| **[references/components.md](references/components.md)** | Component index by category (Form, Date, Overlay, Menu, Data, etc.) |
| **components/\*.md**                                     | Per-component details (dialog.md, select.md, etc.)                  |

**New guides** (see [reka-ui.com](https://reka-ui.com)): Controlled State, Inject Context, Virtualization, Migration

## Loading Files

**Consider loading these reference files based on your task:**

- [ ] [references/components.md](references/components.md) - if browsing component index by category or searching for specific components

**DO NOT load all files at once.** Load only what's relevant to your current task.

**For styled Nuxt components built on Reka UI:** use **nuxt-ui** skill

## Key Concepts

| Concept                 | Description                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| `asChild`               | Render as child element instead of wrapper, merging props/behavior    |
| Controlled/Uncontrolled | Use `v-model` for controlled, `default*` props for uncontrolled       |
| Parts                   | Components split into Root, Trigger, Content, Portal, etc.            |
| `forceMount`            | Keep element in DOM for animation libraries                           |
| Virtualization          | Optimize large lists (Combobox, Listbox, Tree) with virtual scrolling |
| Context Injection       | Access component context from child components                        |

## Installation

```ts
// nuxt.config.ts (auto-imports all components)
export default defineNuxtConfig({
  modules: ['reka-ui/nuxt']
})
```

```ts
import { RekaResolver } from 'reka-ui/resolver'
// vite.config.ts (with auto-import resolver)
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({ resolvers: [RekaResolver()] })
  ]
})
```

## Basic Patterns

```vue
<!-- Dialog with controlled state -->
<script setup>
import { DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from 'reka-ui'
const open = ref(false)
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger>Open</DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 bg-black/50" />
      <DialogContent class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded">
        <DialogTitle>Title</DialogTitle>
        <DialogDescription>Description</DialogDescription>
        <DialogClose>Close</DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
```

```vue
<!-- Select with uncontrolled default -->
<SelectRoot default-value="apple">
  <SelectTrigger>
    <SelectValue placeholder="Pick fruit" />
  </SelectTrigger>
  <SelectPortal>
    <SelectContent>
      <SelectViewport>
        <SelectItem value="apple"><SelectItemText>Apple</SelectItemText></SelectItem>
        <SelectItem value="banana"><SelectItemText>Banana</SelectItemText></SelectItem>
      </SelectViewport>
    </SelectContent>
  </SelectPortal>
</SelectRoot>
```

```vue
<!-- asChild for custom trigger element -->
<DialogTrigger as-child>
  <button class="my-custom-button">Open</button>
</DialogTrigger>
```

## Recent Updates (v2.5.0-v2.7.0)

- **New composables exposed**: `useLocale`, `useDirection` (v2.6.0)
- **Select**: Added `disableOutsidePointerEvents` prop to Content
- **Toast**: Added `disableSwipe` prop for swipe control
- **DatePicker**: Added `closeOnSelect` property
- **ContextMenu**: Added `pressOpenDelay` for long-press configuration
- **Virtualization**: `estimateSize` now accepts function for Listbox/Tree (v2.7.0); supported in Combobox, Listbox, Tree

## Resources

- [Reka UI Docs](https://reka-ui.com)
- [GitHub](https://github.com/unovue/reka-ui)
- [Nuxt UI](https://ui.nuxt.com) (styled Reka components)
- [shadcn-vue](https://www.shadcn-vue.com) (styled Reka components)

---

_Token efficiency: ~350 tokens base, components.md index ~100 tokens, per-component ~50-150 tokens_
