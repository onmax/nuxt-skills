# Dialog

Modal dialog

**Parts:** `DialogRoot`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogTitle`, `DialogDescription`, `DialogClose`

## DialogRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `defaultOpen` | `boolean` | `false` |
| `modal` | `boolean` | `true` |
| `open` | `boolean` | - |

### Emits
| Event | Payload |
|-------|---------|
| `update:open` | `[value: boolean]` |

### Slots
| Slot | Type |
|------|------|
| `open` | `boolean` |

## DialogTrigger

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |

## DialogPortal

### Props
| Prop | Type | Default |
|------|------|---------|
| `disabled` | `boolean` | - |
| `forceMount` | `boolean` | - |
| `to` | `string \| HTMLElement` | - |

## DialogOverlay

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `forceMount` | `boolean` | - |

## DialogContent

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `disableOutsidePointerEvents` | `boolean` | - |
| `forceMount` | `boolean` | - |
| `trapFocus` | `boolean` | - |

### Emits
| Event | Payload |
|-------|---------|
| `closeAutoFocus` | `[event: Event]` |
| `escapeKeyDown` | `[event: KeyboardEvent]` |
| `focusOutside` | `[event: FocusOutsideEvent]` |
| `interactOutside` | `[event: PointerDownOutsideEvent \| FocusOutsideE...` |
| `openAutoFocus` | `[event: Event]` |
| `pointerDownOutside` | `[event: PointerDownOutsideEvent]` |

## DialogTitle

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"h2"` |
| `asChild` | `boolean` | - |

## DialogDescription

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"p"` |
| `asChild` | `boolean` | - |

## DialogClose

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |
