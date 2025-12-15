# Date Range Field

Date range input (alpha)

**Parts:** `DateRangeFieldRoot`, `DateRangeFieldInput`

## DateRangeFieldRoot

### Props

| Prop                 | Type                                      | Default |
| -------------------- | ----------------------------------------- | ------- |
| `as`                 | `AsTag \| Component`                      | `"div"` |
| `asChild`            | `boolean`                                 | -       |
| `defaultPlaceholder` | `DateValue`                               | -       |
| `defaultValue`       | `DateRange`                               | -       |
| `dir`                | `"ltr" \| "rtl"`                          | -       |
| `disabled`           | `boolean`                                 | `false` |
| `granularity`        | `"day" \| "hour" \| "minute" \| "second"` | -       |
| `hideTimeZone`       | `boolean`                                 | -       |
| `hourCycle`          | `12 \| 24`                                | -       |
| `id`                 | `string`                                  | -       |
| `isDateUnavailable`  | `Matcher`                                 | -       |
| `locale`             | `string`                                  | `"en"`  |
| `maxValue`           | `DateValue`                               | -       |
| `minValue`           | `DateValue`                               | -       |
| `modelValue`         | `DateRange`                               | -       |
| `name`               | `string`                                  | -       |
| `placeholder`        | `DateValue`                               | -       |
| `readonly`           | `boolean`                                 | `false` |
| `required`           | `boolean`                                 | -       |

### Emits

| Event                | Payload             |
| -------------------- | ------------------- |
| `update:modelValue`  | `[DateRange]`       |
| `update:placeholder` | `[date: DateValue]` |

### Slots

| Slot         | Type                                                 |
| ------------ | ---------------------------------------------------- |
| `modelValue` | `DateRange`                                          |
| `segments`   | `{ start: { part: SegmentPart; value: string; }[...` |

## DateRangeFieldInput

### Props

| Prop      | Type                                                      | Default |
| --------- | --------------------------------------------------------- | ------- |
| `as`      | `AsTag \| Component`                                      | `"div"` |
| `asChild` | `boolean`                                                 | -       |
| `part`\*  | `"day" \| "month" \| "year" \| "hour" \| "minute" \| ...` | -       |
| `type`\*  | `"start" \| "end"`                                        | -       |
