---
name: document-writer
description: Use when writing blog posts or documentation markdown files - provides writing style guide (active voice, present tense), content structure patterns, and MDC component usage. Overrides brevity rules for proper grammar. Use nuxt-content for MDC syntax, nuxt-ui for component props.
license: MIT
---

# Documentation Writer for Nuxt Ecosystem

Writing guidance for blog posts and documentation following patterns from official Nuxt websites.

## When to Use

- Writing blog posts for Nuxt ecosystem projects
- Creating or editing documentation pages
- Ensuring consistent writing style across content

## Writing Standard

**Override**: When writing documentation, maintain proper grammar and complete sentences. The "sacrifice grammar for brevity" rule does NOT apply here.

Documentation must be:

- Grammatically correct
- Clear and unambiguous
- Properly punctuated
- Complete sentences (not fragments)

Brevity is still valued, but never at the cost of clarity or correctness.

## Related Skills

For component and syntax details, use these skills:

| Skill            | Use For                                         |
| ---------------- | ----------------------------------------------- |
| **nuxt-content** | MDC syntax, prose components, code highlighting |
| **nuxt-ui**      | Component props, theming, UI patterns           |

## Available References

| Reference                                                            | Purpose                                         |
| -------------------------------------------------------------------- | ----------------------------------------------- |
| **[references/writing-style.md](references/writing-style.md)**       | Voice, tone, sentence structure                 |
| **[references/content-patterns.md](references/content-patterns.md)** | Blog frontmatter, structure, component patterns |

## Loading Files

**Consider loading these reference files based on your task:**

- [ ] [references/writing-style.md](references/writing-style.md) - if writing prose, improving voice/tone, or structuring sentences
- [ ] [references/content-patterns.md](references/content-patterns.md) - if creating blog posts, setting up frontmatter, or using MDC components

**DO NOT load all files at once.** Load only what's relevant to your current task.

## Quick Reference

### Writing Patterns

| Pattern       | Example                                            |
| ------------- | -------------------------------------------------- |
| Subject-first | "The `useFetch` composable handles data fetching." |
| Imperative    | "Add the following to `nuxt.config.ts`."           |
| Contextual    | "When using authentication, configure..."          |

### Modal Verbs

| Verb     | Meaning     |
| -------- | ----------- |
| `can`    | Optional    |
| `should` | Recommended |
| `must`   | Required    |

### Component Patterns (WHEN to use)

| Need              | Component                         |
| ----------------- | --------------------------------- |
| Info aside        | `::note`                          |
| Suggestion        | `::tip`                           |
| Caution           | `::warning`                       |
| Required          | `::important`                     |
| CTA               | `:u-button{to="..." label="..."}` |
| Multi-source code | `::code-group`                    |

> For component props: see **nuxt-ui** skill

## Headings

- **H1 (`#`)**: No backticks — they don't render properly
- **H2-H4**: Backticks work fine

## Checklist

- [ ] Active voice (85%+)
- [ ] Present tense
- [ ] 2-4 sentences per paragraph
- [ ] Explanation before code
- [ ] File path labels on code blocks
- [ ] Appropriate callout types
- [ ] No backticks in H1 headings
