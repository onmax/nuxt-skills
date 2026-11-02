# Animating lists (`v-for`)

## Add, remove, reorder

Wrap the `v-for` in `<AnimeTransitionGroup>`. New items run the enter
animation, removed items the leave animation, and the rest slide to their
new positions. See [transitions.md](transitions.md), including staggering.

## Draggable items

Give each item its own component, with `useDraggable` inside it. To drop
an item out of the list, hide its handle with `v-if` inside an
`<AnimeTransition>` and remove it from the array only in `@after-leave`.
`useDraggable` reverts its draggable when the component unmounts, and the
revert moves the element back to where the drag started. Removing the item
on release makes it jump back to its slot before it fades.

## Entrance stagger without a transition group

Target the items through the container ref, not a `v-for` ref array.

```ts
import { stagger } from '#nanime/utils'

const grid = useTemplateRef('grid')

useAnimate(
  () => grid.value ? [...grid.value.querySelectorAll<HTMLElement>('.card')] : [],
  { opacity: [0, 1], translateY: [40, 0], delay: stagger(80, { grid: [4, 3], from: 'center' }) },
)
```

A getter over a `v-for` ref array changes identity whenever the list grows.
That rebuilds the animation, so every card replays. The getter above tracks
only `grid`, which settles once at mount.
