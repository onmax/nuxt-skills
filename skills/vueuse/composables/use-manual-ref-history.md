# useManualRefHistory

Manually track the change history of a ref when the using calls , also provides undo and redo functionality

**Package:** `@vueuse/core`
**Category:** State

## Usage

```ts
// @include: usage
// ---cut---
console.log(counter.value) // 1
undo()
console.log(counter.value) // 0
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| capacity | `number` | - | Maximum number of history to be kept. Default to unlimited. |
| clone | `boolean \| CloneFn&lt;Raw&gt;` | false | Clone when taking a snapshot, shortcut for dump: JSON.parse(JSON.stringify(value)). |
| dump | `(v: Raw) =&gt; Serialized` | - | Serialize data into the history |
| parse | `(v: Serialized) =&gt; Raw` | - | Deserialize data from the history |
| setSource | `(source: Ref&lt;Raw&gt;, v: Raw) =&gt; void` | - | set data source |

## Returns

| Name | Type |
| --- | --- |
| source | `Ref` |
| undoStack | `Ref` |
| redoStack | `Ref` |
| last | `Ref` |
| history | `computed` |
| canUndo | `computed` |
| canRedo | `computed` |
| clear | `Ref` |
| commit | `Ref` |
| reset | `Ref` |
| undo | `Ref` |
| redo | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useManualRefHistory/)
