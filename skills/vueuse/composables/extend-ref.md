# extendRef

Add extra attributes to Ref.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { extendRef } from '@vueuse/core'
import { shallowRef } from 'vue'

const myRef = shallowRef('content')

const extended = extendRef(myRef, { foo: 'extra data' })

extended.value === 'content'
extended.foo === 'extra data'
```

## Reference

[VueUse Docs](https://vueuse.org/core/extendRef/)
