# Number Field

Numeric input with increment/decrement

**Parts:** `NumberFieldRoot`, `NumberFieldInput`, `NumberFieldIncrement`, `NumberFieldDecrement`

## NumberFieldRoot

### Props

| Prop            | Type                  | Default   |
| --------------- | --------------------- | --------- |
| `as`            | `AsTag \| Component`  | `"div"`   |
| `asChild`       | `boolean`             | -         |
| `defaultValue`  | `number`              | -         |
| `disabled`      | `boolean`             | -         |
| `formatOptions` | `NumberFormatOptions` | -         |
| `id`            | `string`              | -         |
| `locale`        | `string`              | `"en-US"` |
| `max`           | `number`              | -         |
| `min`           | `number`              | -         |
| `modelValue`    | `number`              | -         |
| `name`          | `string`              | -         |
| `required`      | `boolean`             | -         |
| `step`          | `number`              | `1`       |

### Emits

| Event               | Payload         |
| ------------------- | --------------- |
| `update:modelValue` | `[val: number]` |

### Slots

| Slot         | Type     |
| ------------ | -------- |
| `modelValue` | `number` |
| `textValue`  | `string` |

## NumberFieldInput

### Props

| Prop      | Type                 | Default   |
| --------- | -------------------- | --------- |
| `as`      | `AsTag \| Component` | `"input"` |
| `asChild` | `boolean`            | -         |

## NumberFieldIncrement

### Props

| Prop       | Type                 | Default    |
| ---------- | -------------------- | ---------- |
| `as`       | `AsTag \| Component` | `"button"` |
| `asChild`  | `boolean`            | -          |
| `disabled` | `boolean`            | -          |

## NumberFieldDecrement

### Props

| Prop       | Type                 | Default    |
| ---------- | -------------------- | ---------- |
| `as`       | `AsTag \| Component` | `"button"` |
| `asChild`  | `boolean`            | -          |
| `disabled` | `boolean`            | -          |
