# useParentElement

Get parent element of the given element

**Package:** `@vueuse/core`
**Category:** Elements

## Usage

```ts
<script setup lang="ts">
import { useParentElement } from '@vueuse/core'

const parentEl = useParentElement()

onMounted(() => {
  console.log(parentEl.value)
})
</script>
```

## Reference

[VueUse Docs](https://vueuse.org/core/useParentElement/)
