# useActiveElement

Reactive . Returns a shallow ref that updates when focus changes.

**Package:** `@vueuse/core`
**Category:** Elements

## Usage

```ts
<script setup lang="ts">
import { useActiveElement } from '@vueuse/core'
import { watch } from 'vue'

const activeElement = useActiveElement()

watch(activeElement, (el) => {
  console.log('focus changed to', el)
})
</script>
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| deep | `boolean` | true | Search active element deeply inside shadow dom |
| triggerOnRemoval | `boolean` | false | Track active element when it's removed from the DOM |

## Reference

[VueUse Docs](https://vueuse.org/core/useActiveElement/)
