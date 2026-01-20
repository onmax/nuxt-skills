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

## Options

| Option | Type     | Default | Description              |
| ------ | -------- | ------- | ------------------------ |
| name   | `string` | -       | The name of the channel. |

## Returns

| Name        | Type                                           |
| ----------- | ---------------------------------------------- |
| isSupported | `useSupported`                                 |
| channel     | `deepRef&lt;BroadcastChannel \| undefined&gt;` |
| data        | `deepRef`                                      |
| post        | `Ref`                                          |
| close       | `Ref`                                          |
| error       | `shallowRef&lt;Event \| null&gt;`              |
| isClosed    | `shallowRef`                                   |

## Reference

[VueUse Docs](https://vueuse.org/core/useBroadcastChannel/)
