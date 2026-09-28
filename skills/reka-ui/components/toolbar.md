# Toolbar

Toolbar with buttons/toggles

**Parts:** `ToolbarRoot`, `ToolbarButton`, `ToolbarLink`, `ToolbarToggleGroup`, `ToolbarToggleItem`, `ToolbarSeparator`

## ToolbarRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `dir` | `"ltr" \| "rtl"` | - |
| `loop` | `boolean` | - |
| `orientation` | `"vertical" \| "horizontal"` | `"horizontal"` |

## ToolbarButton

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |
| `disabled` | `boolean` | - |

## ToolbarLink

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"a"` |
| `asChild` | `boolean` | - |

## ToolbarToggleGroup

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `defaultValue` | `string \| string[]` | - |
| `dir` | `"ltr" \| "rtl"` | - |
| `disabled` | `boolean` | - |
| `loop` | `boolean` | - |
| `modelValue` | `string \| string[]` | - |
| `orientation` | `"vertical" \| "horizontal"` | - |
| `rovingFocus` | `boolean` | - |
| `type` | `"single" \| "multiple"` | - |

### Emits
| Event | Payload |
|-------|---------|
| `update:modelValue` | `[payload: string \| string[]]` |

## ToolbarToggleItem

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `disabled` | `boolean` | - |
| `value`* | `string` | - |

## ToolbarSeparator

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
