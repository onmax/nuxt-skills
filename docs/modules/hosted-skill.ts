import { promises as fsp } from 'node:fs'
import { defineNuxtModule } from 'nuxt/kit'
import { dirname, join, resolve } from 'pathe'
import { loadNuxtRuleFilesFromDir } from '../../packages/nuxt-skill-hub/shared/nuxt-content.ts'
import { createSkillEntrypoint, DEFAULT_NUXT_CONTENT_METADATA, selectLinkedPacks } from '../../packages/nuxt-skill-hub/shared/skill-render.ts'
import { loadVueSkillFilesFromDir } from '../../packages/nuxt-skill-hub/shared/vue-content.ts'

const SKILL_NAME = 'nuxt'

/** Where the generated skill is written, relative to the docs root. `agentDiscovery.skills.dir` in nuxt.config.ts must match. */
export const HOSTED_SKILLS_DIR = 'node_modules/.cache/hosted-skills'

const projectGuidanceSection = `## Project-specific guidance
This hosted skill covers Nuxt itself. Module APIs (Nuxt UI, Nuxt Content, NuxtHub, and others) change between versions, so check the installed module's docs before relying on exact props or options.

For guidance that matches the modules and versions installed in a project, add the Nuxt module there:

\`\`\`bash
npx nuxi module add nuxt-skill-hub
\`\`\`

\`nuxt prepare\` then writes a local skill that also includes each installed module's skill.`

/** The files of the hosted `nuxt` skill: the same router and rule packs the Nuxt module writes, without project modules. */
export async function buildHostedSkillFiles(repoRoot: string): Promise<Record<string, string>> {
  const [nuxtFiles, vueFiles] = await Promise.all([
    loadNuxtRuleFilesFromDir(join(repoRoot, 'packages/nuxt-skill-hub/nuxt-best-practices')),
    loadVueSkillFilesFromDir(join(repoRoot, 'skills/vue-best-practices')),
  ])
  const entrypointOptions = {
    moduleAuthoring: true,
    installedPackages: DEFAULT_NUXT_CONTENT_METADATA.packs.flatMap(pack => pack.packages || []),
    extraSections: [projectGuidanceSection],
  }
  const files: Record<string, string> = {
    'SKILL.md': createSkillEntrypoint(SKILL_NAME, DEFAULT_NUXT_CONTENT_METADATA, entrypointOptions),
  }
  for (const pack of selectLinkedPacks(DEFAULT_NUXT_CONTENT_METADATA, entrypointOptions))
    files[`references/nuxt/${pack.relativePath}`] = nuxtFiles[pack.relativePath]!
  for (const [path, contents] of Object.entries(vueFiles))
    files[`references/vue/${path}`] = contents
  return files
}

// Writes the hosted skill before @vite-hub/docs installs nuxt-agent-discovery, which scans HOSTED_SKILLS_DIR, so
// `npx skills add https://nuxt-skill.onmax.me/` installs it. List this module before `@vite-hub/docs/nuxt`.
export default defineNuxtModule({
  meta: { name: 'hosted-skill' },
  async setup(_options, nuxt) {
    const outDir = join(nuxt.options.rootDir, HOSTED_SKILLS_DIR)
    const files = await buildHostedSkillFiles(resolve(nuxt.options.rootDir, '..'))
    await fsp.rm(outDir, { recursive: true, force: true })
    for (const [path, contents] of Object.entries(files)) {
      const target = join(outDir, SKILL_NAME, path)
      await fsp.mkdir(dirname(target), { recursive: true })
      await fsp.writeFile(target, contents, 'utf8')
    }
  },
})
