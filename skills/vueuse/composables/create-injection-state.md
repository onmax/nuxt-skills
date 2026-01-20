# createInjectionState

Create global state that can be injected into components.

**Package:** `@vueuse/shared`
**Category:** State

## Usage

```ts
<!-- RootComponent.vue -->
<script setup lang="ts">
// @filename: useCounterStore.ts
// @include: useCounterStore
// ---cut---
import { useProvideCounterStore } from './useCounterStore'

useProvideCounterStore(0)
</script>

<template>
  <div>
    <slot />
  </div>
</template>
```

## Options

| Option       | Type                                   | Default | Description                            |
| ------------ | -------------------------------------- | ------- | -------------------------------------- |
| injectionKey | `string \| InjectionKey&lt;Return&gt;` | -       | Custom injectionKey for InjectionState |
| defaultValue | `Return`                               | -       | Default value for the InjectionState   |

## Reference

[VueUse Docs](https://vueuse.org/core/createInjectionState/)
