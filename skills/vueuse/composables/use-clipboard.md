# useClipboard

Reactive Clipboard API. Provides the ability to respond to clipboard commands (cut, copy, and paste) as well as to asynchronously read from and write to the system clipboard. Access to the contents of the clipboard is gated behind the Permissions API. Without user permission, reading or altering the clipboard contents is not permitted.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const source = ref('Hello')
const { text, copy, copied, isSupported } = useClipboard({ source })
</script>

<template>
  <div v-if="isSupported">
    <button @click="copy(source)">
      <!-- by default, `copied` will be reset in 1.5s -->
      <span v-if="!copied">Copy</span>
      <span v-else>Copied!</span>
    </button>
    <p>Current copied: <code>{{ text || 'none' }}</code></p>
  </div>
  <p v-else>
    Your browser does not support Clipboard API
  </p>
</template>
```

## Options

| Option       | Type      | Default | Description                                                                 |
| ------------ | --------- | ------- | --------------------------------------------------------------------------- |
| read         | `boolean` | false   | Enabled reading for clipboard                                               |
| source       | `Source`  | -       | Copy source                                                                 |
| copiedDuring | `number`  | 1500    | Milliseconds to reset state of `copied` ref                                 |
| legacy       | `boolean` | false   | Whether fallback to document.execCommand('copy') if clipboard is undefined. |

## Returns

| Name        | Type         |
| ----------- | ------------ |
| isSupported | `computed`   |
| text        | `shallowRef` |
| copied      | `shallowRef` |
| copy        | `Ref`        |

## Reference

[VueUse Docs](https://vueuse.org/core/useClipboard/)
