# Scroll Area

Custom scrollbar container

**Parts:** `ScrollAreaRoot`, `ScrollAreaViewport`, `ScrollAreaScrollbar`, `ScrollAreaThumb`, `ScrollAreaCorner`

## ScrollAreaRoot

### Props

| Prop              | Type                                        | Default   |
| ----------------- | ------------------------------------------- | --------- |
| `as`              | `AsTag \| Component`                        | `"div"`   |
| `asChild`         | `boolean`                                   | -         |
| `dir`             | `"ltr" \| "rtl"`                            | -         |
| `scrollHideDelay` | `number`                                    | `600`     |
| `type`            | `"always" \| "scroll" \| "hover" \| "auto"` | `"hover"` |

## ScrollAreaViewport

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
| `nonce`   | `string`             | -       |

## ScrollAreaScrollbar

### Props

| Prop          | Type                         | Default      |
| ------------- | ---------------------------- | ------------ |
| `as`          | `AsTag \| Component`         | `"div"`      |
| `asChild`     | `boolean`                    | -            |
| `forceMount`  | `boolean`                    | -            |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` |

## ScrollAreaThumb

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |

## ScrollAreaCorner

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean`            | -       |
