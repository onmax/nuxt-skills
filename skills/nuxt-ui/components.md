# Components

## Component Catalog

### Core

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `UButton` | Actions, links | `color`, `variant`, `size`, `icon`, `loading`, `to` |
| `ULink` | Navigation links | `to`, `active`, `inactive-class` |
| `UCard` | Content container | `variant` (outline, soft, subtle) |
| `UBadge` | Labels, counts | `color`, `variant`, `size` |
| `UAlert` | Messages | `color`, `icon`, `title`, `description`, `close` |
| `UBanner` | Page-wide notices | `color`, `icon`, `close` |
| `UIcon` | Iconify icons | `name`, `size` |
| `UAvatar` | User images | `src`, `alt`, `size`, `icon` |
| `UAvatarGroup` | Stacked avatars | `size`, `max` |
| `UChip` | Position indicator | `color`, `size`, `position` |
| `UKbd` | Keyboard keys | `value` |
| `USeparator` | Dividers | `orientation`, `label` |
| `USkeleton` | Loading states | `class` (width/height) |

### Layout

| Component | Purpose |
|-----------|---------|
| `UApp` | Root wrapper (required for overlays) |
| `UContainer` | Max-width container |
| `UPage` | Page wrapper |
| `UPageHeader` | Page title section |
| `UPageBody` | Page content area |
| `UPageGrid` | Grid layout |
| `UPageColumns` | Column layout |
| `UHeader` | Site header |
| `UFooter` | Site footer |
| `UMain` | Main content area |

### Navigation

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `UTabs` | Tab navigation | `items`, `orientation`, `variant` |
| `UBreadcrumb` | Path navigation | `items`, `separator-icon` |
| `UNavigationMenu` | Site navigation | `items`, `orientation` |
| `UAccordion` | Collapsible sections | `items`, `multiple` |
| `UCollapsible` | Single collapsible | `open` |
| `UStepper` | Multi-step progress | `items`, `orientation` |
| `UPagination` | Page navigation | `total`, `page`, `page-count` |

### Data Display

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `UTable` | Data tables | `data`, `columns`, `sort`, `selection` |
| `UTree` | Hierarchical data | `items`, `multiple`, `expanded` |
| `UTimeline` | Event sequence | `items` |
| `UCarousel` | Image/content slider | `items`, `arrows`, `dots` |
| `UUser` | User display | `name`, `description`, `avatar` |

### Dashboard

| Component | Purpose |
|-----------|---------|
| `UDashboardSidebar` | Side navigation |
| `UDashboardSidebarToggle` | Mobile toggle |
| `UDashboardSidebarCollapse` | Collapse button |
| `UDashboardNavbar` | Top navigation |
| `UDashboardSearch` | Search overlay |
| `UDashboardSearchButton` | Search trigger |
| `UDashboardPanel` | Content panel |
| `UDashboardToolbar` | Action toolbar |
| `UDashboardGroup` | Section grouping |
| `UDashboardResizeHandle` | Resizable panels |

### Content (Nuxt Content Integration)

| Component | Purpose |
|-----------|---------|
| `UContentNavigation` | Content nav tree |
| `UContentSearch` | Content search |
| `UContentSearchButton` | Search trigger |
| `UContentSurround` | Prev/next links |
| `UContentToc` | Table of contents |

### Color Mode

| Component | Purpose |
|-----------|---------|
| `UColorModeButton` | Toggle button |
| `UColorModeSelect` | Dropdown select |
| `UColorModeSwitch` | Switch toggle |
| `UColorModeImage` | Mode-aware images |
| `UColorModeAvatar` | Mode-aware avatars |

## Common Props Pattern

Most components share these props:

```vue
<UButton
  color="primary"        <!-- Semantic color -->
  variant="solid"        <!-- Style variant: solid, outline, soft, subtle, ghost, link -->
  size="md"              <!-- Size: xs, sm, md, lg, xl -->
  icon="i-heroicons-star"
  :ui="{ base: '...' }" <!-- Theme override -->
  class="..."            <!-- Root class override -->
/>
```

## Slots Pattern

Components expose named slots for customization:

```vue
<UCard>
  <template #header>Card Header</template>
  <template #default>Card Body</template>
  <template #footer>Card Footer</template>
</UCard>

<UAlert>
  <template #icon><MyIcon /></template>
  <template #title>Alert Title</template>
  <template #description>Alert text</template>
  <template #close="{ ui }"><UButton v-bind="ui" /></template>
</UAlert>
```

## Button Examples

```vue
<!-- Basic -->
<UButton>Click me</UButton>

<!-- With icon -->
<UButton icon="i-heroicons-plus">Add</UButton>

<!-- Icon only -->
<UButton icon="i-heroicons-trash" variant="ghost" color="error" />

<!-- Loading -->
<UButton :loading="isLoading">Save</UButton>

<!-- As link -->
<UButton to="/about">About</UButton>

<!-- External link -->
<UButton to="https://example.com" target="_blank">External</UButton>
```

## Card Examples

```vue
<UCard>
  <template #header>
    <h3 class="text-lg font-semibold">Title</h3>
  </template>
  <p>Card content</p>
  <template #footer>
    <UButton>Action</UButton>
  </template>
</UCard>

<!-- Variants -->
<UCard variant="outline">Outlined</UCard>
<UCard variant="soft">Soft background</UCard>
<UCard variant="subtle">Subtle</UCard>
```

## Table Example

```vue
<script setup>
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'actions', label: '' }
]
const data = [
  { name: 'John', email: 'john@example.com' },
  { name: 'Jane', email: 'jane@example.com' }
]
</script>

<template>
  <UTable :data="data" :columns="columns">
    <template #actions-cell="{ row }">
      <UButton size="xs" variant="ghost" icon="i-heroicons-pencil" />
    </template>
  </UTable>
</template>
```

## Tabs Example

```vue
<script setup>
const items = [
  { label: 'Account', icon: 'i-heroicons-user', slot: 'account' },
  { label: 'Password', icon: 'i-heroicons-lock-closed', slot: 'password' }
]
</script>

<template>
  <UTabs :items="items">
    <template #account>Account settings...</template>
    <template #password>Password settings...</template>
  </UTabs>
</template>
```

## Icon Usage

Uses Iconify. Default collections: Heroicons, Lucide.

```vue
<UIcon name="i-heroicons-home" />
<UIcon name="i-lucide-settings" class="size-6" />

<!-- In components -->
<UButton icon="i-heroicons-plus">Add</UButton>
<UAlert icon="i-heroicons-exclamation-triangle" />
```

Browse icons: [icones.js.org](https://icones.js.org)

## Best Practices

| Do | Don't |
|----|-------|
| Use semantic `color` prop | Hardcode colors in classes |
| Use `variant` for style differences | Create custom button styles |
| Use `size` prop consistently | Mix size utilities manually |
| Use `:ui` for theme overrides | Override with `!important` |
| Use slots for custom content | Wrap components unnecessarily |
