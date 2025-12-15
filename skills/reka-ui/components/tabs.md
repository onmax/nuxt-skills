# Tabs

Tabbed content panels

**Parts:** `TabsRoot`, `TabsList`, `TabsTrigger`, `TabsContent`, `TabsIndicator`

## TabsRoot

### Props

| Prop             | Type                         | Default        |
| ---------------- | ---------------------------- | -------------- |
| `activationMode` | `"automatic" \| "manual"`    | `"automatic"`  |
| `as`             | `AsTag \| Component`         | `"div"`        |
| `asChild`        | `boolean`                    | -              |
| `defaultValue`   | `string \| number`           | -              |
| `dir`            | `"ltr" \| "rtl"`             | -              |
| `modelValue`     | `string \| number`           | -              |
| `orientation`    | `"vertical" \| "horizontal"` | `"horizontal"` |

### Emits

| Event               | Payload                     |
| ------------------- | --------------------------- |
| `update:modelValue` | `[payload: StringOrNumber]` |

### Slots

| Slot         | Type               |
| ------------ | ------------------ |
| `modelValue` | `string \| number` |

## TabsList

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
| `loop`    | `boolean`            | `true`  |

## TabsTrigger

### Props

| Prop       | Type                 | Default    |
| ---------- | -------------------- | ---------- |
| `as`       | `AsTag \| Component` | `"button"` |
| `asChild`  | `boolean`            | -          |
| `disabled` | `boolean`            | `false`    |
| `value`\*  | `string \| number`   | -          |

## TabsContent

### Props

| Prop         | Type                 | Default |
| ------------ | -------------------- | ------- |
| `as`         | `AsTag \| Component` | `"div"` |
| `asChild`    | `boolean`            | -       |
| `forceMount` | `boolean`            | -       |
| `value`\*    | `string \| number`   | -       |

## TabsIndicator

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
