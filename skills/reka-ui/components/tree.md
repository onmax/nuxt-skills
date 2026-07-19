# Tree

Hierarchical tree view

**Parts:** `TreeRoot`, `TreeItem`, `TreeVirtualizer`

## TreeRoot

### Props

| Prop                | Type                                                 | Default        |
| ------------------- | ---------------------------------------------------- | -------------- |
| `as`                | `AsTag \| Component`                                 | `"ul"`         |
| `asChild`           | `boolean`                                            | -              |
| `defaultExpanded`   | `string[]`                                           | -              |
| `defaultValue`      | `Record<string, any> \| Record<string, any>[]`       | -              |
| `dir`               | `"ltr" \| "rtl"`                                     | -              |
| `disabled`          | `boolean`                                            | -              |
| `expanded`          | `string[]`                                           | -              |
| `getChildren`       | `((val: Record<string, any>) => Record<string, a...` | `val.children` |
| `getKey`\*          | `(val: Record<string, any>) => string`               | -              |
| `items`             | `Record<string, any>[]`                              | -              |
| `modelValue`        | `Record<string, any> \| Record<string, any>[]`       | -              |
| `multiple`          | `boolean`                                            | -              |
| `propagateSelect`   | `boolean`                                            | -              |
| `selectionBehavior` | `"toggle" \| "replace"`                              | `"toggle"`     |

### Emits

| Event               | Payload                      |
| ------------------- | ---------------------------- |
| `update:expanded`   | `[val: string[]]`            |
| `update:modelValue` | `[val: Record<string, any>]` |

### Slots

| Slot           | Type                                           |
| -------------- | ---------------------------------------------- |
| `flattenItems` | `FlattenedItem<Record<string, any>>[]`         |
| `modelValue`   | `Record<string, any> \| Record<string, any>[]` |
| `expanded`     | `string[]`                                     |

## TreeItem

### Props

| Prop      | Type                  | Default |
| --------- | --------------------- | ------- |
| `as`      | `AsTag \| Component`  | `"li"`  |
| `asChild` | `boolean`             | -       |
| `level`\* | `number`              | -       |
| `value`\* | `Record<string, any>` | -       |

### Emits

| Event    | Payload                                     |
| -------- | ------------------------------------------- |
| `select` | `[event: SelectEvent<Record<string, any>>]` |
| `toggle` | `[event: ToggleEvent<Record<string, any>>]` |

### Slots

| Slot              | Type                   |
| ----------------- | ---------------------- |
| `isExpanded`      | `boolean`              |
| `isSelected`      | `boolean`              |
| `isIndeterminate` | `boolean \| undefined` |
| `handleToggle`    | ``                     |
| `handleSelect`    | ``                     |

## TreeVirtualizer

### Props

| Prop           | Type                                      | Default |
| -------------- | ----------------------------------------- | ------- |
| `estimateSize` | `number`                                  | -       |
| `textContent`  | `((item: Record<string, any>) => string)` | -       |

### Slots

| Slot          | Type                                      |
| ------------- | ----------------------------------------- |
| `item`        | `FlattenedItem<Record<string, any>>`      |
| `virtualizer` | `Virtualizer<Element \| Window, Element>` |
| `virtualItem` | `VirtualItem<Element>`                    |
