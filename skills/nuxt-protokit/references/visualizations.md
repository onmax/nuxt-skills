# Visualizations Reference

Add visualizations to `schema.visualizations: VizDef[]`. Each item references a zero-based index in `layout`.

```ts
visualizations: [
  { type: 'bar-chart', config: { ... } },       // index 0
  { type: 'stat-cards', config: { ... } },      // index 1
],
layout: {
  rows: [{ cols: 2, items: [
    { type: 'viz', vizIndex: 0 },
    { type: 'viz', vizIndex: 1 },
  ]}]
}
```

All `config` callbacks receive `ctx: ComputeContext` (`{ fields, derived, connections, collections }`).

---

## Built-In Viz Types

### `progress` — Progress Bar

```ts
{
  type: 'progress',
  title?: 'Runway',
  config: {
    type: 'progress',
    value: ctx => ctx.derived.runwayMonths,
    max?: 24,
    label?: ctx => `${ctx.derived.runwayMonths} months`,
    thresholds?: [
      { value: 6,  color: 'error',   label: 'Critical' },
      { value: 12, color: 'warning', label: 'Low' },
      { value: 24, color: 'success', label: 'Healthy' },
    ],
  },
}
```

### `benchmark` — Benchmark Bar

Positions a value against a median reference with min/max range.

```ts
{
  type: 'benchmark',
  config: {
    type: 'benchmark',
    value: ctx => ctx.fields.cac,
    median: 150,
    min?: 50,
    max?: 500,
    label?: 'CAC vs Industry',
    unit?: '$',
  },
}
```

### `bar-chart`

```ts
{
  type: 'bar-chart',
  config: {
    type: 'bar-chart',
    data: ctx => [
      { label: 'Jan', value: ctx.fields.jan, color?: '#3B82F6' },
      { label: 'Feb', value: ctx.fields.feb },
    ],
    maxValue?: number,
    unit?: '$',
  },
}
```

### `line-chart`

```ts
{
  type: 'line-chart',
  config: {
    type: 'line-chart',
    data: ctx => ctx.collections.metrics.map(m => ({ label: m.month, value: m.mrr })),
    color?: '#3B82F6',
    showAxes?: true,
    unit?: '$',
    emptyText?: 'No data yet',
  },
}
```

### `area-chart` — Multi-Series

```ts
{
  type: 'area-chart',
  config: {
    type: 'area-chart',
    series: ctx => [
      { label: 'Revenue', color: '#10B981',
        data: ctx.collections.months.map(m => ({ label: m.name, value: m.revenue })) },
      { label: 'Costs', color: '#F43F5E',
        data: ctx.collections.months.map(m => ({ label: m.name, value: m.costs })) },
    ],
    showAxes?: true,
    unit?: '$',
  },
}
```

### `pie-chart` / `donut-chart`

```ts
{
  type: 'pie-chart',   // or 'donut-chart'
  config: {
    type: 'pie-chart',
    data: ctx => ctx.collections.channels.map(c => ({ label: c.name, value: c.revenue })),
    unit?: '$',
    showLegend?: true,
    emptyText?: 'No channels yet',
  },
}
```

### `funnel-chart`

```ts
{
  type: 'funnel-chart',
  config: {
    type: 'funnel-chart',
    data: ctx => [
      { label: 'Visitors',  value: ctx.fields.visitors },
      { label: 'Signups',   value: ctx.fields.signups },
      { label: 'Paid',      value: ctx.fields.paid },
    ],
    unit?: '',
    showConversion?: true,   // show conversion % between stages
  },
}
```

### `stat-cards`

```ts
{
  type: 'stat-cards',
  config: {
    type: 'stat-cards',
    cols?: 3,   // 1 | 2 | 3 | 4
    cards: ctx => [
      {
        label: 'MRR',
        value: ctx.derived.mrr,
        subLabel?: 'Monthly Recurring Revenue',
        trend?: 12.5,         // percentage change
        trendLabel?: 'vs last month',
        unit?: '$',
        icon?: 'i-heroicons-currency-dollar',
        color?: 'emerald',    // 'primary' | 'emerald' | 'rose' | 'amber' | 'violet' | 'sky' | 'neutral'
        sparkline?: [120, 135, 148, 162, 180],  // mini chart
      },
    ],
  },
}
```

### `comparison-table`

```ts
{
  type: 'comparison-table',
  config: {
    type: 'comparison-table',
    columns: [
      { key: 'name',  label: 'Plan' },
      { key: 'price', label: 'Price' },
      { key: 'users', label: 'Users' },
    ],
    rows: ctx => ctx.collections.plans.map(p => ({
      name: p.name, price: p.price, users: p.maxUsers
    })),
  },
}
```

### `feature-matrix`

```ts
{
  type: 'feature-matrix',
  config: {
    type: 'feature-matrix',
    features: ['SSO', 'API Access', 'Custom Domain', 'SLA'],
    entities: ctx => ctx.collections.competitors.map(c => ({
      name: c.name,
      coverage: { SSO: c.hasSso, 'API Access': 'partial', 'Custom Domain': false, SLA: c.hasSla }
      // value: true | false | 'partial'
    })),
  },
}
```

### `timeline`

```ts
{
  type: 'timeline',
  config: {
    type: 'timeline',
    items: ctx => ctx.collections.milestones.map(m => ({
      title: m.name,
      description?: m.notes,
      date?: m.targetDate,
      status?: m.done ? 'done' : m.current ? 'current' : 'upcoming',
      icon?: 'i-heroicons-flag',
    })),
  },
}
```

---

## `showWhen` on VizDef

All viz types support `showWhen` to conditionally render:

```ts
{
  type: 'bar-chart',
  showWhen: ctx => ctx.collections.months.length > 0,
  config: { ... }
}
```

---

## Custom Viz Types

Custom viz must be registered via `defineProtokitExtension`. See `references/extensions.md`.

```ts
{
  type: 'myns:heatmap',   // 'namespace:name'
  title?: 'Activity Heatmap',
  showWhen?: ctx => true,
  config?: { /* passed as props to your component */ }
}
```

---

## `CollectionCalendarConfig` (for collection calendar views)

Used in `LayoutItem` with `view: 'calendar'`:

```ts
{
  dateField: 'scheduledDate',     // required
  titleField: 'name',             // required
  idField?: '_id',
  endDateField?: 'endDate',
  timeField?: 'startTime',        // HH:mm
  endTimeField?: 'endTime',       // HH:mm
  allDayField?: 'isAllDay',       // boolean field; absent = all-day
  statusColorMap?: { scheduled: 'blue', done: 'green', cancelled: 'red' },
  defaultColor?: 'neutral',
}
```
