# Displaying Errors

Regle is headless -- display errors any way you choose.

## Basic error display

```vue
<template>
  <input v-model="r$.$value.name" />
  <ul v-if="r$.$errors.name.length">
    <li v-for="error of r$.$errors.name" :key="error">{{ error }}</li>
  </ul>
</template>
```

Errors are accessible via:
- `r$.$errors.fieldName` -- shortcut (only when dirty)
- `r$.fieldName.$errors` -- same, from the field status
- `r$.fieldName.$silentErrors` -- all errors regardless of dirty state

## Custom error messages

Use `withMessage` wrapper:

```ts
import { withMessage } from '@regle/rules';

const { r$ } = useRegle({ name: '' }, {
  name: {
    required: withMessage(required, 'Please enter your name'),
    minLength: withMessage(
      minLength(3),
      ({ $value, $params: [min] }) => `Min ${min} chars. Current: ${$value?.length}`
    ),
  },
});
```

For app-wide messages, use `defineRegleConfig` instead of `withMessage` on every field.

## i18n / translations

Use any i18n library directly -- no special config needed:

```ts
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { r$ } = useRegle({ name: '' }, {
  name: {
    required: withMessage(required, t('validation.required')),
  },
});
```

## Applying CSS classes

```vue
<template>
  <input
    v-model="r$.$value.email"
    :class="{ error: r$.email.$error, valid: r$.email.$correct }"
  />
</template>
```

## Get errors by path

```ts
import { getErrors } from '@regle/core';

const emailErrors = getErrors(r$, 'user.email');
// ['This field is required']

// Collection items
const contactErrors = getErrors(r$, 'contacts.$each.0.name');
```

The path parameter is type-safe with autocompletion.

## Get issues by path

```ts
import { getIssues } from '@regle/core';

const issues = getIssues(r$, 'user.name');
// [{ $message: 'This field is required', $property: 'name', $rule: 'required', $type: 'required' }]
```

## Flat errors

Get all errors as a flat array:

```ts
import { flatErrors } from '@regle/core';

const allErrors = flatErrors(r$.$errors);
// ['This field is required', 'Value must be a valid email']

// With paths (Standard Schema Issue format)
const withPaths = flatErrors(r$.$errors, { includePath: true });
// [{ message: 'This field is required', path: ['name'] }]
```
