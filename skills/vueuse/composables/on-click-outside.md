# onClickOutside

Listen for clicks outside of an element. Useful for modal or dropdown.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const target = useTemplateRef('target')

onClickOutside(target, event => console.log(event))
</script>

<template>
  <div ref="target">
    Hello world
  </div>
  <div>Outside element</div>
</template>
```

## Options

| Option       | Type                                                    | Default | Description                                         |
| ------------ | ------------------------------------------------------- | ------- | --------------------------------------------------- |
| ignore       | `MaybeRefOrGetter&lt;(MaybeElementRef \| string)[]&gt;` | -       | List of elements that should not trigger the event, |
| capture      | `boolean`                                               | true    | Use capturing phase for internal event listener.    |
| detectIframe | `boolean`                                               | false   | Run handler function if focus moves to an iframe.   |
| controls     | `Controls`                                              | false   | Use controls to cancel/trigger listener.            |

## Returns

| Name   | Type  |
| ------ | ----- |
| stop   | `Ref` |
| cancel | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/onClickOutside/)
