# useShare

Reactive Web Share API. The Browser provides features that can share content in text or file.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useShare } from '@vueuse/core'

const { share, isSupported } = useShare()

function startShare() {
  share({
    title: 'Hello',
    text: 'Hello my friend!',
    url: location.href,
  })
}
```

## Returns

| Name | Type |
| --- | --- |
| isSupported | `useSupported` |
| share | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useShare/)
