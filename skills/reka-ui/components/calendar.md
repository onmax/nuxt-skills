# Calendar

Date selection grid (alpha)

**Parts:** `CalendarRoot`, `CalendarHeader`, `CalendarHeading`, `CalendarGrid`, `CalendarGridHead`, `CalendarGridBody`, `CalendarGridRow`, `CalendarCell`, `CalendarCellTrigger`, `CalendarHeadCell`, `CalendarNext`, `CalendarPrev`

## CalendarRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `calendarLabel` | `string` | - |
| `defaultPlaceholder` | `DateValue` | - |
| `defaultValue` | `DateValue` | - |
| `dir` | `"ltr" \| "rtl"` | - |
| `disabled` | `boolean` | `false` |
| `fixedWeeks` | `boolean` | `false` |
| `initialFocus` | `boolean` | `false` |
| `isDateDisabled` | `Matcher` | - |
| `isDateUnavailable` | `Matcher` | - |
| `locale` | `string` | `"en"` |
| `maxValue` | `DateValue` | - |
| `minValue` | `DateValue` | - |
| `modelValue` | `DateValue \| DateValue[]` | - |
| `multiple` | `boolean` | `false` |
| `nextPage` | `((placeholder: DateValue) => DateValue)` | - |
| `numberOfMonths` | `number` | `1` |
| `pagedNavigation` | `boolean` | `false` |
| `placeholder` | `DateValue` | - |
| `preventDeselect` | `boolean` | `false` |
| `prevPage` | `((placeholder: DateValue) => DateValue)` | - |
| `readonly` | `boolean` | `false` |
| `weekdayFormat` | `"narrow" \| "short" \| "long"` | `"narrow"` |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` |

### Emits
| Event | Payload |
|-------|---------|
| `update:modelValue` | `[date: DateValue]` |
| `update:placeholder` | `[date: DateValue]` |

### Slots
| Slot | Type |
|------|------|
| `date` | `DateValue` |
| `grid` | `Grid<DateValue>[]` |
| `weekDays` | `string[]` |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` |
| `locale` | `string` |
| `fixedWeeks` | `boolean` |

## CalendarHeader

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |

## CalendarHeading

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |

### Slots
| Slot | Type |
|------|------|
| `headingValue` | `string` |

## CalendarGrid

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"table"` |
| `asChild` | `boolean` | - |

## CalendarGridHead

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"thead"` |
| `asChild` | `boolean` | - |

## CalendarGridBody

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"tbody"` |
| `asChild` | `boolean` | - |

## CalendarGridRow

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"tr"` |
| `asChild` | `boolean` | - |

## CalendarCell

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"td"` |
| `asChild` | `boolean` | - |
| `date`* | `DateValue` | - |

## CalendarCellTrigger

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `day`* | `DateValue` | - |
| `month`* | `DateValue` | - |

### Slots
| Slot | Type |
|------|------|
| `dayValue` | `string` |

## CalendarHeadCell

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"th"` |
| `asChild` | `boolean` | - |

## CalendarNext

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |
| `nextPage` | `((placeholder: DateValue) => DateValue)` | - |
| `step` | `"month" \| "year"` | `"month"` |

## CalendarPrev

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |
| `prevPage` | `((placeholder: DateValue) => DateValue)` | - |
| `step` | `"month" \| "year"` | `"month"` |
