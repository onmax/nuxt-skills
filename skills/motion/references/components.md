# Motion Component API

## Import Patterns

### motion (lowercase) - Standard pattern

The standard way to use motion-v with dot notation:

```vue
<script setup>
import { motion } from 'motion-v'
</script>

<template>
  <motion.div />
</template>
```

### Motion (capital) - Primitive pattern

Alternative pattern using `as` prop. Useful when element type needs to be dynamic at runtime:

```vue
<script setup>
import { Motion } from 'motion-v'
</script>

<template>
  <Motion as="div" />
</template>
```

**Use `motion` (lowercase) throughout this guide** - it's preloaded with all features.

## Component Variants

The `motion` component wraps any HTML or SVG element:

```vue
<script setup lang="ts">
import { motion } from 'motion-v'
</script>

<template>
  <!-- HTML elements -->
  <motion.div />
  <motion.span />
  <motion.button />
  <motion.a />
  <motion.img />
  <motion.ul />
  <motion.li />

  <!-- SVG elements -->
  <motion.svg />
  <motion.path />
  <motion.circle />
  <motion.rect />
  <motion.g />
</template>
```

## Animation Props

### initial

Starting state before component mounts:

```vue
<motion.div :initial="{ opacity: 0, scale: 0.8, x: -100 }">
```

Set `initial: false` to disable enter animation and start at `animate` values.

### animate

Target animation state. Changes trigger animation:

```vue
<script setup>
const isOpen = ref(false)
</script>

<motion.div :animate="{ height: isOpen ? 'auto' : 0 }">
```

### exit

Animation when component unmounts. Requires `AnimatePresence`:

```vue
<script setup>
import { motion, AnimatePresence } from 'motion-v'
</script>

<template>
  <AnimatePresence>
    <motion.div
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
<motion.div :style="{ x: motionValue, backgroundColor: '#fff' }">
```

## Gesture Props

### whileHover

Animation while pointer hovers:

```vue
<motion.div
  :whileHover="{ scale: 1.1, backgroundColor: '#f00' }"
  :transition="{ type: 'spring', stiffness: 300 }"
/>
```

### whilePress / whileTap

Animation while element is pressed:

```vue
<motion.button :whilePress="{ scale: 0.95 }">
```

### whileFocus

Animation while element has focus:

```vue
<motion.input :whileFocus="{ borderColor: '#0066ff', scale: 1.02 }">
```

### whileDrag

Animation while element is being dragged:

```vue
<motion.div
  drag
  :whileDrag="{ scale: 1.1, cursor: 'grabbing' }"
  :dragConstraints="{ top: 0, left: 0, right: 300, bottom: 300 }"
/>
```

### Drag Props

```vue
<motion.div
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
<motion.div
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
<motion.div layout>
  <!-- Position/size changes animate smoothly -->
</motion.div>
```

Layout modes:

```vue
<motion.div layout />           <!-- Animate position and size -->
<motion.div layout="position" /> <!-- Position only -->
<motion.div layout="size" />     <!-- Size only -->
```

### layoutId - Shared Element Transitions

Animate between components with matching layoutId:

```vue
<script setup>
const selected = ref<string | null>(null)
</script>

<template>
  <div class="grid">
    <motion.div
      v-for="item in items"
      :key="item.id"
      :layoutId="item.id"
      @click="selected = item.id"
    />
  </div>

  <AnimatePresence>
    <motion.div
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
import { motion, LayoutGroup } from 'motion-v'
</script>

<template>
  <LayoutGroup>
    <motion.div layout />
    <motion.div layout />
  </LayoutGroup>
</template>
```

## Transition Configuration

### transition Prop

Configure animation behavior:

```vue
<motion.div
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
<motion.div
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
import { motion, AnimatePresence } from 'motion-v'
</script>

<template>
  <AnimatePresence mode="wait">
    <motion.div
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
<motion.div
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
