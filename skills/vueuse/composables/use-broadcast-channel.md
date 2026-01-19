# useBroadcastChannel

Reactive BroadcastChannel API.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useBroadcastChannel } from '@vueuse/core'
import { shallowRef } from 'vue'

const {
  isSupported,
  channel,
  post,
  close,
  error,
  isClosed,
} = useBroadcastChannel({ name: 'vueuse-demo-channel' })

const message = shallowRef('')

message.value = 'Hello, VueUse World!'

// Post the message to the broadcast channel:
post(message.value)

// Option to close the channel if you wish:
close()
```

## Reference

[VueUse Docs](https://vueuse.org/core/useBroadcastChannel/)
