import { describe, expect, it } from 'vitest'
import { findPackageOverride } from '../src/package-overrides'

describe('package overrides', () => {
  it('routes both VueUse packages to the upstream VueUse skill', () => {
    for (const packageName of ['@vueuse/core', '@vueuse/nuxt']) {
      expect(findPackageOverride(packageName)).toMatchObject({
        repo: 'vueuse/vueuse',
        path: 'skills/vueuse-functions',
        skillName: 'vueuse-functions',
      })
    }
  })

  it('routes Content and Studio to curated community guidance', () => {
    for (const packageName of ['@nuxt/content', 'nuxt-studio']) {
      expect(findPackageOverride(packageName)).toMatchObject({
        repo: 'onmax/nuxt-skills',
        official: false,
      })
    }
  })
})
