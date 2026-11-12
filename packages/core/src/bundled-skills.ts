import type { InstalledPackageMetadata } from './internal'
import type { ResolvedContribution } from './types'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'mlly'
import { dirname, resolve } from 'pathe'
import { normalizeContribution } from './internal'

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// The published package carries a copy made by `prepack`. In this repository, read `skills/` directly.
const SKILL_ROOTS = [
  resolve(PACKAGE_ROOT, 'skills'),
  resolve(PACKAGE_ROOT, '../../skills'),
]

/**
 * nuxt-skills skills linked when the app installs one of these Nuxt modules.
 * The module's own skill, shipped in its package, wins over these.
 */
export const BUNDLED_SKILL_PACKAGES: Record<string, string[]> = {
  'comark': ['@comark/nuxt'],
  'nanime': ['nanime'],
  'nuxt-better-auth': ['@nuxtjs/better-auth', '@onmax/nuxt-better-auth'],
  'nuxt-content': ['@nuxt/content'],
  'nuxt-i18n': ['@nuxtjs/i18n'],
  'nuxt-protokit': ['@websideproject/nuxt-protokit'],
  'nuxt-seo': ['@nuxtjs/seo'],
  'nuxt-studio': ['nuxt-studio'],
  'nuxt-ui': ['@nuxt/ui'],
  'nuxt-users': ['nuxt-users'],
  'nuxthub': ['@nuxthub/core'],
  'pinia': ['@pinia/nuxt'],
  'regle': ['@regle/nuxt'],
  'reka-ui': ['reka-ui'],
  'unocss': ['@unocss/nuxt'],
  'vueuse-functions': ['@vueuse/nuxt'],
  'yapyak': ['@yapyak/nuxt'],
}

/** Every skill the published package must carry. */
export const BUNDLED_SKILL_NAMES = ['vue-best-practices', ...Object.keys(BUNDLED_SKILL_PACKAGES)]

export function resolveBundledSkillDir(skillName: string): string {
  const dir = SKILL_ROOTS.map(root => resolve(root, skillName)).find(candidate => existsSync(resolve(candidate, 'SKILL.md')))
  if (!dir)
    throw new Error(`Bundled skill "${skillName}" is missing. Looked in: ${SKILL_ROOTS.join(', ')}`)
  return dir
}

/** One contribution per installed package that maps to a bundled skill, skipping packages in `exclude`. */
export function collectBundledContributions(installedPackages: InstalledPackageMetadata[], exclude: Set<string>): ResolvedContribution[] {
  const contributions: ResolvedContribution[] = []
  for (const pkg of installedPackages) {
    if (exclude.has(pkg.packageName))
      continue
    for (const [skillName, packageNames] of Object.entries(BUNDLED_SKILL_PACKAGES)) {
      if (!packageNames.includes(pkg.packageName))
        continue
      const sourceDir = resolveBundledSkillDir(skillName)
      contributions.push(normalizeContribution({
        packageName: pkg.packageName,
        version: pkg.version,
        sourceDir,
        skillName,
        sourceKind: 'bundled',
        resolver: 'bundled',
        official: false,
        repoUrl: 'https://github.com/onmax/nuxt-skills',
      }, sourceDir, sourceDir))
    }
  }
  return contributions
}
