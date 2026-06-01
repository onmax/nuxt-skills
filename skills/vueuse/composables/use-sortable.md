# useSortable

Wrapper for .

**Package:** `@vueuse/integrations`
**Category:** '@Integrations'

## Usage

```ts
<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable'
import { shallowRef, useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const list = shallowRef([{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' }])

useSortable(el, list)
</script>

<template>
  <div ref="el">
    <div v-for="item in list" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| watchElement | `boolean` | false | Watch the element reference for changes and automatically reinitialize Sortable |

## Returns

| Name | Type |
| --- | --- |
| stop | `Ref` |
| start | `Ref` |
| option | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useSortable/)
