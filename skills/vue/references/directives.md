---
name: Custom Directives
description: Create reusable directives for low-level DOM manipulation
---

# Custom Directives

Custom directives provide low-level DOM access for reusable behavior.

## When to Use

Use custom directives when:

- You need direct DOM manipulation
- The behavior can't be achieved with components or composables
- You need to apply behavior to native elements

## Basic Example

```vue
<script setup lang="ts">
// v-focus directive
const vFocus = {
  mounted: (el: HTMLElement) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

## Directive Hooks

```ts
const myDirective = {
  // Before element attributes/listeners are applied
  created(el, binding, vnode) {},

  // Before element is inserted into DOM
  beforeMount(el, binding, vnode) {},

  // After element and children are mounted
  mounted(el, binding, vnode) {},

  // Before parent component updates
  beforeUpdate(el, binding, vnode, prevVnode) {},

  // After parent component updates
  updated(el, binding, vnode, prevVnode) {},

  // Before parent component unmounts
  beforeUnmount(el, binding, vnode) {},

  // After parent component unmounts
  unmounted(el, binding, vnode) {}
}
```

## Hook Arguments

```ts
interface DirectiveBinding<T = any> {
  value: T           // v-my-dir="value"
  oldValue: T        // Previous value (beforeUpdate/updated only)
  arg?: string       // v-my-dir:arg
  modifiers: Record<string, boolean>  // v-my-dir.foo.bar → { foo: true, bar: true }
  instance: ComponentPublicInstance   // Component using the directive
  dir: ObjectDirective               // Directive definition object
}
```

Example usage:

```vue-html
<div v-example:foo.bar="baz">
```

```ts
// binding object:
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* value of baz */,
  oldValue: /* previous value */
}
```

## Function Shorthand

When you only need `mounted` and `updated` with same behavior:

```ts
// Full form
const vColor = {
  mounted(el, binding) {
    el.style.color = binding.value
  },
  updated(el, binding) {
    el.style.color = binding.value
  }
}

// Shorthand (same behavior)
const vColor = (el: HTMLElement, binding: DirectiveBinding<string>) => {
  el.style.color = binding.value
}
```

## Global Registration

```ts
// main.ts
const app = createApp(App)

app.directive('focus', {
  mounted: (el) => el.focus()
})

// Shorthand
app.directive('color', (el, binding) => {
  el.style.color = binding.value
})
```

## Object Literals

Pass multiple values:

```vue-html
<div v-demo="{ color: 'white', text: 'hello' }">
```

```ts
const vDemo = (el: HTMLElement, binding: DirectiveBinding<{ color: string; text: string }>) => {
  console.log(binding.value.color) // 'white'
  console.log(binding.value.text)  // 'hello'
}
```

## Dynamic Arguments

```vue-html
<div v-my-directive:[dynamicArg]="value">
```

## Practical Examples

### v-click-outside

```ts
const vClickOutside = {
  mounted(el: HTMLElement, binding: DirectiveBinding<() => void>) {
    el._clickOutside = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value()
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el._clickOutside)
  }
}
```

### v-tooltip

```ts
const vTooltip = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    el.setAttribute('title', binding.value)
  },
  updated(el: HTMLElement, binding: DirectiveBinding<string>) {
    el.setAttribute('title', binding.value)
  }
}
```

### v-permission

```ts
const vPermission = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    if (!hasPermission(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  }
}
```

## TypeScript: Global Directives

```ts
// directives/highlight.ts
import type { Directive } from 'vue'

export type HighlightDirective = Directive<HTMLElement, string>

declare module 'vue' {
  export interface ComponentCustomProperties {
    vHighlight: HighlightDirective
  }
}

export default {
  mounted: (el, binding) => {
    el.style.backgroundColor = binding.value
  }
} satisfies HighlightDirective
```

## Usage on Components

⚠️ **Not recommended** - directives apply to root element, which can be unpredictable with multi-root components.

```vue-html
<!-- Applies to MyComponent's root element -->
<MyComponent v-my-directive />
```

<!--
Source references:
- https://vuejs.org/guide/reusability/custom-directives.html
-->
