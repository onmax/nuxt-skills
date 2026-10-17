# Date Field

Date input field (alpha)

**Parts:** `DateFieldRoot`, `DateFieldInput`

## DateFieldRoot

### Props

| Prop                 | Type                                      | Default |
| -------------------- | ----------------------------------------- | ------- |
| `as`                 | `AsTag \| Component`                      | `"div"` |
| `asChild`            | `boolean`                                 | -       |
| `defaultPlaceholder` | `DateValue`                               | -       |
| `defaultValue`       | `DateValue`                               | -       |
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
| `modelValue`         | `DateValue`                               | -       |
| `name`               | `string`                                  | -       |
| `placeholder`        | `DateValue`                               | -       |
| `readonly`           | `boolean`                                 | `false` |
| `required`           | `boolean`                                 | -       |

### Emits

| Event                | Payload             |
| -------------------- | ------------------- |
| `update:modelValue`  | `[date: DateValue]` |
| `update:placeholder` | `[date: DateValue]` |

### Slots

| Slot         | Type                                      |
| ------------ | ----------------------------------------- |
| `modelValue` | `DateValue \| undefined`                  |
| `segments`   | `{ part: SegmentPart; value: string; }[]` |
| `isInvalid`  | `boolean`                                 |

## DateFieldInput

### Props

| Prop      | Type                                                      | Default |
| --------- | --------------------------------------------------------- | ------- |
| `as`      | `AsTag \| Component`                                      | `"div"` |
| `asChild` | `boolean`                                                 | -       |
| `part`\*  | `"day" \| "month" \| "year" \| "hour" \| "minute" \| ...` | -       |
