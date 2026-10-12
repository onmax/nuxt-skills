# Radio Group

Mutually exclusive selection

**Parts:** `RadioGroupRoot`, `RadioGroupItem`, `RadioGroupIndicator`

## RadioGroupRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `defaultValue` | `string` | - |
| `dir` | `"ltr" \| "rtl"` | - |
| `disabled` | `boolean` | `false` |
| `loop` | `boolean` | `true` |
| `modelValue` | `string` | - |
| `name` | `string` | - |
| `orientation` | `"vertical" \| "horizontal"` | - |
| `required` | `boolean` | `false` |

### Emits
| Event | Payload |
|-------|---------|
| `update:modelValue` | `[payload: string]` |

### Slots
| Slot | Type |
|------|------|
| `modelValue` | `string \| undefined` |

## RadioGroupItem

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |
| `disabled` | `boolean` | `false` |
| `id` | `string` | - |
| `name` | `string` | - |
| `required` | `boolean` | - |
| `value` | `string` | - |

## RadioGroupIndicator

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"span"` |
| `asChild` | `boolean` | - |
| `forceMount` | `boolean` | - |
