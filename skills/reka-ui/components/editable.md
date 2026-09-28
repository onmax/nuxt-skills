# Editable

Inline text editing with preview/edit modes

**Parts:** `EditableRoot`, `EditableArea`, `EditableInput`, `EditablePreview`, `EditableSubmitTrigger`, `EditableCancelTrigger`, `EditableEditTrigger`

## EditableRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `activationMode` | `"dblclick" \| "focus" \| "none"` | `"focus"` |
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `autoResize` | `boolean` | `false` |
| `defaultValue` | `string` | - |
| `dir` | `"ltr" \| "rtl"` | - |
| `disabled` | `boolean` | `false` |
| `id` | `string` | - |
| `maxLength` | `number` | - |
| `modelValue` | `string` | - |
| `name` | `string` | - |
| `placeholder` | `string \| { edit: string; preview: string; }` | `"Enter text..."` |
| `readonly` | `boolean` | - |
| `required` | `boolean` | `false` |
| `selectOnFocus` | `boolean` | `false` |
| `startWithEditMode` | `boolean` | - |
| `submitMode` | `"blur" \| "none" \| "enter" \| "both"` | `"blur"` |

### Emits
| Event | Payload |
|-------|---------|
| `submit` | `[value: string]` |
| `update:modelValue` | `[value: string]` |
| `update:state` | `[state: "cancel" \| "submit" \| "edit"]` |

### Slots
| Slot | Type |
|------|------|
| `isEditing` | `boolean` |
| `modelValue` | `string \| undefined` |
| `isEmpty` | `boolean` |
| `submit` | `` |
| `cancel` | `` |
| `edit` | `` |

## EditableArea

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |

## EditableInput

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"input"` |
| `asChild` | `boolean` | - |

## EditablePreview

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"span"` |
| `asChild` | `boolean` | - |

## EditableSubmitTrigger

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |

## EditableCancelTrigger

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |

## EditableEditTrigger

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |
