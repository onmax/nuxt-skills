# useTextSelection

Reactively track user text selection based on .

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
<script setup lang="ts">
import { useTextSelection } from '@vueuse/core'

const state = useTextSelection()
</script>

<template>
  <p>{{ state.text }}</p>
</template>
```

## Returns

| Name      | Type                                  |
| --------- | ------------------------------------- |
| text      | `computed`                            |
| rects     | `computed`                            |
| ranges    | `computed&lt;Range[]&gt;`             |
| selection | `shallowRef&lt;Selection \| null&gt;` |

## Reference

[VueUse Docs](https://vueuse.org/core/useTextSelection/)
