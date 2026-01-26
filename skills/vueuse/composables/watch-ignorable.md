# watchIgnorable

Ignorable watch

**Package:** `@vueuse/shared`
**Category:** Watch

## Usage

```ts
import { watchIgnorable } from '@vueuse/core'
import { nextTick, shallowRef } from 'vue'

const source = shallowRef('foo')

const { stop, ignoreUpdates } = watchIgnorable(
  source,
  v => console.log(`Changed to ${v}!`),
)

source.value = 'bar'
await nextTick() // logs: Changed to bar!

ignoreUpdates(() => {
  source.value = 'foobar'
})
await nextTick() // (nothing happened)

source.value = 'hello'
await nextTick() // logs: Changed to hello!

ignoreUpdates(() => {
  source.value = 'ignored'
})
source.value = 'logged'

await nextTick() // logs: Changed to logged!
```

## Returns

| Name | Type |
| --- | --- |
| stop | `Ref` |
| ignoreUpdates | `Ref` |
| ignorePrevAsyncUpdates | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/watchIgnorable/)
