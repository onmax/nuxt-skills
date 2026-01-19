# useCountdown

Wrapper for that provides a countdown timer.

**Package:** `@vueuse/core`
**Category:** Time

## Usage

```ts
import { useCountdown } from '@vueuse/core'

const countdownSeconds = 5
const { remaining, start, stop, pause, resume } = useCountdown(countdownSeconds, {
  onComplete() {

  },
  onTick() {

  }
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/useCountdown/)
