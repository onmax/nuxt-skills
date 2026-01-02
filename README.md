<p align="center">
  <img src="https://raw.githubusercontent.com/onmax/nuxt-skills/main/.github/nuxt-skills.webp" alt="Nuxt Skills" width="100%">
  <br>
  <sub>Design inspired by <a href="https://github.com/HugoRCD">HugoRCD</a>'s work</sub>
</p>

<p align="center">Vue, Nuxt, and NuxtHub skills for AI coding assistants.</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/onmax/nuxt-skills/main/.github/badge-claude-code.svg" alt="Claude Code">
  <img src="https://raw.githubusercontent.com/onmax/nuxt-skills/main/.github/badge-copilot.svg" alt="GitHub Copilot">
  <img src="https://raw.githubusercontent.com/onmax/nuxt-skills/main/.github/badge-codex.svg" alt="OpenAI Codex">
  <img src="https://raw.githubusercontent.com/onmax/nuxt-skills/main/.github/badge-opencode.svg" alt="OpenCode">
</p>

## Skills

| Skill                | Description                                                                     |
| -------------------- | ------------------------------------------------------------------------------- |
| **vue**              | Vue 3 Composition API, components, composables, testing                         |
| **nuxt**             | Nuxt 4+ server routes, routing, middleware, config                              |
| **nuxt-modules**     | Creating Nuxt modules with defineNuxtModule, Kit utilities, testing             |
| **nuxthub**          | NuxtHub v0.10 database, KV, blob, cache, multi-cloud                            |
| **nuxt-content**     | Nuxt Content v3 collections, queries, MDC rendering, NuxtStudio                 |
| **nuxt-ui**          | Nuxt UI v4 components, theming, forms, overlays, composables                    |
| **nuxt-better-auth** | Auth with @onmax/nuxt-better-auth, useUserSession, route protection, plugins    |
| **reka-ui**          | Reka UI headless Vue components, accessible primitives, props/emits/slots       |
| **document-writer**  | Writing documentation for Nuxt ecosystem - MDC, style, structure, code examples |
| **ts-library**       | TypeScript library authoring - exports, tsdown, API patterns, type tricks, CI   |

## How Skills Work

Skills are **auto-activated by AI agents** based on context - not manually invoked.

| You're working on... | Agent automatically uses... |
| -------------------- | --------------------------- |
| `.vue` file          | `vue` skill                 |
| `server/api/` route  | `nuxt` skill                |
| `nuxt.config.ts`     | `nuxt` skill                |
| NuxtHub storage      | `nuxthub` skill             |
| Auth/login/session   | `nuxt-better-auth` skill    |

The agent reads the skill's `description` field and decides when to load it. This follows the [Agent Skills](https://agentskills.io) open format.

## Installation

### Claude Code

```bash
/plugin marketplace add onmax/nuxt-skills
/plugin install nuxt-skills@nuxt-skills
```

This installs all skills (vue, nuxt, nuxt-modules, nuxthub, nuxt-content, nuxt-ui, nuxt-better-auth, reka-ui, document-writer, ts-library). Skills appear in `/skills` list and auto-activate based on context.

### GitHub Copilot

Copy skills to your project's `.github/skills/` directory:

```bash
git clone https://github.com/onmax/nuxt-skills.git
cp -r nuxt-skills/skills/vue .github/skills/
cp -r nuxt-skills/skills/nuxt .github/skills/
cp -r nuxt-skills/skills/nuxt-modules .github/skills/
cp -r nuxt-skills/skills/nuxthub .github/skills/
cp -r nuxt-skills/skills/nuxt-content .github/skills/
cp -r nuxt-skills/skills/nuxt-ui .github/skills/
cp -r nuxt-skills/skills/nuxt-better-auth .github/skills/
cp -r nuxt-skills/skills/reka-ui .github/skills/
cp -r nuxt-skills/skills/document-writer .github/skills/
cp -r nuxt-skills/skills/ts-library .github/skills/
```

Copilot auto-detects skills matching your prompt context.

### OpenAI Codex

Use the built-in skill installer:

```
$skill-installer https://github.com/onmax/nuxt-skills
```

Or copy skills to your `.codex/skills/` directory:

```bash
git clone https://github.com/onmax/nuxt-skills.git
cp -r nuxt-skills/skills/vue ~/.codex/skills/
cp -r nuxt-skills/skills/nuxt ~/.codex/skills/
cp -r nuxt-skills/skills/nuxt-modules ~/.codex/skills/
cp -r nuxt-skills/skills/nuxthub ~/.codex/skills/
cp -r nuxt-skills/skills/nuxt-content ~/.codex/skills/
cp -r nuxt-skills/skills/nuxt-ui ~/.codex/skills/
cp -r nuxt-skills/skills/nuxt-better-auth ~/.codex/skills/
cp -r nuxt-skills/skills/reka-ui ~/.codex/skills/
cp -r nuxt-skills/skills/document-writer ~/.codex/skills/
cp -r nuxt-skills/skills/ts-library ~/.codex/skills/
```

Invoke skills with `/skills` command or `$skill-name`.

### OpenCode

OpenCode will support the [agentskills](https://github.com/agentskills/agentskills) standard natively. This repo follows that format.

### btca

[btca](https://github.com/davis7dotsh/better-context) searches repos locally to answer questions.

```bash
bun add -g btca
btca config repos add -n nuxt -u https://github.com/onmax/nuxt-skills -b main --notes "Nuxt 4, Vue 3, NuxtHub patterns. Check skills/ folder."
```

Ask questions:

```bash
btca ask -t nuxt -q "How do I create a server route with validation?"
btca chat -t nuxt  # interactive mode
```

### Manual (Claude Code)

```bash
git clone https://github.com/onmax/nuxt-skills.git
cp -r nuxt-skills/skills/vue ~/.claude/skills/
cp -r nuxt-skills/skills/nuxt ~/.claude/skills/
cp -r nuxt-skills/skills/nuxt-modules ~/.claude/skills/
cp -r nuxt-skills/skills/nuxthub ~/.claude/skills/
cp -r nuxt-skills/skills/nuxt-content ~/.claude/skills/
cp -r nuxt-skills/skills/nuxt-ui ~/.claude/skills/
cp -r nuxt-skills/skills/nuxt-better-auth ~/.claude/skills/
cp -r nuxt-skills/skills/reka-ui ~/.claude/skills/
cp -r nuxt-skills/skills/document-writer ~/.claude/skills/
cp -r nuxt-skills/skills/ts-library ~/.claude/skills/
```

## Structure

Follows [agentskills](https://github.com/agentskills/agentskills) standard format.

```
nuxt-skills/
├── skills/                 # Skills (agentskills format)
│   ├── vue/
│   │   ├── SKILL.md        # Entry point with frontmatter
│   │   └── references/     # Sub-files loaded on-demand
│   ├── nuxt/
│   ├── nuxt-modules/
│   ├── nuxthub/
│   ├── nuxt-content/
│   ├── nuxt-ui/
│   ├── nuxt-better-auth/
│   ├── reka-ui/
│   ├── document-writer/
│   └── ts-library/
└── .claude-plugin/
    └── marketplace.json    # Claude Code marketplace
```

## Resources

- [Agent Skills Spec](https://agentskills.io) - Open format for extending AI agent capabilities
- [awesome-copilot](https://github.com/github/awesome-copilot) - Community collection of custom agents and prompts
- [Claude Code Skills](https://code.claude.com/docs/en/skills) - Skills in Claude Code

## License

MIT
