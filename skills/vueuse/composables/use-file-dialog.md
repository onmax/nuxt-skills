# useFileDialog

Open file dialog with ease.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
<script setup lang="ts">
import { useFileDialog } from '@vueuse/core'

const { files, open, reset, onCancel, onChange } = useFileDialog({
  accept: 'image/*', // Set to accept only image files
  directory: true, // Select directories instead of files if set true
})

onChange((files) => {
  /** do something with files */
})

onCancel(() => {
  /** do something on cancel */
})
</script>

<template>
  <button type="button" @click="open">
    Choose file
  </button>
</template>
```

## Options

| Option       | Type                                      | Default                 | Description                                   |
| ------------ | ----------------------------------------- | ----------------------- | --------------------------------------------- |
| multiple     | `MaybeRef&lt;boolean&gt;`                 | true                    | @default true                                 |
| accept       | `MaybeRef&lt;string&gt;`                  | -                       | @default '\*'                                 |
| capture      | `MaybeRef&lt;string&gt;`                  | -                       | Select the input source for the capture file. |
| reset        | `MaybeRef&lt;boolean&gt;`                 | false                   | Reset when open file dialog.                  |
| directory    | `MaybeRef&lt;boolean&gt;`                 | false                   | Select directories instead of files.          |
| initialFiles | `Array&lt;File&gt; \| FileList`           | null                    | Initial files to set.                         |
| input        | `MaybeElementRef&lt;HTMLInputElement&gt;` | document.createElement( | The input element to use for file dialog.     |

## Returns

| Name     | Type                              |
| -------- | --------------------------------- |
| files    | `deepRef&lt;FileList \| null&gt;` |
| open     | `Ref`                             |
| reset    | `Ref`                             |
| onCancel | `Ref`                             |
| onChange | `Ref`                             |

## Reference

[VueUse Docs](https://vueuse.org/core/useFileDialog/)
