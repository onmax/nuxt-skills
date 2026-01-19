# Checkbox

Selection control with indeterminate state

**Parts:** `CheckboxGroupRoot`, `CheckboxRoot`, `CheckboxIndicator`

## CheckboxRoot

### Props

| Prop             | Type                         | Default    |
| ---------------- | ---------------------------- | ---------- |
| `as`             | `AsTag \| Component`         | `"button"` |
| `asChild`        | `boolean`                    | -          |
| `checked`        | `boolean \| "indeterminate"` | -          |
| `defaultChecked` | `boolean`                    | -          |
| `disabled`       | `boolean`                    | -          |
| `id`             | `string`                     | -          |
| `name`           | `string`                     | -          |
| `required`       | `boolean`                    | -          |
| `value`          | `string`                     | `"on"`     |

### Emits

| Event            | Payload            |
| ---------------- | ------------------ |
| `update:checked` | `[value: boolean]` |

### Slots

| Slot      | Type                               |
| --------- | ---------------------------------- |
| `checked` | `false \| true \| "indeterminate"` |

## CheckboxIndicator

### Props

| Prop         | Type                 | Default  |
| ------------ | -------------------- | -------- |
| `as`         | `AsTag \| Component` | `"span"` |
| `asChild`    | `boolean`            | -        |
| `forceMount` | `boolean`            | -        |
