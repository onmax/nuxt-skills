# createUnrefFn

Make a plain function accepting ref and raw values as arguments. Returns the same value the unconverted function returns, with proper typing.

**Package:** `@vueuse/core`
**Category:** Utilities

## Usage

```ts
import { createUnrefFn } from '@vueuse/core'
import { shallowRef } from 'vue'

const url = shallowRef('https://httpbin.org/post')
const data = shallowRef({ foo: 'bar' })

function post(url, data) {
  return fetch(url, { data })
}
const unrefPost = createUnrefFn(post)

post(url, data) /* ❌ Will throw an error because the arguments are refs */
unrefPost(url, data) /* ✔️ Will Work because the arguments will be auto unref */
```

## Reference

[VueUse Docs](https://vueuse.org/core/createUnrefFn/)
