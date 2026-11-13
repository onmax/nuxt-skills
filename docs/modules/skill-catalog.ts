import { promises as fsp } from 'node:fs'
import { defineNuxtModule } from 'nuxt/kit'
import { join, resolve } from 'pathe'
import { parse } from 'yaml'

// The catalog page is generated from skills/*/SKILL.md, so it can't drift from the plugin. It is written into the
// content folder before @vite-hub/docs reads it, and git ignores it. List this module before `@vite-hub/docs/nuxt`.
export const CATALOG_PAGE = 'content/skills/catalog.md'

const GROUPS: Array<{ title: string, intro: string, skills: string[] }> = [
  {
    title: 'Nuxt',
    intro: 'Nuxt itself, its server engine, and the official and core modules.',
    skills: ['nuxt', 'nitro', 'nuxt-modules', 'nuxthub', 'nuxt-ui', 'nuxt-content', 'nuxt-studio', 'nuxt-i18n', 'nuxt-seo', 'nuxt-better-auth', 'nuxt-users', 'nuxt-protokit'],
  },
  {
    title: 'Vue',
    intro: 'Vue, its router, state, and the libraries most Vue apps use.',
    skills: ['vue', 'vue-best-practices', 'vue-debug-guides', 'vue-router-best-practices', 'vue-testing-best-practices', 'pinia', 'vueuse-functions', 'reka-ui'],
  },
  {
    title: 'Build and test',
    intro: 'The tools under a Nuxt or Vue app.',
    skills: ['vite', 'vitest', 'unocss'],
  },
  {
    title: 'Ecosystem',
    intro: 'Libraries and Nuxt modules from the community. Each skill comes from its own repository.',
    skills: ['arkenv', 'comark', 'eve', 'nanime', 'regle', 'selaras', 'yapyak'],
  },
]

interface CatalogSkill {
  name: string
  description: string
  source: string
}

async function readSkills(repoRoot: string): Promise<CatalogSkill[]> {
  const lock = JSON.parse(await fsp.readFile(join(repoRoot, 'ecosystem-skills.lock.json'), 'utf8')) as {
    skills: Record<string, string>
    sources: Record<string, { repository: string }>
  }
  const skillsDir = join(repoRoot, 'skills')
  const skills: CatalogSkill[] = []
  for (const entry of await fsp.readdir(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory())
      continue
    const markdown = await fsp.readFile(join(skillsDir, entry.name, 'SKILL.md'), 'utf8').catch(() => undefined)
    const frontmatter = markdown?.match(/^---\n([\s\S]*?)\n---/)?.[1]
    if (!frontmatter)
      continue
    const data = parse(frontmatter) as { name?: string, description?: string }
    const sourceName = lock.skills[entry.name]
    const repository = sourceName ? lock.sources[sourceName]?.repository.replace(/\.git$/, '') : undefined
    skills.push({
      name: data.name || entry.name,
      description: (data.description || '').replace(/\s+/g, ' ').trim(),
      source: repository ? `[${repository.replace('https://github.com/', '')}](${repository})` : 'Written here',
    })
  }
  return skills.sort((a, b) => a.name.localeCompare(b.name))
}

/** The first sentence of a description: what the skill covers. The rest says when to load it. */
function summary(description: string): string {
  const match = description.match(/^(.+?[.!?])(\s|$)/)
  return match ? match[1]! : description
}

function cell(text: string): string {
  return text.replace(/\|/g, '\\|')
}

export function renderCatalog(skills: CatalogSkill[]): string {
  const byName = new Map(skills.map(skill => [skill.name, skill]))
  const grouped = new Set(GROUPS.flatMap(group => group.skills))
  const groups = [...GROUPS, { title: 'Other', intro: 'Skills not sorted into a group yet.', skills: skills.map(skill => skill.name).filter(name => !grouped.has(name)) }]
  const sections = groups.map((group) => {
    const rows = group.skills.map(name => byName.get(name)).filter(skill => skill !== undefined).map(skill =>
      `| [\`${skill.name}\`](https://github.com/onmax/nuxt-skills/tree/main/skills/${skill.name}) | ${cell(summary(skill.description))} | ${skill.source} |`)
    if (!rows.length)
      return ''
    return [`## ${group.title}`, '', group.intro, '', '| Skill | Use it for | Source |', '| --- | --- | --- |', ...rows, ''].join('\n')
  }).filter(Boolean)

  return [
    '---',
    'title: All skills',
    'navigation.order: 2',
    `description: The ${skills.length} skills in nuxt-skills, grouped by what they cover, with where each one comes from.`,
    'icon: i-lucide-library',
    '---',
    '',
    `nuxt-skills has ${skills.length} skills. Install all of them with the [plugin](/getting-started/install), or pick some:`,
    '',
    '```bash',
    'npx skills add onmax/nuxt-skills --skill pinia --skill nuxt-ui',
    '```',
    '',
    'Each row shows the first sentence of the skill\'s description. The full description, which your agent reads to decide when to load the skill, is in its `SKILL.md`. "Written here" means the skill is maintained in this repository. The others are copied from their own repository and refreshed by a weekly job.',
    '',
    ...sections,
  ].join('\n')
}

export default defineNuxtModule({
  meta: { name: 'skill-catalog' },
  async setup(_options, nuxt) {
    const skills = await readSkills(resolve(nuxt.options.rootDir, '..'))
    await fsp.writeFile(join(nuxt.options.rootDir, CATALOG_PAGE), renderCatalog(skills), 'utf8')
  },
})
