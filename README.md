# nuxt-skills

Vue, Nuxt, and NuxtHub skills for AI coding assistants.

## Skills

| Skill | Description |
|-------|-------------|
| **vue** | Vue 3 Composition API, components, composables, testing |
| **nuxt** | Nuxt 4+ server routes, routing, middleware, config |
| **nuxthub** | NuxtHub v0.10 database, KV, blob, cache, multi-cloud |

## Installation

### Claude Code

```bash
/plugin marketplace add onmax/nuxt-skills
/plugin install vue@nuxt-skills
/plugin install nuxt@nuxt-skills
/plugin install nuxthub@nuxt-skills
```

### OpenCode

```bash
curl -fsSL https://raw.githubusercontent.com/onmax/nuxt-skills/main/scripts/opencode.sh | bash
```

Specific skill:
```bash
curl -fsSL https://raw.githubusercontent.com/onmax/nuxt-skills/main/scripts/opencode.sh | bash -s -- vue
```

### Manual (Claude Code)

```bash
git clone https://github.com/onmax/nuxt-skills.git
cp -r nuxt-skills/skills/vue ~/.claude/skills/
cp -r nuxt-skills/skills/nuxt ~/.claude/skills/
cp -r nuxt-skills/skills/nuxthub ~/.claude/skills/
```

## Structure

```
nuxt-skills/
├── skills/                 # Source (Claude Code format)
│   ├── vue/
│   ├── nuxt/
│   └── nuxthub/
├── scripts/
│   └── opencode.sh        # OpenCode installer
└── .claude-plugin/
    └── marketplace.json   # Claude Code marketplace
```

## License

MIT
