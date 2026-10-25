import type { Config } from "@react-router/dev/config"
import { vercelPreset } from "@vercel/react-router/vite"

export default {
  appDirectory: "src",
  // Server rendering, so the AI scoping route and the demo session cookie run on the server.
  ssr: true,
  // The Vercel preset only matters when Vercel builds the app.
  presets: process.env.VERCEL ? [vercelPreset()] : [],
} satisfies Config
