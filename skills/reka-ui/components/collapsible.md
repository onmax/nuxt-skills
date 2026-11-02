# Collapsible

Single collapsible panel

**Parts:** `CollapsibleRoot`, `CollapsibleTrigger`, `CollapsibleContent`

## CollapsibleRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `defaultOpen` | `boolean` | `false` |
| `disabled` | `boolean` | - |
| `open` | `boolean` | - |

### Emits
| Event | Payload |
|-------|---------|
| `update:open` | `[value: boolean]` |

### Slots
| Slot | Type |
|------|------|
| `open` | `boolean` |

## CollapsibleTrigger

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |

## CollapsibleContent

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `forceMount` | `boolean` | - |
