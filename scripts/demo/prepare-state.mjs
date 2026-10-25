// Builds the starting states the demo scenes load (docs/demo/state/*.json) by driving the real app once.
// Usage: node scripts/demo/prepare-state.mjs   (needs the app on BASE, default http://localhost:4400)
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { chromium } from "@playwright/test"
import { BASE, STATE_DIR } from "./lib.mjs"

mkdirSync(STATE_DIR, { recursive: true })
const browser = await chromium.launch()
const file = (name) => join(STATE_DIR, `${name}.json`)

const newContext = (storageState) => browser.newContext({ baseURL: BASE, viewport: { width: 1920, height: 1080 }, storageState })
const loginAs = (context, role) => context.request.post("/login", { form: { role, next: "" }, maxRedirects: 0 })

// Logged out, and logged in as one role, all with fresh seed data.
{
  const c = await newContext()
  const p = await c.newPage()
  await p.goto("/")
  await c.storageState({ path: file("fresh") })
  await c.close()
}
for (const [name, role] of [["apprentice", "student"], ["partner", "partner"], ["steward", "steward"]]) {
  const c = await newContext()
  await loginAs(c, role)
  const p = await c.newPage()
  await p.goto("/")
  await c.storageState({ path: file(name) })
  await c.close()
}

// Eastside Tenants Network sends its kit feedback (the text is the synthetic paste table in docs/demo-script.md).
let code
{
  const c = await newContext()
  const p = await c.newPage()
  await p.goto("/learn/carry-it-forward")
  await p.getByLabel("A community organization").check()
  await p.getByLabel("What did you change about the session?").fill(
    "We read each prompt card aloud in Spanish and English, and people could answer by drawing as well as talking, because several of our members read one language better than the other.",
  )
  await p.getByLabel("What didn't fit your community?").fill("An hour was too long after work, so we took a short break halfway.")
  await p.locator("#kit-pillar").selectOption("access-inclusion")
  await p.getByLabel(/may credit our group/).check()
  await p.getByLabel("Group name to credit").fill("Eastside Tenants Network")
  await p.getByRole("button", { name: "Send to BRIDGEGOOD" }).click()
  await p.getByRole("heading", { name: "Sent to BRIDGEGOOD" }).waitFor()
  code = (await p.getByText(/^BG-[A-Z0-9]{4}-[A-Z0-9]{4}$/).textContent()).trim()
  await c.storageState({ path: file("eastside-sent") })
  await c.close()
}

// The steward's view before the decision: the same browser data, logged in as the steward.
{
  const c = await newContext(file("eastside-sent"))
  await loginAs(c, "steward")
  const p = await c.newPage()
  await p.goto("/steward")
  await c.storageState({ path: file("steward-before") })

  // Then the steward accepts it, with a reason; log out and keep the data (for the reply-code scene).
  await p.getByLabel("Type").selectOption("outside-community")
  await p.getByRole("link", { name: "Outside community: a community organization" }).click()
  await p.getByLabel("Accept").check()
  await p.getByLabel("Show it as a field note").check()
  await p.getByLabel("Your reason").fill("It removes a language barrier without dropping any prompt, and other groups face the same barrier.")
  await p.getByRole("button", { name: "Record decision" }).click()
  await p.waitForURL(/\/steward\?decided=/)
  await c.clearCookies()
  await c.storageState({ path: file("eastside-decided") })
  await c.close()
}

writeFileSync(file("meta"), JSON.stringify({ replyCode: code, group: "Eastside Tenants Network" }, null, 2))
await browser.close()
console.log("states written to docs/demo/state (reply code saved in meta.json)")
