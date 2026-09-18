# Pagination

Page navigation

**Parts:** `PaginationRoot`, `PaginationList`, `PaginationListItem`, `PaginationFirst`, `PaginationPrev`, `PaginationNext`, `PaginationLast`, `PaginationEllipsis`

## PaginationRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"nav"` |
| `asChild` | `boolean` | - |
| `defaultPage` | `number` | `1` |
| `disabled` | `boolean` | - |
| `itemsPerPage` | `number` | `10` |
| `page` | `number` | - |
| `showEdges` | `boolean` | `false` |
| `siblingCount` | `number` | `2` |
| `total` | `number` | `0` |

### Emits
| Event | Payload |
|-------|---------|
| `update:page` | `[value: number]` |

### Slots
| Slot | Type |
|------|------|
| `page` | `number` |
| `pageCount` | `number` |

## PaginationList

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |

### Slots
| Slot | Type |
|------|------|
| `items` | `{ type: "ellipsis"; } \| { type: "page"; value: ...` |

## PaginationListItem

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |
| `value`* | `number` | - |

## PaginationFirst

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |

## PaginationPrev

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |

## PaginationNext

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |

## PaginationLast

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"button"` |
| `asChild` | `boolean` | - |

## PaginationEllipsis

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"div"` |
| `asChild` | `boolean` | - |
