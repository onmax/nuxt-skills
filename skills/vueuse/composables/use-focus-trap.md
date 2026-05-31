# useFocusTrap

Reactive wrapper for .

**Package:** `@vueuse/integrations`
**Category:** '@Integrations'

## Usage

```ts
<script setup lang="ts">
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { useTemplateRef } from 'vue'

const target = useTemplateRef('target')
const { hasFocus, activate, deactivate } = useFocusTrap(target)
</script>

<template>
  <div>
    <button @click="activate()">
      Activate
    </button>
    <div ref="target">
      <span>Has Focus: {{ hasFocus }}</span>
      <input type="text">
      <button @click="deactivate()">
        Deactivate
      </button>
    </div>
  </div>
</template>
```

## Options

| Option    | Type      | Default | Description                   |
| --------- | --------- | ------- | ----------------------------- |
| immediate | `boolean` | -       | Immediately activate the trap |

## Returns

| Name       | Type         |
| ---------- | ------------ |
| hasFocus   | `shallowRef` |
| isPaused   | `shallowRef` |
| activate   | `Ref`        |
| deactivate | `Ref`        |
| pause      | `Ref`        |
| unpause    | `Ref`        |

## Reference

[VueUse Docs](https://vueuse.org/core/useFocusTrap/)
