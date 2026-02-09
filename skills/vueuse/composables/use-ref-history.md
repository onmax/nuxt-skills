# useRefHistory

Track the change history of a ref, also provides undo and redo functionality

**Package:** `@vueuse/core`
**Category:** State

## Usage

```ts
// @include: usage
// ---cut---
counter.value += 1

await nextTick()
console.log(history.value)
/* [
  { snapshot: 1, timestamp: 1601912898062 },
  { snapshot: 0, timestamp: 1601912898061 }
] */
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| deep | `boolean` | false | Watch for deep changes, default to false |
| capacity | `number` | - | Maximum number of history to be kept. Default to unlimited. |
| clone | `boolean \| CloneFn&lt;Raw&gt;` | false | Clone when taking a snapshot, shortcut for dump: JSON.parse(JSON.stringify(value)). |
| dump | `(v: Raw) =&gt; Serialized` | - | Serialize data into the history |
| parse | `(v: Serialized) =&gt; Raw` | - | Deserialize data from the history |
| shouldCommit | `(oldValue: Raw \| undefined, newValue: Raw) =&gt; boolean` | - | Function to determine if the commit should proceed |

## Returns

| Name | Type |
| --- | --- |
| isTracking | `Ref` |
| pause | `Ref` |
| resume | `Ref` |
| commit | `Ref` |
| batch | `Ref` |
| dispose | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useRefHistory/)
