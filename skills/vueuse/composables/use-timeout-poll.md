# useTimeoutPoll

Use timeout to poll something. It will trigger callback after last task is done.

**Package:** `@vueuse/core`
**Category:** Utilities

## Usage

```ts
import { useTimeoutPoll } from '@vueuse/core'

const count = ref(0)

async function fetchData() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  count.value++
}

// Only trigger after last fetch is done
const { isActive, pause, resume } = useTimeoutPoll(fetchData, 1000)
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| immediate | `boolean` | true | Start the timer immediately |
| immediateCallback | `boolean` | false | Execute the callback immediately after calling `resume` |

## Returns

| Name | Type |
| --- | --- |
| isActive | `shallowRef` |
| pause | `Ref` |
| resume | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useTimeoutPoll/)
