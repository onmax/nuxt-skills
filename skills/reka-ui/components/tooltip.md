# Tooltip

Informational hover tip

**Parts:** `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`, `TooltipPortal`, `TooltipContent`, `TooltipArrow`

## TooltipProvider

### Props
| Prop | Type | Default |
|------|------|---------|
| `delayDuration` | `number` | `700` |
| `disableClosingTrigger` | `boolean` | - |
| `disabled` | `boolean` | - |
| `disableHoverableContent` | `boolean` | `false` |
| `ignoreNonKeyboardFocus` | `boolean` | `false` |
| `skipDelayDuration` | `number` | `300` |

## TooltipRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `defaultOpen` | `boolean` | `false` |
| `delayDuration` | `number` | - |
| `disableClosingTrigger` | `boolean` | - |
| `disabled` | `boolean` | - |
| `disableHoverableContent` | `boolean` | - |
| `ignoreNonKeyboardFocus` | `boolean` | - |
| `open` | `boolean` | - |

### Emits
| Event | Payload |
|-------|---------|
| `update:open` | `[value: boolean]` |

### Slots
| Slot | Type |
|------|------|
| `open` | `boolean` |

## TooltipTrigger

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |

## TooltipPortal

### Props
| Prop | Type | Default |
|------|------|---------|
| `disabled` | `boolean` | - |
| `forceMount` | `boolean` | - |
| `to` | `string \| HTMLElement` | - |

## TooltipContent

### Props
| Prop | Type | Default |
|------|------|---------|
| `align` | `"start" \| "center" \| "end"` | - |
| `alignOffset` | `number` | - |
| `ariaLabel` | `string` | - |
| `arrowPadding` | `number` | - |
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `avoidCollisions` | `boolean` | - |
| `collisionBoundary` | `Element \| (Element \| null)[] \| null` | - |
| `collisionPadding` | `number \| Partial<Record<"top" \| "right" \| "bott...` | - |
| `forceMount` | `boolean` | - |
| `hideWhenDetached` | `boolean` | - |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` |
| `sideOffset` | `number` | - |
| `sticky` | `"partial" \| "always"` | - |

### Emits
| Event | Payload |
|-------|---------|
| `escapeKeyDown` | `[event: KeyboardEvent]` |
| `pointerDownOutside` | `[event: Event]` |

## TooltipArrow

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"svg"` |
| `asChild` | `boolean` | - |
| `height` | `number` | `5` |
| `width` | `number` | `10` |
