import { existsSync } from "node:fs"
import { fileURLToPath, pathToFileURL } from "node:url"

const SRC = new URL("../../", import.meta.url)

/** Node resolve hook: `@/x` → src/x, and `./x` → ./x.ts (or ./x/index.ts) when that file exists. */
export async function resolve(specifier, context, next) {
  let target = specifier
  if (specifier.startsWith("@/")) target = new URL(specifier.slice(2), SRC).href
  if (target.startsWith(".") || target.startsWith("file:")) {
    const url = new URL(target, context.parentURL)
    // Not a file as written (e.g. "./model.server" or "@/content/evaluator-goldens"): try TypeScript.
    if (!existsSync(fileURLToPath(url)) || !/\.\w+$/.test(url.pathname)) {
      for (const ext of [".ts", ".tsx", "/index.ts"]) {
        const candidate = fileURLToPath(url) + ext
        if (existsSync(candidate)) return next(pathToFileURL(candidate).href, context)
      }
    }
    return next(url.href, context)
  }
  return next(target, context)
}
