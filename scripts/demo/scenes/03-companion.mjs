// Scene 3: the Reflection Companion UI. The live models were unavailable when recording, so only POST /api/reflect
// is answered with a hand-written SYNTHETIC sample (scripts/demo/samples/reflect-consent.json), labelled on screen.
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ROOT } from "../lib.mjs"

const NOTE = "Synthetic test. Sign-up screen for a free after-school homework club. I wanted parents to sign up in one step."
const IMAGE = join(ROOT, "src/content/evaluator-goldens/images/consent.png")
const SAMPLE = readFileSync(join(ROOT, "scripts/demo/samples/reflect-consent.json"), "utf8")
const sse = (chunks) => chunks.map((c) => `data: ${typeof c === "string" ? c : JSON.stringify(c)}\n\n`).join("")

export default {
  id: "03-companion",
  budgetSeconds: 25,
  state: "apprentice",
  async run({ page, goto, caption, click, type, hold, scrollIntoView }) {
    await page.route("**/api/reflect", async (route) => {
      if (route.request().method() !== "POST") return route.fallback()
      await new Promise((r) => setTimeout(r, 3000))
      await route.fulfill({
        status: 200,
        headers: { "content-type": "text/event-stream", "cache-control": "no-cache", "x-vercel-ai-ui-message-stream": "v1" },
        body: sse([
          { type: "start" },
          { type: "start-step" },
          { type: "text-start", id: "t0" },
          { type: "text-delta", id: "t0", delta: SAMPLE },
          { type: "text-end", id: "t0" },
          { type: "finish-step" },
          { type: "finish" },
          "[DONE]",
        ]),
      })
    })
    const form = page.locator('form[aria-labelledby="reflect-form-title"]')
    await goto("/student/reflection")
    await page.evaluate(() => {
      const b = document.createElement("div")
      b.setAttribute("aria-hidden", "true")
      b.textContent = "Recorded sample response, not a live model call"
      b.style.cssText =
        "position:fixed;left:50%;bottom:128px;transform:translateX(-50%);z-index:2147483646;background:#fff3bf;color:#1f2937;border:3px solid #b45309;font:700 28px/1.3 ui-sans-serif,system-ui,sans-serif;padding:8px 22px;border-radius:12px;pointer-events:none"
      document.documentElement.append(b)
    })
    await caption("Ari asks the Reflection Companion about a sign-up screen.", 3.5)
    await hold(800)
    await type(page.locator("#reflect-note"), NOTE, { delay: 12 })
    await form.locator("input[type=file]").setInputFiles(IMAGE)
    await hold(600)
    await caption("AI is labelled. It can't produce a score.", 3.2)
    await hold(500)
    await click(form.locator("button[type=submit]"), { after: 200 })
    await page.getByText("What I can't judge").first().waitFor({ state: "visible", timeout: 20_000 })
    await hold(500)
    await caption("It asks about the pre-ticked box instead of judging it.", 4)
    await scrollIntoView(page.getByText("AI observation · please check").first())
    await hold(3800)
    await caption("It says what it can't judge. Ari edits, and decides what to share.", 5)
    await scrollIntoView(page.getByText("What I can't judge").first())
    await hold(2800)
    await scrollIntoView(page.getByText("How this was made").first(), { ms: 900 })
    await hold(2200)
  },
}
