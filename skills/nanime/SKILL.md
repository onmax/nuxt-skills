---
name: nanime
description: |
  Build animations in a Nuxt app with nanime, the Nuxt module wrapping Anime.js v4.
  Use when animating elements, text, SVG or scroll in Nuxt: useAnimate, useWaapiAnimate,
  useAnimatable, useAnimeTimeline, useDraggable, useSplitText, useScrambleText,
  useAnimeScroll, useAnimeLayout, <AnimeTransition>, <AnimeTransitionGroup>,
  <AnimeLayoutGroup>, transition styles, component defaults, provideAnimeDefaults and
  the #nanime/* aliases. Also use when an effect seems to need raw animejs, GSAP or CSS
  transition classes. Most mistakes here do not throw; they animate the wrong thing.
---

# nanime

The composables own an Anime.js instance, rebuild it when reactive inputs
change, and revert it on unmount. They wait for mount, so they are SSR-safe.
Composables and components are auto-imported and auto-registered.

Don't drop to `onMounted` with raw `animejs` imports, and don't reach for GSAP
or transition CSS. The effect almost always has a nanime path.

## Pick the tool

| Building | Use | Details |
|---|---|---|
| Animating elements, refs, arrays, plain objects | `useAnimate` (`useWaapiAnimate` for the Web Animations API) | |
| Values set imperatively at speed (cursor follow, live counter) | `useAnimatable` | |
| Sequencing | `useAnimeTimeline` | [timelines.md](references/timelines.md) |
| Scroll-driven animation | `useAnimeScroll` | [timelines.md](references/timelines.md) |
| Text split into lines, words, chars | `useSplitText` | [timelines.md](references/timelines.md) |
| Scrambling or revealing text | `useScrambleText` | |
| SVG draw, morph, motion path | `#nanime/proxies/svg` inside a composable | [timelines.md](references/timelines.md) |
| Dragging with snap, bounds, axis locks | `useDraggable` | [lists.md](references/lists.md) for draggable list items |
| `v-if` / `v-show` / keyed enter and leave, crossfades | `<AnimeTransition>` | [transitions.md](references/transitions.md) |
| `v-for` add, remove, reorder, stagger | `<AnimeTransitionGroup>` | [transitions.md](references/transitions.md), [lists.md](references/lists.md) |
| Mounted elements changing position or size (FLIP) | `<AnimeLayoutGroup>`, or `useAnimeLayout` to `await` it | [layout.md](references/layout.md) |
| Testing an animation without a browser | | [verifying.md](references/verifying.md) |

For an Anime.js parameter, return shape or util, read
https://animejs.com/documentation. nanime passes those through unchanged.
For nanime's own API, read https://nanimejs.netlify.app/llms-full.txt or query
the docs MCP server at https://nanimejs.netlify.app/mcp.

## Aliases

Not auto-imported. Import helpers from these, never from `animejs` directly.

| Alias | Holds |
|---|---|
| `#nanime/types` | Anime.js types (`AnimationParams`, `JSAnimation`, …) and `AnimeTransitionStyle` |
| `#nanime/utils` | Anime.js utils (`stagger`, `random`, `set`, …), plus `animate` and `createTimer` for handler code |
| `#nanime/easings` | `spring`, `cubicBezier`, `steps`, … |
| `#nanime/proxies/svg` | `createMotionPath`, `createDrawable`, `morphTo` |
| `#nanime/proxies/text` | `scrambleText`, for use inside animation parameters |
| `#nanime/proxies` | Both of the above |

## Rules

Each of these fails without an error.

### Parameters that read a template ref must be a getter

```ts
useAnimeScroll(() => ({ target: section.value ?? undefined }))   // correct
useAnimeScroll({ target: section.value })                        // silently wrong
```

A template ref is `null` during setup. A plain object is read once, then, so
Anime.js falls back to a default, such as watching `document.body` instead of
your element. A getter is read again once the element exists.

Read `.value` yourself: Anime.js does not unwrap Vue refs inside parameters.
Template refs are `T | null` while most params take `T | undefined`, so use
`?? undefined`, not a cast.

### Call composables only in `setup`

```ts
function onClick() {
  useAnimate(box, { x: 100 })   // leaks: no effect scope, never reverted
}
```

From a handler or per-frame callback, use `animate` from `#nanime/utils` and
own the handle:

```ts
import { animate } from '#nanime/utils'
import type { JSAnimation } from '#nanime/types'

const pulse = shallowRef<JSAnimation | null>(null)
onScopeDispose(() => pulse.value?.revert())

function highlight(el: HTMLElement) {
  pulse.value?.revert()
  pulse.value = animate(el, { scale: [1, 1.1, 1], duration: 400 })
}
```

Code of your own that reads an element must also wait for mount.

### Pass composable returns straight in

nanime unwraps a composable's return value to its Anime.js instance, in
parameters and in a timeline's `sync()`:

```ts
const scroll = useAnimeScroll(() => ({ target: section.value ?? undefined, sync: true }))
useAnimate(box, { x: 400, autoplay: scroll })
```

One scroll observer drives one animation. Handing it to a second animation
steals it from the first, which freezes. Call `useAnimeScroll` once per
animation; observers with the same params stay in step.

### Live values do not tick in a template

`{{ animation.progress }}` never updates; the return value tracks the
instance, not the numbers inside it. Copy the value out from a callback:

```ts
const progress = ref(0)
useAnimate(box, { x: 400, onUpdate: self => progress.value = self.progress })
```

### Text a composable rewrites must not re-render

`useScrambleText` and `useSplitText` write into the element. If Vue also
renders the changing value there, they overwrite each other. Render the first
value once and hand changes to the composable:

```vue
<script setup lang="ts">
useScrambleText(title, {}, () => ({ text: track.value.title }))
</script>

<template>
  <h2 ref="title" v-once>{{ track.title }}</h2>
</template>
```

For `useSplitText`, keep `v-once` and pass the new text through its `html`
option.

### Scramble timing goes in the third argument

AnimeJS `scrambleText()` sets its own `duration`, `delay` and `ease`, so the
same keys in `useScrambleText`'s second argument are ignored. Keep the second
argument for playback and callbacks:

```ts
useScrambleText(title, { onComplete: next }, () => ({ text: text.value, duration: 2000 }))
```

### Give list and layout groups `deps`

Without `deps`, `<AnimeTransitionGroup>` and `<AnimeLayoutGroup>` measure
every element inside them on each re-render, even when nothing moved. A
parent that passes a new object or array prop on every render re-renders
them each time. Pass `deps` by default:

```vue
<AnimeTransitionGroup :deps="[]">       <!-- moves on add, remove, reorder -->
<AnimeTransitionGroup :deps="[view]">   <!-- also when view resizes items -->
<AnimeLayoutGroup :deps="[expanded]">   <!-- only when expanded changes -->
```

List every value whose change moves or resizes items. `:deps="[]"` on an
`<AnimeLayoutGroup>` turns its animation off. Each move still measures every
element inside the group, so keep item markup lean. On an
`<AnimeTransitionGroup>` whose items only enter and leave, set
`:move-animation="false"`.

### Reduced motion is a module option

`nanime.reducedMotion` in `nuxt.config.ts` takes `'never'` (default),
`'system'` (follows `prefers-reduced-motion`) or `'always'`. When motion is
reduced, animations from the composables, transitions and groups jump to
their end state. `useDraggable` and `useAnimeScroll` are not affected. To
let visitors choose, call `updateAppConfig({ nanime: { reducedMotion } })`.
Don't add your own `prefers-reduced-motion` checks around nanime calls.

### Rebuilds restart the animation

When a reactive target or parameter changes, the composable reverts the old
instance and builds a new one, from the start. Unchanged params are skipped,
so a getter returning an identical fresh object costs nothing.

- To continue mid-flight instead, pass `{ keepTime: true }` as the last
  argument. Only `useAnimate`, `useAnimeTimeline` and `useScrambleText` take it.
- For a value that retargets constantly, use `useAnimatable`.
