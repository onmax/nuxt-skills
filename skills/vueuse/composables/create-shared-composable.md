# createSharedComposable

Make a composable function usable with multiple Vue instances.

**Package:** `@vueuse/shared`
**Category:** State

## Usage

```ts
import { createSharedComposable, useMouse } from '@vueuse/core'

const useSharedMouse = createSharedComposable(useMouse)

// CompA.vue
const { x, y } = useSharedMouse()

// CompB.vue - will reuse the previous state and no new event listeners will be registered
const { x, y } = useSharedMouse()
```

## Reference

[VueUse Docs](https://vueuse.org/core/createSharedComposable/)
