import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  // Make .env / .env.local available to server code (the AI scoping route) during `npm run dev`.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""))
  return {
    plugins: [tailwindcss(), reactRouter()],
    resolve: { tsconfigPaths: true },
  }
})
