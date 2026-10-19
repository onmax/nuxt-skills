# Alert Dialog

Modal dialog requiring action

**Parts:** `AlertDialogRoot`, `AlertDialogTrigger`, `AlertDialogPortal`, `AlertDialogOverlay`, `AlertDialogContent`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogCancel`, `AlertDialogAction`

## AlertDialogRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `defaultOpen` | `boolean` | - |
| `open` | `boolean` | - |

### Emits
| Event | Payload |
|-------|---------|
| `update:open` | `[value: boolean]` |

## AlertDialogTrigger

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |

## AlertDialogPortal

### Props
| Prop | Type | Default |
|------|------|---------|
| `disabled` | `boolean` | - |
| `forceMount` | `boolean` | - |
| `to` | `string \| HTMLElement` | - |

## AlertDialogOverlay

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `forceMount` | `boolean` | - |

## AlertDialogContent

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

## AlertDialogTitle

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"h2"` |
| `asChild` | `boolean` | - |

## AlertDialogDescription

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"p"` |
| `asChild` | `boolean` | - |

## AlertDialogCancel

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |

## AlertDialogAction

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |
