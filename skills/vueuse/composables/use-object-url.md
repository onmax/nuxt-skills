# useObjectUrl

Reactive URL representing an object.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
<script setup lang="ts">
import { useObjectUrl } from '@vueuse/core'
import { shallowRef } from 'vue'

const file = shallowRef()
const url = useObjectUrl(file)

function onFileChange(event) {
  file.value = event.target.files[0]
}
</script>

<template>
  <input type="file" @change="onFileChange">

  <a :href="url">Open file</a>
</template>
```

## Reference

[VueUse Docs](https://vueuse.org/core/useObjectUrl/)
