#!/usr/bin/env npx tsx
/**
 * Generates nuxt-ui component docs from local Nuxt UI docs
 * Run: npx tsx skills/nuxt-ui/scripts/generate-components.ts
 *
 * Requires: ~/nuxt/ui (clone of nuxt/ui repo)
 *
 * Creates:
 *   - components.md (index)
 *   - components/<name>.md (per-component)
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const NUXT_UI_DOCS = process.env.NUXT_UI_DOCS || join(homedir(), 'nuxt/ui/docs/content/docs/2.components')

interface ComponentMeta {
  name: string
  description: string
  category: string
  rekaLink?: string
}

// Category groupings for better organization
const CATEGORIES: Record<string, string> = {
  element: 'Element',
  form: 'Form',
  data: 'Data',
  navigation: 'Navigation',
  overlay: 'Overlay',
  layout: 'Layout',
}

function parseYamlFrontmatter(content: string): { frontmatter: Record<string, any>, body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match)
    return { frontmatter: {}, body: content }

  const frontmatter: Record<string, any> = {}
  const yamlContent = match[1]

  // Simple YAML parsing for our needs
  for (const line of yamlContent.split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx > 0 && !line.startsWith(' ') && !line.startsWith('-')) {
      const key = line.slice(0, colonIdx).trim()
      const value = line.slice(colonIdx + 1).trim()
      frontmatter[key] = value.replace(/^['"]|['"]$/g, '')
    }
  }

  // Parse links for Reka UI reference
  if (yamlContent.includes('reka-ui.com')) {
    const rekaMatch = yamlContent.match(/to:\s*(https:\/\/reka-ui\.com[^\n]+)/)
    if (rekaMatch)
      frontmatter.rekaLink = rekaMatch[1]
  }

  return { frontmatter, body: match[2] }
}

function generateComponentFile(name: string, meta: ComponentMeta, body: string): string {
  const lines: string[] = []
  const displayName = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')

  lines.push(`# ${displayName}`)
  lines.push('')
  lines.push(meta.description)
  lines.push('')

  if (meta.rekaLink) {
    lines.push(`> Based on [Reka UI ${displayName}](${meta.rekaLink})`)
    lines.push('')
  }

  // Extract key props from body text
  const propMentions = body.match(/Use the `(\w+)` prop/g)
  if (propMentions && propMentions.length > 0) {
    lines.push('## Key Props')
    lines.push('')
    const uniqueProps = [...new Set(propMentions.map(m => m.match(/`(\w+)`/)?.[1]).filter(Boolean))]
    for (const prop of uniqueProps.slice(0, 10)) {
      // Find the description after the prop mention
      const propRegex = new RegExp(`Use the \`${prop}\` prop ([^.]+\\.?)`)
      const desc = body.match(propRegex)?.[1] || ''
      lines.push(`- \`${prop}\`: ${desc.replace(/to\s+$/, '').trim()}`)
    }
    lines.push('')
  }

  // Add basic usage
  lines.push('## Usage')
  lines.push('')
  lines.push('```vue')
  lines.push(`<U${displayName}`)
  lines.push(`  <!-- props here -->`)
  lines.push(`/>`)
  lines.push('```')
  lines.push('')

  // Add slot info if present - look for slot mentions in text
  const slotPattern = /`#(\w+)`\{?/g
  const slotMatches = [...body.matchAll(slotPattern)]
  if (slotMatches.length > 0) {
    const validSlots = ['default', 'content', 'header', 'body', 'footer', 'title', 'description', 'leading', 'trailing', 'icon', 'label', 'close', 'trigger', 'actions', 'item', 'empty']
    const uniqueSlots = [...new Set(slotMatches.map(m => m[1]))]
      .filter(s => validSlots.includes(s))
    if (uniqueSlots.length > 0) {
      lines.push('## Slots')
      lines.push('')
      for (const slot of uniqueSlots.slice(0, 8)) {
        lines.push(`- \`#${slot}\``)
      }
      lines.push('')
    }
  }

  return lines.join('\n')
}

async function main() {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const baseDir = join(__dirname, '..')
  const componentsDir = join(baseDir, 'components')

  if (!existsSync(NUXT_UI_DOCS)) {
    console.error(`Error: Nuxt UI docs not found at ${NUXT_UI_DOCS}`)
    console.error('Please clone nuxt/ui to ~/nuxt/ui')
    process.exit(1)
  }

  mkdirSync(componentsDir, { recursive: true })

  console.log('Generating Nuxt UI component docs...')

  const files = readdirSync(NUXT_UI_DOCS).filter(f => f.endsWith('.md') && f !== '0.index.md')
  const components: ComponentMeta[] = []

  for (const file of files) {
    const name = basename(file, '.md')
    const content = readFileSync(join(NUXT_UI_DOCS, file), 'utf-8')
    const { frontmatter, body } = parseYamlFrontmatter(content)

    const meta: ComponentMeta = {
      name,
      description: frontmatter.description || '',
      category: frontmatter.category || 'other',
      rekaLink: frontmatter.rekaLink,
    }
    components.push(meta)

    // Generate component file
    const componentContent = generateComponentFile(name, meta, body)
    writeFileSync(join(componentsDir, `${name}.md`), componentContent)
    console.log(`✓ Generated components/${name}.md`)
  }

  // Generate index
  const index: string[] = []
  index.push('# Components')
  index.push('')
  index.push('> Auto-generated from Nuxt UI docs. Run `npx tsx skills/nuxt-ui/scripts/generate-components.ts` to update.')
  index.push('')

  // Group by category
  const byCategory: Record<string, ComponentMeta[]> = {}
  for (const comp of components) {
    const cat = CATEGORIES[comp.category] || 'Other'
    if (!byCategory[cat])
      byCategory[cat] = []
    byCategory[cat].push(comp)
  }

  for (const [cat, comps] of Object.entries(byCategory).sort((a, b) => a[0].localeCompare(b[0]))) {
    index.push(`## ${cat}`)
    index.push('')
    index.push('| Component | Description |')
    index.push('|-----------|-------------|')
    for (const comp of comps.sort((a, b) => a.name.localeCompare(b.name))) {
      const displayName = comp.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
      index.push(`| [${displayName}](components/${comp.name}.md) | ${comp.description} |`)
    }
    index.push('')
  }

  writeFileSync(join(baseDir, 'components.md'), index.join('\n'))
  console.log('✓ Generated components.md (index)')

  console.log(`\nDone! Generated ${components.length + 1} files.`)
}

main().catch(console.error)
