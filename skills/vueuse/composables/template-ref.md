# templateRef



**Package:** `@vueuse/core`
**Category:** Component

## Usage

```ts
<script lang="ts">
import { templateRef } from '@vueuse/core'

export default {
  setup() {
    const target = templateRef('target')

    // no need to return the `target`, it will bind to the ref magically
  },
}
</script>

<template>
  <div ref="target" />
</template>
```

## Reference

[VueUse Docs](https://vueuse.org/core/templateRef/)
