// Usage: node scripts/demo/run-scene.mjs <scene-id>   e.g. 01-hook
import { pathToFileURL } from "node:url"
import { join } from "node:path"
import { ROOT, recordScene } from "./lib.mjs"

const id = process.argv[2]
if (!id) {
  console.error("Usage: node scripts/demo/run-scene.mjs <scene-id>")
  process.exit(2)
}
const mod = await import(pathToFileURL(join(ROOT, "scripts/demo/scenes", `${id}.mjs`)).href)
try {
  await recordScene(mod.default)
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
