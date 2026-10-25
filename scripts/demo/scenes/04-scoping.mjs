// Scene 4: the real partner scoping studio with a HAND-WRITTEN SYNTHETIC sample reply.
// Only POST /api/scope is faked (the live model key was rejected); the caption says so. Everything else is the real app.
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ROOT } from "../lib.mjs"

const NEED = "Synthetic test. Our food pantry's sign-up is a paper form, and many neighbors read Spanish better than English."
const sample = JSON.parse(readFileSync(join(ROOT, "scripts/demo/samples/scope-brief.json"), "utf8"))
const SAMPLE = "Recorded sample response, not a live model call"
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const chunk = (o) => `data: ${JSON.stringify(o)}\n\n`
function streamBody() {
  const words = sample.text.split(/(?<=\s)/)
  return [
    chunk({ type: "start" }),
    chunk({ type: "start-step" }),
    chunk({ type: "text-start", id: "t1" }),
    ...words.map((w) => chunk({ type: "text-delta", id: "t1", delta: w })),
    chunk({ type: "text-end", id: "t1" }),
    chunk({ type: "tool-input-available", toolCallId: "call_1", toolName: "updateBrief", input: sample.brief }),
    chunk({ type: "tool-output-available", toolCallId: "call_1", output: { updated: true } }),
    chunk({ type: "finish-step" }),
    chunk({ type: "finish" }),
    "data: [DONE]\n\n",
  ].join("")
}

export default {
  id: "04-scoping",
  budgetSeconds: 14,
  state: "partner",
  async run({ page, goto, caption, click, type, hold, scrollIntoView, hover }) {
    await page.route("**/api/scope", async (route) => {
      if (route.request().method() !== "POST") return route.continue()
      await sleep(3000)
      await route.fulfill({
        status: 200,
        headers: { "content-type": "text/event-stream", "x-vercel-ai-ui-message-stream": "v1", "cache-control": "no-cache" },
        body: streamBody(),
      })
    })
    await goto("/partner/submit")
    await caption("A community partner scopes a problem with AI help.", 3)
    await hold(400)
    const box = page.getByPlaceholder("Describe the problem…")
    await type(box, NEED, { delay: 6 })
    await click(box.locator("xpath=ancestor::form").locator("button[type=submit]"), { after: 200 })
    await caption("The brief is a draft. The partner is the author.", 3.2)
    await page.waitForFunction(
      () => document.querySelector('[aria-label="Conversation"]')?.innerText.includes("I've started a draft brief"),
      null,
      { timeout: 20_000 },
    )
    const field = page.getByLabel(/How will the people you serve shape this/).first()
    await caption("Required question. Recorded sample, not a live model call", 3)
    await hold(300)
    await scrollIntoView(field, { ms: 600 })
    await hover(field)
    await caption(SAMPLE, 8)
    // Show that the partner can edit: type into the AI's draft.
    await field.evaluate((el) => { el.focus(); el.setSelectionRange(el.value.length, el.value.length) })
    await field.pressSequentially(" Add: ask the pantry's Spanish-speaking volunteers first.", { delay: 12 })
    await hold(4000)
  },
}
