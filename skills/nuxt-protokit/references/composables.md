# Composables Reference

## `usePrototype` — High-Level Orchestrator

The primary composable. Combines doc, fields (Y.Map), collections (Y.Arrays), derived, permissions.

```ts
const proto = usePrototype(schema, options?)
```

### Options

```ts
{
  docKey?: string          // Override doc key (default: schema.key)
  existingDoc?: Y.Doc      // Share an existing Y.js doc
  disableSync?: boolean    // Force local-only, ignore global serverSync config
  namespace?: string       // Prefix for IndexedDB isolation (see below)
  encryption?: {
    password: string       // AES-GCM encryption for IndexedDB updates
  }
}
```

### Return Value

```ts
{
  state: Record<string, Ref>                         // one Ref per schema.fields key
  collections: Record<string, UseProtoListReturn>    // one per schema.collections key
  derived: ComputedRef<Record<string, any>>          // computed derived values
  computeContext: ComputedRef<ComputeContext>         // { fields, derived, connections, collections }
  reset: () => void                                  // reset fields + all collections to defaults
  isReady: Ref<boolean>                              // false until IndexedDB loaded
  doc: Y.Doc                                         // underlying Y.js document
  fieldPermissions: Record<string, FieldPermissionsResolved>
  collectionPermissions: Record<string, CollectionPermissionsResolved>
}
```

### Usage Patterns

```vue
<script setup>
// Basic
const proto = usePrototype(schema)

// Namespace isolation (multi-tenant)
const { user } = useAuth()
const proto = usePrototype(schema, { namespace: user.value.tenantId })

// Per-user isolation
const proto = usePrototype(schema, {
  namespace: computed(() => `${tenantId.value}:${userId.value}`)
})

// Encryption
const proto = usePrototype(schema, { encryption: { password: userPassphrase } })

// Public demo tool (never syncs to server)
const proto = usePrototype(schema, { disableSync: true })

// Read state
const revenue = proto.state.revenue  // Ref<number>
const items   = proto.collections.competitors.items  // Ref<any[]>
const burn    = proto.derived.value.monthlyBurn

// Mutate state directly
proto.state.revenue.value = 50000

// Collections CRUD
proto.collections.team.add({ name: 'Alice', role: 'Engineer' })
proto.collections.team.update(0, { name: 'Alice', role: 'Lead' })
proto.collections.team.remove(0)
</script>
```

---

## `useProtoCollection` — Standalone Collection

For collections that don't need a parent prototype. Has its own doc.

```ts
const coll = useProtoCollection(collectionSchema, options?)
```

### Options

```ts
{
  docKey?: string       // Override doc key (default: 'collection-<schema.key>')
  existingDoc?: Y.Doc   // Share an existing Y.js doc
  disableSync?: boolean
}
```

### Return Value

```ts
{
  doc: Y.Doc
  items: Ref<any[]>
  add: (item: any) => void
  update: (index: number, item: any) => void
  remove: (index: number) => void
  move: (from: number, to: number) => void
  count: ComputedRef<number>
  search: Ref<string>           // bind to search input
  filtered: ComputedRef<any[]>  // items filtered by search
  sortKey: Ref<string>
  sortOrder: Ref<'asc' | 'desc'>
  sorted: ComputedRef<any[]>    // filtered + sorted
  reset: () => void
  isReady: Ref<boolean>
  permissions: CollectionPermissionsResolved
  destroy: () => void           // clean up IndexedDB listener
}
```

---

## `useProtoDoc` — Low-Level Y.js Document

For advanced use. Usually prefer `usePrototype` or `useProtoCollection`.

```ts
const { doc, isReady, destroy } = useProtoDoc(key, options?)
```

### Options

```ts
{
  disableSync?: boolean
  encryption?: { password: string }
}
```

The doc is persisted to IndexedDB under `key` and synced via BroadcastChannel between tabs. If `serverSync` is enabled in module config, it also syncs to `/api/yjs/<key>` (or custom baseUrl).

---

## `useProtoCalendar` — Calendar Event Store

```ts
const { events, addEvent, updateEvent, removeEvent, moveEvent, isReady, doc } = useProtoCalendar({
  docKey: 'my-calendar',   // or existingDoc: doc to share a Y.Doc with other tools
})
// events: Ref<CalendarEvent[]> in the STORED shape — startAt/endAt, all-day endAt = last day (inclusive)
```

`<ProtoCalendar>` wraps this for you. To drive `<ProtoCalendarView>` from it yourself, convert with
`fromStoredEvent` / `toStoredPatch` from `#protokit/calendar` (the view's events are [start, end)).

---

## `useProtoPermissions`

Resolves field/collection permission guards reactively.

```ts
const { resolveFieldPermissions, resolveCollectionPermissions } = useProtoPermissions()
```

Usually accessed via `proto.fieldPermissions` and `proto.collectionPermissions` — not called directly.

---

## `useProtoCorruption` — Corruption Detection

```ts
const { isCorrupted, clearCorruption } = useProtoCorruption()
```

Used internally by `<ProtoCorruptionModal>`. In most cases use the component directly rather than this composable.

---

## `useProtoKitConfig` — Runtime Config Access

```ts
const { serverSync } = useProtoKitConfig()
// { enabled: boolean, baseUrl: string }
```

---

## Namespace Isolation

The `namespace` option creates fully isolated IndexedDB stores and BroadcastChannels. The resulting doc key is `<namespace>:<docKey>`.

```ts
// Org-shared: all users in the org see the same data
usePrototype(schema, { namespace: orgId })

// Private per user in org
usePrototype(schema, { namespace: `${orgId}:${userId}` })

// Reactive namespace (re-mounts when user switches org)
const ns = computed(() => user.value?.orgId)
usePrototype(schema, { namespace: ns })
```

When `namespace` changes, the composable unmounts the old doc and mounts a fresh one — no data bleeds between namespaces.

---

## Permission Types

```ts
interface FieldPermissionsResolved {
  visible: ComputedRef<boolean>
  editable: ComputedRef<boolean>
}

interface CollectionPermissionsResolved {
  canAdd: ComputedRef<boolean>
  canEdit: ComputedRef<boolean>
  canDelete: ComputedRef<boolean>
  canReorder: ComputedRef<boolean>
}
```

All flags default to `true` when no permissions are defined on the schema.
