# Components

> Auto-generated. Run `npx tsx skills/reka-ui/scripts/generate-components.ts` to update.

## Form

| Component       | Description                                 | File                         |
| --------------- | ------------------------------------------- | ---------------------------- |
| **checkbox**    | Selection control with indeterminate state  | `components/checkbox.md`     |
| **combobox**    | Searchable dropdown with filtering          | `components/combobox.md`     |
| **editable**    | Inline text editing with preview/edit modes | `components/editable.md`     |
| **label**       | Accessible form label                       | `components/label.md`        |
| **listbox**     | Accessible list selection                   | `components/listbox.md`      |
| **numberField** | Numeric input with increment/decrement      | `components/number-field.md` |
| **pinInput**    | Multi-character code entry (OTP)            | `components/pin-input.md`    |
| **radioGroup**  | Mutually exclusive selection                | `components/radio-group.md`  |
| **select**      | Dropdown selection with grouping            | `components/select.md`       |
| **slider**      | Range input control                         | `components/slider.md`       |
| **switch**      | Toggle between two states                   | `components/switch.md`       |
| **tagsInput**   | Multiple tag entry and management           | `components/tags-input.md`   |
| **toggle**      | Single state button toggle                  | `components/toggle.md`       |
| **toggleGroup** | Multiple toggles with group behavior        | `components/toggle-group.md` |

## Date

| Component           | Description                       | File                              |
| ------------------- | --------------------------------- | --------------------------------- |
| **calendar**        | Date selection grid (alpha)       | `components/calendar.md`          |
| **dateField**       | Date input field (alpha)          | `components/date-field.md`        |
| **datePicker**      | Date picker with calendar (alpha) | `components/date-picker.md`       |
| **dateRangeField**  | Date range input (alpha)          | `components/date-range-field.md`  |
| **dateRangePicker** | Date range picker (alpha)         | `components/date-range-picker.md` |
| **rangeCalendar**   | Calendar for date ranges (alpha)  | `components/range-calendar.md`    |
| **timeField**       | Time input field (alpha)          | `components/time-field.md`        |

## Disclosure

| Component       | Description                  | File                        |
| --------------- | ---------------------------- | --------------------------- |
| **accordion**   | Collapsible content sections | `components/accordion.md`   |
| **collapsible** | Single collapsible panel     | `components/collapsible.md` |

## Overlay

| Component       | Description                   | File                         |
| --------------- | ----------------------------- | ---------------------------- |
| **alertDialog** | Modal dialog requiring action | `components/alert-dialog.md` |
| **dialog**      | Modal dialog                  | `components/dialog.md`       |
| **hoverCard**   | Card shown on hover           | `components/hover-card.md`   |
| **popover**     | Floating content panel        | `components/popover.md`      |
| **tooltip**     | Informational hover tip       | `components/tooltip.md`      |
| **toast**       | Temporary notifications       | `components/toast.md`        |

## Menu

| Component          | Description              | File                            |
| ------------------ | ------------------------ | ------------------------------- |
| **contextMenu**    | Right-click context menu | `components/context-menu.md`    |
| **dropdownMenu**   | Dropdown action menu     | `components/dropdown-menu.md`   |
| **menubar**        | Horizontal menu bar      | `components/menubar.md`         |
| **navigationMenu** | Site navigation menu     | `components/navigation-menu.md` |

## Data

| Component      | Description                   | File                        |
| -------------- | ----------------------------- | --------------------------- |
| **avatar**     | User image with fallback      | `components/avatar.md`      |
| **pagination** | Page navigation               | `components/pagination.md`  |
| **progress**   | Progress indicator            | `components/progress.md`    |
| **rating**     | Star rating input (v2.8.0)    | `components/rating.md`      |
| **scrollArea** | Custom scrollbar container    | `components/scroll-area.md` |
| **separator**  | Visual divider                | `components/separator.md`   |
| **splitter**   | Resizable split panels        | `components/splitter.md`    |
| **stepper**    | Multi-step progress indicator | `components/stepper.md`     |
| **tabs**       | Tabbed content panels         | `components/tabs.md`        |
| **tree**       | Hierarchical tree view        | `components/tree.md`        |

## Layout

| Component       | Description                  | File                         |
| --------------- | ---------------------------- | ---------------------------- |
| **aspectRatio** | Maintain aspect ratio        | `components/aspect-ratio.md` |
| **toolbar**     | Toolbar with buttons/toggles | `components/toolbar.md`      |

## Utility

| Component          | Description                | File                            |
| ------------------ | -------------------------- | ------------------------------- |
| **configProvider** | Global config context      | `components/config-provider.md` |
| **focusScope**     | Focus trap container       | `components/focus-scope.md`     |
| **presence**       | Animation presence control | `components/presence.md`        |
| **primitive**      | Base element wrapper       | `components/primitive.md`       |
| **visuallyHidden** | Screen reader only content | `components/visually-hidden.md` |

## Composables

| Composable             | Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `useEmitAsProps`       | Convert emit functions to props for passing to child components    |
| `useFilter`            | Filter items based on search query with customizable matching      |
| `useForwardProps`      | Forward props to child components while filtering out handled ones |
| `useForwardPropsEmits` | Combine useForwardProps and useEmitAsProps                         |
| `useForwardExpose`     | Forward exposed methods/refs from child components                 |
| `useId`                | Generate unique IDs for accessibility attributes                   |
| `useDateFormatter`     | Format dates with locale support                                   |
| `useDirection`         | Get/set text direction (ltr/rtl)                                   |
| `useLocale`            | Get/set locale for internationalization                            |
