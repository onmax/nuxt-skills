# useRafFn

Call function on every . With controls of pausing and resuming.

**Package:** `@vueuse/core`
**Category:** Animation

## Usage

```ts
import { useRafFn } from '@vueuse/core'
import { shallowRef } from 'vue'

const count = shallowRef(0)

const { pause, resume } = useRafFn(() => {
  count.value++
  console.log(count.value)
})
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| immediate | `boolean` | true | Start the requestAnimationFrame loop immediately on creation |
| fpsLimit | `MaybeRefOrGetter&lt;number \| null&gt;` | null | The maximum frame per second to execute the function. |
| once | `boolean` | false | After the requestAnimationFrame loop executed once, it will be automatically stopped. |

## Returns

| Name | Type |
| --- | --- |
| isActive | `shallowRef` |
| pause | `Ref` |
| resume | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useRafFn/)
