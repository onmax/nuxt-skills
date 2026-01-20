# createTemplatePromise

Template as Promise. Useful for constructing custom Dialogs, Modals, Toasts, etc.

**Package:** `@vueuse/core`
**Category:** Component

## Usage

```ts
<script setup lang="ts">
import { createTemplatePromise } from '@vueuse/core'

const TemplatePromise = createTemplatePromise<ReturnType>()

async function open() {
  const result = await TemplatePromise.start()
  // button is clicked, result is 'ok'
}
</script>

<template>
  <TemplatePromise v-slot="{ promise, resolve, reject, args }">
    <!-- your UI -->
    <button @click="resolve('ok')">
      OK
    </button>
  </TemplatePromise>
</template>
```

## Reference

[VueUse Docs](https://vueuse.org/core/createTemplatePromise/)
