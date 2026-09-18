# useRegle

`useRegle` is the main composable. It takes a state and rules, and returns a reactive validation object `r$`.

```ts
import { useRegle } from '@regle/core';
import { required, minLength } from '@regle/rules';

const { r$ } = useRegle(state, rules, modifiers?);
```

## State (first argument)

The state can be defined in multiple ways:

```ts
// Raw object (simplest)
const { r$ } = useRegle({ name: '', email: '' }, rules);

// Reactive object
const formData = reactive({ name: '', email: '' });
const { r$ } = useRegle(formData, rules);

// Ref object
const formData = ref({ name: '', email: '' });
const { r$ } = useRegle(formData, rules);

// Mixed refs
const formData = { name: ref(''), email: ref('') };
const { r$ } = useRegle(formData, rules);

// Single value
const email = ref('');
const { r$ } = useRegle(email, { required, email });
```

## Rules (second argument)

Rules mirror the data structure exactly:

```ts
const { r$ } = useRegle(
  { user: { name: '', email: '' }, message: '' },
  {
    user: {
      name: { required, minLength: minLength(2) },
      email: { required, email },
    },
    message: { required, minLength: minLength(10) },
  }
);
```

### Dynamic rules

Use a getter function or `computed` for reactive rules:

```ts
// Getter function
useRegle({ name: '' }, () => ({
  name: { required }
}));

// Computed (use inferRules for autocompletion)
import { inferRules } from '@regle/core';

const state = ref({ name: '' });
const rules = computed(() =>
  inferRules(state, { name: { required } })
);
const { r$ } = useRegle(state, rules);
```

## The `r$` object

`r$` is a reactive object containing values, errors, dirty state, and validation methods.

- **`r$.$value`** -- bind with `v-model` (`r$.$value.name`)
- **`r$.$errors`** -- shortcut errors (`r$.$errors.name`)
- **`r$.fieldName`** -- full field status with `$invalid`, `$dirty`, `$errors`, `$rules`, etc.
- **`r$.$validate()`** -- triggers all rules, returns `{ valid, data, errors, issues }`
- **`r$.$reset()`** -- resets validation state
- **`r$.$touch()`** -- marks all fields as dirty

### Template usage

```vue
<template>
  <input v-model="r$.$value.name" />
  <span v-if="r$.name.$error">{{ r$.$errors.name[0] }}</span>
  <button @click="submit">Submit</button>
</template>

<script setup>
async function submit() {
  const { valid, data } = await r$.$validate();
  if (valid) {
    // data is type-safe (required fields are non-nullable)
    console.log(data);
  }
}
</script>
```

## Composition API only

Regle only works with the Composition API. There is no Options API or Class API support.
