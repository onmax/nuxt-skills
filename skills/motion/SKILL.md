---
name: motion
description: Use when adding animations with Motion Vue (motion-v) - provides motion component API, gesture animations, scroll-linked effects, layout transitions, and composables for Vue 3/Nuxt
license: MIT
---

# Motion Vue (motion-v)

Animation library for Vue 3 and Nuxt. Production-ready, hardware-accelerated animations with minimal bundle size.

**Current stable:** motion-v 1.x - Vue port of Motion (formerly Framer Motion)

## Overview

Progressive reference for Motion Vue animations. Load only files relevant to current task (~200 tokens base, 500-1500 per sub-file).

## When to Use

**Use Motion Vue for:**

- Simple declarative animations (fade, slide, scale)
- Gesture-based interactions (hover, tap, drag)
- Scroll-linked animations
- Layout animations and shared element transitions
- Spring physics animations

**Consider alternatives:**

- **GSAP** - Complex timelines, SVG morphing, scroll-triggered sequences
- **@vueuse/motion** - Simpler API, less features, smaller bundle
- **CSS animations** - Simple transitions without JS

## Installation

```bash
# Vue 3
pnpm add motion-v

# Nuxt 3
pnpm add motion-v @vueuse/nuxt
```

```ts
// nuxt.config.ts - Nuxt 3 setup
export default defineNuxtConfig({
  modules: ['motion-v/nuxt'],
})
```

## Quick Reference

| Working on...                | Load file                 |
| ---------------------------- | ------------------------- |
| Motion component, gestures   | references/components.md  |
| useMotionValue, useScroll    | references/composables.md |
| Animation examples, patterns | references/examples.md    |

## Loading Files

**Consider loading these reference files based on your task:**

- [ ] [references/components.md](references/components.md) - if using Motion component, gestures, or layout animations
- [ ] [references/composables.md](references/composables.md) - if using useMotionValue, useScroll, useSpring, or animate()
- [ ] [references/examples.md](references/examples.md) - if looking for animation patterns or inspiration

**DO NOT load all files at once.** Load only what's relevant to your current task.

## Core Concepts

### Motion Component

Render any HTML/SVG element with animation capabilities:

```vue
<script setup lang="ts">
import { motion } from 'motion-v'
</script>

<template>
  <motion.div
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :exit="{ opacity: 0, y: -20 }"
    :transition="{ duration: 0.3 }"
  >
    Animated content
  </motion.div>
</template>
```

### Gesture Animations

```vue
<motion.button
  :whileHover="{ scale: 1.05 }"
  :whilePress="{ scale: 0.95 }"
  :transition="{ type: 'spring', stiffness: 400 }"
>
  Click me
</motion.button>
```

### Scroll Animations

```vue
<motion.div
  :initial="{ opacity: 0 }"
  :whileInView="{ opacity: 1 }"
  :viewport="{ once: true, margin: '-100px' }"
>
  Appears on scroll
</motion.div>
```

## Available Guidance

**[references/components.md](references/components.md)** - Motion component variants, animation props, gesture props, layout animations, transition configuration

**[references/composables.md](references/composables.md)** - useMotionValue, useSpring, useTransform, useScroll, useInView, animate()

**[references/examples.md](references/examples.md)** - External resources, component libraries, animation patterns and inspiration
