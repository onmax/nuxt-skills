# Rating

Star rating input (v2.8.0)

**Parts:** `RatingRoot`, `RatingItem`, `RatingItemIndicator`

## RatingRoot

### Props

| Prop           | Type                         | Default        |
| -------------- | ---------------------------- | -------------- |
| `as`           | `AsTag \| Component`         | `"div"`        |
| `asChild`      | `boolean`                    | -              |
| `defaultValue` | `number`                     | -              |
| `modelValue`   | `number`                     | -              |
| `length`       | `number`                     | `5`            |
| `step`         | `1 \| 0.5 \| 0.25 \| 0.1`    | `1`            |
| `clearable`    | `boolean`                    | -              |
| `hoverable`    | `boolean`                    | -              |
| `disabled`     | `boolean`                    | `false`        |
| `orientation`  | `"vertical" \| "horizontal"` | `"horizontal"` |

### Emits

| Event               | Payload             |
| ------------------- | ------------------- |
| `update:modelValue` | `[payload: number]` |

### Slots

| Slot         | Type                  |
| ------------ | --------------------- |
| `modelValue` | `number \| undefined` |
| `items`      | `number[]`            |

## RatingItem

### Props

| Prop      | Type                 | Default   |
| --------- | -------------------- | --------- |
| `as`      | `AsTag \| Component` | `"label"` |
| `asChild` | `boolean`            | -         |
| `item`    | `number`             | required  |

### Slots

| Slot    | Type       |
| ------- | ---------- |
| `steps` | `number[]` |

## RatingItemIndicator

### Props

| Prop      | Type                 | Default  |
| --------- | -------------------- | -------- |
| `as`      | `AsTag \| Component` | -        |
| `asChild` | `boolean`            | -        |
| `step`    | `number`             | required |

### CSS Variables

| Variable                          | Description            |
| --------------------------------- | ---------------------- |
| `--reka-rating-item-step-width`   | Width based on step    |
| `--reka-rating-item-step-opacity` | Visibility of step     |
| `--reka-rating-item-step-z-index` | Z-index stacking order |

### Data Attributes

| Attribute      | Value                   |
| -------------- | ----------------------- |
| `[data-state]` | `"active" \| undefined` |

## Example

```vue
<script setup>
import { RatingRoot, RatingItem, RatingItemIndicator } from 'reka-ui'
const rating = ref(3)
</script>

<template>
  <RatingRoot v-model="rating" :length="5">
    <template #default="{ items }">
      <RatingItem v-for="item in items" :key="item" :item="item">
        <template #default="{ steps }">
          <RatingItemIndicator v-for="step in steps" :key="step" :step="step">
            ★
          </RatingItemIndicator>
        </template>
      </RatingItem>
    </template>
  </RatingRoot>
</template>
```
