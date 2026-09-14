# Toast

Temporary notifications

**Parts:** `ToastProvider`, `ToastRoot`, `ToastViewport`, `ToastTitle`, `ToastDescription`, `ToastAction`, `ToastClose`, `ToastPortal`

## ToastProvider

### Props
| Prop | Type | Default |
|------|------|---------|
| `duration` | `number` | `5000` |
| `label` | `string` | `"Notification"` |
| `swipeDirection` | `"right" \| "left" \| "up" \| "down"` | `"right"` |
| `swipeThreshold` | `number` | `50` |

## ToastRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"li"` |
| `asChild` | `boolean` | - |
| `defaultOpen` | `boolean` | `true` |
| `duration` | `number` | - |
| `forceMount` | `boolean` | - |
| `open` | `boolean` | - |
| `type` | `"foreground" \| "background"` | `"foreground"` |

### Emits
| Event | Payload |
|-------|---------|
| `escapeKeyDown` | `[event: KeyboardEvent]` |
| `pause` | `[]` |
| `resume` | `[]` |
| `swipeCancel` | `[event: SwipeEvent]` |
| `swipeEnd` | `[event: SwipeEvent]` |
| `swipeMove` | `[event: SwipeEvent]` |
| `swipeStart` | `[event: SwipeEvent]` |
| `update:open` | `[value: boolean]` |

### Slots
| Slot | Type |
|------|------|
| `open` | `boolean` |
| `remaining` | `number` |
| `duration` | `number` |

## ToastViewport

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"ol"` |
| `asChild` | `boolean` | - |
| `hotkey` | `string[]` | `["F8"]` |
| `label` | `string \| ((hotkey: string) => string)` | `"Notifications ({hotkey})"` |

## ToastTitle

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |

## ToastDescription

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |

## ToastAction

### Props
| Prop | Type | Default |
|------|------|---------|
| `altText`* | `string` | - |
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |

## ToastClose

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |

## ToastPortal

### Props
| Prop | Type | Default |
|------|------|---------|
| `disabled` | `boolean` | - |
| `forceMount` | `boolean` | - |
| `to` | `string \| HTMLElement` | - |
