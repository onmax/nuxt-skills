# Components Reference

All components are auto-imported when `@websideproject/nuxt-protokit` is registered in `nuxt.config.ts`.

---

## `<ProtoTool>` — Main Wrapper

The top-level container for a prototype. Handles `isReady` lifecycle (shows skeleton while IndexedDB loads) and renders the full tool UI from schema + prototype data.

```vue
<template>
  <ProtoTool :schema="schema" :prototype="proto" />
</template>

<script setup>
const proto = usePrototype(schema)
</script>
```

**Props:**
- `:schema` — `PrototypeSchema`
- `:prototype` — return value of `usePrototype(schema)`

When `schema.layout` is defined, renders `<ProtoDashboard>`. Otherwise auto-renders form + results.

---

## `<ProtoDashboard>` — Dashboard with Layout/Tabs

Renders a full dashboard driven by `schema.layout`. Handles tabs, rows, and all `LayoutItem` types.

```vue
<ProtoDashboard :schema="schema" :prototype="proto" />
```

Usually used indirectly via `<ProtoTool>`. Use directly if you need to embed the dashboard inside a custom wrapper.

---

## `<ProtoForm>` — Field Renderer

Renders all fields from `schema.fields` (or a specific `SectionDef`) as form inputs.

```vue
<ProtoForm :schema="schema" :state="proto.state" />
<!-- Render specific section only -->
<ProtoForm :schema="schema" :state="proto.state" :sectionIndex="0" />
```

---

## `<ProtoSection>` — Field Group Container

Renders a labelled group of fields. Used inside custom layouts.

```vue
<ProtoSection title="Revenue" icon="i-heroicons-currency-dollar">
  <ProtoForm :schema="schema" :state="proto.state" :sectionIndex="0" />
</ProtoSection>
```

---

## `<ProtoCard>` / `<ProtoDetailCard>` — Stat Cards

```vue
<ProtoCard :def="schema.cards[0]" :ctx="proto.computeContext.value" />
```

---

## `<ProtoCrudModal>` — Collection Editor (Modal)

Full CRUD modal for a collection. Triggered by an "Add" button + edit/delete actions per row.

```vue
<ProtoCrudModal
  :schema="schema"
  :collection-key="'competitors'"
  :collection="proto.collections.competitors"
/>
```

**Props:**
- `:schema` — parent `PrototypeSchema`
- `:collection-key` — key in `schema.collections`
- `:collection` — `UseProtoListReturn` (from `proto.collections[key]`)

Renders in `'modal'` editMode (default). Switch to `'inline'` in `CollectionSchema.editMode` for inline editing.

---

## `<ProtoCrudTable>` — Table View

Renders collection items as a sortable table. Uses `schema.collections[key].tableColumns`.

```vue
<ProtoCrudTable
  :schema="schema"
  :collection-key="'items'"
  :collection="proto.collections.items"
/>
```

---

## `<ProtoCrudList>` — List View

Renders collection items as a searchable list. Uses `schema.collections[key].listDisplay`.

```vue
<ProtoCrudList
  :schema="schema"
  :collection-key="'items'"
  :collection="proto.collections.items"
/>
```

---

## `<ProtoCalendar>` / `<ProtoCalendarView>` — Calendar

Day / week / infinite month calendar (from the Nuxt UI calendar template): drag to create, move and
resize, inline event form, quick natural-language events. Needs `@nuxt/ui` >= 4.5.

```vue
<!-- Y.js-backed, persists itself -->
<ProtoCalendar doc-key="my-calendar" class="h-screen" />

<!-- Bring your own data: events in, changes out -->
<ProtoCalendarView
  v-model:view="view"
  :events="events"
  :calendars="[{ id: 'work', name: 'Work', color: 'primary' }]"
  sidebar
  @create="onCreate"
  @update="onUpdate"
  @remove="onRemove"
  @event-click="onClick"
/>
```

- `CalendarViewEvent` (`#protokit/calendar`): `{ id, title, start, end, allDay?, calendarId?, color?, description?, location?, editable? }` — floating local `YYYY-MM-DDTHH:mm:ss`, `end` EXCLUSIVE
- Flags: `editable` (move/resize), `creatable` (draw new), `popover` (inline form), `droppable` (`@external-drop`), `sidebar`, `toolbar`, `shortcuts`, `weekStartsOn`, `views`, `loading`
- A plain `view="month"` pins the view; use `v-model:view` when offering several
- `ProtoCalendar` passes every view prop/listener through; converts stored ⇄ view with `fromStoredEvent` / `toStoredPatch`

## `<VizCollectionCalendar>` — Collection on a Calendar

Renders collection items as calendar events; dragging one writes the new date/time back via `onUpdate`.

```vue
<VizCollectionCalendar
  :items="proto.collections.events.items.value"
  :config="{
    dateField: 'date',
    titleField: 'title',
    timeField: 'startTime',
    endTimeField: 'endTime',
    statusColorMap: { scheduled: 'blue', done: 'green' },
    defaultColor: 'neutral',
  }"
  :on-update="(idx, val) => proto.collections.events.update(idx, val)"
/>
```

**`CollectionCalendarConfig` props:**
- `dateField` — required, primary date field key
- `titleField` — required, field key for event title
- `idField?` — defaults to `_id`
- `endDateField?` — end date for multi-day events
- `timeField?` — HH:mm time field
- `endTimeField?` — HH:mm end time
- `allDayField?` — boolean field; when absent, events default to all-day
- `statusColorMap?` — `Record<statusValue, CalendarColor>`
- `defaultColor?` — fallback color (default: `'neutral'`)

Or use via `DashboardLayout`:
```ts
layout: {
  rows: [{ cols: 1, items: [{
    type: 'collection', collectionKey: 'events', view: 'calendar',
    calendarConfig: { dateField: 'date', titleField: 'title' }
  }]}]
}
```

---

## `<ProtoViz>` — Visualization Dispatcher

Renders any visualization type by dispatching to the correct viz component.

```vue
<ProtoViz :def="schema.visualizations[0]" :ctx="proto.computeContext.value" />
```

Usually rendered automatically by `<ProtoTool>` / `<ProtoDashboard>`. Use directly when building custom layouts.

---

## `<ProtoActionBar>` — Action Buttons

Renders the `schema.actions` array as buttons (copy-text, export-markdown, reset).

```vue
<ProtoActionBar :schema="schema" :ctx="proto.computeContext.value" />
```

---

## `<ProtoDebugPanel>` — Development Tool

Shows raw Y.js state for debugging. Dev-only, renders nothing in production.

```vue
<ProtoDebugPanel :prototype="proto" />
```

---

## `<ProtoCorruptionModal>` — Corruption Recovery

Monitors for IndexedDB corruption and presents a recovery UI when detected. Add once per page or in the root layout.

```vue
<ProtoCorruptionModal />
```

No props needed — it uses `useProtoCorruption()` internally.

---

## Field Input Components (internal)

These render automatically inside `<ProtoForm>` based on field type. They can also be used standalone:

| Component | Field type |
|-----------|------------|
| `<ProtoFieldText>` | `text` |
| `<ProtoFieldTextarea>` | `textarea` |
| `<ProtoFieldNumber>` | `number` |
| `<ProtoFieldSelect>` | `select` |
| `<ProtoFieldSegmented>` | `segmented` |
| `<ProtoFieldToggle>` | `toggle` |
| `<ProtoFieldRange>` | `range` |
| `<ProtoFieldRating>` | `rating` |
| `<ProtoFieldColor>` | `color` |
| `<ProtoFieldDate>` | `date` |
| `<ProtoFieldTags>` | `tags` |
| `<ProtoFieldLinkedResponses>` | `linked-responses` |
