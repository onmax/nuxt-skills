# TresJS Core

Core package for building 3D scenes with Vue components.

## TresCanvas Props

| Prop               | Type                       | Default                 | Description                       |
| ------------------ | -------------------------- | ----------------------- | --------------------------------- |
| `shadows`          | `boolean \| ShadowMapType` | `false`                 | Enable shadow maps                |
| `alpha`            | `boolean`                  | `false`                 | Transparent background            |
| `clearColor`       | `string`                   | `#000000`               | Background color                  |
| `antialias`        | `boolean`                  | `true`                  | Enable antialiasing               |
| `toneMapping`      | `ToneMapping`              | `ACESFilmicToneMapping` | Tone mapping                      |
| `outputColorSpace` | `ColorSpace`               | `SRGBColorSpace`        | Output color space                |
| `windowSize`       | `boolean`                  | `false`                 | Use window size instead of parent |
| `preset`           | `'realistic' \| 'low'`     | -                       | Quality presets                   |

```vue
<TresCanvas
  shadows
  alpha
  clear-color="#1a1a2e"
  :tone-mapping="NoToneMapping"
  window-size
>
  <!-- scene -->
</TresCanvas>
```

## Composables

### useTres

Access Three.js instances from any component inside TresCanvas:

```ts
import { useTres } from '@tresjs/core'

const { scene, renderer, camera, sizes } = useTres()

// scene: THREE.Scene
// renderer: THREE.WebGLRenderer
// camera: computed<THREE.Camera>
// sizes: { width, height, aspectRatio }
```

### useLoop

Register callbacks in the render loop:

```ts
import { useLoop } from '@tresjs/core'

const { onBeforeRender, pause, resume } = useLoop()

onBeforeRender(({ delta, elapsed }) => {
  mesh.value.rotation.y += delta
})
```

Render priority (lower = earlier):

```ts
onBeforeRender(({ delta }) => {
  // physics update
}, { priority: -1 })

onBeforeRender(({ delta }) => {
  // animation update
}, { priority: 0 })
```

### useGraph

Navigate object hierarchies by name:

```ts
import { useGraph } from '@tresjs/core'

const { nodes, materials } = useGraph(model)

// Access by name
const head = nodes.Head
const skin = materials.Skin
```

### useLoader

Generic loader wrapper:

```ts
import { useLoader } from '@tresjs/core'
import { TextureLoader, CubeTextureLoader } from 'three'

const texture = await useLoader(TextureLoader, '/texture.jpg')

const cubeTexture = await useLoader(CubeTextureLoader, [
  '/px.jpg', '/nx.jpg', '/py.jpg', '/ny.jpg', '/pz.jpg', '/nz.jpg'
])
```

## Events

Pointer events on meshes:

```vue
<TresMesh
  @click="onClick"
  @pointer-move="onPointerMove"
  @pointer-enter="onPointerEnter"
  @pointer-leave="onPointerLeave"
>
  <TresBoxGeometry />
  <TresMeshStandardMaterial />
</TresMesh>
```

Event payload:

```ts
function onClick(event) {
  event.object      // The mesh that was clicked
  event.point       // THREE.Vector3 intersection point
  event.distance    // Distance from camera
  event.uv          // UV coordinates
  event.face        // Intersected face
  event.stopPropagation() // Stop event bubbling
}
```

Enable pointer events on canvas:

```vue
<TresCanvas :pointer="{ events: true }">
```

## Template Ref

Access Three.js objects directly:

```vue
<script setup>
import { shallowRef, onMounted } from 'vue'

const meshRef = shallowRef()

onMounted(() => {
  console.log(meshRef.value) // THREE.Mesh
  meshRef.value.rotation.x = Math.PI / 4
})
</script>

<template>
  <TresMesh ref="meshRef">
    <TresBoxGeometry />
    <TresMeshStandardMaterial />
  </TresMesh>
</template>
```

Use `shallowRef` for Three.js objects to avoid deep reactivity overhead.

## Extend Catalog

Register custom Three.js classes:

```ts
import { extend } from '@tresjs/core'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({ OrbitControls })
```

Then use as component:

```vue
<TresOrbitControls :args="[camera, renderer.domElement]" />
```

Note: Cientos already extends common classes for you.

## Performance Tips

1. **Use `shallowRef`** for Three.js objects
2. **Dispose resources** when unmounting:
   ```ts
   onUnmounted(() => {
     geometry.dispose()
     material.dispose()
     texture.dispose()
   })
   ```
3. **Limit reactive props** - static values don't need refs
4. **Use `window-size`** for fullscreen to avoid resize listeners
5. **Set `antialias: false`** on mobile for better performance
6. **Use `preset="low"`** for performance mode
