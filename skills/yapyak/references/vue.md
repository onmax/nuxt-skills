# Vue

Vue 3.4+ with Vite. Nuxt wraps this file in a module: [nuxt.md](nuxt.md).

### Packages

```bash
npm install yapyak @yapyak/vite @yapyak/vue
```

### Build config

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { yapyak } from '@yapyak/vite';

export default defineConfig({
  plugins: [vue(), yapyak()]
});
```

### `yapyak.config.ts`

```ts [yapyak.config.ts]
import { defineConfig } from 'yapyak/config';
import { vue } from '@yapyak/vue/processor';

export default defineConfig({
  processors: [vue()],
  syncHtmlAttributes: true
});
```

### Types

Add `.yapyak/types.d.ts` and `yapyak.config.ts` to `include` in `tsconfig.json`.

### Where `t()` works

Any `.ts` or `.js` file, plus `<script>` blocks and `<template>` expressions in `.vue` files. Import `t` in `<script setup>`; the template sees it.

### Component

```vue
<script setup lang="ts">
import { t } from 'yapyak';
</script>

<template>
  <button>{{ t('Save changes') }}</button>
</template>
```

Install no Vue plugin and provide nothing: a component that calls `t()` reads the locale `customRef` and re-renders on a locale change.

### Locale

```vue
<script setup lang="ts">
import { locale } from '@yapyak/vue';
import { t } from 'yapyak';
</script>

<template>
  <button @click="locale = locale === 'en' ? 'sv' : 'en'">
    {{ t('Switch language') }}
  </button>
</template>
```

`locale` is a `Ref<Locale>`. Read `locale.value` in script and `locale` in a template; assign to switch.

### Text direction

`textDirection` from `@yapyak/vue` is a `Readonly<Ref<TextDirection>>`.

```vue
<p :dir="textDirection">{{ t('Save changes') }}</p>
```

### Locale switcher

```vue
<script setup lang="ts">
import { locale } from '@yapyak/vue';
import { format, locales } from 'yapyak';
</script>

<template>
  <select v-model="locale">
    <option v-for="value in locales" :key="value" :value="value">
      {{ format.in(value).displayName(value, 'language') }}
    </option>
  </select>
</template>
```

### Rich text

```vue
<script setup lang="ts">
import { RichText } from '@yapyak/vue';
import { t } from 'yapyak';
</script>

<template>
  <p>
    <RichText :value="t('Read our <link>privacy policy</link> for details.')">
      <template #link="{ children }">
        <a href="/privacy"><component :is="children" /></a>
      </template>
    </RichText>
  </p>
</template>
```

```vue
<RichText :value="t('Line one<br/>line two')">
  <template #br>
    <br />
  </template>
</RichText>
```

A tag is a named slot. A pair-tag slot receives `{ children }`; render it with `<component :is="children" />`. A void-tag slot receives nothing.

### Fixed-locale build

```ts
yapyak({ fixedLocale: process.env.YAPYAK_LOCALE })
```

### Quirks

- A missing slot is not a compile error: the tag renders as literal text at runtime. Check every tag in the source has a `<template #name>`. A slot for a tag the source lacks is a type error.
- Write `t()` in a template exactly as in script. The processor reads mustache and directive expressions, including `:title="t('Settings')"`.
