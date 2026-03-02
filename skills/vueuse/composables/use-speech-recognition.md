# useSpeechRecognition

Reactive SpeechRecognition.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { useSpeechRecognition } from '@vueuse/core'

const {
  isSupported,
  isListening,
  isFinal,
  result,
  start,
  stop,
} = useSpeechRecognition()
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| continuous | `boolean` | true | Controls whether continuous results are returned for each recognition, or only a single result. |
| interimResults | `boolean` | true | Controls whether interim results should be returned (true) or not (false.) Interim results are results that are not yet final |
| lang | `MaybeRefOrGetter&lt;string&gt;` | en-US | Language for SpeechRecognition |
| maxAlternatives | `number` | 1 | A number representing the maximum returned alternatives for each result. |

## Returns

| Name | Type |
| --- | --- |
| isSupported | `useSupported` |
| isListening | `shallowRef` |
| isFinal | `shallowRef` |
| recognition | `Ref` |
| result | `shallowRef` |
| error | `shallowRef&lt;SpeechRecognitionErrorEvent \| Error \| undefined&gt;` |
| toggle | `Ref` |
| start | `Ref` |
| stop | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useSpeechRecognition/)
