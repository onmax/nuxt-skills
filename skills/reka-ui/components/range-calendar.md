# Range Calendar

Calendar for date ranges (alpha)

**Parts:** `RangeCalendarRoot`, `RangeCalendarHeader`, `RangeCalendarHeading`, `RangeCalendarGrid`, `RangeCalendarCell`, `RangeCalendarCellTrigger`, `RangeCalendarNext`, `RangeCalendarPrev`

## RangeCalendarRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
| `calendarLabel` | `string` | - |
| `defaultPlaceholder` | `DateValue` | - |
| `defaultValue` | `DateRange` | `{ start: undefined, end: undefined }` |
| `dir` | `"ltr" \| "rtl"` | - |
| `disabled` | `boolean` | `false` |
| `fixedWeeks` | `boolean` | `false` |
| `initialFocus` | `boolean` | `false` |
| `isDateDisabled` | `Matcher` | - |
| `isDateUnavailable` | `Matcher` | - |
| `locale` | `string` | `"en"` |
| `maxValue` | `DateValue` | - |
| `minValue` | `DateValue` | - |
| `modelValue` | `DateRange` | - |
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
| `update:modelValue` | `[date: DateRange]` |
| `update:placeholder` | `[date: DateValue]` |
| `update:startValue` | `[date: DateValue]` |

### Slots
| Slot | Type |
|------|------|
| `date` | `DateValue` |
| `grid` | `Grid<DateValue>[]` |
| `weekDays` | `string[]` |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` |
| `locale` | `string` |
| `fixedWeeks` | `boolean` |

## RangeCalendarHeader

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |

## RangeCalendarHeading

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |

### Slots
| Slot | Type |
|------|------|
| `headingValue` | `string` |

## RangeCalendarGrid

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"table"` |
| `asChild` | `boolean` | - |

## RangeCalendarCell

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"td"` |
| `asChild` | `boolean` | - |
| `date`* | `DateValue` | - |

## RangeCalendarCellTrigger

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

## RangeCalendarNext

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |
| `nextPage` | `((placeholder: DateValue) => DateValue)` | - |
| `step` | `"month" \| "year"` | - |

## RangeCalendarPrev

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |
| `prevPage` | `((placeholder: DateValue) => DateValue)` | - |
| `step` | `"month" \| "year"` | - |
