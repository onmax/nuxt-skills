# useBluetooth

Reactive Web Bluetooth API. Provides the ability to connect and interact with Bluetooth Low Energy peripherals.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
<script setup lang="ts">
import { useBluetooth } from '@vueuse/core'

const {
  isSupported,
  isConnected,
  device,
  requestDevice,
  server,
} = useBluetooth({
  acceptAllDevices: true,
})
</script>

<template>
  <button @click="requestDevice()">
    Request Bluetooth Device
  </button>
</template>
```

## Reference

[VueUse Docs](https://vueuse.org/core/useBluetooth/)
