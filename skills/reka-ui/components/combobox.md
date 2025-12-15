# Combobox

Searchable dropdown with filtering

**Parts:** `ComboboxRoot`, `ComboboxInput`, `ComboboxAnchor`, `ComboboxTrigger`, `ComboboxContent`, `ComboboxViewport`, `ComboboxItem`, `ComboboxItemIndicator`, `ComboboxGroup`, `ComboboxLabel`, `ComboboxEmpty`, `ComboboxSeparator`, `ComboboxArrow`, `ComboboxPortal`, `ComboboxCancel`, `ComboboxVirtualizer`

## ComboboxRoot

### Props

| Prop                      | Type                                                     | Default |
| ------------------------- | -------------------------------------------------------- | ------- |
| `as`                      | `AsTag \| Component`                                     | `"div"` |
| `asChild`                 | `boolean`                                                | -       |
| `defaultOpen`             | `boolean`                                                | -       |
| `defaultValue`            | `AcceptableValue \| AcceptableValue[]`                   | -       |
| `dir`                     | `"ltr" \| "rtl"`                                         | -       |
| `disabled`                | `boolean`                                                | -       |
| `displayValue`            | `((val: AcceptableValue) => string)`                     | -       |
| `filterFunction`          | `((val: string[] \| number[] \| false[] \| true[] \|...` | -       |
| `modelValue`              | `AcceptableValue \| AcceptableValue[]`                   | -       |
| `multiple`                | `boolean`                                                | -       |
| `name`                    | `string`                                                 | -       |
| `open`                    | `boolean`                                                | -       |
| `resetSearchTermOnBlur`   | `boolean`                                                | `true`  |
| `resetSearchTermOnSelect` | `boolean`                                                | `true`  |
| `searchTerm`              | `string`                                                 | -       |
| `selectedValue`           | `AcceptableValue`                                        | -       |

### Emits

| Event                  | Payload                    |
| ---------------------- | -------------------------- |
| `update:modelValue`    | `[value: AcceptableValue]` |
| `update:open`          | `[value: boolean]`         |
| `update:searchTerm`    | `[value: string]`          |
| `update:selectedValue` | `[value: AcceptableValue]` |

### Slots

| Slot         | Type                                   |
| ------------ | -------------------------------------- |
| `open`       | `boolean`                              |
| `modelValue` | `AcceptableValue \| AcceptableValue[]` |

## ComboboxInput

### Props

| Prop        | Type                 | Default   |
| ----------- | -------------------- | --------- |
| `as`        | `AsTag \| Component` | `"input"` |
| `asChild`   | `boolean`            | -         |
| `autoFocus` | `boolean`            | -         |
| `disabled`  | `boolean`            | -         |
| `type`      | `string`             | `"text"`  |

## ComboboxAnchor

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## ComboboxTrigger

### Props

| Prop       | Type                 | Default    |
| ---------- | -------------------- | ---------- |
| `as`       | `AsTag \| Component` | `"button"` |
| `asChild`  | `boolean`            | -          |
| `disabled` | `boolean`            | -          |

## ComboboxContent

### Props

| Prop                          | Type                                                    | Default |
| ----------------------------- | ------------------------------------------------------- | ------- |
| `align`                       | `"start" \| "center" \| "end"`                          | -       |
| `alignOffset`                 | `number`                                                | -       |
| `arrowPadding`                | `number`                                                | -       |
| `as`                          | `AsTag \| Component`                                    | `"div"` |
| `asChild`                     | `boolean`                                               | -       |
| `avoidCollisions`             | `boolean`                                               | -       |
| `bodyLock`                    | `boolean`                                               | -       |
| `collisionBoundary`           | `Element \| (Element \| null)[] \| null`                | -       |
| `collisionPadding`            | `number \| Partial<Record<"top" \| "right" \| "bott...` | -       |
| `disableOutsidePointerEvents` | `boolean`                                               | -       |
| `dismissable`                 | `boolean`                                               | -       |
| `forceMount`                  | `boolean`                                               | -       |
| `hideWhenDetached`            | `boolean`                                               | -       |
| `position`                    | `"inline" \| "popper"`                                  | -       |
| `prioritizePosition`          | `boolean`                                               | -       |
| `side`                        | `"top" \| "right" \| "bottom" \| "left"`                | -       |
| `sideOffset`                  | `number`                                                | -       |
| `sticky`                      | `"partial" \| "always"`                                 | -       |
| `updatePositionStrategy`      | `"always" \| "optimized"`                               | -       |

### Emits

| Event                | Payload                                               |
| -------------------- | ----------------------------------------------------- |
| `escapeKeyDown`      | `[event: KeyboardEvent]`                              |
| `focusOutside`       | `[event: FocusOutsideEvent]`                          |
| `interactOutside`    | `[event: PointerDownOutsideEvent \| FocusOutsideE...` |
| `pointerDownOutside` | `[event: PointerDownOutsideEvent]`                    |

## ComboboxViewport

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
| `nonce`   | `string`             | -       |

## ComboboxItem

### Props

| Prop       | Type                 | Default |
| ---------- | -------------------- | ------- |
| `as`       | `AsTag \| Component` | `"div"` |
| `asChild`  | `boolean`            | -       |
| `disabled` | `boolean`            | -       |
| `value`\*  | `AcceptableValue`    | -       |

### Emits

| Event    | Payload                                 |
| -------- | --------------------------------------- |
| `select` | `[event: SelectEvent<AcceptableValue>]` |

## ComboboxItemIndicator

### Props

| Prop      | Type                 | Default  |
| --------- | -------------------- | -------- |
| `as`      | `AsTag \| Component` | `"span"` |
| `asChild` | `boolean`            | -        |

## ComboboxGroup

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## ComboboxLabel

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
| `for`     | `string`             | -       |

## ComboboxEmpty

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## ComboboxSeparator

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## ComboboxArrow

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"svg"` |
| `asChild` | `boolean`            | -       |
| `height`  | `number`             | `5`     |
| `width`   | `number`             | `10`    |

## ComboboxPortal

### Props

| Prop         | Type                    | Default |
| ------------ | ----------------------- | ------- |
| `disabled`   | `boolean`               | -       |
| `forceMount` | `boolean`               | -       |
| `to`         | `string \| HTMLElement` | -       |

## ComboboxCancel

### Props

| Prop      | Type                 | Default    |
| --------- | -------------------- | ---------- |
| `as`      | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean`            | -          |
