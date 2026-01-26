# Slider

Range input control

**Parts:** `SliderRoot`, `SliderTrack`, `SliderRange`, `SliderThumb`

## SliderRoot

### Props

| Prop                    | Type                         | Default        |
| ----------------------- | ---------------------------- | -------------- |
| `as`                    | `AsTag \| Component`         | `"div"`        |
| `asChild`               | `boolean`                    | -              |
| `defaultValue`          | `number[]`                   | `[0]`          |
| `dir`                   | `"ltr" \| "rtl"`             | -              |
| `disabled`              | `boolean`                    | `false`        |
| `inverted`              | `boolean`                    | `false`        |
| `max`                   | `number`                     | `100`          |
| `min`                   | `number`                     | `0`            |
| `minStepsBetweenThumbs` | `number`                     | `0`            |
| `modelValue`            | `number[]`                   | -              |
| `name`                  | `string`                     | -              |
| `orientation`           | `"vertical" \| "horizontal"` | `"horizontal"` |
| `step`                  | `number`                     | `1`            |

### Emits

| Event               | Payload               |
| ------------------- | --------------------- |
| `update:modelValue` | `[payload: number[]]` |
| `valueCommit`       | `[payload: number[]]` |

### Slots

| Slot         | Type       |
| ------------ | ---------- |
| `modelValue` | `number[]` |

## SliderTrack

### Props

| Prop      | Type                 | Default  |
| --------- | -------------------- | -------- |
| `as`      | `AsTag \| Component` | `"span"` |
| `asChild` | `boolean`            | -        |

## SliderRange

### Props

| Prop      | Type                 | Default  |
| --------- | -------------------- | -------- |
| `as`      | `AsTag \| Component` | `"span"` |
| `asChild` | `boolean`            | -        |

## SliderThumb

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
