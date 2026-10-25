/**
 * Lets Node's built-in test runner load the evaluator's TypeScript modules: resolves the `@/` alias
 * to src/ and extensionless relative imports to .ts files. Run the tests with:
 *
 *   node --experimental-strip-types --no-warnings --import ./src/lib/evaluator/test/register.mjs --test src/lib/evaluator/test/*.test.ts
 */
import { register } from "node:module"

register("./resolve-hook.mjs", import.meta.url)
