# Date Range Picker

Date range picker (alpha)

**Parts:** `DateRangePickerRoot`, `DateRangePickerField`, `DateRangePickerInput`, `DateRangePickerTrigger`, `DateRangePickerContent`, `DateRangePickerCalendar`, `DateRangePickerHeader`, `DateRangePickerHeading`, `DateRangePickerGrid`, `DateRangePickerCell`, `DateRangePickerCellTrigger`, `DateRangePickerNext`, `DateRangePickerPrev`

## DateRangePickerRoot

### Props

| Prop                 | Type                                      | Default                                |
| -------------------- | ----------------------------------------- | -------------------------------------- |
| `as`                 | `AsTag \| Component`                      | `"div"`                                |
| `asChild`            | `boolean`                                 | -                                      |
| `defaultOpen`        | `boolean`                                 | `false`                                |
| `defaultPlaceholder` | `DateValue`                               | -                                      |
| `defaultValue`       | `DateRange`                               | `{ start: undefined, end: undefined }` |
| `dir`                | `"ltr" \| "rtl"`                          | -                                      |
| `disabled`           | `boolean`                                 | `false`                                |
| `fixedWeeks`         | `boolean`                                 | `false`                                |
| `granularity`        | `"day" \| "hour" \| "minute" \| "second"` | -                                      |
| `hideTimeZone`       | `boolean`                                 | -                                      |
| `hourCycle`          | `12 \| 24`                                | -                                      |
| `id`                 | `string`                                  | -                                      |
| `isDateDisabled`     | `Matcher`                                 | -                                      |
| `isDateUnavailable`  | `Matcher`                                 | -                                      |
| `locale`             | `string`                                  | `"en"`                                 |
| `maxValue`           | `DateValue`                               | -                                      |
| `minValue`           | `DateValue`                               | -                                      |
| `modal`              | `boolean`                                 | `false`                                |
| `modelValue`         | `DateRange`                               | -                                      |
| `name`               | `string`                                  | -                                      |
| `numberOfMonths`     | `number`                                  | `1`                                    |
| `open`               | `boolean`                                 | -                                      |
| `pagedNavigation`    | `boolean`                                 | `false`                                |
| `placeholder`        | `DateValue`                               | -                                      |
| `preventDeselect`    | `boolean`                                 | `false`                                |
| `readonly`           | `boolean`                                 | `false`                                |
| `required`           | `boolean`                                 | -                                      |
| `weekdayFormat`      | `"narrow" \| "short" \| "long"`           | `"narrow"`                             |
| `weekStartsOn`       | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`         | `0`                                    |

### Emits

| Event                | Payload             |
| -------------------- | ------------------- |
| `update:modelValue`  | `[date: DateRange]` |
| `update:open`        | `[value: boolean]`  |
| `update:placeholder` | `[date: DateValue]` |
| `update:startValue`  | `[date: DateValue]` |

## DateRangePickerField

### Slots

| Slot         | Type                                                 |
| ------------ | ---------------------------------------------------- |
| `segments`   | `{ start: { part: SegmentPart; value: string; }[...` |
| `modelValue` | `DateRange`                                          |

## DateRangePickerInput

### Props

| Prop      | Type                                                      | Default |
| --------- | --------------------------------------------------------- | ------- |
| `as`      | `AsTag \| Component`                                      | `"div"` |
| `asChild` | `boolean`                                                 | -       |
| `part`\*  | `"day" \| "month" \| "year" \| "hour" \| "minute" \| ...` | -       |
| `type`\*  | `"start" \| "end"`                                        | -       |

## DateRangePickerTrigger

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## DateRangePickerContent

### Props

| Prop                          | Type                                                    | Default |
| ----------------------------- | ------------------------------------------------------- | ------- |
| `align`                       | `"start" \| "center" \| "end"`                          | -       |
| `alignOffset`                 | `number`                                                | -       |
| `arrowPadding`                | `number`                                                | -       |
| `as`                          | `AsTag \| Component`                                    | `"div"` |
| `asChild`                     | `boolean`                                               | -       |
| `avoidCollisions`             | `boolean`                                               | -       |
| `collisionBoundary`           | `Element \| (Element \| null)[] \| null`                | -       |
| `collisionPadding`            | `number \| Partial<Record<"top" \| "right" \| "bott...` | -       |
| `disableOutsidePointerEvents` | `boolean`                                               | -       |
| `forceMount`                  | `boolean`                                               | -       |
| `hideWhenDetached`            | `boolean`                                               | -       |
| `prioritizePosition`          | `boolean`                                               | -       |
| `side`                        | `"top" \| "right" \| "bottom" \| "left"`                | -       |
| `sideOffset`                  | `number`                                                | -       |
| `sticky`                      | `"partial" \| "always"`                                 | -       |
| `trapFocus`                   | `boolean`                                               | -       |
| `updatePositionStrategy`      | `"always" \| "optimized"`                               | -       |

### Emits

| Event                | Payload                                               |
| -------------------- | ----------------------------------------------------- |
| `closeAutoFocus`     | `[event: Event]`                                      |
| `escapeKeyDown`      | `[event: KeyboardEvent]`                              |
| `focusOutside`       | `[event: FocusOutsideEvent]`                          |
| `interactOutside`    | `[event: PointerDownOutsideEvent \| FocusOutsideE...` |
| `openAutoFocus`      | `[event: Event]`                                      |
| `pointerDownOutside` | `[event: PointerDownOutsideEvent]`                    |

## DateRangePickerCalendar

### Slots

| Slot           | Type                              |
| -------------- | --------------------------------- |
| `date`         | `DateValue`                       |
| `grid`         | `Grid<DateValue>[]`               |
| `weekDays`     | `string[]`                        |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` |
| `locale`       | `string`                          |
| `fixedWeeks`   | `boolean`                         |

## DateRangePickerHeader

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## DateRangePickerHeading

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

### Slots

| Slot           | Type     |
| -------------- | -------- |
| `headingValue` | `string` |

## DateRangePickerGrid

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## DateRangePickerCell

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
| `date`\*  | `DateValue`          | -       |

## DateRangePickerCellTrigger

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
| `day`\*   | `DateValue`          | -       |
| `month`\* | `DateValue`          | -       |

## DateRangePickerNext

### Props

| Prop       | Type                                      | Default |
| ---------- | ----------------------------------------- | ------- |
| `as`       | `AsTag \| Component`                      | `"div"` |
| `asChild`  | `boolean`                                 | -       |
| `nextPage` | `((placeholder: DateValue) => DateValue)` | -       |
| `step`     | `"month" \| "year"`                       | -       |

## DateRangePickerPrev

### Props

| Prop       | Type                                      | Default |
| ---------- | ----------------------------------------- | ------- |
| `as`       | `AsTag \| Component`                      | `"div"` |
| `asChild`  | `boolean`                                 | -       |
| `prevPage` | `((placeholder: DateValue) => DateValue)` | -       |
| `step`     | `"month" \| "year"`                       | -       |
