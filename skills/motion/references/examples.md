# Animation Examples & Resources

Links to external animation libraries, component collections, and inspiration.

## Official Motion Resources

- **[motion.dev/examples](https://motion.dev/examples)** - Official Motion examples gallery
- **[github.com/motiondivision/motion-vue](https://github.com/motiondivision/motion-vue)** - Motion Vue source code

## Vue Animation Libraries

- **[Vue Bits](https://github.com/DavidHDev/vue-bits)** - 110+ animated Vue components (text reveals, backgrounds, UI effects)
- **[Inspira UI](https://inspira-ui.com/)** - Beautiful UI components built with Vue, Nuxt, and Tailwind CSS

## Animation Pattern References

These React/CSS libraries provide patterns easily ported to Motion Vue:

- **[React Bits](https://github.com/DavidHDev/react-bits)** - Same author as Vue Bits, patterns translate directly
- **[Magic UI](https://github.com/magicuidesign/magicui)** - 150+ landing page effects, shadcn companion
- **[Animata](https://github.com/codse/animata)** - 80+ Tailwind copy-paste animations
- **[Aceternity UI](https://ui.aceternity.com)** - Premium animations (lamp, globe, 3D cards)
- **[Motion Primitives](https://motion-primitives.com)** - Animated UI component kit
- **[Cult UI](https://www.cult-ui.com/)** - Curated animated components

## Patterns by Category

### Scroll Animations

```vue
<!-- Parallax -->
<script setup>
import { motion, useScroll, useTransform } from 'motion-v'

const { scrollYProgress } = useScroll()
const y = useTransform(scrollYProgress, [0, 1], [0, -200])
</script>

<motion.div :style="{ y }">Parallax content</motion.div>
```

```vue
<!-- Progress bar -->
<motion.div
  class="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left"
  :style="{ scaleX: scrollYProgress }"
/>
```

### Layout Animations

```vue
<!-- Expanding card -->
<motion.div
  :layoutId="`card-${id}`"
  @click="expanded = !expanded"
  :class="expanded ? 'w-full h-64' : 'w-32 h-32'"
/>
```

```vue
<!-- Reordering list -->
<motion.li
  v-for="item in items"
  :key="item.id"
  layout
  :initial="{ opacity: 0 }"
  :animate="{ opacity: 1 }"
  :exit="{ opacity: 0 }"
/>
```

### Gesture Interactions

```vue
<!-- Magnetic button -->
<script setup>
import { motion, useMotionValue } from 'motion-v'

const x = useMotionValue(0)
const y = useMotionValue(0)

function handleMouse(e: MouseEvent) {
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  x.set(e.clientX - rect.left - rect.width / 2)
  y.set(e.clientY - rect.top - rect.height / 2)
}

function reset() {
  x.set(0)
  y.set(0)
}
</script>

<motion.button
  :style="{ x, y }"
  @mousemove="handleMouse"
  @mouseleave="reset"
  :transition="{ type: 'spring', stiffness: 150 }"
/>
```

```vue
<!-- Swipe to dismiss -->
<motion.div
  drag="x"
  :dragConstraints="{ left: 0, right: 0 }"
  :onDragEnd="(_, info) => info.offset.x > 100 && dismiss()"
  :style="{ x }"
/>
```

### Text Animations

```vue
<!-- Staggered text reveal -->
<script setup>
import { motion } from 'motion-v'

const words = text.split(' ')
</script>

<template>
  <span v-for="(word, i) in words" :key="i">
    <motion.span
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ delay: i * 0.1 }"
    >
      {{ word }}
    </motion.span>
    {{ ' ' }}
  </span>
</template>
```

```vue
<!-- Character animation -->
<motion.span
  v-for="(char, i) in text.split('')"
  :key="i"
  :initial="{ opacity: 0 }"
  :animate="{ opacity: 1 }"
  :transition="{ delay: i * 0.03 }"
>
  {{ char }}
</motion.span>
```

### SVG Animations

```vue
<!-- Path drawing -->
<motion.path
  d="M0 0 L100 100"
  :initial="{ pathLength: 0 }"
  :animate="{ pathLength: 1 }"
  :transition="{ duration: 2, ease: 'easeInOut' }"
/>
```

```vue
<!-- Morphing shapes -->
<motion.path
  :animate="{ d: isCircle ? circlePath : squarePath }"
  :transition="{ duration: 0.5 }"
/>
```

### Background Effects

```vue
<!-- Gradient follow cursor -->
<script setup>
import { motion, useMotionValue, useMotionTemplate } from 'motion-v'

const x = useMotionValue(0)
const y = useMotionValue(0)
const background = useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, #3b82f6, transparent 80%)`

function handleMouse(e: MouseEvent) {
  x.set(e.clientX)
  y.set(e.clientY)
}
</script>

<motion.div
  :style="{ background }"
  @mousemove="handleMouse"
  class="fixed inset-0"
/>
```

### Page Transitions

```vue
<!-- Slide transition -->
<AnimatePresence mode="wait">
  <motion.div
    :key="route.path"
    :initial="{ opacity: 0, x: 100 }"
    :animate="{ opacity: 1, x: 0 }"
    :exit="{ opacity: 0, x: -100 }"
    :transition="{ type: 'spring', stiffness: 100, damping: 20 }"
  />
</AnimatePresence>
```

## Performance Tips

1. **Use motion values** for frequent updates (mouse position, scroll)
2. **Prefer transform properties** (x, y, scale, rotate) over layout properties (width, height, top, left)
3. **Use `layout` sparingly** - it measures DOM which can be expensive
4. **Set `once: true`** on viewport animations when possible
5. **Use `will-change`** for complex animations (Motion adds this automatically)
