# useStorageAsync

Reactive Storage in with async support.

**Package:** `@vueuse/core`
**Category:** State

## Usage

```ts
import { useStorageAsync } from '@vueuse/core'

const accessToken = useStorageAsync('access.token', '', SomeAsyncStorage)

// accessToken.value may be empty before the async storage is ready
console.log(accessToken.value) // ""

setTimeout(() => {
  // After some time, the async storage is ready
  console.log(accessToken.value) // "the real value stored in storage"
}, 500)
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| serializer | `SerializerAsync&lt;T&gt;` | - | Custom data serialization |
| onReady | `(value: T) =&gt; void` | - | On first value loaded hook. |

## Reference

[VueUse Docs](https://vueuse.org/core/useStorageAsync/)
