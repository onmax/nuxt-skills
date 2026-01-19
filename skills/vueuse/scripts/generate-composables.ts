/**
 * Auto-generates VueUse composable documentation files
 *
 * Run: npx tsx skills/vueuse/scripts/generate-composables.ts
 *
 * Clones VueUse repo (sparse checkout), parses composable docs, generates:
 * - references/composables.md (index by category)
 * - composables/<name>.md (per-composable docs)
 */

import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SKILL_ROOT = resolve(__dirname, '..')
const TEMP_DIR = join(SKILL_ROOT, '.temp-vueuse')
const COMPOSABLES_DIR = join(SKILL_ROOT, 'composables')
const REFERENCES_DIR = join(SKILL_ROOT, 'references')

interface ComposableInfo {
  name: string
  description: string
  category: string
  package: string
  usage?: string
}

// Package to npm package mapping
const PACKAGE_MAP: Record<string, string> = {
  core: '@vueuse/core',
  shared: '@vueuse/shared',
  integrations: '@vueuse/integrations',
  router: '@vueuse/router',
  rxjs: '@vueuse/rxjs',
  firebase: '@vueuse/firebase',
  electron: '@vueuse/electron',
  math: '@vueuse/math',
}

// Convert camelCase to kebab-case
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

// Parse frontmatter from markdown
function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const lines = match[1].split('\n')
  const result: Record<string, string> = {}
  for (const line of lines) {
    const [key, ...values] = line.split(':')
    if (key && values.length) result[key.trim()] = values.join(':').trim()
  }
  return result
}

// Extract first paragraph as description
function extractDescription(content: string): string {
  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n*/, '')
  // Split into lines, skip title
  const lines = withoutFrontmatter.split('\n')
  let desc = ''
  let inCodeBlock = false

  for (const line of lines) {
    // Skip code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      if (desc) break // Stop at first code block if we have description
      continue
    }
    if (inCodeBlock) continue
    // Skip headers
    if (line.startsWith('#')) continue
    // Skip empty lines at the start
    if (!line.trim() && !desc) continue
    // Stop at empty line after getting content
    if (!line.trim() && desc) break
    // Stop at directives
    if (line.trim().startsWith(':::')) break

    desc += (desc ? ' ' : '') + line.trim()
  }

  return desc
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

// Extract first code block as usage example
function extractUsage(content: string): string | undefined {
  const match = content.match(/```(?:ts|typescript|vue|js|javascript)\n([\s\S]*?)```/)
  return match?.[1]?.trim()
}

// Clone VueUse repo with sparse checkout
function cloneVueUseRepo(): void {
  if (existsSync(TEMP_DIR)) rmSync(TEMP_DIR, { recursive: true })
  console.log('Cloning VueUse repo (sparse checkout)...')
  execSync(`git clone --depth 1 --filter=blob:none --sparse https://github.com/vueuse/vueuse.git ${TEMP_DIR}`, { stdio: 'inherit' })
  execSync('git sparse-checkout set packages', { cwd: TEMP_DIR, stdio: 'inherit' })
}

// Find all composable index.md files
function findComposableDocs(): string[] {
  const files: string[] = []
  const packagesDir = join(TEMP_DIR, 'packages')
  if (!existsSync(packagesDir)) return files

  for (const pkg of readdirSync(packagesDir, { withFileTypes: true })) {
    if (!pkg.isDirectory()) continue
    const pkgDir = join(packagesDir, pkg.name)

    for (const item of readdirSync(pkgDir, { withFileTypes: true })) {
      if (!item.isDirectory()) continue
      const indexMd = join(pkgDir, item.name, 'index.md')
      if (existsSync(indexMd)) files.push(indexMd)
    }
  }
  return files
}

// Parse a composable's documentation
function parseComposable(filePath: string): ComposableInfo | null {
  const content = readFileSync(filePath, 'utf-8')
  const frontmatter = parseFrontmatter(content)

  // Extract package from path: packages/<pkg>/<name>/index.md
  const parts = filePath.split('/')
  const packagesIdx = parts.findIndex(p => p === 'packages')
  if (packagesIdx === -1) return null

  const pkg = parts[packagesIdx + 1]
  const name = parts[packagesIdx + 2]

  if (!frontmatter.category) return null

  return {
    name,
    description: extractDescription(content),
    category: frontmatter.category,
    package: PACKAGE_MAP[pkg] || `@vueuse/${pkg}`,
    usage: extractUsage(content),
  }
}

// Generate per-composable markdown file
function generateComposableFile(info: ComposableInfo): void {
  const fileName = `${toKebabCase(info.name)}.md`
  const filePath = join(COMPOSABLES_DIR, fileName)

  let content = `# ${info.name}

${info.description}

**Package:** \`${info.package}\`
**Category:** ${info.category}
`

  if (info.usage) {
    content += `
## Usage

\`\`\`ts
${info.usage}
\`\`\`
`
  }

  content += `
## Reference

[VueUse Docs](https://vueuse.org/core/${info.name}/)
`

  writeFileSync(filePath, content)
}

// Generate index file by category
function generateIndexFile(composables: ComposableInfo[]): void {
  // Group by category
  const byCategory: Record<string, ComposableInfo[]> = {}
  for (const c of composables) {
    if (!byCategory[c.category]) byCategory[c.category] = []
    byCategory[c.category].push(c)
  }

  // Sort categories and composables
  const categories = Object.keys(byCategory).sort()
  for (const cat of categories) {
    byCategory[cat].sort((a, b) => a.name.localeCompare(b.name))
  }

  let content = `# VueUse Composables

> Auto-generated. Run \`npx tsx skills/vueuse/scripts/generate-composables.ts\` to update.

`

  for (const category of categories) {
    content += `## ${category}

| Composable | Description | File |
| --- | --- | --- |
`
    for (const c of byCategory[category]) {
      const fileName = `${toKebabCase(c.name)}.md`
      const shortDesc = c.description.length > 60 ? c.description.slice(0, 57) + '...' : c.description
      content += `| ${c.name} | ${shortDesc} | [${fileName}](../composables/${fileName}) |\n`
    }
    content += '\n'
  }

  writeFileSync(join(REFERENCES_DIR, 'composables.md'), content)
}

// Main
async function main() {
  console.log('VueUse Composables Generator\n')

  // Ensure directories exist
  mkdirSync(COMPOSABLES_DIR, { recursive: true })
  mkdirSync(REFERENCES_DIR, { recursive: true })

  // Clone repo
  cloneVueUseRepo()

  // Find and parse composables
  const docFiles = findComposableDocs()
  console.log(`Found ${docFiles.length} composable docs`)

  const composables: ComposableInfo[] = []
  for (const file of docFiles) {
    const info = parseComposable(file)
    if (info) {
      composables.push(info)
      generateComposableFile(info)
    }
  }

  console.log(`Parsed ${composables.length} composables`)

  // Generate index
  generateIndexFile(composables)
  console.log('Generated references/composables.md')

  // Cleanup
  rmSync(TEMP_DIR, { recursive: true })
  console.log('\nDone!')
}

main().catch(console.error)
