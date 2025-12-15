# Listbox

Accessible list selection

**Parts:** `ListboxRoot`, `ListboxContent`, `ListboxFilter`, `ListboxItem`, `ListboxItemIndicator`, `ListboxGroup`, `ListboxGroupLabel`, `ListboxVirtualizer`

## ListboxRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `by` | `string \| ((a: AcceptableValue, b: AcceptableVal...` | - |
| `defaultValue` | `AcceptableValue \| AcceptableValue[]` | - |
| `dir` | `"ltr" \| "rtl"` | - |
| `disabled` | `boolean` | - |
| `highlightOnHover` | `boolean` | - |
| `modelValue` | `AcceptableValue \| AcceptableValue[]` | - |
| `multiple` | `boolean` | - |
| `name` | `string` | - |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` |
| `selectionBehavior` | `"toggle" \| "replace"` | `"toggle"` |

### Emits
| Event | Payload |
|-------|---------|
| `entryFocus` | `[event: CustomEvent<any>]` |
| `highlight` | `[payload: { ref: HTMLElement; value: Acceptable...` |
| `leave` | `[event: Event]` |
| `update:modelValue` | `[value: AcceptableValue]` |

### Slots
| Slot | Type |
|------|------|
| `modelValue` | `AcceptableValue \| AcceptableValue[] \| undefined` |

## ListboxContent

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |

## ListboxFilter

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"input"` |
| `asChild` | `boolean` | - |
| `autoFocus` | `boolean` | - |
| `modelValue` | `string` | - |

### Emits
| Event | Payload |
|-------|---------|
| `update:modelValue` | `[string]` |

### Slots
| Slot | Type |
|------|------|
| `modelValue` | `string \| undefined` |

## ListboxItem

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `disabled` | `boolean` | - |
| `value`* | `AcceptableValue` | - |

### Emits
| Event | Payload |
|-------|---------|
| `select` | `[event: SelectEvent<AcceptableValue>]` |

## ListboxItemIndicator

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"span"` |
| `asChild` | `boolean` | - |

## ListboxGroup

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |

## ListboxGroupLabel

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `for` | `string` | - |

## ListboxVirtualizer

### Props
| Prop | Type | Default |
|------|------|---------|
| `estimateSize` | `number` | - |
| `options`* | `AcceptableValue[]` | - |
| `textContent` | `((option: AcceptableValue) => string)` | - |

### Slots
| Slot | Type |
|------|------|
| `option` | `string \| number \| false \| true \| Record<string,...` |
| `virtualizer` | `Virtualizer<Element \| Window, Element>` |
| `virtualItem` | `VirtualItem<Element>` |
