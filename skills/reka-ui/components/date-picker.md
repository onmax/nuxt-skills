# Date Picker

Date picker with calendar (alpha)

**Parts:** `DatePickerRoot`, `DatePickerField`, `DatePickerInput`, `DatePickerTrigger`, `DatePickerContent`, `DatePickerCalendar`, `DatePickerHeader`, `DatePickerHeading`, `DatePickerGrid`, `DatePickerCell`, `DatePickerCellTrigger`, `DatePickerNext`, `DatePickerPrev`, `DatePickerAnchor`, `DatePickerArrow`, `DatePickerClose`

## DatePickerRoot

### Props

| Prop                 | Type                                      | Default    |
| -------------------- | ----------------------------------------- | ---------- |
| `as`                 | `AsTag \| Component`                      | `"div"`    |
| `asChild`            | `boolean`                                 | -          |
| `defaultOpen`        | `boolean`                                 | `false`    |
| `defaultPlaceholder` | `DateValue`                               | -          |
| `defaultValue`       | `DateValue`                               | -          |
| `dir`                | `"ltr" \| "rtl"`                          | -          |
| `disabled`           | `boolean`                                 | `false`    |
| `fixedWeeks`         | `boolean`                                 | `false`    |
| `granularity`        | `"day" \| "hour" \| "minute" \| "second"` | -          |
| `hideTimeZone`       | `boolean`                                 | -          |
| `hourCycle`          | `12 \| 24`                                | -          |
| `id`                 | `string`                                  | -          |
| `isDateDisabled`     | `Matcher`                                 | -          |
| `isDateUnavailable`  | `Matcher`                                 | -          |
| `locale`             | `string`                                  | `"en"`     |
| `maxValue`           | `DateValue`                               | -          |
| `minValue`           | `DateValue`                               | -          |
| `modal`              | `boolean`                                 | `false`    |
| `modelValue`         | `DateValue`                               | -          |
| `name`               | `string`                                  | -          |
| `numberOfMonths`     | `number`                                  | `1`        |
| `open`               | `boolean`                                 | -          |
| `pagedNavigation`    | `boolean`                                 | `false`    |
| `placeholder`        | `DateValue`                               | -          |
| `preventDeselect`    | `boolean`                                 | `false`    |
| `readonly`           | `boolean`                                 | `false`    |
| `required`           | `boolean`                                 | -          |
| `weekdayFormat`      | `"narrow" \| "short" \| "long"`           | `"narrow"` |
| `weekStartsOn`       | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`         | `0`        |

### Emits

| Event                | Payload             |
| -------------------- | ------------------- |
| `update:modelValue`  | `[date: DateValue]` |
| `update:open`        | `[value: boolean]`  |
| `update:placeholder` | `[date: DateValue]` |

## DatePickerField

### Slots

| Slot         | Type                                      |
| ------------ | ----------------------------------------- |
| `segments`   | `{ part: SegmentPart; value: string; }[]` |
| `modelValue` | `DateValue \| undefined`                  |

## DatePickerInput

### Props

| Prop      | Type                                                      | Default |
| --------- | --------------------------------------------------------- | ------- |
| `as`      | `AsTag \| Component`                                      | `"div"` |
| `asChild` | `boolean`                                                 | -       |
| `part`\*  | `"day" \| "month" \| "year" \| "hour" \| "minute" \| ...` | -       |

## DatePickerTrigger

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## DatePickerContent

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

## DatePickerCalendar

### Slots

| Slot           | Type                              |
| -------------- | --------------------------------- |
| `date`         | `DateValue`                       |
| `grid`         | `Grid<DateValue>[]`               |
| `weekDays`     | `string[]`                        |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` |
| `locale`       | `string`                          |
| `fixedWeeks`   | `boolean`                         |

## DatePickerHeader

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## DatePickerHeading

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

### Slots

| Slot           | Type     |
| -------------- | -------- |
| `headingValue` | `string` |

## DatePickerGrid

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## DatePickerCell

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
| `date`\*  | `DateValue`          | -       |

## DatePickerCellTrigger

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
| `day`\*   | `DateValue`          | -       |
| `month`\* | `DateValue`          | -       |

## DatePickerNext

### Props

| Prop       | Type                                      | Default |
| ---------- | ----------------------------------------- | ------- |
| `as`       | `AsTag \| Component`                      | `"div"` |
| `asChild`  | `boolean`                                 | -       |
| `nextPage` | `((placeholder: DateValue) => DateValue)` | -       |
| `step`     | `"month" \| "year"`                       | -       |

## DatePickerPrev

### Props

| Prop       | Type                                      | Default |
| ---------- | ----------------------------------------- | ------- |
| `as`       | `AsTag \| Component`                      | `"div"` |
| `asChild`  | `boolean`                                 | -       |
| `prevPage` | `((placeholder: DateValue) => DateValue)` | -       |
| `step`     | `"month" \| "year"`                       | -       |

## DatePickerAnchor

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
| `element` | `Measurable`         | -       |

## DatePickerArrow

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
| `height`  | `number`             | -       |
| `width`   | `number`             | -       |

## DatePickerClose

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
