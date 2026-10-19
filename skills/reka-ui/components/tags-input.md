# Tags Input

Multiple tag entry and management

**Parts:** `TagsInputRoot`, `TagsInputInput`, `TagsInputItem`, `TagsInputItemText`, `TagsInputItemDelete`, `TagsInputClear`

## TagsInputRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `addOnBlur` | `boolean` | - |
| `addOnPaste` | `boolean` | - |
| `addOnTab` | `boolean` | - |
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `convertValue` | `((value: string) => AcceptableInputValue)` | - |
| `defaultValue` | `AcceptableInputValue[]` | `[]` |
| `delimiter` | `string` | `","` |
| `dir` | `"ltr" \| "rtl"` | - |
| `disabled` | `boolean` | - |
| `displayValue` | `((value: AcceptableInputValue) => string)` | `value.toString()` |
| `duplicate` | `boolean` | - |
| `id` | `string` | - |
| `max` | `number` | `0` |
| `modelValue` | `AcceptableInputValue[]` | - |
| `name` | `string` | - |
| `required` | `boolean` | - |

### Emits
| Event | Payload |
|-------|---------|
| `invalid` | `[payload: AcceptableInputValue]` |
| `update:modelValue` | `[payload: AcceptableInputValue[]]` |

### Slots
| Slot | Type |
|------|------|
| `modelValue` | `string \| Record<string, any>` |

## TagsInputInput

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"input"` |
| `asChild` | `boolean` | - |
| `autoFocus` | `boolean` | - |
| `maxLength` | `number` | - |
| `placeholder` | `string` | - |

## TagsInputItem

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `disabled` | `boolean` | - |
| `value`* | `string \| Record<string, any>` | - |

## TagsInputItemText

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"span"` |
| `asChild` | `boolean` | - |

## TagsInputItemDelete

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |

## TagsInputClear

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |
