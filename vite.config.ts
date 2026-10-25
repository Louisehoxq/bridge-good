import { createReadStream } from "node:fs"
import { resolve } from "node:path"
import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, loadEnv, type Plugin } from "vite"

/**
 * Dev only: serve MapLibre's worker files as they are, at /maplibre-gl-worker/. Vite's dev transform adds its client
 * to them, which can't run in a worker. The build bundles the worker instead (src/components/chapters/chapter-map.tsx).
 */
function maplibreWorker(): Plugin {
  return {
    name: "maplibre-worker",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/maplibre-gl-worker", (req, res, next) => {
        const file = req.url?.split("?")[0].replace(/^\//, "") ?? ""
        if (!/^maplibre-gl-(worker|shared)\.mjs$/.test(file)) return next()
        res.setHeader("Content-Type", "text/javascript")
        createReadStream(resolve("node_modules/maplibre-gl/dist", file)).pipe(res)
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Make .env / .env.local available to server code (the AI scoping route) during `npm run dev`.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""))
  return {
    plugins: [tailwindcss(), reactRouter(), maplibreWorker()],
    resolve: { tsconfigPaths: true },
    // MapLibre's worker is an ES module that imports a shared chunk.
    worker: { format: "es" as const },
  }
})
