# Template regeneration in development

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
