## Nuxt UI Primitives

### `ui-primitives-before-custom-markup`: Prefer Nuxt UI primitives before custom markup
**Apply when:** building or fixing page chrome, tables, forms, modals, command palettes, dropdowns, or similar UI.
**Skip when:** the required behavior is genuinely outside the component model.

```vue
<!-- Wrong: hand-built dropdown with custom keyboard and focus handling -->
<button @click="open = !open">Actions</button>
<ul v-if="open" @keydown.esc="open = false">...</ul>
```

```vue
<!-- Right -->
<UDropdownMenu :items="[
  { label: 'Edit', icon: 'i-lucide-pencil', onSelect: edit },
  { label: 'Delete', icon: 'i-lucide-trash', onSelect: remove },
]">
  <UButton label="Actions" />
</UDropdownMenu>
```

**Why:** Nuxt UI tasks often fail because the agent builds something that looks right while bypassing the intended component.
**Verify:** check whether a Nuxt UI component exists for the surface; if one fits, the implementation uses it.

### `ui-current-api-shape-not-lookalike`: Match the current Nuxt UI API shape, not a plausible lookalike
**Apply when:** using existing or newly added Nuxt UI components.
**Skip when:** the project intentionally wraps or replaces the upstream component API.

```vue
<!-- Wrong: older or lookalike API -->
<UModal v-model="open"><UCard>...</UCard></UModal>
<UTable :rows="users" :columns="[{ key: 'email', label: 'Email' }]" />
```

```vue
<!-- Right: current API -->
<UModal v-model:open="open" title="Invite user">
  <template #body>...</template>
</UModal>
<UTable :data="users" :columns="[{ accessorKey: 'email', header: 'Email' }]" />
```

**Why:** Nuxt UI evals mostly catch wrong-but-plausible API memory (old props, slot names, models), not broken UI.
**Verify:** props, `v-model` names, slots, and item/column shapes match the docs for the installed version.

### `ui-page-shells-belong-to-framework-components`: Use framework page-shell components when they exist
**Apply when:** docs pages, marketing shells, dashboards, or app chrome where Nuxt UI has a page primitive.
**Skip when:** the prompt explicitly requires bespoke shell markup.

```vue
<!-- Wrong: <div class="grid ..."><header><h1>{{ page.title }}</h1></header>...</div> -->
<!-- Right: -->
<UPage>
  <UPageHeader :title="page.title" :description="page.description" />
  <UPageBody><ContentRenderer :value="page" /></UPageBody>
  <template #right><UContentToc :links="page.body.toc.links" /></template>
</UPage>
```

**Why:** a polished raw-HTML page is still the wrong answer when the framework expects a Nuxt UI shell (`UPage`, `UPageHero`, `UDashboardPanel`, and similar).
**Verify:** repeated page chrome is expressed through the available shell components and composed around them.
