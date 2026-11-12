## Module Authoring Conventions

### `module-keep-setup-fast-and-defer-heavy-work`: Keep module setup fast and defer heavy work
**Apply when:** authoring or updating a Nuxt module with runtime behavior.
**Skip when:** initialization must finish before the app or module lifecycle can continue.

```ts
// Wrong: every dev start waits for the download inside setup
import { addTemplate, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  async setup(options) {
    const icons = await downloadIconSet(options.set)
    addTemplate({ filename: 'icons.mjs', getContents: () => serialize(icons) })
  },
})
```

```ts
// Right: setup only registers; the work runs when the template is generated
import { addTemplate, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  setup(options) {
    addTemplate({
      filename: 'icons.mjs',
      getContents: async () => serialize(await downloadIconSet(options.set)),
    })
  },
})
```

**Why:** Nuxt warns when module setup is slow, and slow setup delays dev server and build startup. Move heavy work to hooks, templates, or runtime.
**Verify:** the `defineNuxtModule` setup body has no long awaited operations on the startup path.

`getContents` can run repeatedly during development. Declare its inputs using the guidance below when the supported Nuxt versions allow it.

<!-- BEGIN GENERATED TEMPLATE GUIDANCE -->

<!-- Generated from onmax/nuxt-skills/skills/nuxt-modules/references/template-dependencies.md; SHA-256: 5bcb56943649e4c14c0ac3597b73adff0eb3f7869a40a9abfd04a4b4172abaff. Run pnpm sync:template-guidance; edit the source, not this section. -->

### Template regeneration in development

`addTemplate` and `addTypeTemplate` accept `dependsOn` in Nuxt versions that support template dependency tracking. Check the Nuxt and `@nuxt/kit` versions in your module's compatibility range before using it.

Dependency declarations are opt-in because Nuxt cannot infer what a module's template reads. With no declaration, `getContents` templates regenerate on watched file changes; `src` templates default to regenerating only when their source changes.

Choose a declaration that matches the generated output's inputs:

| Inputs | Declaration |
| --- | --- |
| Configuration or which files exist, without reading file contents | `dependsOn: []` |
| Nuxt pages or plugins | `dependsOn: ['pages']` or `dependsOn: ['plugins']` |
| Custom file contents | A predicate such as `dependsOn: ({ path }) => path.endsWith('.yaml')` |

For a template whose output depends only on module options:

```ts
addTemplate({
  filename: 'my-module/config.mjs',
  dependsOn: [],
  getContents: () => `export default ${JSON.stringify(options)}`,
})
```

The same declaration works on `addTypeTemplate`. `dependsOn: []` skips regeneration on edits to existing watched files. It does not make a template run only once: adding or removing files and explicit regeneration through `updateTemplates` can still regenerate it.

Predicates filter file events; they do not establish filesystem watchers. Ensure custom inputs are watched, for example through `nuxt.options.watch`. An incomplete dependency declaration can leave generated output stale. Keep the default when the inputs are uncertain.

Verify in development by editing a relevant input and an unrelated watched file, then adding/removing an input and explicitly regenerating the template. Check both the generated contents and whether `getContents` ran.

See [Nuxt Kit: skipping regeneration in development](https://nuxt.com/docs/4.x/api/kit/templates#skipping-regeneration-in-development).

<!-- END GENERATED TEMPLATE GUIDANCE -->

### `module-prefix-public-exports`: Prefix public exports and routes
**Apply when:** adding module composables, components, plugins, or server routes.
**Skip when:** a backward-compatibility policy requires legacy unprefixed aliases.

```ts
import { addComponentsDir, addImports, addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  setup() {
    const { resolve } = createResolver(import.meta.url)
    addImports({ name: 'useFooData', from: resolve('./runtime/composables') }) // not useData
    addComponentsDir({ path: resolve('./runtime/components'), prefix: 'Foo' }) // <FooButton>
    addServerHandler({ route: '/api/_foo/session', handler: resolve('./runtime/server/session') }) // not /api/auth
  },
})
```

**Why:** unprefixed module routes and components collide with app code and other modules.
**Verify:** every exported composable, component, and server route carries the module's prefix.

### `module-public-kit-apis-only`: Prefer documented Nuxt Kit APIs over internals
**Apply when:** implementing module behavior or code generation.
**Skip when:** the behavior has no documented public API yet (pin and document the internal dependency).

```ts
// Wrong: deep imports like 'nuxt/dist/...', underscored nuxt.options fields, undocumented hooks
// Right:
import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: { name: 'foo', configKey: 'foo', compatibility: { nuxt: '>=3.12.0' } },
  setup() {
    addPlugin(createResolver(import.meta.url).resolve('./runtime/plugin'))
  },
})
```

**Why:** private internals can break in minor or patch releases even when declared compatibility looks broad.
**Verify:** imports come from `@nuxt/kit` or documented hooks only, and `meta.compatibility` is set.

### `module-skill-scope-only`: Scope module skills to module APIs only
**Apply when:** publishing `agents.skills` with a module.
**Skip when:** never; a module skill that adds global rules unrelated to the module is out of scope and should be cut.

Document only the module's APIs, integration points, and module-specific caveats. Leave general Nuxt guidance to Nuxt's own skills.

**Why:** module guidance can override Nuxt guidance only inside that module's explicit scope.
**Verify:** frontmatter, rule text, and examples are module-scoped and match the module version.
