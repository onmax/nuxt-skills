# Cientos

Collection of ready-made helpers and components for TresJS. Uses `three-stdlib` under the hood.

```bash
pnpm add @tresjs/cientos
```

No `Tres` prefix needed - import and use directly.

## Controls

### OrbitControls

Orbit around a target:

```vue
<script setup>
import { OrbitControls } from '@tresjs/cientos'
</script>

<template>
  <TresCanvas>
    <TresPerspectiveCamera :position="[5, 5, 5]" />
    <OrbitControls enable-damping :damping-factor="0.05" />
  </TresCanvas>
</template>
```

Key props: `enableDamping`, `autoRotate`, `autoRotateSpeed`, `enableZoom`, `enablePan`, `minDistance`, `maxDistance`, `minPolarAngle`, `maxPolarAngle`

Events: `@change`, `@start`, `@end`

### Other Controls

| Component             | Description                           |
| --------------------- | ------------------------------------- |
| `CameraControls`      | Full-featured camera controller       |
| `PointerLockControls` | First-person controls (lock cursor)   |
| `KeyboardControls`    | WASD movement                         |
| `MapControls`         | Panning-focused (like Google Maps)    |
| `TransformControls`   | Move/rotate/scale objects with gizmo  |
| `ScrollControls`      | Scroll-driven camera/scene animations |

## Loaders

### useGLTF

Load glTF/GLB models:

```vue
<script setup>
import { useGLTF } from '@tresjs/cientos'

const { scene, nodes, materials } = await useGLTF('/model.glb', { draco: true })
</script>

<template>
  <primitive :object="scene" />
</template>
```

Returns: `scene`, `nodes`, `materials`, `animations`

Options: `draco: boolean`, `decoderPath: string`

### GLTFModel Component

Declarative alternative:

```vue
<Suspense>
  <GLTFModel path="/model.glb" draco />
</Suspense>
```

### Other Loaders

```ts
import { useFBX, useTexture, useVideoTexture, useSVG } from '@tresjs/cientos'

const fbx = await useFBX('/model.fbx')
const texture = await useTexture('/texture.jpg')
const video = useVideoTexture('/video.mp4')
const svg = await useSVG('/icon.svg')
```

### useProgress

Track loading progress:

```vue
<script setup>
import { useProgress } from '@tresjs/cientos'

const { progress, active, errors, item } = useProgress()
</script>

<template>
  <div v-if="active">Loading: {{ Math.round(progress) }}%</div>
</template>
```

## Materials

### GlassMaterial

Realistic glass/crystal:

```vue
<TresMesh>
  <TresSphereGeometry />
  <GlassMaterial :thickness="0.5" :roughness="0" :transmission="1" />
</TresMesh>
```

### HolographicMaterial

Sci-fi hologram effect:

```vue
<HolographicMaterial
  :fresnelAmount="0.5"
  :fresnelOpacity="0.8"
  :hologramBrightness="1.5"
  :scanlineSize="8"
  :signalSpeed="2"
  hologramColor="#00d5ff"
/>
```

### WobbleMaterial

Animated wobble distortion:

```vue
<WobbleMaterial :speed="2" :factor="0.5" color="hotpink" />
```

### Other Materials

| Component                | Description                                   |
| ------------------------ | --------------------------------------------- |
| `CustomShaderMaterial`   | Extend built-in materials with custom shaders |
| `MeshReflectionMaterial` | Reflective surfaces like water/mirrors        |
| `PointMaterial`          | For point clouds                              |
| `MeshDiscardMaterial`    | Invisible (for shadows only)                  |

## Staging

### Environment

Set up scene environment and background:

```vue
<Suspense>
  <Environment files="/sunset.hdr" :background="true" />
</Suspense>
```

Or use presets:

```vue
<Environment preset="city" />
```

Presets: `apartment`, `city`, `dawn`, `forest`, `lobby`, `night`, `park`, `studio`, `sunset`, `warehouse`

### Sky

Procedural sky:

```vue
<Sky :distance="450000" :sun-position="[1, 0.5, 0]" />
```

### Stars

Starfield background:

```vue
<Stars :count="5000" :depth="50" />
```

### Precipitation

Rain/snow:

```vue
<Precipitation :count="5000" :speed="0.5" />
```

### Other Staging

| Component             | Description                         |
| --------------------- | ----------------------------------- |
| `ContactShadows`      | Soft contact shadows on ground      |
| `AccumulativeShadows` | Progressive shadow baking           |
| `SoftShadows`         | PCSS soft shadows                   |
| `Backdrop`            | Curved backdrop for studio lighting |
| `Grid`                | Ground grid helper                  |
| `Ocean`               | Realistic ocean with waves          |
| `Smoke`               | Volumetric smoke effect             |
| `Sparkles`            | Floating particle sparkles          |

## Abstractions

### Text3D

3D text geometry:

```vue
<Suspense>
  <Text3D font="/fonts/helvetiker.json" text="Hello" :size="1" center>
    <TresMeshNormalMaterial />
  </Text3D>
</Suspense>
```

Font format: typeface.json (generate at gero3.github.io/facetype.js)

### Html

HTML overlay in 3D space:

```vue
<Html :position="[0, 2, 0]" center transform>
  <div class="label">Hello World</div>
</Html>
```

### Billboard

Always face camera:

```vue
<Billboard :position="[0, 1, 0]">
  <TresSprite>
    <TresSpriteMaterial map="texture" />
  </TresSprite>
</Billboard>
```

### Levioso

Floating animation:

```vue
<Levioso :speed="2" :rotation-intensity="2" :float-intensity="1">
  <TresMesh><!-- content --></TresMesh>
</Levioso>
```

### Other Abstractions

| Component         | Description                |
| ----------------- | -------------------------- |
| `Edges`           | Render object edges        |
| `Outline`         | Object outline effect      |
| `LensFlare`       | Camera lens flare          |
| `MouseParallax`   | Parallax on mouse movement |
| `Reflector`       | Reflective plane           |
| `PositionalAudio` | 3D positioned audio        |
| `GlobalAudio`     | Background audio           |

## Shapes

Pre-made geometry components:

```vue
<Box :args="[1, 1, 1]" />
<Sphere :args="[0.5, 32, 32]" />
<Plane :args="[5, 5]" />
<Circle :args="[0.5, 32]" />
<Cone :args="[0.5, 1, 32]" />
<Cylinder :args="[0.5, 0.5, 1, 32]" />
<Torus :args="[0.5, 0.2, 16, 32]" />
<TorusKnot :args="[0.5, 0.15, 100, 16]" />
<RoundedBox :args="[1, 1, 1]" :radius="0.1" />
```

All shapes support mesh props like `position`, `rotation`, `scale`, and accept a default slot for materials.

## Debug/Performance

### Stats

FPS counter:

```vue
<Stats />
```

### StatsGl

WebGL stats panel:

```vue
<StatsGl />
```

### Lod

Level of detail:

```vue
<Lod>
  <TresMesh :distance="0"><!-- high detail --></TresMesh>
  <TresMesh :distance="50"><!-- medium detail --></TresMesh>
  <TresMesh :distance="100"><!-- low detail --></TresMesh>
</Lod>
```
