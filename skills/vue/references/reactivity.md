---
name: Vue Reactivity System
description: Core reactivity primitives - ref, reactive, computed, and watchers
---

# Vue Reactivity System

Vue's reactivity system enables automatic tracking of state changes and DOM updates.

## ref()

Create reactive primitive values with `ref()`. Access/modify via `.value` in JavaScript, auto-unwrapped in templates.

```ts
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0
count.value++
```

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

### Typing refs

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

// Type inference
const year = ref(2020) // Ref<number>

// Explicit generic
const name = ref<string | null>(null)

// Ref type annotation
const id: Ref<string | number> = ref('abc')
```

## reactive()

Create reactive objects. No `.value` needed, but cannot reassign the entire object.

```ts
import { reactive } from 'vue'

interface State {
  count: number
  name: string
}

const state: State = reactive({
  count: 0,
  name: 'Vue'
})

state.count++ // reactive
```

### Limitations of reactive()

1. **Only works with objects** - not primitives
2. **Cannot replace entire object** - loses reactivity
3. **Destructuring loses reactivity** - use `toRefs()` instead

```ts
const state = reactive({ count: 0 })

// ❌ Loses reactivity
let { count } = state

// ✅ Use toRefs
import { toRefs } from 'vue'
const { count } = toRefs(state)
```

## Recommendation

Use `ref()` as the primary API for declaring reactive state - it works with any value type and has consistent behavior.

## Deep Reactivity

Both `ref()` and `reactive()` are deeply reactive by default:

```ts
const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

// These trigger updates
obj.value.nested.count++
obj.value.arr.push('baz')
```

Use `shallowRef()` or `shallowReactive()` to opt out of deep reactivity for performance.

## DOM Update Timing

DOM updates are batched and asynchronous. Use `nextTick()` to wait for updates:

```ts
import { ref, nextTick } from 'vue'

const count = ref(0)

async function increment() {
  count.value++
  await nextTick()
  // DOM is now updated
}
```

## Ref Unwrapping Rules

- **In templates**: Top-level refs auto-unwrap
- **In reactive objects**: Refs auto-unwrap when accessed as properties
- **In arrays/collections**: Refs do NOT auto-unwrap

```ts
const count = ref(0)
const state = reactive({ count })

console.log(state.count) // 0 (unwrapped)

const books = reactive([ref('Vue Guide')])
console.log(books[0].value) // Need .value
```

## computed()

Derive values from reactive state with automatic caching. Only re-evaluates when dependencies change.

```ts
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// Readonly computed
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// Writable computed
const fullNameWritable = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue: string) {
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
```

### Computed Best Practices

- **Getters should be pure** - no side effects, no mutating other state
- **Don't mutate computed values** - mutate the source instead
- **Use computed over methods** for derived data (caching benefit)

```ts
// ✅ Cached - only recalculates when items changes
const activeItems = computed(() => items.value.filter(x => x.active))

// ❌ Not cached - runs on every render
function getActiveItems() {
  return items.value.filter(x => x.active)
}
```

## watch()

Explicitly watch reactive sources and run side effects when they change. Lazy by default.

```ts
import { ref, watch } from 'vue'

const id = ref(1)

watch(id, async (newId, oldId) => {
  const data = await fetchData(newId)
  // handle data...
})
```

### Watch Source Types

```ts
const x = ref(0)
const obj = reactive({ count: 0 })

// Single ref
watch(x, (newX) => console.log(newX))

// Getter function
watch(() => obj.count, (count) => console.log(count))

// Multiple sources
watch([x, () => obj.count], ([newX, newCount]) => {
  console.log(newX, newCount)
})
```

### Watch Options

```ts
watch(source, callback, {
  immediate: true,  // Run immediately on creation
  deep: true,       // Watch nested properties
  once: true,       // Trigger only once (3.4+)
  flush: 'post'     // Run after DOM update
})
```

## watchEffect()

Automatically tracks dependencies and runs immediately. Re-runs when any tracked dependency changes.

```ts
import { ref, watchEffect } from 'vue'

const todoId = ref(1)
const data = ref(null)

watchEffect(async () => {
  const response = await fetch(`/api/todos/${todoId.value}`)
  data.value = await response.json()
})
```

### watch vs watchEffect

| Feature             | watch            | watchEffect           |
| ------------------- | ---------------- | --------------------- |
| Dependency tracking | Explicit         | Automatic             |
| Lazy                | Yes              | No (immediate)        |
| Access old value    | Yes              | No                    |
| Best for            | Specific sources | Multiple dependencies |

## Watcher Cleanup (3.5+)

Cancel stale async operations:

```ts
import { watch, onWatcherCleanup } from 'vue'

watch(id, async (newId) => {
  const controller = new AbortController()

  fetch(`/api/${newId}`, { signal: controller.signal })

  onWatcherCleanup(() => controller.abort())
})
```

## Stopping Watchers

```ts
const stop = watch(source, callback)
const stop2 = watchEffect(() => { /* ... */ })

// Stop manually
stop()
stop2()

// Pause/Resume (3.5+)
const { stop, pause, resume } = watchEffect(() => { /* ... */ })
```

<!--
Source references:
- https://vuejs.org/guide/essentials/reactivity-fundamentals.html
- https://vuejs.org/guide/essentials/computed.html
- https://vuejs.org/guide/essentials/watchers.html
- https://vuejs.org/api/reactivity-core.html
-->
