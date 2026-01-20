# useEventSource

An EventSource or Server-Sent-Events instance opens a persistent connection to an HTTP server, which sends events in text/event-stream format.

**Package:** `@vueuse/core`
**Category:** Network

## Usage

```ts
import { useEventSource } from '@vueuse/core'

const { status, data, error, close } = useEventSource('https://event-source-url')
```

## Options

| Option        | Type                           | Default | Description                          |
| ------------- | ------------------------------ | ------- | ------------------------------------ |
| autoReconnect | `boolean \| {`                 | false   | Enabled auto reconnect               |
| retries       | `number \| (() =&gt; boolean)` | -1      | Maximum retry times.                 |
| delay         | `number`                       | 1000    | Delay for reconnect, in milliseconds |
| onFailed      | `Fn`                           | -       | On maximum retry times reached.      |

## Returns

| Name        | Type                                  |
| ----------- | ------------------------------------- |
| eventSource | `deepRef&lt;EventSource \| null&gt;`  |
| event       | `Ref`                                 |
| data        | `Ref`                                 |
| status      | `shallowRef&lt;EventSourceStatus&gt;` |
| error       | `shallowRef&lt;Event \| null&gt;`     |
| open        | `Ref`                                 |
| close       | `Ref`                                 |
| lastEventId | `shallowRef&lt;string \| null&gt;`    |

## Reference

[VueUse Docs](https://vueuse.org/core/useEventSource/)
