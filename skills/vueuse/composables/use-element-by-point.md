# useElementByPoint

Reactive element by point.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { useElementByPoint, useMouse } from '@vueuse/core'

const { x, y } = useMouse({ type: 'client' })
const { element } = useElementByPoint({ x, y })
```

## Reference

[VueUse Docs](https://vueuse.org/core/useElementByPoint/)
