# Schema Reference

## Helper Utilities

```ts
import { definePrototype, defineCollection, defineHeadlessSchema } from '@websideproject/nuxt-protokit'

// Type-safe schema helper (pass-through, for TS inference)
const schema = definePrototype({ key, title, shortTitle, description, icon, fields, ... })

// Type-safe collection helper
const myCollection = defineCollection({ key, title, fields, defaults, itemLabel, ... })

// Headless schema (no UI metadata required)
const headless = defineHeadlessSchema({ key, fields, collections?, derived? })
```

---

## PrototypeSchema

```ts
interface PrototypeSchema {
  key: string              // Unique ID — used as Y.js doc key and IndexedDB store
  title: string
  shortTitle: string
  description: string
  icon: string             // Iconify icon, e.g. 'i-heroicons-calculator'
  tags?: string[]

  // Input state (persisted in Y.Map)
  fields: Record<string, FieldDef>
  sections?: SectionDef[]   // Visual grouping of fields
  defaultCols?: 1 | 2 | 3 | 4

  // CRUD collections (persisted in Y.Arrays)
  collections?: Record<string, CollectionSchema>

  // Computed values (NOT stored in Y.js)
  derived?: Record<string, DerivedDef>

  // Display
  results?: ResultSectionDef[]
  visualizations?: VizDef[]
  cards?: CardDef[]
  actions?: ProtoAction[]

  // Dashboard layout
  layout?: DashboardLayout

  // Cross-tool data sharing
  produces?: Record<string, 'number' | 'string' | 'boolean' | 'string[]' | 'object' | 'object[]'>
  consumes?: Record<string, string>

  // Schema migration
  version?: number
  migrations?: SchemaMigrations  // Record<number, (data) => data>
}
```

---

## Field Types (`FieldDef`)

All fields share: `label`, `default`, `help?`, `hint?`, `showWhen?`, `permissions?`

### Simple Fields

```ts
// number — numeric input
{ type: 'number', label: 'Revenue', default: 0,
  min?: number, max?: number, step?: number,
  leading?: '$', trailing?: '/mo',
  format?: 'money' | 'percent' | 'number' | 'date' | ((v) => string) }

// text — single-line input
{ type: 'text', label: 'Name', default: '', placeholder?: string }

// textarea — multi-line
{ type: 'textarea', label: 'Notes', default: '' }

// select — dropdown
{ type: 'select', label: 'Plan', default: 'starter',
  options: ['starter', 'pro'] | [{ label: 'Starter', value: 'starter', icon?: string }] }

// segmented — segmented control (like radio but compact)
{ type: 'segmented', label: 'View', default: 'week',
  options: ['day', 'week', 'month'] }

// toggle — boolean switch
{ type: 'toggle', label: 'Enabled', default: false }

// range — slider
{ type: 'range', label: 'Growth %', default: 10, min: 0, max: 100, step: 1,
  rangeLabels?: { min: 'Low', max: 'High' },
  format?: 'percent' }

// rating — star rating
{ type: 'rating', label: 'Confidence', default: 3, min: 1, max: 5 }

// color — color picker
{ type: 'color', label: 'Brand Color', default: '#3B82F6' }

// date — date picker
{ type: 'date', label: 'Launch Date', default: '' }

// tags — tag input (array of strings)
{ type: 'tags', label: 'Keywords', default: [] }
```

### Linked Responses (cross-collection)

```ts
{
  type: 'linked-responses',
  label: 'Team Answers',
  default: [],                            // Array<{ sourceId: string, answer: string }>
  sourceCollection: 'team',              // key in schema.collections
  sourceLabel: (item) => item.name,
  sourceBadge?: (item) => item.role,
  answerPlaceholder?: string,
  answerRows?: number,
}
```

### Custom Field

```ts
{
  type: 'myns:myfield',     // namespaced: 'namespace:name'
  label: 'Custom',
  default: null,
  props?: Record<string, any>,
  showWhen?: (values) => boolean,
}
```

### Field Permissions

```ts
permissions?: {
  visible?: (ctx: PermissionContext) => boolean
  editable?: (ctx: PermissionContext) => boolean
}
// ⚠️ Frontend only — Y.js data is always present regardless
```

---

## CollectionSchema

```ts
interface CollectionSchema {
  key: string
  title: string
  icon?: string
  itemLabel: (item: Record<string, any>) => string  // Display name for each item

  fields: Record<string, FieldDef>
  defaults: Record<string, any>        // Default values for new items

  maxItems?: number
  sortBy?: string                      // Default sort field key
  sortOrder?: 'asc' | 'desc'
  searchable?: boolean
  searchFields?: string[]

  editMode?: 'inline' | 'modal'        // How items are edited
  modalSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'

  // Table view config
  tableColumns?: Array<{
    key: string
    label: string
    sortable?: boolean
    format?: 'money' | 'percent' | 'number' | 'date' | ((v) => string)
  }>

  // List view config
  listDisplay?: {
    primaryField: string
    secondaryField?: string
    badgeField?: string
    avatarField?: string
  }

  // Status badge per item
  statusField?: {
    key: string
    states: Record<string, { label: string, color: 'neutral'|'info'|'success'|'warning'|'error', icon?: string }>
  }

  // Per-item action buttons in the row
  itemActions?: CollectionItemAction[]

  // Expandable panels per item
  itemPanels?: CollectionItemPanel[]

  // Preset data packs
  presets?: PresetPack[]
  onboardingPresets?: boolean          // Show preset picker on first load

  // Validation
  validate?: (item) => true | false | string | Record<string, string>

  // CRUD guards (frontend only)
  permissions?: CollectionPermissions

  // Schema migration
  version?: number
  migrations?: SchemaMigrations
}
```

### Item Actions

```ts
// Open a URL
{ type: 'open-url', id: 'view', icon: 'i-heroicons-arrow-top-right-on-square',
  url: (item, collections) => item.websiteUrl }

// Set a status field
{ type: 'status-set', id: 'mark-done', icon: 'i-heroicons-check',
  toStatus: 'done', showWhen: (item) => item.status !== 'done' }

// Custom action (emits event handled in component)
{ type: 'custom', id: 'analyze', icon: 'i-heroicons-sparkles', label: 'Analyze',
  showWhen: (item) => !!item.url }
```

### Item Panels

```ts
// Time series history panel
{ type: 'time-series', id: 'history', label: 'Metrics History',
  historyKey: 'metricsHistory',
  metrics: [{ key: 'mrr', label: 'MRR' }, { key: 'users', label: 'Users' }] }

// Text template panel
{ type: 'text-template', id: 'prompt', label: 'AI Prompt',
  sections: [{ id: 'overview', label: 'Overview',
    template: (item, ctx) => `Product: ${item.name}\nRevenue: ${item.mrr}` }] }

// URL input panel
{ type: 'url-input', id: 'website', label: 'Website', field: 'url',
  onConfirm: (url, item) => ({ url, domain: new URL(url).hostname }) }
```

---

## DerivedDef & ComputeContext

```ts
interface DerivedDef {
  deps?: string[]                    // field keys this depends on (optimization hint)
  compute: (ctx: ComputeContext) => any
  format?: 'money' | 'percent' | 'number' | 'date' | ((v) => string)
}

interface ComputeContext {
  fields: Record<string, any>        // current field values
  derived: Record<string, any>       // other derived values (chained)
  connections: Record<string, any>   // values from connected prototypes
  collections: Record<string, any[]> // collection item arrays
}

// Example
derived: {
  monthlyBurn: {
    deps: ['salaries', 'infrastructure', 'marketing'],
    compute: ctx => ctx.fields.salaries + ctx.fields.infrastructure + ctx.fields.marketing,
    format: 'money',
  },
  runway: {
    deps: ['cash', 'monthlyBurn'],   // can depend on other derived values
    compute: ctx => ctx.fields.cash / ctx.derived.monthlyBurn,
  },
}
```

---

## SectionDef (field grouping)

```ts
interface SectionDef {
  title: string
  icon?: string
  description?: string
  fields: string[]           // keys into schema.fields
  cols?: 1 | 2 | 3 | 4
  collapsible?: boolean
  defaultOpen?: boolean
}
```

---

## DashboardLayout

```ts
interface DashboardLayout {
  rows?: LayoutRow[]           // flat layout
  tabs?: DashboardTabDef[]     // tabbed layout
}

interface LayoutRow {
  cols: 1 | 2 | 3 | 4
  gap?: number
  items: LayoutItem[]
}

// LayoutItem union
type LayoutItem =
  | { type: 'form',       sectionIndex?: number, span?: number }
  | { type: 'stats',      resultIndex: number,   span?: number }
  | { type: 'viz',        vizIndex: number,       span?: number }
  | { type: 'card',       cardIndex: number,      span?: number }
  | { type: 'collection', collectionKey: string, view: 'list' | 'table', span?: number }
  | { type: 'collection', collectionKey: string, view: 'calendar',
      calendarConfig: CollectionCalendarConfig, span?: number }
  | { type: 'section',   title: string, items: LayoutItem[], span?: number }
  | { type: 'tabs',      tabs: InlineTabDef[], span?: number }
```

---

## ProtoAction

```ts
// Copy text to clipboard
{ type: 'copy-text', id: 'copy', label: 'Copy Report',
  text: (ctx, collections) => `Revenue: ${ctx.fields.revenue}` }

// Export markdown file
{ type: 'export-markdown', id: 'export', label: 'Export',
  content: (ctx) => `# Report\n\nRevenue: ${ctx.fields.revenue}`,
  filename: 'report.md' }

// Reset all fields to defaults
{ type: 'reset', id: 'reset', label: 'Reset' }
```

---

## Schema Migrations

```ts
// Increment version when stored data shape changes
version: 2,
migrations: {
  // key = target version; runs when stored version < target
  2: (data) => ({ ...data, newField: data.oldField ?? 0 }),
},
```

For manual use: `import { runMigrations } from '#protokit/utils/runMigrations'` — `runMigrations(data, storedVersion, currentVersion, migrations)`.
