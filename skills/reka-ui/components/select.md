# Select

Dropdown selection with grouping

**Parts:** `SelectRoot`, `SelectTrigger`, `SelectPortal`, `SelectContent`, `SelectViewport`, `SelectItem`, `SelectItemText`, `SelectItemIndicator`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, `SelectArrow`, `SelectScrollUpButton`, `SelectScrollDownButton`, `SelectValue`, `SelectIcon`

## SelectRoot

### Props

| Prop           | Type             | Default |
| -------------- | ---------------- | ------- |
| `autocomplete` | `string`         | -       |
| `defaultOpen`  | `boolean`        | -       |
| `defaultValue` | `string`         | `""`    |
| `dir`          | `"ltr" \| "rtl"` | -       |
| `disabled`     | `boolean`        | -       |
| `modelValue`   | `string`         | -       |
| `name`         | `string`         | -       |
| `open`         | `boolean`        | -       |
| `required`     | `boolean`        | -       |

### Emits

| Event               | Payload            |
| ------------------- | ------------------ |
| `update:modelValue` | `[value: string]`  |
| `update:open`       | `[value: boolean]` |

### Slots

| Slot         | Type      |
| ------------ | --------- |
| `modelValue` | `string`  |
| `open`       | `boolean` |

## SelectTrigger

### Props

| Prop       | Type                 | Default    |
| ---------- | -------------------- | ---------- |
| `as`       | `AsTag \| Component` | `"button"` |
| `asChild`  | `boolean`            | -          |
| `disabled` | `boolean`            | -          |

## SelectPortal

### Props

| Prop         | Type                    | Default |
| ------------ | ----------------------- | ------- |
| `disabled`   | `boolean`               | -       |
| `forceMount` | `boolean`               | -       |
| `to`         | `string \| HTMLElement` | -       |

## SelectContent

### Props

| Prop                     | Type                                                    | Default |
| ------------------------ | ------------------------------------------------------- | ------- |
| `align`                  | `"start" \| "center" \| "end"`                          | -       |
| `alignOffset`            | `number`                                                | -       |
| `arrowPadding`           | `number`                                                | -       |
| `as`                     | `AsTag \| Component`                                    | `"div"` |
| `asChild`                | `boolean`                                               | -       |
| `avoidCollisions`        | `boolean`                                               | -       |
| `bodyLock`               | `boolean`                                               | -       |
| `collisionBoundary`      | `Element \| (Element \| null)[] \| null`                | -       |
| `collisionPadding`       | `number \| Partial<Record<"top" \| "right" \| "bott...` | -       |
| `forceMount`             | `boolean`                                               | -       |
| `hideWhenDetached`       | `boolean`                                               | -       |
| `position`               | `"popper" \| "item-aligned"`                            | -       |
| `prioritizePosition`     | `boolean`                                               | -       |
| `side`                   | `"top" \| "right" \| "bottom" \| "left"`                | -       |
| `sideOffset`             | `number`                                                | -       |
| `sticky`                 | `"partial" \| "always"`                                 | -       |
| `updatePositionStrategy` | `"always" \| "optimized"`                               | -       |

### Emits

| Event                | Payload                            |
| -------------------- | ---------------------------------- |
| `closeAutoFocus`     | `[event: Event]`                   |
| `escapeKeyDown`      | `[event: KeyboardEvent]`           |
| `pointerDownOutside` | `[event: PointerDownOutsideEvent]` |

## SelectViewport

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
| `nonce`   | `string`             | -       |

## SelectItem

### Props

| Prop        | Type                 | Default |
| ----------- | -------------------- | ------- |
| `as`        | `AsTag \| Component` | `"div"` |
| `asChild`   | `boolean`            | -       |
| `disabled`  | `boolean`            | -       |
| `textValue` | `string`             | -       |
| `value`\*   | `string`             | -       |

## SelectItemText

### Props

| Prop      | Type                 | Default  |
| --------- | -------------------- | -------- |
| `as`      | `AsTag \| Component` | `"span"` |
| `asChild` | `boolean`            | -        |

## SelectItemIndicator

### Props

| Prop      | Type                 | Default  |
| --------- | -------------------- | -------- |
| `as`      | `AsTag \| Component` | `"span"` |
| `asChild` | `boolean`            | -        |

## SelectGroup

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## SelectLabel

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
| `for`     | `string`             | -       |

## SelectSeparator

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## SelectArrow

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"svg"` |
| `asChild` | `boolean`            | -       |
| `height`  | `number`             | `5`     |
| `width`   | `number`             | `10`    |

## SelectScrollUpButton

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## SelectScrollDownButton

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## SelectValue

### Props

| Prop          | Type                 | Default  |
| ------------- | -------------------- | -------- |
| `as`          | `AsTag \| Component` | `"span"` |
| `asChild`     | `boolean`            | -        |
| `placeholder` | `string`             | `""`     |

## SelectIcon

### Props

| Prop      | Type                 | Default  |
| --------- | -------------------- | -------- |
| `as`      | `AsTag \| Component` | `"span"` |
| `asChild` | `boolean`            | -        |
