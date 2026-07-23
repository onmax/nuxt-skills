# Context Menu

Right-click context menu

**Parts:** `ContextMenuRoot`, `ContextMenuTrigger`, `ContextMenuPortal`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioGroup`, `ContextMenuRadioItem`, `ContextMenuItemIndicator`, `ContextMenuLabel`, `ContextMenuGroup`, `ContextMenuSeparator`, `ContextMenuSub`, `ContextMenuSubTrigger`, `ContextMenuSubContent`, `ContextMenuArrow`

## ContextMenuRoot

### Props

| Prop    | Type             | Default |
| ------- | ---------------- | ------- |
| `dir`   | `"ltr" \| "rtl"` | -       |
| `modal` | `boolean`        | `true`  |

### Emits

| Event         | Payload              |
| ------------- | -------------------- |
| `update:open` | `[payload: boolean]` |

## ContextMenuTrigger

### Props

| Prop       | Type                 | Default  |
| ---------- | -------------------- | -------- |
| `as`       | `AsTag \| Component` | `"span"` |
| `asChild`  | `boolean`            | -        |
| `disabled` | `boolean`            | `false`  |

## ContextMenuPortal

### Props

| Prop         | Type                    | Default |
| ------------ | ----------------------- | ------- |
| `disabled`   | `boolean`               | -       |
| `forceMount` | `boolean`               | -       |
| `to`         | `string \| HTMLElement` | -       |

## ContextMenuContent

### Props

| Prop                 | Type                                                    | Default     |
| -------------------- | ------------------------------------------------------- | ----------- |
| `alignOffset`        | `number`                                                | `0`         |
| `as`                 | `AsTag \| Component`                                    | `"div"`     |
| `asChild`            | `boolean`                                               | -           |
| `avoidCollisions`    | `boolean`                                               | `true`      |
| `collisionBoundary`  | `Element \| (Element \| null)[] \| null`                | `[]`        |
| `collisionPadding`   | `number \| Partial<Record<"top" \| "right" \| "bott...` | `0`         |
| `forceMount`         | `boolean`                                               | -           |
| `hideWhenDetached`   | `boolean`                                               | `false`     |
| `loop`               | `boolean`                                               | -           |
| `prioritizePosition` | `boolean`                                               | -           |
| `sticky`             | `"partial" \| "always"`                                 | `"partial"` |

### Emits

| Event                | Payload                                               |
| -------------------- | ----------------------------------------------------- |
| `closeAutoFocus`     | `[event: Event]`                                      |
| `escapeKeyDown`      | `[event: KeyboardEvent]`                              |
| `focusOutside`       | `[event: FocusOutsideEvent]`                          |
| `interactOutside`    | `[event: PointerDownOutsideEvent \| FocusOutsideE...` |
| `pointerDownOutside` | `[event: PointerDownOutsideEvent]`                    |

## ContextMenuItem

### Props

| Prop        | Type                 | Default |
| ----------- | -------------------- | ------- |
| `as`        | `AsTag \| Component` | `"div"` |
| `asChild`   | `boolean`            | -       |
| `disabled`  | `boolean`            | -       |
| `textValue` | `string`             | -       |

### Emits

| Event    | Payload          |
| -------- | ---------------- |
| `select` | `[event: Event]` |

## ContextMenuCheckboxItem

### Props

| Prop        | Type                               | Default |
| ----------- | ---------------------------------- | ------- |
| `as`        | `AsTag \| Component`               | `"div"` |
| `asChild`   | `boolean`                          | -       |
| `checked`   | `false \| true \| "indeterminate"` | -       |
| `disabled`  | `boolean`                          | -       |
| `textValue` | `string`                           | -       |

### Emits

| Event            | Payload              |
| ---------------- | -------------------- |
| `select`         | `[event: Event]`     |
| `update:checked` | `[payload: boolean]` |

## ContextMenuRadioGroup

### Props

| Prop         | Type                 | Default |
| ------------ | -------------------- | ------- |
| `as`         | `AsTag \| Component` | `"div"` |
| `asChild`    | `boolean`            | -       |
| `modelValue` | `string`             | -       |

### Emits

| Event               | Payload             |
| ------------------- | ------------------- |
| `update:modelValue` | `[payload: string]` |

## ContextMenuRadioItem

### Props

| Prop        | Type                 | Default |
| ----------- | -------------------- | ------- |
| `as`        | `AsTag \| Component` | `"div"` |
| `asChild`   | `boolean`            | -       |
| `disabled`  | `boolean`            | -       |
| `textValue` | `string`             | -       |
| `value`\*   | `string`             | -       |

### Emits

| Event    | Payload          |
| -------- | ---------------- |
| `select` | `[event: Event]` |

## ContextMenuItemIndicator

### Props

| Prop         | Type                 | Default |
| ------------ | -------------------- | ------- |
| `as`         | `AsTag \| Component` | `"div"` |
| `asChild`    | `boolean`            | -       |
| `forceMount` | `boolean`            | -       |

## ContextMenuLabel

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## ContextMenuGroup

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## ContextMenuSeparator

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## ContextMenuSub

### Props

| Prop          | Type      | Default |
| ------------- | --------- | ------- |
| `defaultOpen` | `boolean` | -       |
| `open`        | `boolean` | -       |

### Emits

| Event         | Payload              |
| ------------- | -------------------- |
| `update:open` | `[payload: boolean]` |

### Slots

| Slot   | Type      |
| ------ | --------- |
| `open` | `boolean` |

## ContextMenuSubTrigger

### Props

| Prop        | Type                 | Default |
| ----------- | -------------------- | ------- |
| `as`        | `AsTag \| Component` | `"div"` |
| `asChild`   | `boolean`            | -       |
| `disabled`  | `boolean`            | -       |
| `textValue` | `string`             | -       |

## ContextMenuSubContent

### Props

| Prop                     | Type                                                    | Default |
| ------------------------ | ------------------------------------------------------- | ------- |
| `alignOffset`            | `number`                                                | -       |
| `arrowPadding`           | `number`                                                | -       |
| `as`                     | `AsTag \| Component`                                    | `"div"` |
| `asChild`                | `boolean`                                               | -       |
| `avoidCollisions`        | `boolean`                                               | -       |
| `collisionBoundary`      | `Element \| (Element \| null)[] \| null`                | -       |
| `collisionPadding`       | `number \| Partial<Record<"top" \| "right" \| "bott...` | -       |
| `forceMount`             | `boolean`                                               | -       |
| `hideWhenDetached`       | `boolean`                                               | -       |
| `loop`                   | `boolean`                                               | -       |
| `prioritizePosition`     | `boolean`                                               | -       |
| `sideOffset`             | `number`                                                | -       |
| `sticky`                 | `"partial" \| "always"`                                 | -       |
| `updatePositionStrategy` | `"always" \| "optimized"`                               | -       |

### Emits

| Event                | Payload                                               |
| -------------------- | ----------------------------------------------------- |
| `closeAutoFocus`     | `[event: Event]`                                      |
| `entryFocus`         | `[event: Event]`                                      |
| `escapeKeyDown`      | `[event: KeyboardEvent]`                              |
| `focusOutside`       | `[event: FocusOutsideEvent]`                          |
| `interactOutside`    | `[event: PointerDownOutsideEvent \| FocusOutsideE...` |
| `openAutoFocus`      | `[event: Event]`                                      |
| `pointerDownOutside` | `[event: PointerDownOutsideEvent]`                    |

## ContextMenuArrow

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"svg"` |
| `asChild` | `boolean`            | -       |
| `height`  | `number`             | `5`     |
| `width`   | `number`             | `10`    |
