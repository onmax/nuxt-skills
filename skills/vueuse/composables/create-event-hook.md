# createEventHook

Utility for creating event hooks

**Package:** `@vueuse/shared`
**Category:** Utilities

## Usage

```ts
import { createEventHook } from '@vueuse/core'

export function useMyFetch(url) {
  const fetchResult = createEventHook<Response>()
  const fetchError = createEventHook<any>()

  fetch(url)
    .then(result => fetchResult.trigger(result))
    .catch(error => fetchError.trigger(error.message))

  return {
    onResult: fetchResult.on,
    onError: fetchError.on,
  }
}
```

## Returns

| Name    | Type  |
| ------- | ----- |
| on      | `Ref` |
| off     | `Ref` |
| trigger | `Ref` |
| clear   | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/createEventHook/)
