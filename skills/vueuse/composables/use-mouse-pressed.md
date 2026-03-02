# useMousePressed

Reactive mouse pressing state. Triggered by on target element and released by on window.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { useMousePressed } from '@vueuse/core'

const { pressed } = useMousePressed()
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| touch | `boolean` | true | Listen to `touchstart` `touchend` events |
| drag | `boolean` | true | Listen to `dragstart` `drop` and `dragend` events |
| capture | `boolean` | false | Add event listeners with the `capture` option set to `true` |
| initialValue | `boolean` | false | Initial values |
| target | `MaybeComputedElementRef` | - | Element target to be capture the click |
| onPressed | `(event: MouseEvent \| TouchEvent \| DragEvent) =&gt; void` | - | Callback to be called when the mouse is pressed |
| onReleased | `(event: MouseEvent \| TouchEvent \| DragEvent) =&gt; void` | - | Callback to be called when the mouse is released |

## Returns

| Name | Type |
| --- | --- |
| pressed | `shallowRef` |
| sourceType | `shallowRef&lt;UseMouseSourceType&gt;` |

## Reference

[VueUse Docs](https://vueuse.org/core/useMousePressed/)
