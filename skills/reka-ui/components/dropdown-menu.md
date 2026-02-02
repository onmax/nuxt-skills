# Dropdown Menu

Dropdown action menu

**Parts:** `DropdownMenuRoot`, `DropdownMenuTrigger`, `DropdownMenuPortal`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuItemIndicator`, `DropdownMenuLabel`, `DropdownMenuGroup`, `DropdownMenuSeparator`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuArrow`

## DropdownMenuRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `defaultOpen` | `boolean` | - |
| `dir` | `"ltr" \| "rtl"` | - |
| `modal` | `boolean` | `true` |
| `open` | `boolean` | - |

### Emits
| Event | Payload |
|-------|---------|
| `update:open` | `[payload: boolean]` |

### Slots
| Slot | Type |
|------|------|
| `open` | `boolean` |

## DropdownMenuTrigger

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |
| `disabled` | `boolean` | - |

## DropdownMenuPortal

### Props
| Prop | Type | Default |
|------|------|---------|
| `disabled` | `boolean` | - |
| `forceMount` | `boolean` | - |
| `to` | `string \| HTMLElement` | - |

## DropdownMenuContent

### Props
| Prop | Type | Default |
|------|------|---------|
| `align` | `"start" \| "center" \| "end"` | - |
| `alignOffset` | `number` | - |
| `arrowPadding` | `number` | - |
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `avoidCollisions` | `boolean` | - |
| `collisionBoundary` | `Element \| (Element \| null)[] \| null` | - |
| `collisionPadding` | `number \| Partial<Record<"top" \| "right" \| "bott...` | - |
| `forceMount` | `boolean` | - |
| `hideWhenDetached` | `boolean` | - |
| `loop` | `boolean` | - |
| `prioritizePosition` | `boolean` | - |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | - |
| `sideOffset` | `number` | - |
| `sticky` | `"partial" \| "always"` | - |
| `updatePositionStrategy` | `"always" \| "optimized"` | - |

### Emits
| Event | Payload |
|-------|---------|
| `closeAutoFocus` | `[event: Event]` |
| `escapeKeyDown` | `[event: KeyboardEvent]` |
| `focusOutside` | `[event: FocusOutsideEvent]` |
| `interactOutside` | `[event: PointerDownOutsideEvent \| FocusOutsideE...` |
| `pointerDownOutside` | `[event: PointerDownOutsideEvent]` |

## DropdownMenuItem

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `disabled` | `boolean` | - |
| `textValue` | `string` | - |

### Emits
| Event | Payload |
|-------|---------|
| `select` | `[event: Event]` |

## DropdownMenuCheckboxItem

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `checked` | `false \| true \| "indeterminate"` | - |
| `disabled` | `boolean` | - |
| `textValue` | `string` | - |

### Emits
| Event | Payload |
|-------|---------|
| `select` | `[event: Event]` |
| `update:checked` | `[payload: boolean]` |

## DropdownMenuRadioGroup

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `modelValue` | `string` | - |

### Emits
| Event | Payload |
|-------|---------|
| `update:modelValue` | `[payload: string]` |

## DropdownMenuRadioItem

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `disabled` | `boolean` | - |
| `textValue` | `string` | - |
| `value`* | `string` | - |

### Emits
| Event | Payload |
|-------|---------|
| `select` | `[event: Event]` |

## DropdownMenuItemIndicator

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `forceMount` | `boolean` | - |

## DropdownMenuLabel

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |

## DropdownMenuGroup

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |

## DropdownMenuSeparator

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |

## DropdownMenuSub

### Props
| Prop | Type | Default |
|------|------|---------|
| `defaultOpen` | `boolean` | - |
| `open` | `boolean` | - |

### Emits
| Event | Payload |
|-------|---------|
| `update:open` | `[payload: boolean]` |

### Slots
| Slot | Type |
|------|------|
| `open` | `boolean` |

## DropdownMenuSubTrigger

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `disabled` | `boolean` | - |
| `textValue` | `string` | - |

## DropdownMenuSubContent

### Props
| Prop | Type | Default |
|------|------|---------|
| `alignOffset` | `number` | - |
| `arrowPadding` | `number` | - |
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `avoidCollisions` | `boolean` | - |
| `collisionBoundary` | `Element \| (Element \| null)[] \| null` | - |
| `collisionPadding` | `number \| Partial<Record<"top" \| "right" \| "bott...` | - |
| `forceMount` | `boolean` | - |
| `hideWhenDetached` | `boolean` | - |
| `loop` | `boolean` | - |
| `prioritizePosition` | `boolean` | - |
| `sideOffset` | `number` | - |
| `sticky` | `"partial" \| "always"` | - |
| `updatePositionStrategy` | `"always" \| "optimized"` | - |

### Emits
| Event | Payload |
|-------|---------|
| `closeAutoFocus` | `[event: Event]` |
| `entryFocus` | `[event: Event]` |
| `escapeKeyDown` | `[event: KeyboardEvent]` |
| `focusOutside` | `[event: FocusOutsideEvent]` |
| `interactOutside` | `[event: PointerDownOutsideEvent \| FocusOutsideE...` |
| `openAutoFocus` | `[event: Event]` |
| `pointerDownOutside` | `[event: PointerDownOutsideEvent]` |

## DropdownMenuArrow

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"svg"` |
| `asChild` | `boolean` | - |
| `height` | `number` | `5` |
| `width` | `number` | `10` |
