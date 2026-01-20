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

## Options

| Option     | Type                             | Default | Description                                                    |
| ---------- | -------------------------------- | ------- | -------------------------------------------------------------- |
| interval   | `MaybeRefOrGetter&lt;number&gt;` | -       | Interval for the countdown in milliseconds. Default is 1000ms. |
| onComplete | `() =&gt; void`                  | -       | Callback function called when the countdown reaches 0.         |
| onTick     | `() =&gt; void`                  | -       | Callback function called on each tick of the countdown.        |
| immediate  | `boolean`                        | false   | Start the countdown immediately                                |

## Returns

| Name      | Type         |
| --------- | ------------ |
| remaining | `shallowRef` |
| reset     | `Ref`        |
| stop      | `Ref`        |
| start     | `Ref`        |
| pause     | `Ref`        |
| resume    | `Ref`        |
| isActive  | `Ref`        |

## Reference

[VueUse Docs](https://vueuse.org/core/useCountdown/)
