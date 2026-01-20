/**
 * Auto-generates VueUse composable documentation files
 *
 * Run: npx tsx skills/vueuse/scripts/generate-composables.ts
 *
 * Clones VueUse repo (sparse checkout), parses composable docs + TypeScript source, generates:
 * - references/composables.md (index by category)
 * - composables/<name>.md (per-composable docs with options/returns tables)
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

interface OptionInfo {
  name: string
  type: string
  description: string
  default?: string
}

interface ReturnInfo {
  name: string
  type: string
  description?: string
}

interface ComposableInfo {
  name: string
  description: string
  category: string
  package: string
  usage?: string
  options: OptionInfo[]
  returns: ReturnInfo[]
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
  if (!match)
    return {}
  const lines = match[1].split('\n')
  const result: Record<string, string> = {}
  for (const line of lines) {
    const [key, ...values] = line.split(':')
    if (key && values.length)
      result[key.trim()] = values.join(':').trim()
  }
  return result
}

// Extract first paragraph as description
function extractDescription(content: string): string {
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n*/, '')
  const lines = withoutFrontmatter.split('\n')
  let desc = ''
  let inCodeBlock = false

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      if (desc)
        break
      continue
    }
    if (inCodeBlock)
      continue
    if (line.startsWith('#'))
      continue
    if (!line.trim() && !desc)
      continue
    if (!line.trim() && desc)
      break
    if (line.trim().startsWith(':::'))
      break

    desc += (desc ? ' ' : '') + line.trim()
  }

  return desc
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`[^`]+`/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Extract first code block as usage example
function extractUsage(content: string): string | undefined {
  const match = content.match(/```(?:ts|typescript|vue|js|javascript)\n([\s\S]*?)```/)
  return match?.[1]?.trim()
}

// Extract options from TypeScript interface
function extractOptions(tsContent: string, composableName: string): OptionInfo[] {
  const options: OptionInfo[] = []

  // Look for Options interface (e.g., UseMouseOptions, UseFetchOptions)
  const pascalName = composableName.charAt(0).toUpperCase() + composableName.slice(1)
  const interfacePatterns = [
    new RegExp(`interface\\s+${pascalName}Options[^{]*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}`, 's'),
    new RegExp(`interface\\s+${pascalName}Option[^{]*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}`, 's'),
  ]

  let interfaceContent = ''
  for (const pattern of interfacePatterns) {
    const match = tsContent.match(pattern)
    if (match) {
      interfaceContent = match[1]
      break
    }
  }

  if (!interfaceContent)
    return options

  // Parse each property with JSDoc comments
  // eslint-disable-next-line regexp/no-super-linear-backtracking
  const propRegex = /\/\*\*\s*([\s\S]*?)\*\/\s*(\w+)\??:\s*([^;\n]+)/g

  for (const match of interfaceContent.matchAll(propRegex)) {
    const [, jsdoc, name, type] = match

    // Extract description from JSDoc
    const descMatch = jsdoc.match(/\*\s*([^@*\n][^\n]*)/)?.[1]?.trim() || ''

    // Extract @default value
    const defaultMatch = jsdoc.match(/@default\s+['"`]?([^'"`\n*]+)['"`]?/)?.[1]?.trim()

    options.push({
      name,
      type: type.trim().replace(/\s+/g, ' '),
      description: descMatch,
      default: defaultMatch,
    })
  }

  return options
}

// Extract returns from function
function extractReturns(tsContent: string, composableName: string): ReturnInfo[] {
  const returns: ReturnInfo[] = []

  // Look for return statement with object literal
  const funcPattern = new RegExp(`function\\s+${composableName}[^{]*\\{([\\s\\S]*)`, 's')
  const funcMatch = tsContent.match(funcPattern)
  if (!funcMatch)
    return returns

  // Find the last return statement with object
  const returnPattern = /return\s*\{([^}]+)\}/g
  const matches = [...funcMatch[1].matchAll(returnPattern)]
  const lastMatch = matches.at(-1)

  if (!lastMatch)
    return returns

  // Parse returned properties
  const props = lastMatch[1].split(',').map(p => p.trim()).filter(Boolean)

  for (const prop of props) {
    // Handle shorthand (e.g., "x") and explicit (e.g., "x: xRef")
    const [name] = prop.split(':').map(s => s.trim())
    if (name && /^\w+$/.test(name)) {
      // Try to find the type from variable declaration
      const typeMatch = tsContent.match(new RegExp(`const\\s+${name}\\s*=\\s*(\\w+)(?:<([^>]+)>)?\\(`))

      let type = 'Ref'
      if (typeMatch) {
        type = typeMatch[2] ? `${typeMatch[1]}<${typeMatch[2]}>` : typeMatch[1]
      }

      returns.push({ name, type })
    }
  }

  return returns
}

// Clone VueUse repo with sparse checkout
function cloneVueUseRepo(): void {
  if (existsSync(TEMP_DIR))
    rmSync(TEMP_DIR, { recursive: true })
  console.log('Cloning VueUse repo (sparse checkout)...')
  execSync(`git clone --depth 1 --filter=blob:none --sparse https://github.com/vueuse/vueuse.git ${TEMP_DIR}`, { stdio: 'inherit' })
  execSync('git sparse-checkout set packages', { cwd: TEMP_DIR, stdio: 'inherit' })
}

// Find all composable index.md files
function findComposableDocs(): string[] {
  const files: string[] = []
  const packagesDir = join(TEMP_DIR, 'packages')
  if (!existsSync(packagesDir))
    return files

  for (const pkg of readdirSync(packagesDir, { withFileTypes: true })) {
    if (!pkg.isDirectory())
      continue
    const pkgDir = join(packagesDir, pkg.name)

    for (const item of readdirSync(pkgDir, { withFileTypes: true })) {
      if (!item.isDirectory())
        continue
      const indexMd = join(pkgDir, item.name, 'index.md')
      if (existsSync(indexMd))
        files.push(indexMd)
    }
  }
  return files
}

// Parse a composable's documentation
function parseComposable(filePath: string): ComposableInfo | null {
  const content = readFileSync(filePath, 'utf-8')
  const frontmatter = parseFrontmatter(content)

  const parts = filePath.split('/')
  const packagesIdx = parts.findIndex(p => p === 'packages')
  if (packagesIdx === -1)
    return null

  const pkg = parts[packagesIdx + 1]
  const name = parts[packagesIdx + 2]

  if (!frontmatter.category)
    return null

  // Read TypeScript source
  const tsPath = filePath.replace('index.md', 'index.ts')
  let options: OptionInfo[] = []
  let returns: ReturnInfo[] = []

  if (existsSync(tsPath)) {
    const tsContent = readFileSync(tsPath, 'utf-8')
    options = extractOptions(tsContent, name)
    returns = extractReturns(tsContent, name)
  }

  return {
    name,
    description: extractDescription(content),
    category: frontmatter.category,
    package: PACKAGE_MAP[pkg] || `@vueuse/${pkg}`,
    usage: extractUsage(content),
    options,
    returns,
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

  if (info.options.length > 0) {
    content += `
## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
`
    for (const opt of info.options) {
      const type = opt.type.replace(/\|/g, '\\|').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      const def = opt.default || '-'
      content += `| ${opt.name} | \`${type}\` | ${def} | ${opt.description} |\n`
    }
  }

  if (info.returns.length > 0) {
    content += `
## Returns

| Name | Type |
| --- | --- |
`
    for (const ret of info.returns) {
      const type = ret.type.replace(/\|/g, '\\|').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      content += `| ${ret.name} | \`${type}\` |\n`
    }
  }

  content += `
## Reference

[VueUse Docs](https://vueuse.org/core/${info.name}/)
`

  writeFileSync(filePath, content)
}

// Generate index file by category
function generateIndexFile(composables: ComposableInfo[]): void {
  const byCategory: Record<string, ComposableInfo[]> = {}
  for (const c of composables) {
    if (!byCategory[c.category])
      byCategory[c.category] = []
    byCategory[c.category].push(c)
  }

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
      const shortDesc = c.description.length > 60 ? `${c.description.slice(0, 57)}...` : c.description
      content += `| ${c.name} | ${shortDesc} | [${fileName}](../composables/${fileName}) |\n`
    }
    content += '\n'
  }

  writeFileSync(join(REFERENCES_DIR, 'composables.md'), content)
}

// Main
async function main() {
  console.log('VueUse Composables Generator\n')

  mkdirSync(COMPOSABLES_DIR, { recursive: true })
  mkdirSync(REFERENCES_DIR, { recursive: true })

  cloneVueUseRepo()

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

  generateIndexFile(composables)
  console.log('Generated references/composables.md')

  rmSync(TEMP_DIR, { recursive: true })
  console.log('\nDone!')
}

main().catch(console.error)
