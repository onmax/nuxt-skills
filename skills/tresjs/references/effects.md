# Post-Processing Effects

Visual effects applied after scene render. Two effect systems available.

```bash
pnpm add @tresjs/post-processing
```

## Effect Composers

### EffectComposer (Three.js native)

Uses Three.js built-in effects:

```vue
<script setup>
import { EffectComposer, UnrealBloom, Glitch } from '@tresjs/post-processing'
</script>

<template>
  <TresCanvas>
    <TresPerspectiveCamera :position="[5, 5, 5]" />
    <!-- scene content -->

    <Suspense>
      <EffectComposer>
        <UnrealBloom :strength="1.5" :radius="0.5" :threshold="0.8" />
        <Glitch />
      </EffectComposer>
    </Suspense>
  </TresCanvas>
</template>
```

### EffectComposerPmndrs (pmndrs postprocessing)

Uses pmndrs/postprocessing library (more effects, better performance):

```vue
<script setup>
import { EffectComposerPmndrs, BloomPmndrs, GlitchPmndrs } from '@tresjs/post-processing'
</script>

<template>
  <Suspense>
    <EffectComposerPmndrs>
      <BloomPmndrs :intensity="4" :luminance-threshold="0.1" mipmap-blur />
      <GlitchPmndrs />
    </EffectComposerPmndrs>
  </Suspense>
</template>
```

**Rule:** Pmndrs effects end with `Pmndrs` suffix and require `EffectComposerPmndrs`.

## Three.js Effects (EffectComposer)

### UnrealBloom

Glow around bright areas:

```vue
<UnrealBloom :strength="1.5" :radius="0.5" :threshold="0.8" />
```

| Prop        | Description      | Default |
| ----------- | ---------------- | ------- |
| `strength`  | Bloom intensity  | `1`     |
| `radius`    | Bloom spread     | `0`     |
| `threshold` | Luminance cutoff | `0`     |

### Glitch

Digital glitch distortion:

```vue
<Glitch />
```

### Halftone

Halftone print effect:

```vue
<Halftone :radius="4" :scatter="0" />
```

### Pixelation

Pixelated look:

```vue
<Pixelation :granularity="5" />
```

### Output

Color space/tone mapping:

```vue
<Output />
```

### SMAA

Anti-aliasing pass:

```vue
<SMAA />
```

## Pmndrs Effects (EffectComposerPmndrs)

More effects with better performance through effect merging.

### BloomPmndrs

Advanced bloom:

```vue
<BloomPmndrs
  :intensity="4"
  :luminance-threshold="0.1"
  :luminance-smoothing="0.3"
  :radius="0.85"
  mipmap-blur
/>
```

| Prop                 | Description                      | Default |
| -------------------- | -------------------------------- | ------- |
| `intensity`          | Effect strength                  | `1`     |
| `luminanceThreshold` | Brightness cutoff (0-1)          | `0.9`   |
| `luminanceSmoothing` | Threshold smoothness             | `0.025` |
| `mipmapBlur`         | Enable mipmap blur (like Unreal) | `false` |
| `radius`             | Blur radius                      | -       |

### DepthOfFieldPmndrs

Camera focus blur:

```vue
<DepthOfFieldPmndrs
  :focus-distance="0.5"
  :focus-range="0.1"
  :bokeh-scale="2"
/>
```

| Prop                 | Description                     | Default |
| -------------------- | ------------------------------- | ------- |
| `focusDistance`      | Normalized focus distance (0-1) | -       |
| `focusRange`         | Focus range (0-1)               | `0.1`   |
| `bokehScale`         | Bokeh blur scale                | `1`     |
| `worldFocusDistance` | Focus in world units            | -       |

### GlitchPmndrs

Digital glitch:

```vue
<GlitchPmndrs
  :delay="[1.5, 3.5]"
  :duration="[0.6, 1.0]"
  :strength="[0.3, 1.0]"
/>
```

| Prop       | Description                                  | Default      |
| ---------- | -------------------------------------------- | ------------ |
| `delay`    | [min, max] delay between glitches (s)        | `[1.5, 3.5]` |
| `duration` | [min, max] glitch duration (s)               | `[0.6, 1.0]` |
| `strength` | [weak, strong] glitch intensity              | `[0.3, 1.0]` |
| `mode`     | `SPORADIC`, `CONSTANT_MILD`, `CONSTANT_WILD` | `SPORADIC`   |
| `active`   | Enable/disable                               | -            |

### ChromaticAberrationPmndrs

Color fringing:

```vue
<ChromaticAberrationPmndrs :offset="[0.002, 0.002]" />
```

### VignettePmndrs

Darkened edges:

```vue
<VignettePmndrs :darkness="0.5" :offset="0.3" />
```

### NoisePmndrs

Film grain:

```vue
<NoisePmndrs :opacity="0.1" />
```

### OutlinePmndrs

Object outlines:

```vue
<OutlinePmndrs
  :selected-objects="[meshRef]"
  :edge-strength="3"
  :pulse-speed="0"
  visible-edge-color="#ffffff"
  hidden-edge-color="#22090a"
/>
```

### Other Pmndrs Effects

| Effect                     | Description                 |
| -------------------------- | --------------------------- |
| `AsciiPmndrs`              | ASCII art rendering         |
| `BarrelBlurPmndrs`         | Barrel distortion with blur |
| `BrightnessContrastPmndrs` | Adjust brightness/contrast  |
| `ColorAveragePmndrs`       | Grayscale conversion        |
| `ColorDepthPmndrs`         | Reduce color depth          |
| `DotScreenPmndrs`          | Dot matrix effect           |
| `FishEyePmndrs`            | Fisheye lens distortion     |
| `FXAAPmndrs`               | Fast anti-aliasing          |
| `GodRaysPmndrs`            | Volumetric light rays       |
| `GridPmndrs`               | Grid overlay                |
| `HueSaturationPmndrs`      | Color adjustment            |
| `KuwaharaPmndrs`           | Painterly effect            |
| `LensDistortionPmndrs`     | Lens distortion             |
| `LinocutPmndrs`            | Linocut print effect        |
| `PixelationPmndrs`         | Pixelation                  |
| `ScanlinePmndrs`           | CRT scanlines               |
| `SepiaPmndrs`              | Sepia tone                  |
| `ShockWavePmndrs`          | Shockwave ripple            |
| `SMAAPmndrs`               | Enhanced anti-aliasing      |
| `TexturePmndrs`            | Texture overlay             |
| `TiltShiftPmndrs`          | Miniature effect            |
| `ToneMappingPmndrs`        | Tone mapping                |

## Effect Stacking

Effects apply in order. Combine for complex looks:

```vue
<EffectComposerPmndrs>
  <!-- Base effects first -->
  <SMAAPmndrs />

  <!-- Main effects -->
  <BloomPmndrs :intensity="2" />
  <DepthOfFieldPmndrs :focus-distance="0.5" />

  <!-- Color grading -->
  <VignettePmndrs :darkness="0.3" />
  <NoisePmndrs :opacity="0.05" />
</EffectComposerPmndrs>
```

## Performance

1. **Use Pmndrs** - effects are merged into fewer passes
2. **Limit effects** - each adds GPU cost
3. **Consider mobile** - reduce or disable on low-end devices
4. **Wrap in Suspense** - effects load asynchronously

```vue
<Suspense>
  <EffectComposerPmndrs>
    <!-- effects -->
  </EffectComposerPmndrs>
</Suspense>
```
