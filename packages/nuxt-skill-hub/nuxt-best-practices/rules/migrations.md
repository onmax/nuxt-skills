## Migrations and Compatibility

### `migration-reversible-slices`: Perform migrations in reversible slices
**Apply when:** upgrading Nuxt, Nitro, h3, or a module across major or minor versions.
**Skip when:** the migration cannot be tested incrementally; say so instead of shipping one large change.

Split the upgrade into small commits (dependency bump, config keys, one API family at a time) and validate after each.

**Why:** each slice must be checked on both the SSR render path and client hydration, which a single large diff makes impossible to bisect.
**Verify:** every slice reverts independently and has its own validation step.

### `migration-upgrade-touched-deprecations`: Remove deprecated APIs in touched areas
**Apply when:** editing files that already use deprecated Nuxt, Nitro, or h3 patterns.
**Skip when:** the replacement API is not yet stable in the target version.

Upgrade deprecated usage in the code path you are already changing; do not leave old and new patterns mixed there.

**Why:** official migration guides map each deprecation to its replacement; ad hoc substitutes drift from them.
**Verify:** no deprecated symbols remain in modified files, and each replacement follows the official mapping.

### `migration-verify-ssr-and-hydration`: Verify both server render and hydration behavior after each slice
**Apply when:** a migration touches rendering, data fetching, plugins, or runtime config.
**Skip when:** no runnable app context exists; report that runtime checks were not done.

After each slice, run the app (`nuxi dev`, or `nuxi build` + `nuxi preview`) and check SSR HTML, browser console hydration warnings, critical async-data paths, and client-side route navigation.

**Why:** Nuxt migrations can pass type checks and build while still regressing payload transfer or hydration.
**Verify:** no hydration mismatch warnings and no duplicate initial fetches on hydration.
