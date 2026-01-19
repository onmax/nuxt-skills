# useMutationObserver

Watch for changes being made to the DOM tree. MutationObserver MDN

**Package:** `@vueuse/core`
**Category:** Elements

## Usage

```ts
<script setup lang="ts">
import { useMutationObserver } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const messages = ref([])

useMutationObserver(el, (mutations) => {
  if (mutations[0])
    messages.value.push(mutations[0].attributeName)
}, {
  attributes: true,
})
</script>

<template>
  <div ref="el">
    Hello VueUse
  </div>
</template>
```

## Returns

| Name | Type |
| --- | --- |
| isSupported | `useSupported` |
| stop | `Ref` |
| takeRecords | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useMutationObserver/)
