# onLongPress

Listen for a long press on an element.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
<script setup lang="ts">
import { onLongPress } from '@vueuse/core'
import { shallowRef, useTemplateRef } from 'vue'

const htmlRefHook = useTemplateRef('htmlRefHook')
const longPressedHook = shallowRef(false)

function onLongPressCallbackHook(e: PointerEvent) {
  longPressedHook.value = true
}
function resetHook() {
  longPressedHook.value = false
}

onLongPress(
  htmlRefHook,
  onLongPressCallbackHook,
  {
    modifiers: {
      prevent: true
    }
  }
)
</script>

<template>
  <p>Long Pressed: {{ longPressedHook }}</p>

  <button ref="htmlRefHook" class="ml-2 button small">
    Press long
  </button>

  <button class="ml-2 button small" @click="resetHook">
    Reset
  </button>
</template>
```

## Options

| Option            | Type                                                                    | Default | Description                                       |
| ----------------- | ----------------------------------------------------------------------- | ------- | ------------------------------------------------- |
| delay             | `number \| ((ev: PointerEvent) =&gt; number)`                           | 500     | Time in ms till `longpress` gets called           |
| distanceThreshold | `number \| false`                                                       | 10      | Allowance of moving distance in pixels,           |
| onMouseUp         | `(duration: number, distance: number, isLongPress: boolean) =&gt; void` | -       | Function called when the ref element is released. |

## Reference

[VueUse Docs](https://vueuse.org/core/onLongPress/)
