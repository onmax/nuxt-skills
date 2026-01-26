# useMediaControls

Reactive media controls for both and elements

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
<script setup lang="ts">
import { useMediaControls } from '@vueuse/core'
import { onMounted, useTemplateRef } from 'vue'

const video = useTemplateRef('video')
const { playing, currentTime, duration, volume } = useMediaControls(video, {
  src: 'video.mp4',
})

// Change initial media properties
onMounted(() => {
  volume.value = 0.5
  currentTime.value = 60
})
</script>

<template>
  <video ref="video" />
  <button @click="playing = !playing">
    Play / Pause
  </button>
  <span>{{ currentTime }} / {{ duration }}</span>
</template>
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| src | `MaybeRefOrGetter&lt;string \| UseMediaSource \| UseMediaSource[]&gt;` | - | The source for the media, may either be a string, a `UseMediaSource` object, or a list |
| tracks | `MaybeRefOrGetter&lt;UseMediaTextTrackSource[]&gt;` | - | A list of text tracks for the media |

## Returns

| Name | Type |
| --- | --- |
| currentTime | `shallowRef` |
| duration | `shallowRef` |
| waiting | `shallowRef` |
| seeking | `shallowRef` |
| ended | `shallowRef` |
| stalled | `shallowRef` |
| buffered | `deepRef&lt;[number, number][]&gt;` |
| playing | `shallowRef` |
| rate | `shallowRef` |
| muted | `shallowRef` |
| selectedTrack | `shallowRef&lt;number&gt;` |
| enableTrack | `Ref` |
| disableTrack | `Ref` |
| togglePictureInPicture | `Ref` |
| isPictureInPicture | `shallowRef` |
| onPlaybackError | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useMediaControls/)
