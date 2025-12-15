<p align="center">
  <img src="https://raw.githubusercontent.com/onmax/nuxt-skills/main/.github/nuxt-skills.webp" alt="Nuxt Skills" width="100%">
  <br>
  <sub>Design inspired by <a href="https://github.com/HugoRCD">HugoRCD</a>'s work</sub>
</p>

<p align="center">Vue, Nuxt, and NuxtHub skills for AI coding assistants.</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/onmax/nuxt-skills/main/.github/badge-claude-code.svg" alt="Claude Code">
  <img src="https://raw.githubusercontent.com/onmax/nuxt-skills/main/.github/badge-opencode.svg" alt="OpenCode">
</p>

## Skills

| Skill            | Description                                                               |
| ---------------- | ------------------------------------------------------------------------- |
| **vue**          | Vue 3 Composition API, components, composables, testing                   |
| **nuxt**         | Nuxt 4+ server routes, routing, middleware, config                        |
| **nuxt-modules** | Creating Nuxt modules with defineNuxtModule, Kit utilities, testing       |
| **nuxthub**      | NuxtHub v0.10 database, KV, blob, cache, multi-cloud                      |
| **nuxt-content** | Nuxt Content v3 collections, queries, MDC rendering, NuxtStudio           |
| **nuxt-ui**      | Nuxt UI v4 components, theming, forms, overlays, composables              |
| **reka-ui**      | Reka UI headless Vue components, accessible primitives, props/emits/slots |

## Installation

### Claude Code

```bash
/plugin marketplace add onmax/nuxt-skills
/plugin install vue@nuxt-skills
/plugin install nuxt@nuxt-skills
/plugin install nuxt-modules@nuxt-skills
/plugin install nuxthub@nuxt-skills
/plugin install nuxt-content@nuxt-skills
/plugin install nuxt-ui@nuxt-skills
/plugin install reka-ui@nuxt-skills
```

### OpenCode

```bash
curl -fsSL https://raw.githubusercontent.com/onmax/nuxt-skills/main/scripts/opencode.sh | bash
```

Specific skill:

```bash
curl -fsSL https://raw.githubusercontent.com/onmax/nuxt-skills/main/scripts/opencode.sh | bash -s -- vue
```

Re-run to update.

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
cp -r nuxt-skills/skills/reka-ui ~/.claude/skills/
```

## Structure

```
nuxt-skills/
├── skills/                 # Source (Claude Code format)
│   ├── vue/
│   ├── nuxt/
│   ├── nuxt-modules/
│   ├── nuxthub/
│   ├── nuxt-content/
│   ├── nuxt-ui/
│   └── reka-ui/
├── scripts/
│   └── opencode.sh        # OpenCode installer
└── .claude-plugin/
    └── marketplace.json   # Claude Code marketplace
```

## License

MIT
