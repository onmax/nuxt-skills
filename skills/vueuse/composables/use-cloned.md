# useCloned

Reactive clone of a ref. By default, it use to do the clone.

**Package:** `@vueuse/core`
**Category:** Utilities

## Usage

```ts
import { useCloned } from '@vueuse/core'

const original = ref({ key: 'value' })

const { cloned } = useCloned(original)

original.value.key = 'some new value'

console.log(cloned.value.key) // 'value'
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| clone | `(source: T) =&gt; T` | - | Custom clone function. |
| manual | `boolean` | false | Manually sync the ref |

## Returns

| Name | Type |
| --- | --- |
| cloned | `deepRef` |
| isModified | `shallowRef&lt;boolean&gt;` |
| sync | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useCloned/)
