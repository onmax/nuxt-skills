# useMagicKeys

Reactive keys pressed state, with magical keys combination support.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { useMagicKeys } from '@vueuse/core'

const { shift, space, a /* keys you want to monitor */ } = useMagicKeys()

watch(space, (v) => {
  if (v)
    console.log('space has been pressed')
})

watchEffect(() => {
  if (shift.value && a.value)
    console.log('Shift + A have been pressed')
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/useMagicKeys/)
