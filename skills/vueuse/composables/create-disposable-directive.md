# createDisposableDirective

Utility for authoring disposable directives. Reactive effects created within directive hook will be tracked and automatically disposed when directive is unmounted.

**Package:** `@vueuse/shared`
**Category:** Utilities

## Usage

```ts
import { useMouse } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

export const VDirective = createDisposableDirective({
  mounted(el, binding) {
    const value = binding.value
    if (typeof value === 'function') {
      // `useMouse` event listener will be removed automatically when directive is unmounted
      const { x, y } = useMouse()
      watch(x, val => value(val))
    }
  }
})
```

## Returns

| Name | Type |
| --- | --- |
| binding | `Ref` |
| string | `Ref` |
| vNode | `Ref` |
| prevNode | `Ref` |
| binding | `Ref` |
| vNode | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/createDisposableDirective/)
