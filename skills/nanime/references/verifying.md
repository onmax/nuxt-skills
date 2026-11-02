# Verifying an animation without a browser

Don't watch the page. Mount the component, seek its instance, and read the
styles.

## Setup

The Nuxt app under test must register the module:

```ts
// nuxt.config.ts
export default defineNuxtConfig({ modules: ['nanime'] })
```

If you get `Missing "#nanime/..." specifier` or the composables are undefined,
the module isn't registered in the app that vitest runs. The problem is not the
import path, so don't switch to raw `animejs` imports.

## Trace

```ts
// component: defineExpose({ tl })
const wrapper = await mountSuspended(Hero)
await new Promise(r => setTimeout(r, 0))   // let mount-time builds flush
const { tl } = wrapper.vm
tl.pause()

const at = (t: number) => (tl.seek(t), el.style.transform)
expect(at(0)).toContain('translateX(-100%)')
expect(at(400)).toContain('translateX(0%)')
```

- Assert the start, a midpoint, the end of each segment, and `tl.duration`.
- Anime.js writes x/y together as `translate(x, y)`, so parse the numbers
  instead of matching `translateX(`.
- For data-driven updates, change the reactive value mid-flight and check that
  the value continues from where it was without snapping to the start. That
  only works with `keepTime` (SKILL.md, "Rebuilds restart the animation").

## happy-dom gaps

These gaps are in the test environment. Your code isn't at fault.

| Symptom | Polyfill |
|---|---|
| `useSplitText`: `Cannot read properties of undefined (reading 'status')` | `document.fonts = { status: 'loaded', ready: Promise.resolve() }` |
| `useAnimeLayout().patch()` or `<AnimeTransitionGroup>` moves: `$el.animate is not a function`, reported as an unhandled rejection | a stub `Element.prototype.animate` that returns an object with `play/pause/cancel/finish`, `playbackRate`, `onfinish/oncancel/onremove` and a `finished` promise |

happy-dom does no layout, so every rect is 0. Drag distance, scroll progress and
layout slide distance can't be measured here. For those, assert that the
instance ran and where it ended up.
