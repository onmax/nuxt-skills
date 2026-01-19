# useFullscreen

Reactive Fullscreen API. It adds methods to present a specific Element (and its descendants) in full-screen mode, and to exit full-screen mode once it is no longer needed. This makes it possible to present desired content—such as an online game—using the user's entire screen, removing all browser user interface elements and other applications from the screen until full-screen mode is shut off.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, enter, exit, toggle } = useFullscreen()
```

## Reference

[VueUse Docs](https://vueuse.org/core/useFullscreen/)
