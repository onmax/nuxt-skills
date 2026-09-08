# Popover

Floating content panel

**Parts:** `PopoverRoot`, `PopoverTrigger`, `PopoverPortal`, `PopoverContent`, `PopoverArrow`, `PopoverClose`, `PopoverAnchor`

## PopoverRoot

### Props

| Prop          | Type      | Default |
| ------------- | --------- | ------- |
| `defaultOpen` | `boolean` | `false` |
| `modal`       | `boolean` | `false` |
| `open`        | `boolean` | -       |

### Emits

| Event         | Payload            |
| ------------- | ------------------ |
| `update:open` | `[value: boolean]` |

### Slots

| Slot   | Type      |
| ------ | --------- |
| `open` | `boolean` |

## PopoverTrigger

### Props

| Prop      | Type                 | Default    |
| --------- | -------------------- | ---------- |
| `as`      | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean`            | -          |

## PopoverPortal

### Props

| Prop         | Type                    | Default |
| ------------ | ----------------------- | ------- |
| `disabled`   | `boolean`               | -       |
| `forceMount` | `boolean`               | -       |
| `to`         | `string \| HTMLElement` | -       |

## PopoverContent

### Props

| Prop                          | Type                                                    | Default |
| ----------------------------- | ------------------------------------------------------- | ------- |
| `align`                       | `"start" \| "center" \| "end"`                          | -       |
| `alignOffset`                 | `number`                                                | -       |
| `arrowPadding`                | `number`                                                | -       |
| `as`                          | `AsTag \| Component`                                    | `"div"` |
| `asChild`                     | `boolean`                                               | -       |
| `avoidCollisions`             | `boolean`                                               | -       |
| `collisionBoundary`           | `Element \| (Element \| null)[] \| null`                | -       |
| `collisionPadding`            | `number \| Partial<Record<"top" \| "right" \| "bott...` | -       |
| `disableOutsidePointerEvents` | `boolean`                                               | -       |
| `forceMount`                  | `boolean`                                               | -       |
| `hideWhenDetached`            | `boolean`                                               | -       |
| `prioritizePosition`          | `boolean`                                               | -       |
| `side`                        | `"top" \| "right" \| "bottom" \| "left"`                | -       |
| `sideOffset`                  | `number`                                                | -       |
| `sticky`                      | `"partial" \| "always"`                                 | -       |
| `trapFocus`                   | `boolean`                                               | -       |
| `updatePositionStrategy`      | `"always" \| "optimized"`                               | -       |

### Emits

| Event                | Payload                                               |
| -------------------- | ----------------------------------------------------- |
| `closeAutoFocus`     | `[event: Event]`                                      |
| `escapeKeyDown`      | `[event: KeyboardEvent]`                              |
| `focusOutside`       | `[event: FocusOutsideEvent]`                          |
| `interactOutside`    | `[event: PointerDownOutsideEvent \| FocusOutsideE...` |
| `openAutoFocus`      | `[event: Event]`                                      |
| `pointerDownOutside` | `[event: PointerDownOutsideEvent]`                    |

## PopoverArrow

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"svg"` |
| `asChild` | `boolean`            | -       |
| `height`  | `number`             | `5`     |
| `width`   | `number`             | `10`    |

## PopoverClose

### Props

| Prop      | Type                 | Default    |
| --------- | -------------------- | ---------- |
| `as`      | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean`            | -          |

## PopoverAnchor

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
| `element` | `Measurable`         | -       |
