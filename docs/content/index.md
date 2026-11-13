---
title: Teach your coding agent Nuxt and Vue
description: Agent skills for Nuxt and Vue. Install them as a plugin, pick them one by one, or let a Nuxt module write the ones your project needs.
layout: landing
seo:
  title: nuxt-skills, agent skills for Nuxt and Vue
---

Coding agents learned Nuxt from old code. They mix Nuxt 3 and Nuxt 4, guess module options, and miss what changed last month. A skill is a folder of Markdown that the agent reads before it writes code, so it follows the current docs instead of what it remembers.

nuxt-skills is a set of those skills for Nuxt, Vue, and their ecosystem, and a Nuxt module that picks the right ones for your project.

## Pick how you install

| You use | Install | You get |
| --- | --- | --- |
| Claude Code or Codex | The [plugin](/getting-started/install#plugin) | Every skill, updated with the plugin, and the Nuxt MCP server |
| Any agent | [`npx skills add onmax/nuxt-skills`](/getting-started/install#skills-cli) | The skills you pick, copied into your project or home folder |
| A Nuxt project | [`npx nuxi module add nuxt-skill-hub`](/getting-started/install#nuxt-module) | One skill written for your project and its modules on every `nuxt prepare` |

Not sure? Read [What nuxt-skills is](/getting-started).

::card-group
:::card{title="Install" icon="i-lucide-download" to="/getting-started/install"}
The plugin, the skills CLI, the Nuxt module, or by hand.
:::

:::card{title="All skills" icon="i-lucide-library" to="/skills/catalog"}
What each skill covers and where it comes from.
:::

:::card{title="How the Nuxt module works" icon="i-simple-icons-nuxtdotjs" to="/nuxt-module"}
How it finds a skill for each module you install.
:::

:::card{title="Ship a skill in your module" icon="i-lucide-package" to="/nuxt-module/module-authors"}
Let every app that installs your module give its agent your docs.
:::
::
