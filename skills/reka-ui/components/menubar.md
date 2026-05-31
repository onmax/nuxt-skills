# Menubar

Horizontal menu bar

**Parts:** `MenubarRoot`, `MenubarMenu`, `MenubarTrigger`, `MenubarPortal`, `MenubarContent`, `MenubarItem`, `MenubarCheckboxItem`, `MenubarRadioGroup`, `MenubarRadioItem`, `MenubarItemIndicator`, `MenubarLabel`, `MenubarGroup`, `MenubarSeparator`, `MenubarSub`, `MenubarSubTrigger`, `MenubarSubContent`, `MenubarArrow`

## MenubarRoot

### Props

| Prop           | Type             | Default |
| -------------- | ---------------- | ------- |
| `defaultValue` | `string`         | -       |
| `dir`          | `"ltr" \| "rtl"` | -       |
| `loop`         | `boolean`        | `false` |
| `modelValue`   | `string`         | -       |

### Emits

| Event               | Payload            |
| ------------------- | ------------------ |
| `update:modelValue` | `[value: boolean]` |

### Slots

| Slot         | Type     |
| ------------ | -------- |
| `modelValue` | `string` |

## MenubarMenu

### Props

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `value` | `string` | -       |

## MenubarTrigger

### Props

| Prop       | Type                 | Default    |
| ---------- | -------------------- | ---------- |
| `as`       | `AsTag \| Component` | `"button"` |
| `asChild`  | `boolean`            | -          |
| `disabled` | `boolean`            | -          |

## MenubarPortal

### Props

| Prop         | Type                    | Default |
| ------------ | ----------------------- | ------- |
| `disabled`   | `boolean`               | -       |
| `forceMount` | `boolean`               | -       |
| `to`         | `string \| HTMLElement` | -       |

## MenubarContent

### Props

| Prop                     | Type                                                    | Default   |
| ------------------------ | ------------------------------------------------------- | --------- |
| `align`                  | `"start" \| "center" \| "end"`                          | `"start"` |
| `alignOffset`            | `number`                                                | -         |
| `arrowPadding`           | `number`                                                | -         |
| `as`                     | `AsTag \| Component`                                    | `"div"`   |
| `asChild`                | `boolean`                                               | -         |
| `avoidCollisions`        | `boolean`                                               | -         |
| `collisionBoundary`      | `Element \| (Element \| null)[] \| null`                | -         |
| `collisionPadding`       | `number \| Partial<Record<"top" \| "right" \| "bott...` | -         |
| `forceMount`             | `boolean`                                               | -         |
| `hideWhenDetached`       | `boolean`                                               | -         |
| `loop`                   | `boolean`                                               | -         |
| `prioritizePosition`     | `boolean`                                               | -         |
| `side`                   | `"top" \| "right" \| "bottom" \| "left"`                | -         |
| `sideOffset`             | `number`                                                | -         |
| `sticky`                 | `"partial" \| "always"`                                 | -         |
| `updatePositionStrategy` | `"always" \| "optimized"`                               | -         |

### Emits

| Event                | Payload                                               |
| -------------------- | ----------------------------------------------------- |
| `closeAutoFocus`     | `[event: Event]`                                      |
| `escapeKeyDown`      | `[event: KeyboardEvent]`                              |
| `focusOutside`       | `[event: FocusOutsideEvent]`                          |
| `interactOutside`    | `[event: PointerDownOutsideEvent \| FocusOutsideE...` |
| `pointerDownOutside` | `[event: PointerDownOutsideEvent]`                    |

## MenubarItem

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

## MenubarCheckboxItem

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

## MenubarRadioGroup

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

## MenubarRadioItem

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

## MenubarItemIndicator

### Props

| Prop         | Type                 | Default |
| ------------ | -------------------- | ------- |
| `as`         | `AsTag \| Component` | `"div"` |
| `asChild`    | `boolean`            | -       |
| `forceMount` | `boolean`            | -       |

## MenubarLabel

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## MenubarGroup

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## MenubarSeparator

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## MenubarSub

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

## MenubarSubTrigger

### Props

| Prop        | Type                 | Default |
| ----------- | -------------------- | ------- |
| `as`        | `AsTag \| Component` | `"div"` |
| `asChild`   | `boolean`            | -       |
| `disabled`  | `boolean`            | -       |
| `textValue` | `string`             | -       |

## MenubarSubContent

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

## MenubarArrow

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"svg"` |
| `asChild` | `boolean`            | -       |
| `height`  | `number`             | `5`     |
| `width`   | `number`             | `10`    |
