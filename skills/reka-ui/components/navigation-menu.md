# Navigation Menu

Site navigation menu

**Parts:** `NavigationMenuRoot`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`, `NavigationMenuIndicator`, `NavigationMenuViewport`, `NavigationMenuSub`

## NavigationMenuRoot

### Props

| Prop                  | Type                         | Default        |
| --------------------- | ---------------------------- | -------------- |
| `as`                  | `AsTag \| Component`         | `"nav"`        |
| `asChild`             | `boolean`                    | -              |
| `defaultValue`        | `string`                     | -              |
| `delayDuration`       | `number`                     | `200`          |
| `dir`                 | `"ltr" \| "rtl"`             | -              |
| `disableClickTrigger` | `boolean`                    | `false`        |
| `disableHoverTrigger` | `boolean`                    | `false`        |
| `modelValue`          | `string`                     | -              |
| `orientation`         | `"vertical" \| "horizontal"` | `"horizontal"` |
| `skipDelayDuration`   | `number`                     | `300`          |

### Emits

| Event               | Payload           |
| ------------------- | ----------------- |
| `update:modelValue` | `[value: string]` |

### Slots

| Slot         | Type     |
| ------------ | -------- |
| `modelValue` | `string` |

## NavigationMenuList

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"ul"`  |
| `asChild` | `boolean`            | -       |

## NavigationMenuItem

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `as`      | `AsTag \| Component` | `"li"`  |
| `asChild` | `boolean`            | -       |
| `value`   | `string`             | -       |

## NavigationMenuTrigger

### Props

| Prop       | Type                 | Default    |
| ---------- | -------------------- | ---------- |
| `as`       | `AsTag \| Component` | `"button"` |
| `asChild`  | `boolean`            | -          |
| `disabled` | `boolean`            | -          |

## NavigationMenuContent

### Props

| Prop                          | Type                 | Default |
| ----------------------------- | -------------------- | ------- |
| `as`                          | `AsTag \| Component` | `"div"` |
| `asChild`                     | `boolean`            | -       |
| `disableOutsidePointerEvents` | `boolean`            | -       |
| `forceMount`                  | `boolean`            | -       |

### Emits

| Event                | Payload                                               |
| -------------------- | ----------------------------------------------------- |
| `escapeKeyDown`      | `[event: KeyboardEvent]`                              |
| `focusOutside`       | `[event: FocusOutsideEvent]`                          |
| `interactOutside`    | `[event: PointerDownOutsideEvent \| FocusOutsideE...` |
| `pointerDownOutside` | `[event: PointerDownOutsideEvent]`                    |

## NavigationMenuLink

### Props

| Prop      | Type                 | Default |
| --------- | -------------------- | ------- |
| `active`  | `boolean`            | -       |
| `as`      | `AsTag \| Component` | `"a"`   |
| `asChild` | `boolean`            | -       |

### Emits

| Event    | Payload                                             |
| -------- | --------------------------------------------------- |
| `select` | `[payload: CustomEvent<{ originalEvent: Event; }>]` |

## NavigationMenuIndicator

### Props

| Prop         | Type                 | Default |
| ------------ | -------------------- | ------- |
| `as`         | `AsTag \| Component` | `"div"` |
| `asChild`    | `boolean`            | -       |
| `forceMount` | `boolean`            | -       |

## NavigationMenuViewport

### Props

| Prop         | Type                 | Default |
| ------------ | -------------------- | ------- |
| `as`         | `AsTag \| Component` | `"div"` |
| `asChild`    | `boolean`            | -       |
| `forceMount` | `boolean`            | -       |

## NavigationMenuSub

### Props

| Prop           | Type                         | Default        |
| -------------- | ---------------------------- | -------------- |
| `as`           | `AsTag \| Component`         | `"div"`        |
| `asChild`      | `boolean`                    | -              |
| `defaultValue` | `string`                     | -              |
| `modelValue`   | `string`                     | -              |
| `orientation`  | `"vertical" \| "horizontal"` | `"horizontal"` |

### Emits

| Event               | Payload           |
| ------------------- | ----------------- |
| `update:modelValue` | `[value: string]` |

### Slots

| Slot         | Type     |
| ------------ | -------- |
| `modelValue` | `string` |
