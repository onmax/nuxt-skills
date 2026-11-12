import { defineNuxtConfig } from 'nuxt/config'
import SkillHubModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [SkillHubModule],
  skillHub: {
    moduleAuthoring: true,
    targets: ['claude-code'],
  },
} as any)
