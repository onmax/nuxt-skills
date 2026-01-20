# useMouse

Reactive mouse position

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
<template>
  <UseMouse v-slot="{ x, y }">
    x: {{ x }}
    y: {{ y }}
  </UseMouse>
</template>
```

## Options

| Option           | Type                                                                 | Default | Description                                                                    |
| ---------------- | -------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------ |
| type             | `UseMouseCoordType \| UseMouseEventExtractor`                        | page    | Mouse position based by page, client, screen, or relative to previous position |
| target           | `MaybeRefOrGetter&lt;Window \| EventTarget \| null \| undefined&gt;` | Window  | Listen events on `target` element                                              |
| touch            | `boolean`                                                            | true    | Listen to `touchmove` events                                                   |
| scroll           | `boolean`                                                            | true    | Listen to `scroll` events on window, only effective on type `page`             |
| resetOnTouchEnds | `boolean`                                                            | false   | Reset to initial value when `touchend` event fired                             |
| initialValue     | `Position`                                                           | -       | Initial values                                                                 |

## Returns

| Name       | Type                                   |
| ---------- | -------------------------------------- |
| x          | `shallowRef`                           |
| y          | `shallowRef`                           |
| sourceType | `shallowRef&lt;UseMouseSourceType&gt;` |

## Reference

[VueUse Docs](https://vueuse.org/core/useMouse/)
