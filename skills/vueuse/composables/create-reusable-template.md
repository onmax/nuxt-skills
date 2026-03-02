# createReusableTemplate

Define and reuse template inside the component scope.

**Package:** `@vueuse/core`
**Category:** Component

## Usage

```ts
<template>
  <dialog v-if="showInDialog">
    <!-- something complex -->
  </dialog>
  <div v-else>
    <!-- something complex -->
  </div>
</template>
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| inheritAttrs | `boolean` | true | Inherit attrs from reuse component. |
| name | `string` | - | Name for the reuse component (useful for devtools). |
| props | `ComponentObjectPropsOptions&lt;Props&gt;` | - | Props definition for reuse component. |

## Reference

[VueUse Docs](https://vueuse.org/core/createReusableTemplate/)
