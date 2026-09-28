# Pin Input

Multi-character code entry (OTP)

**Parts:** `PinInputRoot`, `PinInputInput`

## PinInputRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `defaultValue` | `string[]` | - |
| `dir` | `"ltr" \| "rtl"` | - |
| `disabled` | `boolean` | - |
| `id` | `string` | - |
| `mask` | `boolean` | - |
| `modelValue` | `string[]` | - |
| `name` | `string` | - |
| `otp` | `boolean` | - |
| `placeholder` | `string` | `""` |
| `required` | `boolean` | - |
| `type` | `"number" \| "text"` | `"text"` |

### Emits
| Event | Payload |
|-------|---------|
| `complete` | `[value: string[]]` |
| `update:modelValue` | `[value: string[]]` |

### Slots
| Slot | Type |
|------|------|
| `modelValue` | `string[]` |

## PinInputInput

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"input"` |
| `asChild` | `boolean` | - |
| `disabled` | `boolean` | - |
| `index`* | `number` | - |
