import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'
import SkillHubModule from '../../../src/module'

const manualSkillRoot = fileURLToPath(new URL('./manual-skill', import.meta.url))

export default defineNuxtConfig({
  modules: [SkillHubModule],
  hooks: {
    'skill-hub:contribute': (ctx) => {
      ctx.add({
        packageName: 'test-manual-contribution',
        sourceDir: manualSkillRoot,
      })
    },
  },
  skillHub: {
    targets: ['claude-code'],
  },
} as any)
