# useGamepad

Provides reactive bindings for the Gamepad API.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
<script setup lang="ts">
import { useGamepad } from '@vueuse/core'
import { computed } from 'vue'

const { isSupported, gamepads } = useGamepad()
const gamepad = computed(() => gamepads.value.find(g => g.mapping === 'standard'))
</script>

<template>
  <span>
    {{ gamepad.id }}
  </span>
</template>
```

## Returns

| Name | Type |
| --- | --- |
| isSupported | `useSupported` |
| onConnected | `Ref` |
| onDisconnected | `Ref` |
| gamepads | `deepRef&lt;Gamepad[]&gt;` |
| pause | `Ref` |
| resume | `Ref` |
| isActive | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useGamepad/)
