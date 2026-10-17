# Field

Form field primitive sharing ids and running validation, works with Form (added in v2.11.0)

**Parts:** `FieldRoot`, `FieldLabel`, `FieldControl`, `FieldDescription`, `FieldError`, `FieldValidity`

- `FieldRoot` - `name`, `required`, `validate` (sync/async, returns message or `null`), `validation-mode` (`onSubmit` default | `onBlur` | `onChange`), `validation-debounce-time`
- `FieldLabel` - `native-label="false"` for button controls (e.g. `SelectTrigger`)
- `FieldControl` - native `input` by default (`as` for `textarea`/`select`), `v-model` / `default-value`
- `FieldError` - `match` is a `ValidityState` key (e.g. `valueMissing`) or `true`
- `FieldValidity` - renderless; slot exposes `validity`, `error`
- `FormRoot` supplies the default `validation-mode` for its fields; `validate` receives all named field values inside a form. See [reka-ui.com/docs/components/form](https://reka-ui.com/docs/components/form)

```vue
<FieldRoot name="email" required>
  <FieldLabel>Email</FieldLabel>
  <FieldControl type="email" />
  <FieldDescription>We'll never share your email.</FieldDescription>
  <FieldError match="valueMissing">Please enter an email.</FieldError>
</FieldRoot>
```
