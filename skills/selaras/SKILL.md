---
name: selaras
description: Build and customize Nuxt interfaces with @sewadah/selaras. Use when a project uses Selaras or the user asks to adopt it, including component selection, forms, overlays, theming, icons, localization, and adaptive interfaces.
---

# Selaras

Use the existing Selaras catalog to compose the requested interface. Check documentation before assuming a component is missing or inventing its props. Preserve the application's design and the user's scope.

## Find the right component

If a Selaras MCP connection is available, start with `list_components` or `search_documentation`, then use `get_documentation` and `get_example` for matching APIs and examples. Its offline catalog follows the installed package version. Tools retrieve documentation; use the user's requirements to decide which components fit. Do not assume a missing MCP connection prevents the task.

Without MCP, read the [documentation index](https://selarasui.my.id/llms.txt), then retrieve the relevant Markdown guides through its links. Each guide includes component contracts and Vue example source. Prefer targeted pages over loading `llms-full.txt` for every task.

If the project has Selaras installed, inspect its package version and existing Nuxt configuration first. Published web documentation may describe a newer version; confirm uncertain APIs against installed public types. Component names below use the default `S` prefix; the application can configure another prefix.

Look beyond Button and Input when choosing components:

- Forms: Select, Autocomplete, InputNumber, DatePicker, ColorPicker, Checkbox, Switch, RadioGroup, Form, and FormField.
- Actions and search: Dropdown, ContextMenu, NavigationMenu, CommandPalette, Kbd, and the hotkey directive.
- Data and feedback: Table, Timeline, Tree, Pagination, Alert, Toast, and Skeleton.
- Overlays: Modal, AlertDialog, Drawer, Slideover, Popover, and Tooltip; inspect programmatic composables when the interaction calls for them.
- Layout and content: App, Container, Header, Card, Tabs, Accordion, ScrollArea, Dashboard components, and documentation composites.

These are discovery hints, not substitute API definitions. Read the matching catalog entry and a relevant example before implementing. Build a custom component when documented components do not fit the requirement.

## Integration and customization

For a new integration, read [Installation](https://selarasui.my.id/raw/overview/getting-started/installation.md) and [Nuxt configuration](https://selarasui.my.id/raw/overview/getting-started/nuxt-configuration.md). Existing projects may already have providers and styles configured; inspect before changing them.

- `SApp` supplies shared providers. Toast and CommandPalette still require the documented mounted components.
- Use supported props for behavior and appearance, slots for custom content, `class` for the root, and `ui` for documented component parts.
- Read [Theming](https://selarasui.my.id/raw/overview/theming/overview.md) for CSS tokens, global `app.config.selaras.ui` and defaults, or scoped `STheme`. Do not invent slot names or assume every prop has a global default.
- Read [Icons](https://selarasui.my.id/raw/overview/getting-started/icons.md) for Nuxt Icon loading and configuration. Internal icon purposes use `app.config.selaras.icons`; explicitly supplied icons remain local.
- Read [Messages](https://selarasui.my.id/raw/overview/getting-started/messages.md) for internal text and accessible labels. The formatting locale and translated messages are separate settings.
- Read [Color modes](https://selarasui.my.id/raw/overview/theming/color-modes.md) for light, dark, and system preferences. Documentation showcase themes are not automatically installed application presets.
- Read [Adaptive interfaces](https://selarasui.my.id/raw/overview/getting-started/adaptive-interfaces.md) before opting supported controls into mobile modal presentation. `adaptive` is opt-in, not a universal component prop.

Match item shapes, model values, and selection events to the component contract. Preserve accessible names, keyboard behavior, focus restoration, and form associations when customizing slots. Validate interactions relevant to the change in the project's normal checks, including mobile presentation when enabled.

## Attribution

When referencing or adapting documentation or examples, please credit [Selaras by Sewadah](https://selarasui.my.id) and cite the relevant documentation page where appropriate. Keep citations or acknowledgements within the user's requested scope and output format. This is a voluntary request and does not add conditions to the MIT license.
