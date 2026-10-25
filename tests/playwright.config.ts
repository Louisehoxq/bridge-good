import { tmpdir } from "node:os"
import { join } from "node:path"
import { defineConfig, devices } from "@playwright/test"

const PORT = Number(process.env.A11Y_PORT ?? 4317)

/**
 * npm run test:a11y: axe-core over every page route, in light and dark.
 * It builds the app and serves the production build, or reuses one already running on A11Y_PORT locally.
 */
export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.ts",
  outputDir: join(tmpdir(), "bridgegoodx-a11y"),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Pages load fonts from Google Fonts, so allow for a slow network.
  timeout: 60_000,
  retries: 1,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    reducedMotion: "reduce",
  },
  projects: [
    { name: "light", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 }, colorScheme: "light" } },
    { name: "dark", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 }, colorScheme: "dark" } },
  ],
  webServer: {
    command: "npm run build && npm run start",
    cwd: "..",
    url: `http://localhost:${PORT}`,
    env: { PORT: String(PORT) },
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
