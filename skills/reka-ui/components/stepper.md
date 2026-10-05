# Stepper

Multi-step progress indicator

**Parts:** `StepperRoot`, `StepperItem`, `StepperTrigger`, `StepperTitle`, `StepperDescription`, `StepperIndicator`, `StepperSeparator`

## StepperRoot

### Props

| Prop           | Type                         | Default        |
| -------------- | ---------------------------- | -------------- |
| `as`           | `AsTag \| Component`         | `"div"`        |
| `asChild`      | `boolean`                    | -              |
| `defaultValue` | `number`                     | `1`            |
| `dir`          | `"ltr" \| "rtl"`             | -              |
| `linear`       | `boolean`                    | `true`         |
| `modelValue`   | `number`                     | -              |
| `orientation`  | `"vertical" \| "horizontal"` | `"horizontal"` |

### Emits

| Event               | Payload             |
| ------------------- | ------------------- |
| `update:modelValue` | `[payload: number]` |

### Slots

| Slot             | Type                  |
| ---------------- | --------------------- |
| `modelValue`     | `number \| undefined` |
| `totalSteps`     | `number`              |
| `isNextDisabled` | `boolean`             |
| `isPrevDisabled` | `boolean`             |
| `isFirstStep`    | `boolean`             |
| `isLastStep`     | `boolean`             |
| `goToStep`       | ``                    |
| `nextStep`       | ``                    |
| `prevStep`       | ``                    |

## StepperItem

### Props

| Prop        | Type                 | Default |
| ----------- | -------------------- | ------- |
| `as`        | `AsTag \| Component` | `"div"` |
| `asChild`   | `boolean`            | -       |
| `completed` | `boolean`            | `false` |
| `disabled`  | `boolean`            | `false` |
| `step`\*    | `number`             | -       |

### Slots

| Slot    | Type                                    |
| ------- | --------------------------------------- |
| `state` | `"active" \| "completed" \| "inactive"` |

## StepperTrigger

### Props

| Prop      | Type                 | Default    |
| --------- | -------------------- | ---------- |
| `as`      | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean`            | -          |

## StepperTitle

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"h4"`  |
| `asChild` | `boolean`            | -       |

## StepperDescription

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"p"`   |
| `asChild` | `boolean`            | -       |

## StepperIndicator

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## StepperSeparator

### Props

| Prop          | Type                         | Default |
| ------------- | ---------------------------- | ------- |
| `as`          | `AsTag \| Component`         | `"div"` |
| `asChild`     | `boolean`                    | -       |
| `decorative`  | `boolean`                    | -       |
| `orientation` | `"vertical" \| "horizontal"` | -       |
