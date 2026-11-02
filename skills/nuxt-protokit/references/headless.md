# Headless Mode

Use nuxt-protokit's Y.js persistence layer — IndexedDB, tab sync, server sync, migrations — **without any UI components**.

---

## `defineHeadlessSchema`

A minimal schema definition that only requires storage-relevant fields. UI-only properties (`title`, `shortTitle`, `description`, `icon`, `results`, `visualizations`, `layout`, etc.) are optional or omitted.

```ts
import { defineHeadlessSchema } from '@websideproject/nuxt-protokit'

const settingsSchema = defineHeadlessSchema({
  key: 'user-settings',        // required — Y.js doc key and IndexedDB store
  fields: {                    // required
    theme:    { type: 'select', label: 'Theme',    default: 'system',
                options: ['system', 'light', 'dark'] },
    language: { type: 'select', label: 'Language', default: 'en',
                options: ['en', 'de', 'fr'] },
    sidebar:  { type: 'toggle', label: 'Sidebar',  default: true },
  },
  collections?: { ... },       // optional
  derived?: { ... },           // optional
  version?: number,
  migrations?: { ... },
})
```

Returns a full `PrototypeSchema` with empty strings for UI fields — ready to pass directly to `usePrototype`.

---

## Usage with `usePrototype`

```vue
<script setup>
import { settingsSchema } from '~/schemas/settings'

// Local-only (no server sync for settings)
const { state, isReady } = usePrototype(settingsSchema, { disableSync: true })

// Reactive refs — automatically persisted to IndexedDB
const theme    = state.theme      // Ref<'system' | 'light' | 'dark'>
const language = state.language   // Ref<string>
const sidebar  = state.sidebar    // Ref<boolean>

// Mutate directly
function setTheme(t: string) { theme.value = t }
</script>
```

No `<ProtoTool>` or any Proto component needed. The composable handles all persistence.

---

## Headless Collections

```ts
const notesSchema = defineHeadlessSchema({
  key: 'user-notes',
  fields: {},
  collections: {
    notes: defineCollection({
      key: 'notes',
      title: 'Notes',
      itemLabel: item => item.title,
      fields: {
        title:   { type: 'text',     label: 'Title',   default: '' },
        content: { type: 'textarea', label: 'Content', default: '' },
        pinned:  { type: 'toggle',   label: 'Pinned',  default: false },
      },
      defaults: { title: '', content: '', pinned: false },
    }),
  },
})

const { collections, isReady } = usePrototype(notesSchema)
const notes = collections.notes   // UseProtoListReturn

// CRUD
notes.add({ title: 'Hello', content: 'World', pinned: false })
notes.update(0, { ...notes.items.value[0], pinned: true })
notes.remove(0)

// Access items
const allNotes = notes.items      // Ref<any[]>
const pinnedNotes = computed(() => allNotes.value.filter(n => n.pinned))
```

---

## Standalone Collection

`useProtoCollection` is even simpler for a single collection without a parent prototype:

```ts
import { defineCollection } from '@websideproject/nuxt-protokit'

const taskSchema = defineCollection({
  key: 'tasks',
  title: 'Tasks',
  itemLabel: item => item.name,
  fields: {
    name:   { type: 'text',   label: 'Task',   default: '' },
    done:   { type: 'toggle', label: 'Done',   default: false },
    due:    { type: 'date',   label: 'Due',    default: '' },
  },
  defaults: { name: '', done: false, due: '' },
  searchable: true,
  sortBy: 'due',
})

const tasks = useProtoCollection(taskSchema, { disableSync: true })

// In template or other composables
tasks.items.value          // all tasks
tasks.sorted.value         // sorted by 'due'
tasks.search.value = 'bug' // filter by search
tasks.filtered.value       // filtered results
```

---

## Use Cases

| Use Case | Pattern |
|----------|---------|
| User preferences / settings | `defineHeadlessSchema` + `disableSync: true` |
| Per-user bookmarks, notes | `defineHeadlessSchema` + `namespace: userId` |
| Shared team data (no UI) | `defineHeadlessSchema` + `namespace: teamId` + server sync |
| Background data caching | `useProtoDoc` directly for raw Y.Map/Y.Array access |
| Custom UI over persistent storage | `usePrototype(headlessSchema)` — read/write `state.*` refs |

---

## Schema Migrations in Headless Mode

Migrations work identically to UI mode:

```ts
const schema = defineHeadlessSchema({
  key: 'settings',
  fields: {
    theme: { type: 'select', label: 'Theme', default: 'system', options: [...] },
    // v2: added 'accentColor'
    accentColor: { type: 'color', label: 'Accent', default: '#3B82F6' },
  },
  version: 2,
  migrations: {
    2: data => ({ ...data, accentColor: data.accentColor ?? '#3B82F6' }),
  },
})
```
