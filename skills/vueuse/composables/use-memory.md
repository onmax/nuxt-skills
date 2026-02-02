# useMemory

Reactive Memory Info.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useMemory } from '@vueuse/core'

const { isSupported, memory } = useMemory()
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| immediate | `boolean` | true | Start the timer immediately |
| immediateCallback | `boolean` | false | Execute the callback immediately after calling `resume` |
| interval | `number` | - |  |

## Returns

| Name | Type |
| --- | --- |
| isSupported | `useSupported` |
| memory | `deepRef&lt;MemoryInfo&gt;` |

## Reference

[VueUse Docs](https://vueuse.org/core/useMemory/)
