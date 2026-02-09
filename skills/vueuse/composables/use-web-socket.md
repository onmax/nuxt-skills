# useWebSocket

Reactive WebSocket client.

**Package:** `@vueuse/core`
**Category:** Network

## Usage

```ts
import { useWebSocket } from '@vueuse/core'

const { status, data, send, open, close, ws } = useWebSocket('ws://websocketurl')
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| heartbeat | `boolean \| ConfigurableScheduler & {` | false | Send heartbeat for every x milliseconds passed |
| message | `MaybeRefOrGetter&lt;WebSocketHeartbeatMessage&gt;` | ping | Message for the heartbeat |
| responseMessage | `MaybeRefOrGetter&lt;WebSocketHeartbeatMessage&gt;` | - | Response message for the heartbeat, if undefined the message will be used |
| interval | `number` | 1000 | Interval, in milliseconds |
| pongTimeout | `number` | 1000 | Heartbeat response timeout, in milliseconds |

## Returns

| Name | Type |
| --- | --- |
| data | `Ref` |
| status | `shallowRef&lt;WebSocketStatus&gt;` |
| close | `Ref` |
| send | `Ref` |
| open | `Ref` |
| ws | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useWebSocket/)
