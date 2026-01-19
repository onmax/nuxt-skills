# useEventBus

A basic event bus.

**Package:** `@vueuse/core`
**Category:** Utilities

## Usage

```ts
import { useEventBus } from '@vueuse/core'

const bus = useEventBus<string>('news')

function listener(event: string) {
  console.log(`news: ${event}`)
}

// listen to an event
const unsubscribe = bus.on(listener)

// fire an event
bus.emit('The Tokyo Olympics has begun')

// unregister the listener
unsubscribe()
// or
bus.off(listener)

// clearing all listeners
bus.reset()
```

## Reference

[VueUse Docs](https://vueuse.org/core/useEventBus/)
