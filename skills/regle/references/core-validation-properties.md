# Validation Properties

Every field in `r$` exposes reactive computed properties and methods for validation state.

## Field properties

| Property | Type | Description |
|----------|------|-------------|
| `$invalid` | `boolean` | `true` if any rule returns `false` |
| `$correct` | `boolean` | `true` only if: has active rules, is dirty, not empty, and passes validation |
| `$dirty` | `boolean` | `true` if the field has been interacted with (via `$value` or `$touch`) |
| `$anyDirty` | `boolean` | `true` if the field or any descendant is dirty |
| `$edited` | `boolean` | `true` if dirty and value differs from initial value |
| `$anyEdited` | `boolean` | `true` if edited or any descendant is edited |
| `$value` | `TValue` | The current value. Use with `v-model` |
| `$silentValue` | `TValue` | Set value without marking dirty |
| `$initialValue` | `TValue` | Initial value (mutated by `$reset`) |
| `$originalValue` | `TValue` | Original unmutated value |
| `$pending` | `boolean` | `true` if any async rule is running |
| `$ready` | `boolean` | `!$invalid && !$pending` |
| `$error` | `boolean` | `$dirty && !$pending && $invalid` |
| `$errors` | `string[]` | Error messages (only when `$dirty`) |
| `$silentErrors` | `string[]` | Error messages (regardless of `$dirty`) |
| `$issues` | `RegleFieldIssue[]` | Detailed metadata of validators (when `$dirty`) |
| `$name` | `string` | Current key name of the field |
| `$rules` | `Record<string, RegleRuleStatus>` | All declared rules with their status |

## Field methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `$validate` | `(forceValues?) => Promise<false \| SafeOutput>` | Set all dirty, run all rules, return typed result |
| `$validateSync` | `(forceValues?) => boolean` | Synchronous validation (skips async rules) |
| `$touch` | `() => void` | Mark field and children as dirty |
| `$reset` | `(options?) => void` | Reset validation state. See reset forms reference |
| `$extractDirtyFields` | `(filterNullish?) => DeepPartial<TState>` | Extract only dirty fields |
| `$clearExternalErrors` | `() => void` | Clear external errors |

## Nested object properties

| Property | Type | Description |
|----------|------|-------------|
| `$fields` | `Record<string, RegleStatus>` | Children field statuses |
| `$self` | `RegleFieldStatus` | Object's own validation status (for `$self` rules) |

## Collection properties

| Property | Type | Description |
|----------|------|-------------|
| `$each` | `Array<RegleStatus>` | Status of every item (use `$id` for Vue `key`) |
| `$self` | `RegleFieldStatus` | Collection's own validation status (e.g., `minLength` on array) |

## Rule status properties (`$rules.ruleName`)

| Property | Type | Description |
|----------|------|-------------|
| `$valid` | `boolean` | Whether this rule passes |
| `$active` | `boolean` | Whether this rule is currently active |
| `$message` | `string \| string[]` | Error message(s) for this rule |
| `$tooltip` | `string \| string[]` | Tooltip message(s) for this rule |
| `$type` | `string` | Rule type identifier |
| `$path` | `string` | Field path |
