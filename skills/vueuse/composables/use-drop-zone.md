# useDropZone

Create a zone where files can be dropped.

**Package:** `@vueuse/core`
**Category:** Elements

## Usage

```ts
<script setup lang="ts">
import { useDropZone } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const dropZoneRef = useTemplateRef('dropZoneRef')

function onDrop(files: File[] | null) {
  // called when files are dropped on zone
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  // specify the types of data to be received.
  dataTypes: ['image/jpeg'],
  // control multi-file drop
  multiple: true,
  // whether to prevent default behavior for unhandled events
  preventDefaultForUnhandled: false,
})
</script>

<template>
  <div ref="dropZoneRef">
    Drop files here
  </div>
</template>
```

## Options

| Option                     | Type                                                                              | Default | Description                                                                       |
| -------------------------- | --------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------- |
| dataTypes                  | `MaybeRef&lt;readonly string[]&gt; \| ((types: readonly string[]) =&gt; boolean)` | -       | Allowed data types, if not set, all data types are allowed.                       |
| checkValidity              | `(items: DataTransferItemList) =&gt; boolean`                                     | -       | Similar to dataTypes, but exposes the DataTransferItemList for custom validation. |
| multiple                   | `boolean`                                                                         | -       | Allow multiple files to be dropped. Defaults to true.                             |
| preventDefaultForUnhandled | `boolean`                                                                         | -       | Prevent default behavior for unhandled events. Defaults to false.                 |

## Returns

| Name           | Type                               |
| -------------- | ---------------------------------- |
| files          | `shallowRef&lt;File[] \| null&gt;` |
| isOverDropZone | `shallowRef`                       |

## Reference

[VueUse Docs](https://vueuse.org/core/useDropZone/)
