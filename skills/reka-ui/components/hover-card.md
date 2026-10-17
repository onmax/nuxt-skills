# Hover Card

Card shown on hover

**Parts:** `HoverCardRoot`, `HoverCardTrigger`, `HoverCardPortal`, `HoverCardContent`, `HoverCardArrow`

## HoverCardRoot

### Props

| Prop          | Type      | Default |
| ------------- | --------- | ------- |
| `closeDelay`  | `number`  | `300`   |
| `defaultOpen` | `false`   | `false` |
| `open`        | `boolean` | -       |
| `openDelay`   | `number`  | `700`   |

### Emits

| Event         | Payload            |
| ------------- | ------------------ |
| `update:open` | `[value: boolean]` |

### Slots

| Slot   | Type      |
| ------ | --------- |
| `open` | `boolean` |

## HoverCardTrigger

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"a"`   |
| `asChild` | `boolean`            | -       |

## HoverCardPortal

### Props

| Prop         | Type                    | Default |
| ------------ | ----------------------- | ------- |
| `disabled`   | `boolean`               | -       |
| `forceMount` | `boolean`               | -       |
| `to`         | `string \| HTMLElement` | -       |

## HoverCardContent

### Props

| Prop                     | Type                                                    | Default |
| ------------------------ | ------------------------------------------------------- | ------- |
| `align`                  | `"start" \| "center" \| "end"`                          | -       |
| `alignOffset`            | `number`                                                | -       |
| `arrowPadding`           | `number`                                                | -       |
| `as`                     | `AsTag \| Component`                                    | `"div"` |
| `asChild`                | `boolean`                                               | -       |
| `avoidCollisions`        | `boolean`                                               | -       |
| `collisionBoundary`      | `Element \| (Element \| null)[] \| null`                | -       |
| `collisionPadding`       | `number \| Partial<Record<"top" \| "right" \| "bott...` | -       |
| `forceMount`             | `boolean`                                               | -       |
| `hideWhenDetached`       | `boolean`                                               | -       |
| `prioritizePosition`     | `boolean`                                               | -       |
| `side`                   | `"top" \| "right" \| "bottom" \| "left"`                | -       |
| `sideOffset`             | `number`                                                | -       |
| `sticky`                 | `"partial" \| "always"`                                 | -       |
| `updatePositionStrategy` | `"always" \| "optimized"`                               | -       |

### Emits

| Event                | Payload                                               |
| -------------------- | ----------------------------------------------------- |
| `escapeKeyDown`      | `[event: KeyboardEvent]`                              |
| `focusOutside`       | `[event: FocusOutsideEvent]`                          |
| `interactOutside`    | `[event: PointerDownOutsideEvent \| FocusOutsideE...` |
| `pointerDownOutside` | `[event: PointerDownOutsideEvent]`                    |

## HoverCardArrow

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"svg"` |
| `asChild` | `boolean`            | -       |
| `height`  | `number`             | `5`     |
| `width`   | `number`             | `10`    |
