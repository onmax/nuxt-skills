---
name: Provide / Inject
description: Pass data through component tree without prop drilling
---

# Provide / Inject

Provide data from ancestor components to any descendant, avoiding prop drilling.

## Basic Usage

```vue
<!-- Provider.vue -->
<script setup lang="ts">
import { provide, ref } from 'vue'

const message = ref('hello')
provide('message', message)
</script>
```

```vue
<!-- DeepChild.vue (any level deep) -->
<script setup lang="ts">
import { inject } from 'vue'

const message = inject('message')
</script>
```

## Typing with InjectionKey

Use `InjectionKey` for type safety between provider and injector:

```ts
// keys.ts
import type { InjectionKey, Ref } from 'vue'

export const messageKey = Symbol() as InjectionKey<Ref<string>>
export const countKey = Symbol() as InjectionKey<number>
```

```vue
<!-- Provider.vue -->
<script setup lang="ts">
import { provide, ref } from 'vue'
import { messageKey } from './keys'

const message = ref('hello')
provide(messageKey, message)
</script>
```

```vue
<!-- Injector.vue -->
<script setup lang="ts">
import { inject } from 'vue'
import { messageKey } from './keys'

const message = inject(messageKey) // Ref<string> | undefined
</script>
```

## Default Values

```ts
// Simple default
const value = inject('message', 'default value')

// Factory function (for expensive defaults)
const value = inject('key', () => new ExpensiveClass(), true)
//                                                       ^ treat as factory
```

## App-Level Provide

Available to all components:

```ts
// main.ts
import { createApp } from 'vue'

const app = createApp(App)
app.provide('globalConfig', { theme: 'dark' })
```

## Reactive Provide/Inject

Provide reactive values for automatic updates:

```vue
<!-- Provider.vue -->
<script setup lang="ts">
import { provide, ref } from 'vue'

const count = ref(0)
provide('count', count)
</script>
```

The injected value maintains reactivity connection.

## Mutations Best Practice

Keep mutations in the provider, expose update functions:

```vue
<!-- Provider.vue -->
<script setup lang="ts">
import { provide, ref, readonly } from 'vue'

const location = ref('North Pole')

function updateLocation(newLocation: string) {
  location.value = newLocation
}

provide('location', {
  location: readonly(location), // Prevent direct mutation
  updateLocation
})
</script>
```

```vue
<!-- Injector.vue -->
<script setup lang="ts">
import { inject } from 'vue'

const { location, updateLocation } = inject('location')!
</script>

<template>
  <button @click="updateLocation('South Pole')">
    {{ location }}
  </button>
</template>
```

## Using Symbol Keys

Recommended for libraries and large apps to avoid collisions:

```ts
// keys.ts
export const myKey = Symbol('myKey')

// provider
provide(myKey, value)

// injector
inject(myKey)
```

## Type Helpers

```ts
// String key with explicit type
const foo = inject<string>('foo')
//    ^? string | undefined

// With default (removes undefined)
const foo = inject<string>('foo', 'default')
//    ^? string

// Force non-undefined (use when certain it's provided)
const foo = inject('foo') as string
```

<!--
Source references:
- https://vuejs.org/guide/components/provide-inject.html
- https://vuejs.org/guide/typescript/composition-api.html#typing-provide-inject
-->
