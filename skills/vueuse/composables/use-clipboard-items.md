# useClipboardItems

Reactive Clipboard API. Provides the ability to respond to clipboard commands (cut, copy, and paste) as well as to asynchronously read from and write to the system clipboard. Access to the contents of the clipboard is gated behind the Permissions API. Without user permission, reading or altering the clipboard contents is not permitted.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
<script setup lang="ts">
import { useClipboardItems } from '@vueuse/core'

const mime = 'text/plain'
const source = ref([
  new ClipboardItem({
    [mime]: new Blob(['plain text'], { type: mime }),
  })
])

const { content, copy, copied, isSupported } = useClipboardItems({ source })
</script>

<template>
  <div v-if="isSupported">
    <button @click="copy(source)">
      <!-- by default, `copied` will be reset in 1.5s -->
      <span v-if="!copied">Copy</span>
      <span v-else>Copied!</span>
    </button>
    <p>
      Current copied: <code>{{ content || 'none' }}</code>
    </p>
  </div>
  <p v-else>
    Your browser does not support Clipboard API
  </p>
</template>
```

## Options

| Option       | Type      | Default | Description                                 |
| ------------ | --------- | ------- | ------------------------------------------- |
| read         | `boolean` | false   | Enabled reading for clipboard               |
| source       | `Source`  | -       | Copy source                                 |
| copiedDuring | `number`  | 1500    | Milliseconds to reset state of `copied` ref |

## Returns

| Name        | Type                            |
| ----------- | ------------------------------- |
| isSupported | `useSupported`                  |
| content     | `deepRef&lt;ClipboardItems&gt;` |
| copied      | `shallowRef`                    |
| copy        | `Ref`                           |
| read        | `Ref`                           |

## Reference

[VueUse Docs](https://vueuse.org/core/useClipboardItems/)
