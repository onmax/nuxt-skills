# toRefs

Extended that also accepts refs of an object.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { toRefs } from '@vueuse/core'
import { reactive, ref } from 'vue'

const objRef = ref({ a: 'a', b: 0 })
const arrRef = ref(['a', 0])

const { a, b } = toRefs(objRef)
const [a, b] = toRefs(arrRef)

const obj = reactive({ a: 'a', b: 0 })
const arr = reactive(['a', 0])

const { a, b } = toRefs(obj)
const [a, b] = toRefs(arr)
```

## Options

| Option     | Type                              | Default | Description                                              |
| ---------- | --------------------------------- | ------- | -------------------------------------------------------- |
| replaceRef | `MaybeRefOrGetter&lt;boolean&gt;` | true    | Replace the original ref with a copy on property update. |

## Reference

[VueUse Docs](https://vueuse.org/core/toRefs/)
