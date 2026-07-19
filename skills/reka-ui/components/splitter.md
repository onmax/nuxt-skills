# Splitter

Resizable split panels

**Parts:** `SplitterGroup`, `SplitterPanel`, `SplitterResizeHandle`

## SplitterGroup

### Props

| Prop               | Type                         | Default          |
| ------------------ | ---------------------------- | ---------------- |
| `as`               | `AsTag \| Component`         | `"div"`          |
| `asChild`          | `boolean`                    | -                |
| `autoSaveId`       | `string \| null`             | `null`           |
| `direction`\*      | `"vertical" \| "horizontal"` | -                |
| `id`               | `string \| null`             | -                |
| `keyboardResizeBy` | `number \| null`             | `10`             |
| `storage`          | `PanelGroupStorage`          | `defaultStorage` |

### Emits

| Event    | Payload           |
| -------- | ----------------- |
| `layout` | `[val: number[]]` |

### Slots

| Slot     | Type       |
| -------- | ---------- |
| `layout` | `number[]` |

## SplitterPanel

### Props

| Prop            | Type                 | Default |
| --------------- | -------------------- | ------- |
| `as`            | `AsTag \| Component` | `"div"` |
| `asChild`       | `boolean`            | -       |
| `collapsedSize` | `number`             | -       |
| `collapsible`   | `boolean`            | -       |
| `defaultSize`   | `number`             | -       |
| `id`            | `string`             | -       |
| `maxSize`       | `number`             | -       |
| `minSize`       | `number`             | -       |
| `order`         | `number`             | -       |

### Emits

| Event      | Payload                            |
| ---------- | ---------------------------------- |
| `collapse` | `[]`                               |
| `expand`   | `[]`                               |
| `resize`   | `[size: number, prevSize: number]` |

### Slots

| Slot          | Type      |
| ------------- | --------- |
| `isCollapsed` | `boolean` |
| `isExpanded`  | `boolean` |

## SplitterResizeHandle

### Props

| Prop             | Type                    | Default |
| ---------------- | ----------------------- | ------- |
| `as`             | `AsTag \| Component`    | `"div"` |
| `asChild`        | `boolean`               | -       |
| `disabled`       | `boolean`               | -       |
| `hitAreaMargins` | `PointerHitAreaMargins` | -       |
| `id`             | `string`                | -       |
| `tabindex`       | `number`                | `0`     |

### Emits

| Event      | Payload                 |
| ---------- | ----------------------- |
| `dragging` | `[isDragging: boolean]` |
