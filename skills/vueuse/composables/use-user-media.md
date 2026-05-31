# useUserMedia

Reactive streaming.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
<script setup lang="ts">
import { useUserMedia } from '@vueuse/core'
import { useTemplateRef, watchEffect } from 'vue'

const { stream, start } = useUserMedia()
start()

const videoRef = useTemplateRef('video')
watchEffect(() => {
  // preview on a video element
  videoRef.value.srcObject = stream.value
})
</script>

<template>
  <video ref="video" />
</template>
```

## Options

| Option     | Type                      | Default | Description                                           |
| ---------- | ------------------------- | ------- | ----------------------------------------------------- |
| enabled    | `MaybeRef&lt;boolean&gt;` | false   | If the stream is enabled                              |
| autoSwitch | `MaybeRef&lt;boolean&gt;` | true    | Recreate stream when deviceIds or constraints changed |

## Returns

| Name        | Type           |
| ----------- | -------------- |
| isSupported | `useSupported` |
| stream      | `Ref`          |
| start       | `Ref`          |
| stop        | `Ref`          |
| restart     | `Ref`          |
| constraints | `deepRef`      |
| enabled     | `shallowRef`   |
| autoSwitch  | `shallowRef`   |

## Reference

[VueUse Docs](https://vueuse.org/core/useUserMedia/)
