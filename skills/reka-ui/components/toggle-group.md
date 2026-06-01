# Toggle Group

Multiple toggles with group behavior

**Parts:** `ToggleGroupRoot`, `ToggleGroupItem`

## ToggleGroupRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `defaultValue` | `string \| string[]` | - |
| `dir` | `"ltr" \| "rtl"` | - |
| `disabled` | `boolean` | `false` |
| `loop` | `boolean` | `true` |
| `modelValue` | `string \| string[]` | - |
| `orientation` | `"vertical" \| "horizontal"` | - |
| `rovingFocus` | `boolean` | `true` |
| `type` | `"single" \| "multiple"` | - |

### Emits
| Event | Payload |
|-------|---------|
| `update:modelValue` | `[payload: string \| string[]]` |

### Slots
| Slot | Type |
|------|------|
| `modelValue` | `string \| string[] \| undefined` |

## ToggleGroupItem

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |
| `disabled` | `boolean` | - |
| `value`* | `string` | - |
