# Motion Component API

## Component Variants

Motion wraps any HTML or SVG element:

```vue
<script setup lang="ts">
import { Motion } from 'motion-v'
</script>

<template>
  <!-- HTML elements -->
  <Motion.div />
  <Motion.span />
  <Motion.button />
  <Motion.a />
  <Motion.img />
  <Motion.ul />
  <Motion.li />

  <!-- SVG elements -->
  <Motion.svg />
  <Motion.path />
  <Motion.circle />
  <Motion.rect />
  <Motion.g />
</template>
```

## Animation Props

### initial

Starting state before component mounts:

```vue
<Motion.div :initial="{ opacity: 0, scale: 0.8, x: -100 }">
```

Set `initial: false` to disable enter animation and start at `animate` values.

### animate

Target animation state. Changes trigger animation:

```vue
<script setup>
const isOpen = ref(false)
</script>

<Motion.div :animate="{ height: isOpen ? 'auto' : 0 }">
```

### exit

Animation when component unmounts. Requires `AnimatePresence`:

```vue
<script setup>
import { Motion, AnimatePresence } from 'motion-v'
</script>

<template>
  <AnimatePresence>
    <Motion.div
      v-if="show"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
    />
  </AnimatePresence>
</template>
```

### style

Reactive style object. Use motion values for performant updates:

```vue
<Motion.div :style="{ x: motionValue, backgroundColor: '#fff' }">
```

## Gesture Props

### whileHover

Animation while pointer hovers:

```vue
<Motion.div
  :whileHover="{ scale: 1.1, backgroundColor: '#f00' }"
  :transition="{ type: 'spring', stiffness: 300 }"
/>
```

### whilePress / whileTap

Animation while element is pressed:

```vue
<Motion.button :whilePress="{ scale: 0.95 }">
```

### whileFocus

Animation while element has focus:

```vue
<Motion.input :whileFocus="{ borderColor: '#0066ff', scale: 1.02 }">
```

### whileDrag

Animation while element is being dragged:

```vue
<Motion.div
  drag
  :whileDrag="{ scale: 1.1, cursor: 'grabbing' }"
  :dragConstraints="{ top: 0, left: 0, right: 300, bottom: 300 }"
/>
```

### Drag Props

```vue
<Motion.div
  drag              <!-- Enable drag on both axes -->
  drag="x"          <!-- Constrain to x-axis -->
  drag="y"          <!-- Constrain to y-axis -->
  :dragConstraints="{ top: -50, left: -50, right: 50, bottom: 50 }"
  :dragElastic="0.2"        <!-- 0 = rigid, 1 = elastic -->
  :dragMomentum="true"      <!-- Continue with momentum -->
  :dragSnapToOrigin="true"  <!-- Return to start -->
/>
```

## Viewport Props

### whileInView

Animation when element enters viewport:

```vue
<Motion.div
  :initial="{ opacity: 0, y: 50 }"
  :whileInView="{ opacity: 1, y: 0 }"
  :viewport="{ once: true, amount: 0.5 }"
/>
```

### viewport Options

```ts
interface ViewportOptions {
  once?: boolean       // Animate only first time (default: false)
  amount?: number | 'some' | 'all'  // Visibility threshold (default: 'some')
  margin?: string      // Rootmargin (e.g., '-100px')
  root?: Element       // Scroll container (default: window)
}
```

## Layout Animation

### layout Prop

Automatically animate layout changes:

```vue
<Motion.div layout>
  <!-- Position/size changes animate smoothly -->
</Motion.div>
```

Layout modes:

```vue
<Motion.div layout />           <!-- Animate position and size -->
<Motion.div layout="position" /> <!-- Position only -->
<Motion.div layout="size" />     <!-- Size only -->
```

### layoutId - Shared Element Transitions

Animate between components with matching layoutId:

```vue
<script setup>
const selected = ref<string | null>(null)
</script>

<template>
  <div class="grid">
    <Motion.div
      v-for="item in items"
      :key="item.id"
      :layoutId="item.id"
      @click="selected = item.id"
    />
  </div>

  <AnimatePresence>
    <Motion.div
      v-if="selected"
      :layoutId="selected"
      class="expanded"
    />
  </AnimatePresence>
</template>
```

### LayoutGroup

Sync layout animations across components:

```vue
<script setup>
import { Motion, LayoutGroup } from 'motion-v'
</script>

<template>
  <LayoutGroup>
    <Motion.div layout />
    <Motion.div layout />
  </LayoutGroup>
</template>
```

## Transition Configuration

### transition Prop

Configure animation behavior:

```vue
<Motion.div
  :animate="{ x: 100 }"
  :transition="{
    type: 'spring',
    stiffness: 100,
    damping: 10,
    mass: 1,
  }"
/>
```

### Transition Types

**Spring (default):**

```ts
{
  type: 'spring',
  stiffness: 100,  // Higher = snappier (default: 100)
  damping: 10,     // Higher = less bounce (default: 10)
  mass: 1,         // Higher = slower (default: 1)
  velocity: 0,     // Initial velocity
  restDelta: 0.01, // End threshold
}
```

**Tween:**

```ts
{
  type: 'tween',
  duration: 0.3,
  ease: 'easeOut',  // 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | [0.42, 0, 0.58, 1]
  delay: 0,
  repeat: 0,        // Number of repeats (Infinity for loop)
  repeatType: 'loop',  // 'loop' | 'reverse' | 'mirror'
  repeatDelay: 0,
}
```

**Inertia (for drag):**

```ts
{
  type: 'inertia',
  velocity: 50,
  power: 0.8,
  timeConstant: 700,
  bounceStiffness: 500,
  bounceDamping: 10,
}
```

### Per-Property Transitions

```vue
<Motion.div
  :animate="{ x: 100, opacity: 1 }"
  :transition="{
    x: { type: 'spring', stiffness: 100 },
    opacity: { duration: 0.2 },
  }"
/>
```

## AnimatePresence

Animate components as they mount/unmount:

```vue
<script setup>
import { Motion, AnimatePresence } from 'motion-v'
</script>

<template>
  <AnimatePresence mode="wait">
    <Motion.div
      :key="currentPage"
      :initial="{ opacity: 0, x: 100 }"
      :animate="{ opacity: 1, x: 0 }"
      :exit="{ opacity: 0, x: -100 }"
    />
  </AnimatePresence>
</template>
```

### Mode Options

```vue
<AnimatePresence mode="sync" />   <!-- Default: animate simultaneously -->
<AnimatePresence mode="wait" />   <!-- Wait for exit before enter -->
<AnimatePresence mode="popLayout" /> <!-- Pop exiting from layout flow -->
```

## Events

```vue
<Motion.div
  @animationStart="onStart"
  @animationComplete="onComplete"
  @update="onUpdate"              <!-- Called every frame -->
  @hoverStart="onHoverStart"
  @hoverEnd="onHoverEnd"
  @pressStart="onPressStart"
  @pressEnd="onPressEnd"
  @dragStart="onDragStart"
  @drag="onDrag"
  @dragEnd="onDragEnd"
  @viewportEnter="onEnter"
  @viewportLeave="onLeave"
/>
```
