# useConfirmDialog

Creates event hooks to support modals and confirmation dialog chains.

**Package:** `@vueuse/core`
**Category:** Utilities

## Usage

```ts
<script setup lang="ts">
import { useConfirmDialog } from '@vueuse/core'

const { isRevealed, reveal, confirm, cancel, onReveal, onConfirm, onCancel }
  = useConfirmDialog()
</script>

<template>
  <button @click="reveal">
    Reveal Modal
  </button>

  <teleport to="body">
    <div v-if="isRevealed" class="modal-bg">
      <div class="modal">
        <h2>Confirm?</h2>
        <button @click="confirm">
          Yes
        </button>
        <button @click="cancel">
          Cancel
        </button>
      </div>
    </div>
  </teleport>
</template>
```

## Returns

| Name       | Type  |
| ---------- | ----- |
| isRevealed | `Ref` |
| reveal     | `Ref` |
| confirm    | `Ref` |
| cancel     | `Ref` |
| onReveal   | `Ref` |
| onConfirm  | `Ref` |
| onCancel   | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useConfirmDialog/)
