# useDisplayMedia

Reactive streaming.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
<script setup lang="ts">
import { useDisplayMedia } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const { stream, start } = useDisplayMedia()

// start streaming
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

| Option  | Type                                            | Default | Description                           |
| ------- | ----------------------------------------------- | ------- | ------------------------------------- |
| enabled | `MaybeRef&lt;boolean&gt;`                       | false   | If the stream is enabled              |
| video   | `boolean \| MediaTrackConstraints \| undefined` | -       | If the stream video media constraints |
| audio   | `boolean \| MediaTrackConstraints \| undefined` | -       | If the stream audio media constraints |

## Returns

| Name        | Type                                         |
| ----------- | -------------------------------------------- |
| isSupported | `useSupported`                               |
| stream      | `shallowRef&lt;MediaStream \| undefined&gt;` |
| start       | `Ref`                                        |
| stop        | `Ref`                                        |
| enabled     | `shallowRef`                                 |

## Reference

[VueUse Docs](https://vueuse.org/core/useDisplayMedia/)
