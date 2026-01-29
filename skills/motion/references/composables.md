# Motion Composables

## useMotionValue

Create a motion value for performant animations that bypass Vue's reactivity:

```vue
<script setup>
import { motion, useMotionValue } from 'motion-v'

const x = useMotionValue(0)

// Read/write value
console.log(x.get())
x.set(100)

// Subscribe to changes
const unsubscribe = x.on('change', (latest) => {
  console.log('x changed to', latest)
})
</script>

<template>
  <motion.div :style="{ x }" />
</template>
```

## useSpring

Create spring-animated motion value:

```vue
<script setup>
import { motion, useMotionValue, useSpring } from 'motion-v'

const x = useMotionValue(0)
const springX = useSpring(x, {
  stiffness: 100,
  damping: 10,
  mass: 1,
})

// springX follows x with spring physics
x.set(100)
</script>

<template>
  <motion.div :style="{ x: springX }" />
</template>
```

## useTransform

Derive motion values from other motion values:

```vue
<script setup>
import { motion, useMotionValue, useTransform } from 'motion-v'

const x = useMotionValue(0)

// Map x: 0-100 to opacity: 1-0
const opacity = useTransform(x, [0, 100], [1, 0])

// Map x: 0-100 to scale: 1-2
const scale = useTransform(x, [0, 100], [1, 2])

// Custom transform function
const rotate = useTransform(x, (value) => `${value}deg`)

// Combine multiple values
const combined = useTransform([x, opacity], ([x, opacity]) => {
  return x * opacity
})
</script>

<template>
  <motion.div :style="{ x, opacity, scale, rotate }" />
</template>
```

### Easing in useTransform

```ts
import { easeInOut } from 'motion-v'

const opacity = useTransform(x, [0, 100], [0, 1], { ease: easeInOut })
```

## useMotionTemplate

Create template strings from motion values:

```vue
<script setup>
import { useMotionValue, useMotionTemplate } from 'motion-v'

const x = useMotionValue(0)
const y = useMotionValue(0)

// Creates "translateX(0px) translateY(0px)"
const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px)`

// For gradients, shadows, etc.
const blur = useMotionValue(5)
const filter = useMotionTemplate`blur(${blur}px)`
</script>
```

## useScroll

Track scroll progress of window or element:

```vue
<script setup>
import { useScroll, useTransform, motion } from 'motion-v'

// Window scroll
const { scrollX, scrollY, scrollXProgress, scrollYProgress } = useScroll()

// Element scroll
const containerRef = ref<HTMLElement>()
const { scrollYProgress: containerProgress } = useScroll({
  container: containerRef,
})

// Element in viewport progress
const targetRef = ref<HTMLElement>()
const { scrollYProgress: targetProgress } = useScroll({
  target: targetRef,
  offset: ['start end', 'end start'],  // When tracking starts/ends
})

// Transform scroll to animation values
const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
</script>

<template>
  <motion.div :style="{ opacity, scale }" />
</template>
```

### Scroll Offset Options

```ts
offset: ['start end', 'end start']
// First: target position relative to container
// Second: container position relative to viewport

// Common patterns:
['start end', 'end start']     // Element enters bottom, exits top
['start start', 'end start']   // Pin at top while scrolling
['center center', 'end start'] // Centered animation
```

## useInView

Detect element visibility in viewport:

```vue
<script setup>
import { useInView } from 'motion-v'

const ref = ref<HTMLElement>()
const isInView = useInView(ref, {
  once: true,           // Only trigger once
  amount: 0.5,          // 50% visible to trigger
  margin: '-100px',     // Shrink viewport detection
})

watch(isInView, (inView) => {
  if (inView) console.log('Element visible')
})
</script>

<template>
  <div ref="ref">Tracked element</div>
</template>
```

## useAnimationFrame

Run callback every frame with delta time:

```vue
<script setup>
import { useMotionValue, useAnimationFrame } from 'motion-v'

const rotation = useMotionValue(0)

useAnimationFrame((time, delta) => {
  // time: total elapsed ms
  // delta: ms since last frame
  rotation.set(rotation.get() + delta * 0.1)
})
</script>

<template>
  <motion.div :style="{ rotate: rotation }">Spinning</motion.div>
</template>
```

## animate()

Imperative animation function:

```ts
import { animate } from 'motion-v'

// Animate value
const controls = animate(0, 100, {
  duration: 0.5,
  onUpdate: (latest) => console.log(latest),
  onComplete: () => console.log('done'),
})

// Control animation
controls.stop()
controls.time = 0.25  // Seek to 25%

// Animate motion value
const x = useMotionValue(0)
animate(x, 100, { type: 'spring' })

// Animate object
animate(
  { x: 0, y: 0 },
  { x: 100, y: 100 },
  {
    duration: 1,
    onUpdate: ({ x, y }) => console.log(x, y),
  }
)
```

### Sequence Animations

```ts
import { animate, stagger } from 'motion-v'

// Animate elements in sequence
const elements = document.querySelectorAll('.item')

animate(elements, { opacity: 1, y: 0 }, {
  delay: stagger(0.1),  // 0.1s between each
  duration: 0.5,
})

// Custom stagger
animate(elements, { opacity: 1 }, {
  delay: stagger(0.1, {
    start: 0.5,           // Start delay
    from: 'center',       // 'first' | 'last' | 'center' | number
    ease: 'easeOut',
  }),
})
```

## useVelocity

Track velocity of motion value:

```vue
<script setup>
import { useMotionValue, useVelocity, useTransform } from 'motion-v'

const x = useMotionValue(0)
const xVelocity = useVelocity(x)

// Skew based on velocity
const skewX = useTransform(xVelocity, [-1000, 0, 1000], [-25, 0, 25])
</script>
```

## useReducedMotion

Respect user's motion preferences:

```vue
<script setup>
import { useReducedMotion } from 'motion-v'

const prefersReduced = useReducedMotion()
</script>

<template>
  <motion.div
    :animate="{ x: 100 }"
    :transition="prefersReduced ? { duration: 0 } : { type: 'spring' }"
  />
</template>
```
