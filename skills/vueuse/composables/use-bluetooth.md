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

## Options

| Option           | Type      | Default | Description                                                                       |
| ---------------- | --------- | ------- | --------------------------------------------------------------------------------- |
| acceptAllDevices | `boolean` | false   | \* A boolean value indicating that the requesting script can accept all Bluetooth |

## Returns

| Name          | Type           |
| ------------- | -------------- |
| isSupported   | `useSupported` |
| isConnected   | `shallowRef`   |
| requestDevice | `Ref`          |

## Reference

[VueUse Docs](https://vueuse.org/core/useBluetooth/)
