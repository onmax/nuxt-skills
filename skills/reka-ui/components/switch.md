# Switch

Toggle between two states

**Parts:** `SwitchRoot`, `SwitchThumb`

## SwitchRoot

### Props

| Prop             | Type                 | Default    |
| ---------------- | -------------------- | ---------- |
| `as`             | `AsTag \| Component` | `"button"` |
| `asChild`        | `boolean`            | -          |
| `checked`        | `boolean`            | -          |
| `defaultChecked` | `boolean`            | -          |
| `disabled`       | `boolean`            | -          |
| `id`             | `string`             | -          |
| `name`           | `string`             | -          |
| `required`       | `boolean`            | -          |
| `value`          | `string`             | `"on"`     |

### Emits

| Event            | Payload              |
| ---------------- | -------------------- |
| `update:checked` | `[payload: boolean]` |

### Slots

| Slot      | Type      |
| --------- | --------- |
| `checked` | `boolean` |

## SwitchThumb

### Props

| Prop      | Type                 | Default  |
| --------- | -------------------- | -------- |
| `as`      | `AsTag \| Component` | `"span"` |
| `asChild` | `boolean`            | -        |
