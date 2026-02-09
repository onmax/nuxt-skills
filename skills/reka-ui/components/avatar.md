# Avatar

User image with fallback

**Parts:** `AvatarRoot`, `AvatarImage`, `AvatarFallback`

## AvatarRoot

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"span"` |
| `asChild` | `boolean` | - |

## AvatarImage

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"img"` |
| `asChild` | `boolean` | - |
| `referrerPolicy` | `"" \| "no-referrer" \| "no-referrer-when-downgrad...` | - |
| `src`* | `string` | - |

### Emits
| Event | Payload |
|-------|---------|
| `loadingStatusChange` | `[value: ImageLoadingStatus]` |

## AvatarFallback

### Props
| Prop | Type | Default |
|------|------|---------|
| `as` | `AsTag \| Component` | `"span"` |
| `asChild` | `boolean` | - |
| `delayMs` | `number` | `0` |
