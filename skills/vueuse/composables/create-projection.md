# createProjection

Reactive numeric projection from one domain to another.

**Package:** `@vueuse/math`
**Category:** '@Math'

## Usage

```ts
import { createProjection } from '@vueuse/math'

const useProjector = createProjection([0, 10], [0, 100])
const input = ref(0)
const projected = useProjector(input) // projected.value === 0

input.value = 5 // projected.value === 50
input.value = 10 // projected.value === 100
```

## Reference

[VueUse Docs](https://vueuse.org/core/createProjection/)
