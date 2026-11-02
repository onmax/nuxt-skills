# Diagnostics

Every `YAPnnnn` diagnostic the compiler, the CLI, and the runtime report. An error fails `yapyak check`; a warning does not. Each code has a page at `https://yapyak.dev/reference/diagnostics/<code>`.

| Code | Name | Severity | Fires when | Fix |
| --- | --- | --- | --- | --- |
| `YAP0001` | No source | error | `t()` or `t.as()` has no source string | Pass the source as the first argument, second for `t.as()` |
| `YAP0002` | Dynamic template literal | error | The source is a template literal with `${}` | `t('Hi {name}', { name })` |
| `YAP0003` | Empty source | error | The source is `''` | Return `''` directly instead of translating it |
| `YAP0004` | Missing parameter | error | The source names a placeholder the params object lacks | Add the key to the params object |
| `YAP0005` | Extra parameter | error | The params object has a key the source does not use | Add `{key}` to the source or remove the key |
| `YAP0006` | Dynamic parameters | error | The params argument is a variable | Pass an inline object literal |
| `YAP0007` | Malformed ICU | error | A placeholder has mismatched braces, empty branches, or broken structure | Fix the syntax named in the message |
| `YAP0008` | Missing `other` branch | error | A `plural`, `selectordinal`, or `select` has no `other` | Add `other {...}` |
| `YAP0009` | Unsupported feature | error | Plural offsets, number skeletons, or another unsupported ICU feature | Use a supported form, or format the value before `t()` |
| `YAP0010` | Kind mismatch | error | A translation changes a placeholder's kind, `plural` to `select` | Keep the kind of the source |
| `YAP0011` | Missing in translation | error | A source placeholder is absent from the translation | Add the placeholder to the translation |
| `YAP0012` | Missing in source | error | A translation placeholder is absent from the source | Remove it from the translation, or add it to the source and the params |
| `YAP0013` | Invalid shape | error | A locale entry is neither a string nor a context-keyed object of strings | Fix the entry, or regenerate it with `yapyak translate` |
| `YAP0014` | Unsafe path | error | A path key holds `..`, a backslash, or is absolute | Rewrite it as a forward-slash relative path, or remove it |
| `YAP0015` | Not NFC normalized | error | A hand-edited key is not in Unicode NFC form | Re-save with NFC normalization, or regenerate the key |
| `YAP0016` | Invalid JSON | error | A locale file does not parse | Fix the JSON at the reported position |
| `YAP0017` | Context not literal | error | The `t.as()` context is not a string literal | `t.as('action', 'Open')` |
| `YAP0018` | Mixed usage | error | One source uses both `t()` and `t.as()` in one file | `t.as()` on every occurrence |
| `YAP0019` | Unused context | error | A `t.as()` context has no other context for the same source | Use plain `t()` |
| `YAP0020` | Captured chain | error | `t.as(...)` or `t.in(...)` is stored in a variable | Complete the chain in one expression |
| `YAP0021` | Runtime not initialized | warning | The runtime loads without the yapyak plugin | Add `yapyak()` to the plugins |
| `YAP0022` | Server-side leak risk | warning | `getLocale()` reads the module-global locale during SSR | Register the SSR adapter for the framework |
| `YAP0023` | Cookie writer missing | warning | `setLocale()` runs on the server outside `withResponse` | Register the SSR adapter |
| `YAP0024` | Local-storage SSR skipped | warning | `setLocale()` runs on the server with `persistence: 'local-storage'` | Use `'cookie'` under SSR |
| `YAP0025` | Local-storage write fails | warning | `localStorage` refuses the write | The in-memory locale still updates; fall back to cookie persistence |
| `YAP0026` | URL persistence skipped | warning | `setLocale()` runs with `persistence: 'url'` | Switch through navigation |
| `YAP0027` | Locale listener throws | warning | A locale-change subscriber throws | Fix the subscriber named in the message |
| `YAP0028` | Locale-set ignored | warning | `setLocale()` receives a value outside the configured locales | Narrow with `isLocale()` or `parseLocale()`, or add the locale |
| `YAP0029` | SSR leak risk on `setLocale()` | warning | `setLocale()` on the server could leak across requests | Configure `'cookie'` or `'url'` persistence |
| `YAP0030` | Forced locale invalid | warning | `t.in()` receives a tag that is not a valid BCP 47 locale | Fix the tag; the call falls back to `defaultLocale` |
| `YAP0031` | Corrupt locale file | error | A locale file is structurally damaged | Restore it from git, or regenerate it |
| `YAP0032` | Corrupt orphan cache | error | `.yapyak/` is damaged | Delete the directory; it rebuilds on the next save |
| `YAP0033` | Chunk fails | warning | A translator batch fails after retries | Re-run `yapyak translate` |
| `YAP0034` | Entry shape invalid | warning | A custom translator returns a non-object for one entry | Return `{ [locale]: string }` per item |
| `YAP0035` | Unsupported currency | warning | `format.number` gets a currency code `Intl` does not know | Use an ISO 4217 code |
| `YAP0036` | Unsupported unit | warning | `format.number` gets a unit `Intl` does not know | Use an ECMA-402 sanctioned unit |
| `YAP0037` | Unsupported time zone | warning | `format.dateTime` gets a zone `Intl` does not know | Use an IANA identifier such as `Europe/Stockholm` |
| `YAP0038` | Missing branch in target | error | A translation omits a plural or select branch the source defines | Add the branch to the translation |
| `YAP0039` | Migration fails | error | A locale file cannot be migrated to the current format | Fix the file by hand, then re-run |
| `YAP0040` | Tracker throws | warning | A framework binding's reactivity tracker throws | Fix the error named in the message |
| `YAP0041` | Rich-text tag unclosed | error | `<link>terms` has no `</link>` | Close the tag, or write a void tag `<link/>` |
| `YAP0042` | Rich-text tag mismatched | error | `<link>terms</bold>` closes a different tag | Match the closing tag, or close the inner tag first |
| `YAP0043` | Rich-text tag unopened | error | `terms</link>` has no opening tag | Add the opening tag, or remove the stray |
| `YAP0044` | Rich-text tag name missing | error | `<>` or `</>` has no name | Name the tag, or remove the brackets |
| `YAP0045` | Branch unknown | error | A translation's plural branch is not a category of the target locale | Rename it to a CLDR category of that locale, or `=N` |
| `YAP0046` | Keyword unknown | error | A source plural branch is not a CLDR keyword | `zero`, `one`, `two`, `few`, `many`, `other`, or `=N` |
| `YAP0047` | Unreadable locale file | warning | The filesystem denies reading a locale file | Check permissions and the open-file limit, restart the dev server |
| `YAP0048` | Parse error | error | A source file has a syntax error; none of its `t()` calls are extracted | Fix the syntax at the reported location |
| `YAP0049` | Param misspelled | error | A params key is a near match of a placeholder name | Rename the key to the placeholder |
| `YAP0050` | Translation malformed | error | A translation's ICU syntax does not parse | Fix the syntax in the locale file |
| `YAP0051` | Misspelled in translation | error | A translation placeholder is a near match of a source placeholder | Rename it in the locale file |
| `YAP0052` | Invalid placeholder name | error | A placeholder name holds whitespace or punctuation, or starts with a digit | Letters, digits, underscores; start with a letter or underscore |
| `YAP0053` | Entry unused | warning | A locale file holds a translation no `t()` call in that file uses | Delete the entry, or restore the call |
| `YAP0054` | Currency unsupported | warning | An ICU `currency` style names a code outside `Intl.supportedValuesOf('currency')` | Use an ISO 4217 code; a non-standard code still renders as `<value> <code>` |
| `YAP0055` | Module scope call | warning | `t()` is at module scope | Move the call into the function that renders the text |
| `YAP0056` | Unsupported display name | warning | `format.displayName` gets a code `Intl` rejects for the type | Pass a canonical code of that type, such as `sv`, `DE`, or `EUR` |
