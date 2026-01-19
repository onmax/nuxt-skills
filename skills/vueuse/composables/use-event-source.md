# useEventSource

An EventSource or Server-Sent-Events instance opens a persistent connection to an HTTP server, which sends events in text/event-stream format.

**Package:** `@vueuse/core`
**Category:** Network

## Usage

```ts
import { useEventSource } from '@vueuse/core'

const { status, data, error, close } = useEventSource('https://event-source-url')
```

## Reference

[VueUse Docs](https://vueuse.org/core/useEventSource/)
