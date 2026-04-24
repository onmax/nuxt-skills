# useTextareaAutosize

Automatically update the height of a textarea depending on the content.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'

const { textarea, input } = useTextareaAutosize()
</script>

<template>
  <textarea
    ref="textarea"
    v-model="input"
    class="resize-none"
    placeholder="What's on your mind?"
  />
</template>
```

## Options

| Option      | Type                                                       | Default | Description |
| ----------- | ---------------------------------------------------------- | ------- | ----------- |
| element     | `MaybeRef&lt;HTMLTextAreaElement \| undefined \| null&gt;` | -       |             |
| input       | `MaybeRef&lt;string&gt;`                                   | -       |             |
| watch       | `WatchSource \| MultiWatchSources`                         | -       |             |
| onResize    | `() =&gt; void`                                            | -       |             |
| styleTarget | `MaybeRef&lt;HTMLElement \| undefined&gt;`                 | -       |             |
| styleProp   | `'height' \| 'minHeight'`                                  | -       |             |

## Returns

| Name          | Type    |
| ------------- | ------- |
| textarea      | `toRef` |
| input         | `toRef` |
| triggerResize | `Ref`   |

## Reference

[VueUse Docs](https://vueuse.org/core/useTextareaAutosize/)
