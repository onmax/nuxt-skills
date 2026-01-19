# useIdle

Tracks whether the user is being inactive.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { useIdle } from '@vueuse/core'

const { idle, lastActive } = useIdle(5 * 60 * 1000) // 5 min

console.log(idle.value) // true or false
```

## Reference

[VueUse Docs](https://vueuse.org/core/useIdle/)
