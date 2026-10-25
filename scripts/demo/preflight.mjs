// Preflight for the demo video: walk the pages each scene needs and run both AI features once.
// Usage: node scripts/demo/preflight.mjs   (BASE=http://localhost:4400 by default)
import { chromium } from "@playwright/test"

const BASE = process.env.BASE ?? "http://localhost:4400"
const results = []
const record = (scene, name, ok, detail = "") => {
  results.push({ scene, name, ok, detail })
  console.log(`${ok ? "PASS" : "FAIL"}  ${scene}  ${name}${detail ? `  (${detail})` : ""}`)
}

const browser = await chromium.launch()

async function session(role) {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, baseURL: BASE })
  const errors = []
  const page = await context.newPage()
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`))
  page.on("console", (m) => m.type() === "error" && !/Failed to load resource|tile|maplibre|font/i.test(m.text()) && errors.push(`console: ${m.text()}`))
  if (role) {
    const res = await context.request.post("/login", { form: { role, next: "" }, maxRedirects: 0 }).catch((e) => e)
    if (!res?.status || ![200, 302, 303].includes(res.status())) throw new Error(`login as ${role} failed`)
  }
  return { context, page, errors }
}

async function check(scene, name, page, errors, path, expectText) {
  try {
    const before = errors.length
    await page.goto(path, { waitUntil: "load" })
    await page.getByText(expectText, { exact: false }).first().waitFor({ timeout: 10_000 })
    const fresh = errors.slice(before)
    record(scene, `${path} shows "${expectText}"`, fresh.length === 0, fresh.join(" | ").slice(0, 160))
  } catch (e) {
    record(scene, `${path} shows "${expectText}"`, false, String(e.message).split("\n")[0])
  }
}

// Scenes 1, 2, 5, 7: public pages.
{
  const { context, page, errors } = await session(null)
  await check("01", "hook", page, errors, "/", "BRIDGEGOOD authors it")
  await check("02", "pillar", page, errors, "/learn/pillars/ethics-impact", "Ethics")
  await check("02", "practice", page, errors, "/learn/practice", "Practice")
  await check("05", "kit", page, errors, "/learn/carry-it-forward", "Tell BRIDGEGOOD")
  await check("05", "chapters", page, errors, "/chapters", "chapter")
  await check("07", "reply", page, errors, "/learn/carry-it-forward/reply", "code")
  await check("06", "changelog", page, errors, "/learn/changelog", "version")
  await context.close()
}

// Scene 3: the Reflection Companion, live.
{
  const { context, page, errors } = await session("student")
  await check("03", "reflection page", page, errors, "/student/reflection", "Reflection companion")
  try {
    await page.locator("#reflect-note").fill("Synthetic test. Sign-up screen for a free after-school homework club. I wanted parents to sign up in one step.")
    await page.locator('form[aria-labelledby="reflect-form-title"] input[type=file]').setInputFiles("src/content/evaluator-goldens/images/consent.png")
    await page.locator('form[aria-labelledby="reflect-form-title"] button[type=submit]').click()
    const t0 = Date.now()
    await page.getByText("What I can't judge", { exact: false }).first().waitFor({ timeout: 90_000 })
    const secs = Math.round((Date.now() - t0) / 1000)
    const body = await page.locator("main").innerText()
    record("03", "live review returns", true, `${secs}s`)
    record("03", "review has AI observation label", /AI observation/i.test(body))
    record("03", "review has a question for the person", /Question for you/i.test(body))
    record("03", "review mentions the consent box", /consent|ticked|checkbox/i.test(body))
    record("03", "no score or grade shown", !/\b\d+\s*\/\s*(5|10|100)\b|\bscore\b/i.test(body))
  } catch (e) {
    record("03", "live review returns", false, String(e.message).split("\n")[0])
    await page.screenshot({ path: "docs/demo/preflight-03.png" }).catch(() => {})
  }
  record("03", "no page errors", errors.length === 0, errors.join(" | ").slice(0, 160))
  await context.close()
}

// Scene 4: the partner scoping studio, live.
{
  const { context, page, errors } = await session("partner")
  await check("04", "submit page", page, errors, "/partner/submit", "Describe")
  try {
    const box = page.getByPlaceholder("Describe the problem…")
    await box.fill("Synthetic test. Our food pantry's sign-up is a paper form, and many neighbors read Spanish better than English.")
    await box.locator("xpath=ancestor::form").locator("button[type=submit]").click()
    // "people you serve" is static form text, so wait on the conversation itself: a reply longer than our note, with no error.
    const convo = page.getByRole("region", { name: "Conversation" })
    await page.waitForFunction(
      () => {
        const el = document.querySelector('[aria-label="Conversation"]')
        return el && el.innerText.length > 700 && !/writing|thinking/i.test(el.innerText.slice(-200))
      },
      null,
      { timeout: 90_000 },
    )
    const talk = await convo.innerText()
    record("04", "live brief draft returns", !/couldn.t|isn.t switched on|try again/i.test(talk), talk.slice(-120).replace(/\s+/g, " "))
    const body = await page.locator("main").innerText()
    record("04", "AI is labelled", /\bAI\b/.test(body))
  } catch (e) {
    record("04", "live brief draft returns", false, String(e.message).split("\n")[0])
    await page.screenshot({ path: "docs/demo/preflight-04.png" }).catch(() => {})
  }
  record("04", "no page errors", errors.length === 0, errors.join(" | ").slice(0, 160))
  await context.close()
}

// Scene 6: steward inbox.
{
  const { context, page, errors } = await session("steward")
  await check("06", "inbox", page, errors, "/steward", "Outside community")
  await check("06", "framework", page, errors, "/steward/framework", "wording")
  await context.close()
}

await browser.close()
const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
