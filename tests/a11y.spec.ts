import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"
import routes from "../src/routes"
import { PILLARS } from "../src/content/framework"
import { AUDIENCES } from "../src/content/training"
import { GUIDE_SLUGS, TRACKS } from "../src/lib/library"
import { ROLES, type Role } from "../src/lib/roles"

type RouteEntry = { path?: string; index?: boolean; file: string; children?: RouteEntry[] }

/** Values for dynamic segments, so every page route gets a real URL. */
const PARAMS: Record<string, readonly string[]> = { audience: AUDIENCES }

/** Values for segments whose name is shared by several routes (both library tracks and guides use :slug). */
const PATH_PARAMS: Record<string, readonly string[]> = {
  "learn/pillars/:pillarId": PILLARS.map((p) => p.id),
  "learn/tracks/:slug": TRACKS.map((t) => t.slug),
  "learn/guides/:slug": GUIDE_SLUGS,
}

/** Every page route in src/routes.ts. Resource routes and redirects (.ts files) have no page to test. */
function pagePaths(entries: RouteEntry[], parent = ""): string[] {
  return entries.flatMap((entry) => {
    const path = [parent, entry.path].filter(Boolean).join("/")
    const own = entry.file.endsWith(".tsx") && (entry.index || !entry.children) ? expand(path) : []
    return [...own, ...pagePaths(entry.children ?? [], path)]
  })
}

function expand(path: string): string[] {
  const param = path.match(/:(\w+)/)?.[1]
  if (!param) return [`/${path}`]
  const values = PATH_PARAMS[path] ?? PARAMS[param]
  if (!values) throw new Error(`Add values for :${param} to PARAMS or PATH_PARAMS in tests/a11y.spec.ts`)
  return values.flatMap((value) => expand(path.replace(`:${param}`, value)))
}

/**
 * Violations in markup outside the design-system files, waiting on the fixes in docs/design-followups.md.
 * Any other violation fails. So does a listed one that has gone, so this list can't go stale.
 */
const KNOWN: Record<string, string[]> = {}

const roleFor = (path: string) => ROLES.find((role) => path === `/${role}` || path.startsWith(`/${role}/`))

/** Logs in through the demo login screen by submitting the chosen role's form. */
async function logIn(page: Page, role: Role) {
  await page.goto(`/login?next=/${role}`)
  await page.locator(`form:has(input[name="role"][value="${role}"]) [type="submit"]`).first().click()
  await page.waitForURL((url) => url.pathname.startsWith(`/${role}`))
}

const paths = [...new Set(pagePaths(routes as RouteEntry[]))]

test("finds the routes to test", () => {
  expect(paths).toContain("/")
  expect(paths).toContain("/design")
})

for (const path of paths) {
  test(`${path} has no axe violations`, async ({ page }) => {
    const role = roleFor(path)
    if (role) await logIn(page, role)
    const response = await page.goto(path)
    expect(response?.status(), `status for ${path}`).toBeLessThan(400)
    expect(new URL(page.url()).pathname, "not redirected to the login screen").toBe(path)
    await page.waitForLoadState("networkidle")
    await page.evaluate(() => document.fonts.ready)

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
      .analyze()

    const known = KNOWN[path] ?? []
    const found = new Set(violations.map((v) => v.id))
    const gone = known.filter((rule) => !found.has(rule))
    expect(gone, `${path}: fixed, so remove these from KNOWN in tests/a11y.spec.ts`).toEqual([])

    const report = violations
      .filter((v) => !known.includes(v.id))
      .map((v) => ({
        rule: v.id,
        impact: v.impact,
        help: v.help,
        targets: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
      }))
    expect(report, `${path}: ${report.map((r) => `${r.rule} (${r.targets.length})`).join(", ")}`).toEqual([])
  })
}

/** WCAG 1.4.12 text-spacing overrides: content must stay readable with these applied. */
const TEXT_SPACING_CSS = `
  * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
  p { margin-bottom: 2em !important; }
`

/** Elements that make the page scroll sideways, ignoring content inside its own scrolling region. */
async function sidewaysOverflow(page: Page) {
  return page.evaluate(() => {
    const doc = document.documentElement
    if (doc.scrollWidth <= doc.clientWidth + 1) return []
    const scrolls = (el: Element) => ["auto", "scroll"].includes(getComputedStyle(el).overflowX)
    return [...document.body.querySelectorAll("*")]
      .filter((el) => el.getBoundingClientRect().right > doc.clientWidth + 1)
      .filter((el) => {
        for (let p = el.parentElement; p; p = p.parentElement) if (scrolls(p)) return false
        return true
      })
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}.${[...el.classList].slice(0, 3).join(".")}`)
  })
}

/** Text clipped by a box that hides its overflow (the visually hidden .sr-only pattern is allowed). */
async function clippedText(page: Page) {
  return page.evaluate(() =>
    [...document.body.querySelectorAll("*")]
      .filter((el) => {
        const style = getComputedStyle(el)
        const hides = (v: string) => v === "hidden" || v === "clip"
        if (!hides(style.overflowX) && !hides(style.overflowY)) return false
        const rect = el.getBoundingClientRect()
        if (rect.width <= 2 || rect.height <= 2 || el.closest(".sr-only")) return false
        if (!el.textContent?.trim()) return false
        return el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2
      })
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 3).join(".")}: "${el.textContent!.trim().slice(0, 40)}"`)
  )
}

type LayoutCheck = "at320" | "at200" | "clipped"

/**
 * Known layout failures, tracked in docs/design-followups.md. Empty since milestone 2.5: keep it that way.
 * Any other failure fails the test, and so does a listed one that has gone, so this list can only shrink.
 */
const KNOWN_LAYOUT: Record<string, LayoutCheck[]> = {}

for (const path of paths) {
  test(`${path} reflows, zooms and takes text spacing (WCAG 1.4.10, 1.4.4, 1.4.12)`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "light", "Layout checks don't depend on the theme")
    const role = roleFor(path)
    if (role) await logIn(page, role)

    // 1.4.10 Reflow: no sideways scrolling at 320 CSS px wide.
    await page.setViewportSize({ width: 320, height: 640 })
    await page.goto(path)
    await page.evaluate(() => document.fonts.ready)
    const at320 = await sidewaysOverflow(page)

    // 1.4.4 Resize text: a 1280px screen at 200% zoom is 640 CSS px wide.
    await page.setViewportSize({ width: 640, height: 900 })
    await page.goto(path)
    await page.evaluate(() => document.fonts.ready)
    const at200 = await sidewaysOverflow(page)

    // 1.4.12 Text spacing, at the desktop design width.
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto(path)
    await page.addStyleTag({ content: TEXT_SPACING_CSS })
    await page.evaluate(() => document.fonts.ready)
    const clipped = await clippedText(page)

    const found: Record<LayoutCheck, string[]> = { at320, at200, clipped }
    const known = KNOWN_LAYOUT[path] ?? []
    const gone = known.filter((check) => found[check].length === 0)
    expect(gone, `${path}: fixed, so remove these from KNOWN_LAYOUT in tests/a11y.spec.ts`).toEqual([])
    const unexpected = Object.fromEntries(Object.entries(found).filter(([check, els]) => els.length && !known.includes(check as LayoutCheck)))
    expect(unexpected, path).toEqual({})
  })
}
