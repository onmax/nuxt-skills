# Timelines, split text, SVG and scroll

## Timeline methods can be called in `setup`

`useAnimeTimeline()` returns a buffered proxy. `.add()`, `.set()`, `.label()`,
`.play()` and the rest queue until the timeline exists after mount, then
replay. No `onMounted` or `watch` needed.

```ts
const { chars } = useSplitText(heading, { chars: true })
const tl = useAnimeTimeline({ autoplay: false })

tl.add(chars, { opacity: [0, 1] }, 0)   // chars is still [] here, which is fine
```

## Scroll-driven timeline

```ts
const scroll = useAnimeScroll(() => ({ target: section.value ?? undefined, sync: true }))
const tl = useAnimeTimeline({ autoplay: scroll })
```

Bind through `autoplay`, which nanime unwraps to the observer. Don't call
`scroll.link(tl)`: it hands Anime.js the proxy itself.

## SVG helpers need a real element

Composable targets accept refs. `createDrawable`, `morphTo` and
`createMotionPath` from `#nanime/proxies/svg` do not: they read the element
right away, and in top-level `setup` the ref is still `null`.

`createDrawable` returns an array. Take `[0]`: a ref holding an array is not
an array of refs, and targets don't accept it.

Outside a timeline, wrap it in a `computed`:

```ts
const drawable = computed(() => path.value ? createDrawable(path.value)[0] : null)
useAnimate(drawable, { draw: ['0 0', '0 1'], duration: 1000 })
```

In a timeline, add inside `onMounted`:

```ts
onMounted(() => {
  if (!path.value || !shape.value) return
  const [drawable] = createDrawable(path.value)
  if (!drawable) return
  tl.add(drawable, { draw: ['0 0', '0 1'], duration: 1000 }, 0)
    .add(path.value, { d: morphTo(shape.value), duration: 800 }, 1000)
})
```

## Timing that looks right but traces wrong

These come from Anime.js, not nanime:

- A staggered `delay` with `from` values leaves later items at rest until
  each delay starts. Put the start state at position 0 with
  `tl.set(targets, {...}, 0)`.
  https://animejs.com/documentation/timeline/timeline-methods/set
- A staggered `delay` with `loop` and `alternate` inside a timeline mistimes
  the iterations. Stagger the position instead:
  `tl.add(targets, params, stagger(30, { start: 1200 }))`.
  https://animejs.com/documentation/utilities/stagger/timeline-positions-staggering
- `loop: n` means n *extra* passes. For "go and come back" with `alternate`,
  use `loop: 1`.
  https://animejs.com/documentation/animation/animation-playback-settings/loop
