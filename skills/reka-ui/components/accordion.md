# Accordion

Collapsible content sections

**Parts:** `AccordionRoot`, `AccordionItem`, `AccordionHeader`, `AccordionTrigger`, `AccordionContent`

## AccordionRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `collapsible` | `boolean` | `false` |
| `defaultValue` | `string \| string[]` | - |
| `dir` | `"ltr" \| "rtl"` | - |
| `disabled` | `boolean` | `false` |
| `modelValue` | `string \| string[]` | - |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` |
| `type` | `"single" \| "multiple"` | - |

### Emits
| Event | Payload |
|-------|---------|
| `update:modelValue` | `[value: string \| string[]]` |

### Slots
| Slot | Type |
|------|------|
| `modelValue` | `string \| string[] \| undefined` |

## AccordionItem

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `disabled` | `boolean` | - |
| `value`* | `string` | - |

### Slots
| Slot | Type |
|------|------|
| `open` | `boolean` |

## AccordionHeader

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"h3"` |
| `asChild` | `boolean` | - |

## AccordionTrigger

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |

## AccordionContent

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `forceMount` | `boolean` | - |
