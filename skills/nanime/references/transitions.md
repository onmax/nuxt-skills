# `<AnimeTransition>` and `<AnimeTransitionGroup>`

Drop-ins for Vue's `<Transition>` and `<TransitionGroup>`. Anime.js runs the
enter, leave and move animations, so write no transition CSS and no
`.v-enter-active` / `.v-move` classes. Vue's transition events
(`@after-enter`, `@after-leave`, …) pass through.

For elements that stay mounted but change position or size, use
[layout.md](layout.md) instead.

Docs: https://nanimejs.netlify.app/components/transitions and
https://nanimejs.netlify.app/components/transition-styles

## One element: `v-if`, `v-show` or a changed `key`

```vue
<template>
  <AnimeTransition enter-animation="slide-up" leave-animation="fade">
    <div v-if="open" class="panel" />
  </AnimeTransition>

  <AnimeTransition mode="out-in" enter-animation="swap" leave-animation="swap">
    <span :key="status">{{ status }}</span>
  </AnimeTransition>
</template>
```

| Prop | Type | Default |
|---|---|---|
| `enterAnimation` | style name or `AnimationParams` | `'fade'` |
| `leaveAnimation` | style name or `AnimationParams` | `'fade'` |
| `mode` | `'default'`, `'in-out'`, `'out-in'` | `'default'` |
| `appear` | `boolean` | `false` |

Use `mode="out-in"` for keyed swaps. Otherwise both elements are in the DOM
at once and the new one pushes the old one aside.

For a crossfade, keep the default mode and stack the two elements in one
grid cell: make the wrapper a `grid` and give the keyed child
`col-start-1 row-start-1`. The old one's leave and the new one's enter then
run together in the same spot. No fixed size or `absolute` is needed: the
wrapper takes the taller of the two while both are mounted, and the new
one's size once the leave ends.

```vue
<template>
  <div class="grid">
    <AnimeTransition :enter-animation="{ opacity: [0, 1], duration: 400 }" :leave-animation="{ opacity: 0, duration: 400 }">
      <img :key="track.id" :src="track.cover" class="col-start-1 row-start-1">
    </AnimeTransition>
  </div>
</template>
```

## Lists: `v-for` with add, remove and reorder

```vue
<template>
  <AnimeTransitionGroup tag="ul" class="relative flex flex-wrap gap-2" :deps="[]" enter-animation="scale" leave-animation="scale">
    <li v-for="item in items" :key="item.id">{{ item.label }}</li>
  </AnimeTransitionGroup>
</template>
```

It takes the props above except `mode`, with its own defaults, plus:

| Prop | Type | Default |
|---|---|---|
| `enterAnimation` | style name or `AnimationParams` | fade in, 250ms `out(3)` |
| `leaveAnimation` | style name or `AnimationParams` | fade out, 150ms `in(3)` |
| `tag` | `string` | `'div'` |
| `moveAnimation` | style name, `{ duration, delay, ease }`, or `false` | `{ duration: 350, ease: 'out(3)' }` |
| `absoluteLeave` | `boolean` | `true` |
| `deps` | `unknown[]` (values or getters) | |
| `shallow` | `boolean` | `false` |

- Unlike Vue's `<TransitionGroup>`, it always renders a wrapper element
  (`tag`). Put the list's layout classes on the group itself.
- Give the group `position: relative`. With `absoluteLeave`, a leaving item
  switches to `position: absolute` against it, so the others close the gap
  while it animates out.
- Moves (reorder, shuffle, the gap closing) use AnimeJS layout. Mutate the
  array and the items slide. No `useAnimeLayout` or `patch()` call is needed.
- Every item needs a stable `:key`, such as an id. With an index key,
  removing an item makes the last element leave while the rest swap their
  content in place, so nothing slides.
- A leave, a move and an enter in the same update all start together. To
  let the new item appear after the others have made room, give the enter
  a `delay` about as long as the leave. The enter's start values apply at
  once, so the item stays hidden while it waits.

### Pass `deps`

Without `deps`, every re-render of the group measures everything inside
it, even when nothing moved. Pass it on every group:

```vue
<AnimeTransitionGroup :deps="[]">       <!-- add, remove, reorder -->
<AnimeTransitionGroup :deps="[view]">   <!-- also when view resizes items -->
```

- Entries are watched deeply. Add `shallow` to react only when an entry is
  replaced.
- Each move measures every element inside the group, down to the text in
  each item. Keep item markup lean.
- Use `:move-animation="false"` when items only enter and leave. The group
  then measures nothing.
- Without `deps`, a value read in the slot that settles after mount, such
  as a template ref passed to each item as a prop, re-renders the group and
  runs a move pass. Pass a getter instead (`:target="() => bin"`).

### Staggering items

`stagger()` works in `enterAnimation` and `leaveAnimation`. Items that
enter, or leave, in the same update are counted together in DOM order, so
the first one starts first:

```vue
<script setup lang="ts">
import { stagger } from '#nanime/utils'
</script>

<template>
  <AnimeTransitionGroup appear :enter-animation="{ opacity: [0, 1], y: [16, 0], delay: stagger(60) }">
    <div v-for="item in items" :key="item.id" />
  </AnimeTransitionGroup>
</template>
```

The count restarts with each update, so one item added later starts with
no delay.

A stagger in `moveAnimation` works differently. Moves run on every element
inside the group, down to the text in each item, so the delay grows with
each nested element rather than each item. An item holding five elements
adds five steps, and the text trails behind its own item. Leave the move
unstaggered for items with content, or keep the step to a few
milliseconds.

## Styles

Built-ins: `fade`, `slide-up`, `slide-down`, `slide-left`, `slide-right`,
`scale`, `swap`. Inline params beat a name. An unknown name logs a warning
and falls back to the component's own default: `fade` on `<AnimeTransition>`,
the group's defaults on `<AnimeTransitionGroup>`. The same goes for a style
that lacks the part asked for: no built-in style has a `move`, so
`move-animation="fade"` moves with the group's 350ms `out(3)`.

Define your own in `app.config.ts`, never `nuxt.config.ts`. A style can set
`enter`, `leave` and `move`, and a style named like a built-in replaces it.

```ts
export default defineAppConfig({
  nanime: {
    transitions: {
      pop: {
        enter: { opacity: [0, 1], scale: [0.4, 1], duration: 500, ease: 'outBack(3)' },
        leave: { opacity: 0, scale: 0.4, duration: 250 },
        move: { duration: 300, ease: 'out(3)' },
      },
    },
  },
})
```

Inline params take any Anime.js param, including `keyframes`:

```vue
<AnimeTransition :leave-animation="{ keyframes: [{ x: -8, duration: 80 }, { x: 8, duration: 80 }, { opacity: 0, scale: 1.6, duration: 300 }] }">
  <div v-if="visible" />
</AnimeTransition>
```

## Component defaults

Default props for `<AnimeTransition>`, `<AnimeTransitionGroup>` and
`<AnimeLayoutGroup>` go in `app.config.ts` under `nanime.components`, keyed
`transition`, `transitionGroup` and `layoutGroup`:

```ts
export default defineAppConfig({
  nanime: {
    components: {
      transition: { enterAnimation: 'slide-up' },
      transitionGroup: { moveAnimation: { duration: 300 } },
    },
  },
})
```

`provideAnimeDefaults({ ... })` takes the same shape and applies to the
calling component's subtree. A prop passed to the component always wins, and
an `undefined` default leaves the outer one in place. In app config,
`layoutGroup.elements` takes selectors only.
