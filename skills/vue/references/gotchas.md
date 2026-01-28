# Vue Common Gotchas & Edge Cases

Critical Vue 3 gotchas that cause silent failures or hard-to-debug issues.

> Based on [vuejs-ai/skills](https://github.com/vuejs-ai/skills) vue-best-practices. For comprehensive coverage (200+ rules), see the upstream repo.

## Reactivity

### Always Use `.value` When Accessing ref() in Scripts

**Impact: HIGH** - Forgetting `.value` causes silent failures.

```ts
const count = ref(0)

// WRONG
count++           // Tries to increment the ref object
count = 5         // Reassigns variable, loses reactivity
items.push(4)     // Error: push is not a function

// CORRECT
count.value++
count.value = 5
items.value.push(4)

// In templates - NO .value needed (Vue unwraps automatically)
// {{ count }} works, not {{ count.value }}
```

### Never Destructure reactive() Objects Directly

**Impact: HIGH** - Destructuring breaks reactive connection.

```ts
const state = reactive({ count: 0, name: 'Vue' })

// WRONG - destructured variables lose reactivity
const { count, name } = state
state.count++
console.log(count)  // Still 0!

// CORRECT - use toRefs()
const { count, name } = toRefs(state)
state.count++
console.log(count.value)  // 1

// BEST - just use ref() instead of reactive()
const count = ref(0)
const name = ref('Vue')
```

### Proxy Identity Hazard with reactive()

```ts
const raw = {}
const proxy = reactive(raw)

// WRONG - comparing different objects
console.log(proxy === raw) // false

// WRONG - creating multiple proxies
const a = reactive({})
const b = reactive(a)  // Returns same proxy
console.log(a === b) // true (same object)

// GOTCHA - nested objects get proxied too
const nested = reactive({ obj: {} })
console.log(nested.obj === nested.obj) // true (same proxy)
```

## Computed Properties

### No Side Effects in Computed Getters

**Impact: HIGH** - Side effects break reactivity model.

```ts
// WRONG - mutates state
const doubled = computed(() => {
  count.value++  // Side effect!
  return count.value * 2
})

// WRONG - async operation
const data = computed(async () => {
  return await fetch('/api')  // Side effect!
})

// CORRECT - pure computation only
const doubled = computed(() => count.value * 2)

// For side effects, use watch:
watch(count, (newVal) => {
  document.title = `Count: ${newVal}`
})
```

### Computed Returns Are Read-Only

```ts
const fullName = computed(() => `${first.value} ${last.value}`)

// WRONG - computed values are read-only
fullName.value = 'John Doe'  // Error!

// CORRECT - use writable computed
const fullName = computed({
  get: () => `${first.value} ${last.value}`,
  set: (val) => {
    const [f, l] = val.split(' ')
    first.value = f
    last.value = l
  }
})
```

## Watchers

### Clean Up Async Operations to Prevent Race Conditions

**Impact: HIGH** - Stale requests can overwrite newer data.

```ts
const query = ref('')
const results = ref([])

// WRONG - race condition
watch(query, async (q) => {
  const res = await fetch(`/api?q=${q}`)
  results.value = await res.json()  // May overwrite newer results!
})

// CORRECT - use onWatcherCleanup (Vue 3.5+)
watch(query, async (q) => {
  const controller = new AbortController()
  onWatcherCleanup(() => controller.abort())

  try {
    const res = await fetch(`/api?q=${q}`, { signal: controller.signal })
    results.value = await res.json()
  } catch (e) {
    if (e.name !== 'AbortError') throw e
  }
})

// Or use onCleanup parameter
watch(query, async (q, oldQ, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())
  // ... same as above
})
```

### Deep Watch Returns Same Object Reference

```ts
const obj = reactive({ nested: { count: 0 } })

// GOTCHA - oldValue === newValue for deep watches
watch(obj, (newVal, oldVal) => {
  console.log(newVal === oldVal)  // true! Same object
}, { deep: true })

// If you need old value, clone first:
watch(
  () => structuredClone(obj),
  (newVal, oldVal) => { /* now different */ }
)
```

## Props

### Props Are Read-Only - Never Mutate

**Impact: HIGH** - Breaks one-way data flow.

```ts
const props = defineProps<{ count: number; user: User }>()

// WRONG - direct mutation
props.count++  // Vue warning
props.user.name = 'New'  // No warning but still wrong!

// CORRECT - emit to parent
const emit = defineEmits(['update:count', 'update-user'])
emit('update:count', props.count + 1)
emit('update-user', { ...props.user, name: 'New' })

// Or create local copy
const localUser = ref({ ...props.user })
```

### Destructured Props Don't Update Watchers (pre-3.5)

```ts
// WRONG (Vue < 3.5)
const { count } = defineProps<{ count: number }>()
watch(count, () => {})  // Won't trigger!

// CORRECT - use getter
const props = defineProps<{ count: number }>()
watch(() => props.count, () => {})

// Vue 3.5+ - destructuring works with reactive props
const { count } = defineProps<{ count: number }>()
watch(() => count, () => {})  // Works in 3.5+
```

## Lifecycle Hooks

### Register Hooks Synchronously During Setup

**Impact: HIGH** - Async hooks silently fail.

```ts
// WRONG - hook registered after await
async setup() {
  const data = await fetchData()
  onMounted(() => {})  // Will NEVER run!
}

// WRONG - hook in setTimeout
setup() {
  setTimeout(() => {
    onMounted(() => {})  // Will NEVER run!
  }, 100)
}

// CORRECT - register synchronously, async inside
setup() {
  onMounted(async () => {
    const data = await fetchData()
  })
}
```

## Templates

### Never Use v-if with v-for on Same Element

**Impact: HIGH** - Vue 2/3 precedence differs.

```vue
<!-- WRONG - ambiguous precedence -->
<li v-for="user in users" v-if="user.active" :key="user.id">

<!-- Vue 3: v-if runs FIRST, 'user' undefined! -->

<!-- CORRECT - computed filter -->
<li v-for="user in activeUsers" :key="user.id">

<script setup>
const activeUsers = computed(() => users.filter(u => u.active))
</script>

<!-- CORRECT - template wrapper -->
<template v-for="user in users" :key="user.id">
  <li v-if="user.active">{{ user.name }}</li>
</template>
```

### Template Refs Are Null with v-if

```ts
const inputRef = ref<HTMLInputElement | null>(null)

// GOTCHA - ref is null when element hidden
<input v-if="show" ref="inputRef" />

// WRONG - may be null
inputRef.value.focus()  // Error if !show

// CORRECT - null check
inputRef.value?.focus()

// Or use watchEffect with flush: 'post'
watchEffect(() => {
  inputRef.value?.focus()
}, { flush: 'post' })
```

## defineModel

### Object Mutations Don't Emit

```ts
const model = defineModel<{ name: string }>()

// WRONG - mutation doesn't notify parent
model.value.name = 'New'  // Parent won't know!

// CORRECT - replace entire object
model.value = { ...model.value, name: 'New' }
```

### Updated Value Needs nextTick

```ts
const model = defineModel<string>()

// WRONG - value not updated yet
model.value = 'new'
console.log(model.value)  // Still old value!

// CORRECT - wait for nextTick
model.value = 'new'
await nextTick()
console.log(model.value)  // Now 'new'
```

## Component Events

### Undeclared Emits Can Fire Twice

```ts
// WRONG - missing emit declaration causes double firing
const emit = defineEmits([])  // 'click' not declared
<button @click="emit('click')">  // Fires twice!

// CORRECT - declare all custom events
const emit = defineEmits(['click'])
```

### Events Don't Bubble Through Components

```vue
<!-- Parent can't listen to grandchild events directly -->
<Grandparent>
  <Parent>
    <Child @custom="handler" />  <!-- Only Parent can listen -->
  </Parent>
</Grandparent>

<!-- Solution: re-emit or use provide/inject -->
```

## Provide/Inject

### Reactivity Not Automatic

```ts
// Provider
const count = ref(0)
provide('count', count)  // Pass the ref, not .value

// Consumer
const count = inject('count')  // Receives the ref
console.log(count.value)  // Reactive!

// WRONG - loses reactivity
provide('count', count.value)  // Just passes number
```

### Must Call Provide Synchronously

```ts
// WRONG - provide after async
async setup() {
  await fetchData()
  provide('key', value)  // Silently fails!
}

// CORRECT
setup() {
  provide('key', value)  // Synchronous
  onMounted(async () => {
    await fetchData()
  })
}
```

## SSR

### Lifecycle Hooks Don't Run on Server

```ts
// onMounted, onUpdated, onUnmounted - client only
onMounted(() => {
  // Only runs in browser
  window.addEventListener('resize', handler)
})

// For SSR, use onServerPrefetch for data
onServerPrefetch(async () => {
  data.value = await fetchData()
})
```

### Hydration Mismatch Causes

Common causes:

- Browser-only APIs (`window`, `localStorage`)
- Different timestamps
- Random values
- User-agent specific rendering

```ts
// WRONG
const width = ref(window.innerWidth)  // undefined on server

// CORRECT
const width = ref(0)
onMounted(() => {
  width.value = window.innerWidth
})
```

## Performance

### Use shallowRef for Large Non-Reactive Data

```ts
// WRONG - deep reactivity overhead
const hugeList = ref(thousandsOfItems)

// CORRECT - only track .value assignment
const hugeList = shallowRef(thousandsOfItems)

// Trigger update by replacing entire array
hugeList.value = [...hugeList.value, newItem]
```

### markRaw for Non-Reactive Objects

```ts
// WRONG - Chart.js instance becomes reactive (breaks it)
const chart = ref(new Chart(ctx, config))

// CORRECT - mark as non-reactive
const chart = ref(markRaw(new Chart(ctx, config)))
```

## References

- [vuejs-ai/skills vue-best-practices](https://github.com/vuejs-ai/skills/tree/main/skills/vue-best-practices) - Full 200+ rules
- [Vue Style Guide](https://vuejs.org/style-guide/)
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
