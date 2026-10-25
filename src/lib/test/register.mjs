/**
 * Lets Node's built-in test runner load app TypeScript modules: resolves the `@/` alias
 * to src/ and extensionless relative imports to .ts files. Run the tests with:
 *
 *   node --experimental-strip-types --no-warnings --import ./src/lib/test/register.mjs --test src/lib/test/*.test.ts
 */
import { register } from "node:module"

register("./resolve-hook.mjs", import.meta.url)
