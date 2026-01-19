# useProjection

Reactive numeric projection from one domain to another.

**Package:** `@vueuse/math`
**Category:** '@Math'

## Usage

```ts
import { useProjection } from '@vueuse/math'

const input = ref(0)
const projected = useProjection(input, [0, 10], [0, 100])

input.value = 5 // projected.value === 50
input.value = 10 // projected.value === 100
```

## Reference

[VueUse Docs](https://vueuse.org/core/useProjection/)
