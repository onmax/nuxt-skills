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

## Options

| Option                    | Type                | Default | Description                                           |
| ------------------------- | ------------------- | ------- | ----------------------------------------------------- |
| events                    | `WindowEventName[]` | [       | Event names that listen to for detected user activity |
| listenForVisibilityChange | `boolean`           | true    | Listen for document visibility change                 |
| initialState              | `boolean`           | false   | Initial state of the ref idle                         |

## Returns

| Name       | Type         |
| ---------- | ------------ |
| idle       | `shallowRef` |
| lastActive | `shallowRef` |
| reset      | `Ref`        |
| stop       | `Ref`        |
| start      | `Ref`        |
| isPending  | `shallowRef` |

## Reference

[VueUse Docs](https://vueuse.org/core/useIdle/)
