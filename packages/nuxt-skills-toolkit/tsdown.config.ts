import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/module.ts', 'src/cli/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['nuxt', '@nuxt/kit', '@nuxt/schema'],
})
