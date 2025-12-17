---
name: nuxt-ui
description: Use when building with Nuxt UI - provides component docs, template references, and patterns for UI-focused Nuxt projects
---

# Nuxt UI v4

Component library for Vue 3 and Nuxt 4+ built on Reka UI (headless) + Tailwind CSS v4 + Tailwind Variants.

## When to Use

- Installing/configuring @nuxt/ui
- Using UI components (Button, Card, Table, Form, etc.)
- Customizing theme (colors, variants, CSS variables)
- Building forms with validation
- Using overlays (Modal, Toast, CommandPalette)
- Working with composables (useToast, useOverlay)

**For Vue component patterns:** use `vue` skill
**For Nuxt routing/server:** use `nuxt` skill

## Available Guidance

| File                 | Topics                                                           |
| -------------------- | ---------------------------------------------------------------- |
| **installation.md**  | Nuxt/Vue setup, pnpm gotchas, UApp wrapper, module options       |
| **theming.md**       | Semantic colors, CSS variables, app.config.ts, Tailwind Variants |
| **components.md**    | Component index by category (121 components)                     |
| **components/\*.md** | Per-component details (button.md, modal.md, etc.)                |
| **forms.md**         | Form components, validation (Zod/Valibot), useFormField          |
| **overlays.md**      | Toast, Modal, Slideover, Drawer, CommandPalette                  |
| **composables.md**   | useToast, useOverlay, defineShortcuts, useScrollspy              |

## Usage Pattern

```bash
# Installing Nuxt UI?
cat ~/.claude/skills/nuxt-ui/installation.md

# Customizing theme?
cat ~/.claude/skills/nuxt-ui/theming.md

# Component index - find what you need
cat ~/.claude/skills/nuxt-ui/components.md

# Specific component details
cat ~/.claude/skills/nuxt-ui/components/button.md
cat ~/.claude/skills/nuxt-ui/components/modal.md
cat ~/.claude/skills/nuxt-ui/components/form.md

# Building forms?
cat ~/.claude/skills/nuxt-ui/forms.md

# Using overlays/modals?
cat ~/.claude/skills/nuxt-ui/overlays.md

# Using composables?
cat ~/.claude/skills/nuxt-ui/composables.md
```

**DO NOT read all files at once.** Load based on context.

## Key Concepts

| Concept           | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| UApp              | Required wrapper component for Toast, Tooltip, overlays    |
| Tailwind Variants | Type-safe styling with slots, variants, compoundVariants   |
| Semantic Colors   | primary, secondary, success, error, warning, info, neutral |
| Reka UI           | Headless component primitives (accessibility built-in)     |

> For headless component primitives (API details, accessibility patterns, asChild): read the **reka-ui** skill

## Quick Reference

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css']
})
```

```css
/* assets/css/main.css */
@import 'tailwindcss';
@import '@nuxt/ui';
```

```vue
<!-- app.vue - UApp wrapper required -->
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

## Resources

- [Nuxt UI Docs](https://ui.nuxt.com)
- [Component Reference](https://ui.nuxt.com/components)
- [Theme Customization](https://ui.nuxt.com/getting-started/theme)

---

_Token efficiency: Main skill ~300 tokens, each sub-file ~800-1200 tokens_
