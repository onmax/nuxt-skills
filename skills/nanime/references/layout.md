# Layout animation: `<AnimeLayoutGroup>` and `useAnimeLayout`

For elements that stay mounted but change position or size: a class toggle,
a grid column count, a card expanding. For `v-for` items entering, leaving or
reordering, use `<AnimeTransitionGroup>` first ([transitions.md](transitions.md)).

- `<AnimeLayoutGroup>` when the change comes from state you can list in `deps`.
- `useAnimeLayout` when you need to `await` the animation or change timing per call.

Both groups take `deps` and `shallow`, but they mean different things:

| | `<AnimeTransitionGroup>` | `<AnimeLayoutGroup>` |
|---|---|---|
| Built for | `v-for` items entering, leaving, reordering | mounted elements changing size or position |
| Enter and leave | `enterAnimation` / `leaveAnimation` per item | `v-show` fades, `v-if` removes at once |
| `deps` | extra triggers on top of list changes (`[]` = list changes only) | the only trigger |
| Timing | `moveAnimation`: `duration`, `delay`, `ease` | `layoutOptions`: any `createLayout()` param |
| What moves | every element inside | every element inside, or `elements` |

Layout options (`children`, `enterFrom`, `leaveTo`, `swapAt`, …):
https://animejs.com/documentation/layout

## `<AnimeLayoutGroup>`

Records its children before Vue updates the DOM whenever `deps` changes,
then animates them to their new size and position.

```vue
<template>
  <AnimeLayoutGroup :deps="[view]" :layout-options="{ duration: 500 }" :class="view === 'grid' ? 'grid grid-cols-2' : 'flex'">
    <div v-for="item in items" :key="item.id" />
  </AnimeLayoutGroup>
</template>
```

- `deps` entries are watched deeply. A getter entry such as
  `[() => store.view]` is called and its result watched. Add `shallow` to
  react only when an entry is replaced.
- Always pass `deps`. Without it, every re-render of the group measures
  every element inside it and animates, even when nothing moved, such as a
  parent passing a new object or array prop on every render.
- Each animation measures every element inside the group, whatever
  `elements` says. Keep the markup inside lean.
- Toggle children with `v-show` to get enter and leave fades while the rest
  slides. With `v-if`, a removed child vanishes at once and only its
  neighbours animate.
- `elements` picks which elements move on their own: a selector such as
  `'.card'` (matched only inside this group), elements, component instances,
  or a list. The group still measures everything inside it, so wrap only
  what moves.
- Content inside a matched element does not move on its own: it jumps to its
  new spot halfway through, so it can visibly shift when the element resizes.
  Add it to `elements` (`'.card, .card h3'`) to make it slide. If its own size
  changes too it fades out and back; `layoutOptions: { swapAt: { opacity: 1 } }`
  keeps it visible.
- Instead of listing a selector for every element, give each element that
  moves the same attribute of your own and pass it once:
  `elements="[data-layout]"` with `data-layout` on the card and its `h3`.
- `layoutOptions` takes Anime.js `createLayout()` params. By default the
  group moves on `spring({ bounce: 0.15, duration: 300 })`. Setting `ease` or
  `duration` anywhere (prop or component defaults) replaces the spring, since
  a spring picks its own duration. `tag` defaults to `'div'`. App-wide
  defaults: see Component defaults in [transitions.md](transitions.md).
- Layout animates `width` and `height`, so text reflows as a box resizes.
  Text that fits on one line when the move ends stays on one line throughout,
  so a button whose label changes doesn't wrap mid-move. Text over several
  lines reflows.

Docs: https://nanimejs.netlify.app/components/layout-group

## `useAnimeLayout`

```ts
const list = useTemplateRef('list')
const layout = useAnimeLayout(list, { duration: 500, ease: 'inOutQuad' })

async function reverse() {
  await layout.patch(() => items.value.reverse())
}

async function toggleWide() {
  await layout.patch(() => {
    wide.value = !wide.value
  }, { duration: 300 })
}
```

- Pass the container, not the items. Its children are recorded and animated.
- Put every state change that moves elements inside the `patch` callback.
  `patch` snapshots positions, runs the callback (sync or async), waits for
  Vue to update the DOM, then animates. It returns the Anime.js timeline, so
  `await` resolves when the animation finishes.
- The optional second argument overrides the timing for that call.
- Call `patch` from handlers or watchers, after mount.
- Don't use Anime.js `layout.update(callback)` for Vue state. It animates
  before Vue has patched the DOM, so nothing moves.
- The options are reactive. A change in value rebuilds the layout, so keep
  them stable while an animation runs.
- When the change can't go in one callback: `layout.record()`, change state,
  `await nextTick()`, `layout.animate()`, in that order.

Docs: https://nanimejs.netlify.app/composables/use-anime-layout
