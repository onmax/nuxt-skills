# useDateFormat

Get the formatted date according to the string of tokens passed in, inspired by dayjs.

**Package:** `@vueuse/shared`
**Category:** Time

## Usage

```ts
<script setup lang="ts">
import { useDateFormat, useNow } from '@vueuse/core'

const formatted = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss')
</script>

<template>
  <div>{{ formatted }}</div>
</template>
```

## Reference

[VueUse Docs](https://vueuse.org/core/useDateFormat/)
