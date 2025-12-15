#!/usr/bin/env npx tsx
/**
 * Generates reka-ui component docs from GitHub meta files
 * Run: npx tsx skills/reka-ui/scripts/generate-components.ts
 *
 * Creates:
 *   - components.md (index)
 *   - components/<group>.md (per-group details)
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = 'unovue/reka-ui'
const BRANCH = 'main'
const BASE_URL = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`

interface PropMeta { name: string, description: string, type: string, required: boolean, default?: string }
interface EmitMeta { name: string, description: string, type: string }
interface SlotMeta { name: string, description: string, type: string }

const COMPONENT_GROUPS: Record<string, { category: string, description: string, components: string[] }> = {
  checkbox: { category: 'Form', description: 'Selection control with indeterminate state', components: ['CheckboxGroupRoot', 'CheckboxRoot', 'CheckboxIndicator'] },
  combobox: { category: 'Form', description: 'Searchable dropdown with filtering', components: ['ComboboxRoot', 'ComboboxInput', 'ComboboxAnchor', 'ComboboxTrigger', 'ComboboxContent', 'ComboboxViewport', 'ComboboxItem', 'ComboboxItemIndicator', 'ComboboxGroup', 'ComboboxLabel', 'ComboboxEmpty', 'ComboboxSeparator', 'ComboboxArrow', 'ComboboxPortal', 'ComboboxCancel', 'ComboboxVirtualizer'] },
  editable: { category: 'Form', description: 'Inline text editing with preview/edit modes', components: ['EditableRoot', 'EditableArea', 'EditableInput', 'EditablePreview', 'EditableSubmitTrigger', 'EditableCancelTrigger', 'EditableEditTrigger'] },
  label: { category: 'Form', description: 'Accessible form label', components: ['Label'] },
  listbox: { category: 'Form', description: 'Accessible list selection', components: ['ListboxRoot', 'ListboxContent', 'ListboxFilter', 'ListboxItem', 'ListboxItemIndicator', 'ListboxGroup', 'ListboxGroupLabel', 'ListboxVirtualizer'] },
  numberField: { category: 'Form', description: 'Numeric input with increment/decrement', components: ['NumberFieldRoot', 'NumberFieldInput', 'NumberFieldIncrement', 'NumberFieldDecrement'] },
  pinInput: { category: 'Form', description: 'Multi-character code entry (OTP)', components: ['PinInputRoot', 'PinInputInput'] },
  radioGroup: { category: 'Form', description: 'Mutually exclusive selection', components: ['RadioGroupRoot', 'RadioGroupItem', 'RadioGroupIndicator'] },
  select: { category: 'Form', description: 'Dropdown selection with grouping', components: ['SelectRoot', 'SelectTrigger', 'SelectPortal', 'SelectContent', 'SelectViewport', 'SelectItem', 'SelectItemText', 'SelectItemIndicator', 'SelectGroup', 'SelectLabel', 'SelectSeparator', 'SelectArrow', 'SelectScrollUpButton', 'SelectScrollDownButton', 'SelectValue', 'SelectIcon'] },
  slider: { category: 'Form', description: 'Range input control', components: ['SliderRoot', 'SliderTrack', 'SliderRange', 'SliderThumb'] },
  switch: { category: 'Form', description: 'Toggle between two states', components: ['SwitchRoot', 'SwitchThumb'] },
  tagsInput: { category: 'Form', description: 'Multiple tag entry and management', components: ['TagsInputRoot', 'TagsInputInput', 'TagsInputItem', 'TagsInputItemText', 'TagsInputItemDelete', 'TagsInputClear'] },
  toggle: { category: 'Form', description: 'Single state button toggle', components: ['Toggle'] },
  toggleGroup: { category: 'Form', description: 'Multiple toggles with group behavior', components: ['ToggleGroupRoot', 'ToggleGroupItem'] },

  calendar: { category: 'Date', description: 'Date selection grid (alpha)', components: ['CalendarRoot', 'CalendarHeader', 'CalendarHeading', 'CalendarGrid', 'CalendarGridHead', 'CalendarGridBody', 'CalendarGridRow', 'CalendarCell', 'CalendarCellTrigger', 'CalendarHeadCell', 'CalendarNext', 'CalendarPrev'] },
  dateField: { category: 'Date', description: 'Date input field (alpha)', components: ['DateFieldRoot', 'DateFieldInput'] },
  datePicker: { category: 'Date', description: 'Date picker with calendar (alpha)', components: ['DatePickerRoot', 'DatePickerField', 'DatePickerInput', 'DatePickerTrigger', 'DatePickerContent', 'DatePickerCalendar', 'DatePickerHeader', 'DatePickerHeading', 'DatePickerGrid', 'DatePickerCell', 'DatePickerCellTrigger', 'DatePickerNext', 'DatePickerPrev', 'DatePickerAnchor', 'DatePickerArrow', 'DatePickerClose'] },
  dateRangeField: { category: 'Date', description: 'Date range input (alpha)', components: ['DateRangeFieldRoot', 'DateRangeFieldInput'] },
  dateRangePicker: { category: 'Date', description: 'Date range picker (alpha)', components: ['DateRangePickerRoot', 'DateRangePickerField', 'DateRangePickerInput', 'DateRangePickerTrigger', 'DateRangePickerContent', 'DateRangePickerCalendar', 'DateRangePickerHeader', 'DateRangePickerHeading', 'DateRangePickerGrid', 'DateRangePickerCell', 'DateRangePickerCellTrigger', 'DateRangePickerNext', 'DateRangePickerPrev'] },
  rangeCalendar: { category: 'Date', description: 'Calendar for date ranges (alpha)', components: ['RangeCalendarRoot', 'RangeCalendarHeader', 'RangeCalendarHeading', 'RangeCalendarGrid', 'RangeCalendarCell', 'RangeCalendarCellTrigger', 'RangeCalendarNext', 'RangeCalendarPrev'] },
  timeField: { category: 'Date', description: 'Time input field (alpha)', components: ['TimeFieldRoot', 'TimeFieldInput'] },

  accordion: { category: 'Disclosure', description: 'Collapsible content sections', components: ['AccordionRoot', 'AccordionItem', 'AccordionHeader', 'AccordionTrigger', 'AccordionContent'] },
  collapsible: { category: 'Disclosure', description: 'Single collapsible panel', components: ['CollapsibleRoot', 'CollapsibleTrigger', 'CollapsibleContent'] },

  alertDialog: { category: 'Overlay', description: 'Modal dialog requiring action', components: ['AlertDialogRoot', 'AlertDialogTrigger', 'AlertDialogPortal', 'AlertDialogOverlay', 'AlertDialogContent', 'AlertDialogTitle', 'AlertDialogDescription', 'AlertDialogCancel', 'AlertDialogAction'] },
  dialog: { category: 'Overlay', description: 'Modal dialog', components: ['DialogRoot', 'DialogTrigger', 'DialogPortal', 'DialogOverlay', 'DialogContent', 'DialogTitle', 'DialogDescription', 'DialogClose'] },
  hoverCard: { category: 'Overlay', description: 'Card shown on hover', components: ['HoverCardRoot', 'HoverCardTrigger', 'HoverCardPortal', 'HoverCardContent', 'HoverCardArrow'] },
  popover: { category: 'Overlay', description: 'Floating content panel', components: ['PopoverRoot', 'PopoverTrigger', 'PopoverPortal', 'PopoverContent', 'PopoverArrow', 'PopoverClose', 'PopoverAnchor'] },
  tooltip: { category: 'Overlay', description: 'Informational hover tip', components: ['TooltipProvider', 'TooltipRoot', 'TooltipTrigger', 'TooltipPortal', 'TooltipContent', 'TooltipArrow'] },
  toast: { category: 'Overlay', description: 'Temporary notifications', components: ['ToastProvider', 'ToastRoot', 'ToastViewport', 'ToastTitle', 'ToastDescription', 'ToastAction', 'ToastClose', 'ToastPortal'] },

  contextMenu: { category: 'Menu', description: 'Right-click context menu', components: ['ContextMenuRoot', 'ContextMenuTrigger', 'ContextMenuPortal', 'ContextMenuContent', 'ContextMenuItem', 'ContextMenuCheckboxItem', 'ContextMenuRadioGroup', 'ContextMenuRadioItem', 'ContextMenuItemIndicator', 'ContextMenuLabel', 'ContextMenuGroup', 'ContextMenuSeparator', 'ContextMenuSub', 'ContextMenuSubTrigger', 'ContextMenuSubContent', 'ContextMenuArrow'] },
  dropdownMenu: { category: 'Menu', description: 'Dropdown action menu', components: ['DropdownMenuRoot', 'DropdownMenuTrigger', 'DropdownMenuPortal', 'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuCheckboxItem', 'DropdownMenuRadioGroup', 'DropdownMenuRadioItem', 'DropdownMenuItemIndicator', 'DropdownMenuLabel', 'DropdownMenuGroup', 'DropdownMenuSeparator', 'DropdownMenuSub', 'DropdownMenuSubTrigger', 'DropdownMenuSubContent', 'DropdownMenuArrow'] },
  menubar: { category: 'Menu', description: 'Horizontal menu bar', components: ['MenubarRoot', 'MenubarMenu', 'MenubarTrigger', 'MenubarPortal', 'MenubarContent', 'MenubarItem', 'MenubarCheckboxItem', 'MenubarRadioGroup', 'MenubarRadioItem', 'MenubarItemIndicator', 'MenubarLabel', 'MenubarGroup', 'MenubarSeparator', 'MenubarSub', 'MenubarSubTrigger', 'MenubarSubContent', 'MenubarArrow'] },
  navigationMenu: { category: 'Menu', description: 'Site navigation menu', components: ['NavigationMenuRoot', 'NavigationMenuList', 'NavigationMenuItem', 'NavigationMenuTrigger', 'NavigationMenuContent', 'NavigationMenuLink', 'NavigationMenuIndicator', 'NavigationMenuViewport', 'NavigationMenuSub'] },

  avatar: { category: 'Data', description: 'User image with fallback', components: ['AvatarRoot', 'AvatarImage', 'AvatarFallback'] },
  pagination: { category: 'Data', description: 'Page navigation', components: ['PaginationRoot', 'PaginationList', 'PaginationListItem', 'PaginationFirst', 'PaginationPrev', 'PaginationNext', 'PaginationLast', 'PaginationEllipsis'] },
  progress: { category: 'Data', description: 'Progress indicator', components: ['ProgressRoot', 'ProgressIndicator'] },
  scrollArea: { category: 'Data', description: 'Custom scrollbar container', components: ['ScrollAreaRoot', 'ScrollAreaViewport', 'ScrollAreaScrollbar', 'ScrollAreaThumb', 'ScrollAreaCorner'] },
  separator: { category: 'Data', description: 'Visual divider', components: ['Separator'] },
  splitter: { category: 'Data', description: 'Resizable split panels', components: ['SplitterGroup', 'SplitterPanel', 'SplitterResizeHandle'] },
  stepper: { category: 'Data', description: 'Multi-step progress indicator', components: ['StepperRoot', 'StepperItem', 'StepperTrigger', 'StepperTitle', 'StepperDescription', 'StepperIndicator', 'StepperSeparator'] },
  tabs: { category: 'Data', description: 'Tabbed content panels', components: ['TabsRoot', 'TabsList', 'TabsTrigger', 'TabsContent', 'TabsIndicator'] },
  tree: { category: 'Data', description: 'Hierarchical tree view', components: ['TreeRoot', 'TreeItem', 'TreeVirtualizer'] },

  aspectRatio: { category: 'Layout', description: 'Maintain aspect ratio', components: ['AspectRatio'] },
  toolbar: { category: 'Layout', description: 'Toolbar with buttons/toggles', components: ['ToolbarRoot', 'ToolbarButton', 'ToolbarLink', 'ToolbarToggleGroup', 'ToolbarToggleItem', 'ToolbarSeparator'] },
  configProvider: { category: 'Utility', description: 'Global config context', components: ['ConfigProvider'] },
  focusScope: { category: 'Utility', description: 'Focus trap container', components: ['FocusScope'] },
  presence: { category: 'Utility', description: 'Animation presence control', components: ['Presence'] },
  primitive: { category: 'Utility', description: 'Base element wrapper', components: ['Primitive', 'Slot'] },
  visuallyHidden: { category: 'Utility', description: 'Screen reader only content', components: ['VisuallyHidden'] },
}

const COMPOSABLES = [
  { name: 'useEmitAsProps', description: 'Convert emit functions to props for passing to child components' },
  { name: 'useFilter', description: 'Filter items based on search query with customizable matching' },
  { name: 'useForwardProps', description: 'Forward props to child components while filtering out handled ones' },
  { name: 'useForwardPropsEmits', description: 'Combine useForwardProps and useEmitAsProps' },
  { name: 'useForwardExpose', description: 'Forward exposed methods/refs from child components' },
  { name: 'useId', description: 'Generate unique IDs for accessibility attributes' },
  { name: 'useDateFormatter', description: 'Format dates with locale support' },
  { name: 'useDirection', description: 'Get/set text direction (ltr/rtl)' },
  { name: 'useLocale', description: 'Get/set locale for internationalization' },
]

async function fetchMeta(componentName: string): Promise<{ props: PropMeta[], emits: EmitMeta[], slots: SlotMeta[] }> {
  const url = `${BASE_URL}/docs/content/meta/${componentName}.md`
  try {
    const res = await fetch(url)
    if (!res.ok)
      return { props: [], emits: [], slots: [] }
    const text = await res.text()
    return parseMeta(text)
  }
  catch { return { props: [], emits: [], slots: [] } }
}

function parseMeta(content: string): { props: PropMeta[], emits: EmitMeta[], slots: SlotMeta[] } {
  const props: PropMeta[] = []
  const emits: EmitMeta[] = []
  const slots: SlotMeta[] = []
  const propsMatch = content.match(/<PropsTable\s+:data="(\[[\s\S]*?\])"\s*\/>/)
  const emitsMatch = content.match(/<EmitsTable\s+:data="(\[[\s\S]*?\])"\s*\/>/)
  const slotsMatch = content.match(/<SlotsTable\s+:data="(\[[\s\S]*?\])"\s*\/>/)
  if (propsMatch) {
    try {
      props.push(...JSON.parse(propsMatch[1].replace(/'/g, '"')))
    }
    catch {}
  }
  if (emitsMatch) {
    try {
      emits.push(...JSON.parse(emitsMatch[1].replace(/'/g, '"')))
    }
    catch {}
  }
  if (slotsMatch) {
    try {
      slots.push(...JSON.parse(slotsMatch[1].replace(/'/g, '"')))
    }
    catch {}
  }
  return { props, emits, slots }
}

const escapeMarkdown = (str: string) => str.replace(/\|/g, '\\|').replace(/\n/g, ' ')

function truncateType(type: string, max = 50) {
  const c = type.replace(/\s+/g, ' ').trim()
  return c.length > max ? `${c.slice(0, max - 3)}...` : c
}
const toKebab = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

async function generateGroupFile(groupName: string, group: { category: string, description: string, components: string[] }): Promise<string> {
  const lines: string[] = []
  const title = groupName.charAt(0).toUpperCase() + groupName.slice(1).replace(/([A-Z])/g, ' $1').trim()
  lines.push(`# ${title}`)
  lines.push('')
  lines.push(group.description)
  lines.push('')
  lines.push(`**Parts:** ${group.components.map(c => `\`${c}\``).join(', ')}`)
  lines.push('')

  for (const comp of group.components) {
    const meta = await fetchMeta(comp)
    if (meta.props.length === 0 && meta.emits.length === 0 && meta.slots.length === 0)
      continue

    lines.push(`## ${comp}`)
    lines.push('')

    if (meta.props.length > 0) {
      lines.push('### Props')
      lines.push('| Prop | Type | Default |')
      lines.push('|------|------|---------|')
      for (const p of meta.props) {
        const type = escapeMarkdown(truncateType(p.type))
        const def = p.default ? `\`${escapeMarkdown(p.default)}\`` : '-'
        lines.push(`| \`${p.name}\`${p.required ? '*' : ''} | \`${type}\` | ${def} |`)
      }
      lines.push('')
    }

    if (meta.emits.length > 0) {
      lines.push('### Emits')
      lines.push('| Event | Payload |')
      lines.push('|-------|---------|')
      for (const e of meta.emits) {
        lines.push(`| \`${e.name}\` | \`${escapeMarkdown(truncateType(e.type))}\` |`)
      }
      lines.push('')
    }

    if (meta.slots.length > 0) {
      lines.push('### Slots')
      lines.push('| Slot | Type |')
      lines.push('|------|------|')
      for (const s of meta.slots) {
        lines.push(`| \`${s.name}\` | \`${escapeMarkdown(truncateType(s.type))}\` |`)
      }
      lines.push('')
    }
  }
  return lines.join('\n')
}

async function main() {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const baseDir = join(__dirname, '..')
  const componentsDir = join(baseDir, 'components')
  mkdirSync(componentsDir, { recursive: true })

  console.log('Generating Reka UI component docs...')

  // Generate index
  const index: string[] = []
  index.push('# Components')
  index.push('')
  index.push('> Auto-generated. Run `npx tsx skills/reka-ui/scripts/generate-components.ts` to update.')
  index.push('')

  const categories: Record<string, string[]> = {}
  for (const [name, group] of Object.entries(COMPONENT_GROUPS)) {
    if (!categories[group.category])
      categories[group.category] = []
    categories[group.category].push(name)
  }

  for (const [cat, groupNames] of Object.entries(categories)) {
    index.push(`## ${cat}`)
    index.push('')
    index.push('| Component | Description | File |')
    index.push('|-----------|-------------|------|')
    for (const name of groupNames) {
      const g = COMPONENT_GROUPS[name]
      const file = `components/${toKebab(name)}.md`
      index.push(`| **${name}** | ${g.description} | \`${file}\` |`)
    }
    index.push('')
  }

  index.push('## Composables')
  index.push('')
  index.push('| Composable | Description |')
  index.push('|------------|-------------|')
  for (const c of COMPOSABLES) {
    index.push(`| \`${c.name}\` | ${c.description} |`)
  }
  index.push('')

  writeFileSync(join(baseDir, 'components.md'), index.join('\n'))
  console.log('✓ Generated components.md (index)')

  // Generate per-group files
  for (const [name, group] of Object.entries(COMPONENT_GROUPS)) {
    const content = await generateGroupFile(name, group)
    const filename = `${toKebab(name)}.md`
    writeFileSync(join(componentsDir, filename), content)
    console.log(`✓ Generated components/${filename}`)
  }

  console.log(`\nDone! Generated ${Object.keys(COMPONENT_GROUPS).length + 1} files.`)
}

main().catch(console.error)
