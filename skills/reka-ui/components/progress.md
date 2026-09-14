# Progress

Progress indicator

**Parts:** `ProgressRoot`, `ProgressIndicator`

## ProgressRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `getValueLabel` | `((value: number, max: number) => string)` | ``${Math.round((value / max) * DEFAULT_MAX)}%`` |
| `max` | `number` | `DEFAULT_MAX` |
| `modelValue` | `number \| null` | - |

### Emits
| Event | Payload |
|-------|---------|
| `update:max` | `[value: number]` |
| `update:modelValue` | `[value: string[]]` |

### Slots
| Slot | Type |
|------|------|
| `modelValue` | `number \| null \| undefined` |

## ProgressIndicator

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
