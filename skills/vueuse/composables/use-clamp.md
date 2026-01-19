# useClamp

Reactively clamp a value between two other values.

**Package:** `@vueuse/math`
**Category:** '@Math'

## Usage

```ts
import { useClamp } from '@vueuse/math'

const min = shallowRef(0)
const max = shallowRef(10)
const value = useClamp(0, min, max)
```

## Reference

[VueUse Docs](https://vueuse.org/core/useClamp/)
