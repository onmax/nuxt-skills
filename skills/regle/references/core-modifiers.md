# Modifiers

Modifiers control validation behavior. They can be applied globally (third argument of `useRegle`) or per-field.

## Deep modifiers (third argument)

```ts
const { r$ } = useRegle({}, {}, {
  autoDirty: true,
  lazy: false,
  silent: false,
  rewardEarly: false,
});
```

| Modifier | Type | Default | Description |
|----------|------|---------|-------------|
| `autoDirty` | `boolean` | `true` | Automatically set dirty state on value change |
| `immediateDirty` | `boolean \| 'eager' \| 'non-empty' \| 'lazy-non-empty'` | `false` | Set dirty on init. `true`/`'eager'` touches all fields, `'non-empty'` touches all fields when any active field has a non-empty initial value (inactive fields without rules are ignored), and `'lazy-non-empty'` only touches non-empty fields |
| `silent` | `boolean` | `false` | Only show errors after manual `$touch` or `$validate` |
| `lazy` | `boolean` | `false` | Only run rules when the field is dirty |
| `rewardEarly` | `boolean` | `false` | Once valid, stay valid until `$validate` (reward-early-punish-late). Disables `autoDirty` |
| `disabled` | `boolean` | `false` | Pause Regle watchers/computed and validation computation. State updates continue and validation resumes when re-enabled |
| `externalErrors` | `RegleExternalErrorTree` | -- | Server-side errors. See server errors reference |
| `clearExternalErrorsOnChange` | `boolean` | `true` | Clear external errors on value change |
| `clearExternalErrorsOnValidate` | `boolean` | `false` | Clear external errors when `$validate` / `$validateSync` runs |

### Validation groups

Group fields together for combined status:

```ts
const { r$ } = useRegle(
  { email: '', user: { firstName: '' } },
  {
    email: { required },
    user: { firstName: { required } },
  },
  {
    validationGroups: (fields) => ({
      group1: [fields.email, fields.user.firstName],
    }),
  }
);

// Access: r$.$groups.group1.$invalid, r$.$groups.group1.$errors, etc.
```

## Per-field modifiers

Per-field modifiers are prefixed with `$` inside the rules object:

```ts
const { r$ } = useRegle({ name: '' }, {
  name: {
    required,
    $autoDirty: false,
    $lazy: true,
    $silent: false,
    $rewardEarly: true,
    $debounce: 300,       // ms before rule execution
    $immediateDirty: false,
  },
});
```

| Modifier | Type | Description |
|----------|------|-------------|
| `$autoDirty` | `boolean` | Override global `autoDirty` |
| `$lazy` | `boolean` | Override global `lazy` |
| `$silent` | `boolean` | Override global `silent` |
| `$rewardEarly` | `boolean` | Override global `rewardEarly` |
| `$immediateDirty` | `boolean \| 'eager' \| 'non-empty' \| 'lazy-non-empty'` | Override global `immediateDirty` |
| `$debounce` | `number` | Debounce rule execution (ms). Async rules default to 200ms |
| `$isEdited` | `(current, initial, defaultFn) => boolean` | Custom `$edited` comparison |

## Array-specific modifier

```ts
const { r$ } = useRegle({ collection: [] }, {
  collection: {
    $deepCompare: true, // Enable deep compare for $edited (default: false)
    $each: { name: { required } },
  },
});
```

## External errors quick notes

- `externalErrors` can be a nested tree matching your form shape, or a dot-path object like `Record<string, string[]>`.
- Collections with server-only validation should still declare collection shape in rules:

```ts
const { r$ } = useRegle(
  { collection: [] },
  { collection: { $each: {} } },
  { externalErrors }
);
```
