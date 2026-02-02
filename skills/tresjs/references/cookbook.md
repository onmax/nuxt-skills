# TresJS Cookbook

Common patterns and recipes.

## Load and Display 3D Model

```vue
<script setup lang="ts">
import { OrbitControls, useGLTF } from '@tresjs/cientos'
import { TresCanvas } from '@tresjs/core'

const { scene } = await useGLTF('/models/robot.glb', { draco: true })
</script>

<template>
  <TresCanvas shadows>
    <TresPerspectiveCamera :position="[3, 3, 3]" />
    <OrbitControls enable-damping />

    <Suspense>
      <primitive :object="scene" />
    </Suspense>

    <TresDirectionalLight :position="[5, 5, 5]" :intensity="1" cast-shadow />
    <TresAmbientLight :intensity="0.3" />
  </TresCanvas>
</template>
```

## Camera Setup with OrbitControls

```vue
<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos'
import { TresCanvas } from '@tresjs/core'
</script>

<template>
  <TresCanvas>
    <TresPerspectiveCamera
      :position="[5, 5, 5]"
      :fov="45"
      :near="0.1"
      :far="1000"
    />
    <OrbitControls
      enable-damping
      :damping-factor="0.05"
      :min-distance="2"
      :max-distance="20"
      :max-polar-angle="Math.PI / 2"
    />
    <!-- scene -->
  </TresCanvas>
</template>
```

## Animation Loop

```vue
<script setup lang="ts">
import { TresCanvas, useLoop } from '@tresjs/core'
import { shallowRef } from 'vue'

const meshRef = shallowRef()

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  if (meshRef.value) {
    meshRef.value.rotation.y += delta
    meshRef.value.rotation.x += delta * 0.5
  }
})
</script>

<template>
  <TresCanvas>
    <TresPerspectiveCamera :position="[3, 3, 3]" />
    <TresMesh ref="meshRef">
      <TresBoxGeometry />
      <TresMeshStandardMaterial color="orange" />
    </TresMesh>
    <TresAmbientLight :intensity="0.5" />
  </TresCanvas>
</template>
```

## Add Post-Processing Effects

```vue
<script setup lang="ts">
import { BloomPmndrs, EffectComposerPmndrs, VignettePmndrs } from '@tresjs/post-processing'
import { TresCanvas } from '@tresjs/core'
</script>

<template>
  <TresCanvas>
    <TresPerspectiveCamera :position="[5, 5, 5]" />

    <!-- Scene with emissive materials for bloom -->
    <TresMesh>
      <TresSphereGeometry :args="[1, 32, 32]" />
      <TresMeshStandardMaterial
        color="#ff6600"
        :emissive="0xff6600"
        :emissive-intensity="2"
      />
    </TresMesh>

    <TresAmbientLight :intensity="0.2" />

    <Suspense>
      <EffectComposerPmndrs>
        <BloomPmndrs :intensity="3" :luminance-threshold="0.2" mipmap-blur />
        <VignettePmndrs :darkness="0.4" />
      </EffectComposerPmndrs>
    </Suspense>
  </TresCanvas>
</template>
```

## Responsive Canvas

```vue
<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
</script>

<template>
  <!-- Fill parent container -->
  <div class="canvas-container">
    <TresCanvas>
      <!-- scene -->
    </TresCanvas>
  </div>

  <!-- Or fill entire window -->
  <TresCanvas window-size>
    <!-- scene -->
  </TresCanvas>
</template>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100vh;
}
</style>
```

## Environment and Lighting Setup

```vue
<script setup lang="ts">
import { Environment, ContactShadows, Sky } from '@tresjs/cientos'
import { TresCanvas } from '@tresjs/core'
</script>

<template>
  <TresCanvas shadows>
    <TresPerspectiveCamera :position="[5, 5, 5]" />

    <!-- HDR environment for reflections -->
    <Suspense>
      <Environment preset="sunset" :background="true" />
    </Suspense>

    <!-- Or procedural sky -->
    <Sky :sun-position="[100, 20, 100]" />

    <!-- Content -->
    <TresMesh :position="[0, 0.5, 0]" cast-shadow>
      <TresSphereGeometry :args="[0.5, 32, 32]" />
      <TresMeshStandardMaterial :metalness="0.9" :roughness="0.1" />
    </TresMesh>

    <!-- Ground with contact shadows -->
    <ContactShadows :opacity="0.5" :blur="2" :position="[0, 0, 0]" />

    <!-- Or regular ground -->
    <TresMesh :rotation="[-Math.PI / 2, 0, 0]" receive-shadow>
      <TresPlaneGeometry :args="[10, 10]" />
      <TresMeshStandardMaterial color="#444" />
    </TresMesh>
  </TresCanvas>
</template>
```

## Interactive Objects

```vue
<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { ref } from 'vue'

const hovered = ref(false)
const clicked = ref(false)
const scale = computed(() => (clicked.value ? 1.5 : hovered.value ? 1.2 : 1))
</script>

<template>
  <TresCanvas>
    <TresPerspectiveCamera :position="[3, 3, 3]" />

    <TresMesh
      :scale="scale"
      @click="clicked = !clicked"
      @pointer-enter="hovered = true"
      @pointer-leave="hovered = false"
    >
      <TresBoxGeometry />
      <TresMeshStandardMaterial :color="hovered ? 'hotpink' : 'orange'" />
    </TresMesh>

    <TresAmbientLight :intensity="0.5" />
    <TresDirectionalLight :position="[5, 5, 5]" />
  </TresCanvas>
</template>
```

## Multiple Models with Suspense

```vue
<script setup lang="ts">
import { OrbitControls, useGLTF, useProgress } from '@tresjs/cientos'
import { TresCanvas } from '@tresjs/core'

const { progress, active } = useProgress()

const robot = useGLTF('/models/robot.glb', { draco: true })
const car = useGLTF('/models/car.glb', { draco: true })
</script>

<template>
  <div v-if="active" class="loading">Loading: {{ Math.round(progress) }}%</div>

  <TresCanvas>
    <TresPerspectiveCamera :position="[10, 5, 10]" />
    <OrbitControls />

    <Suspense>
      <primitive :object="robot.scene" :position="[-2, 0, 0]" />
    </Suspense>

    <Suspense>
      <primitive :object="car.scene" :position="[2, 0, 0]" />
    </Suspense>

    <TresAmbientLight :intensity="0.5" />
    <TresDirectionalLight :position="[5, 5, 5]" />
  </TresCanvas>
</template>
```

## Text in 3D Scene

```vue
<script setup lang="ts">
import { Text3D, Center } from '@tresjs/cientos'
import { TresCanvas } from '@tresjs/core'
</script>

<template>
  <TresCanvas>
    <TresPerspectiveCamera :position="[0, 0, 10]" />

    <Suspense>
      <Center>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          text="Hello TresJS"
          :size="1"
          :height="0.2"
          center
        >
          <TresMeshNormalMaterial />
        </Text3D>
      </Center>
    </Suspense>

    <TresAmbientLight :intensity="0.5" />
  </TresCanvas>
</template>
```

## Floating Animation

```vue
<script setup lang="ts">
import { Levioso, OrbitControls } from '@tresjs/cientos'
import { TresCanvas } from '@tresjs/core'
</script>

<template>
  <TresCanvas>
    <TresPerspectiveCamera :position="[3, 3, 3]" />
    <OrbitControls />

    <Levioso :speed="2" :rotation-intensity="2" :float-intensity="1">
      <TresMesh>
        <TresIcosahedronGeometry :args="[1, 1]" />
        <TresMeshNormalMaterial flat-shading />
      </TresMesh>
    </Levioso>

    <TresAmbientLight />
  </TresCanvas>
</template>
```
