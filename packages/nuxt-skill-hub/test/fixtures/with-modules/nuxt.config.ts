import { defineNuxtConfig } from 'nuxt/config'
import SkillHubModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    SkillHubModule,
    'test-nuxt-ui',
    'test-nuxt-seo',
    'test-nuxt-bad',
    'test-meta-router',
  ],
  skillHub: {
    targets: ['claude-code'],
    remote: false,
  },
} as any)
