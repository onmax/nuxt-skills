# TagGroup

Accessible grid of removable, optionally selectable tags (added in v2.11.0)

**Parts:** `TagGroupRoot`, `TagGroupItem`, `TagGroupItemText`, `TagGroupItemDelete`

- `TagGroupRoot` - `selectionMode` (`single` | `multiple`), `v-model` (selected value/values), `aria-label`; emits `remove` with the values to remove (filter them from your own list)
- `TagGroupItem` - `value`, `textValue` (typeahead text); Delete/Backspace removes it
- `TagGroupItemDelete` - pass `aria-label` to translate

```vue
<TagGroupRoot aria-label="Categories" @remove="values => tags = tags.filter(t => !values.includes(t))">
  <TagGroupItem v-for="tag in tags" :key="tag" :value="tag">
    <TagGroupItemText />
    <TagGroupItemDelete>×</TagGroupItemDelete>
  </TagGroupItem>
</TagGroupRoot>
```
