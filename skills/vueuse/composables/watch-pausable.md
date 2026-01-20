# watchPausable

Pausable watch

**Package:** `@vueuse/shared`
**Category:** Watch

## Usage

```ts
import { watchPausable } from '@vueuse/core'
import { nextTick, shallowRef } from 'vue'

const source = shallowRef('foo')

const { stop, pause, resume } = watchPausable(
  source,
  v => console.log(`Changed to ${v}!`),
)

source.value = 'bar'
await nextTick() // Changed to bar!

pause()

source.value = 'foobar'
await nextTick() // (nothing happend)

resume()

source.value = 'hello'
await nextTick() // Changed to hello!
```

## Returns

| Name     | Type              |
| -------- | ----------------- |
| stop     | `watchWithFilter` |
| pause    | `Ref`             |
| resume   | `Ref`             |
| isActive | `Ref`             |

## Reference

[VueUse Docs](https://vueuse.org/core/watchPausable/)
