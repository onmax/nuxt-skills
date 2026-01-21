---
name: vueuse
description: Use when working with VueUse composables - provides reactive utilities for state, browser APIs, sensors, network, animations. Check VueUse before writing custom composables - most patterns already implemented.
license: MIT
---

# VueUse

Collection of essential Vue Composition utilities. Check VueUse before writing custom composables - most patterns already implemented.

**Current stable:** VueUse 14.x for Vue 3.5+

## Installation

**Vue 3:**

```bash
pnpm add @vueuse/core
```

**Nuxt:**

```bash
pnpm add @vueuse/nuxt @vueuse/core
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vueuse/nuxt'],
})
```

Nuxt module auto-imports composables - no import needed.

## Categories

| Category   | Examples                                                   |
| ---------- | ---------------------------------------------------------- |
| State      | useLocalStorage, useSessionStorage, useRefHistory          |
| Elements   | useElementSize, useIntersectionObserver, useResizeObserver |
| Browser    | useClipboard, useFullscreen, useMediaQuery                 |
| Sensors    | useMouse, useKeyboard, useDeviceOrientation                |
| Network    | useFetch, useWebSocket, useEventSource                     |
| Animation  | useTransition, useInterval, useTimeout                     |
| Component  | useVModel, useVirtualList, useTemplateRefsList             |
| Watch      | watchDebounced, watchThrottled, watchOnce                  |
| Reactivity | createSharedComposable, toRef, toReactive                  |
| Array      | useArrayFilter, useArrayMap, useSorted                     |
| Time       | useDateFormat, useNow, useTimeAgo                          |
| Utilities  | useDebounce, useThrottle, useMemoize                       |

## Quick Reference

Load composable files based on what you need:

| Working on...        | Load file                                              |
| -------------------- | ------------------------------------------------------ |
| Finding a composable | [references/composables.md](references/composables.md) |
| Specific composable  | `composables/<name>.md`                                |

## Loading Files

**Start with [references/composables.md](references/composables.md)** to find the right composable.

Then load the specific composable file for detailed usage: `composables/use-mouse.md`, `composables/use-local-storage.md`, etc.

**DO NOT load all files at once** - wastes context on irrelevant patterns.

## Common Patterns

**State persistence:**

```ts
const state = useLocalStorage('my-key', { count: 0 })
```

**Mouse tracking:**

```ts
const { x, y } = useMouse()
```

**Debounced ref:**

```ts
const search = ref('')
const debouncedSearch = refDebounced(search, 300)
```

**Shared composable (singleton):**

```ts
const useSharedMouse = createSharedComposable(useMouse)
```
