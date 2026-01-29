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

**Consider loading these reference files based on your task:**

- [ ] [references/composables.md](references/composables.md) - if searching for VueUse composables by category or functionality

**DO NOT load all files at once.** Load only what's relevant to your current task.

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

## SSR Gotchas

Many VueUse composables use browser APIs unavailable during SSR.

**Check with `isClient`:**

```ts
import { isClient } from '@vueuse/core'

if (isClient) {
  // Browser-only code
  const { width } = useWindowSize()
}
```

**Wrap in onMounted:**

```ts
const width = ref(0)

onMounted(() => {
  // Only runs in browser
  const { width: w } = useWindowSize()
  width.value = w.value
})
```

**Use SSR-safe composables:**

```ts
// These check isClient internally
const mouse = useMouse() // Returns {x: 0, y: 0} on server
const storage = useLocalStorage('key', 'default') // Uses default on server
```

**`@vueuse/nuxt` auto-handles SSR** - composables return safe defaults on server.

## Target Element Refs

When targeting component refs instead of DOM elements:

```ts
import type { MaybeElementRef } from '@vueuse/core'

// Component ref needs .$el to get DOM element
const compRef = ref<ComponentInstance>()
const { width } = useElementSize(compRef) // ❌ Won't work

// Use MaybeElementRef pattern
import { unrefElement } from '@vueuse/core'

const el = computed(() => unrefElement(compRef)) // Gets .$el
const { width } = useElementSize(el) // ✅ Works
```

**Or access `$el` directly:**

```ts
const compRef = ref<ComponentInstance>()

onMounted(() => {
  const el = compRef.value?.$el as HTMLElement
  const { width } = useElementSize(el)
})
```
