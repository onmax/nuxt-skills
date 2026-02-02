# useSpeechSynthesis

Reactive SpeechSynthesis.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { useSpeechSynthesis } from '@vueuse/core'

const {
  isSupported,
  isPlaying,
  status,
  voiceInfo,
  utterance,
  error,
  stop,
  toggle,
  speak,
} = useSpeechSynthesis()
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| lang | `MaybeRefOrGetter&lt;string&gt;` | en-US | Language for SpeechSynthesis |
| pitch | `MaybeRefOrGetter&lt;SpeechSynthesisUtterance['pitch']&gt;` | 1 | Gets and sets the pitch at which the utterance will be spoken at. |
| rate | `MaybeRefOrGetter&lt;SpeechSynthesisUtterance['rate']&gt;` | 1 | Gets and sets the speed at which the utterance will be spoken at. |
| voice | `MaybeRef&lt;SpeechSynthesisVoice&gt;` | - | Gets and sets the voice that will be used to speak the utterance. |
| volume | `MaybeRefOrGetter&lt;SpeechSynthesisUtterance['volume']&gt;` | 1 | Gets and sets the volume that the utterance will be spoken at. |
| onBoundary | `(event: SpeechSynthesisEvent) =&gt; void` | - | Callback function that is called when the boundary event is triggered. |

## Returns

| Name | Type |
| --- | --- |
| isSupported | `useSupported` |
| isPlaying | `shallowRef` |
| status | `shallowRef&lt;UseSpeechSynthesisStatus&gt;` |
| utterance | `computed` |
| error | `shallowRef&lt;SpeechSynthesisErrorEvent \| undefined&gt;` |
| stop | `Ref` |
| toggle | `Ref` |
| speak | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useSpeechSynthesis/)
