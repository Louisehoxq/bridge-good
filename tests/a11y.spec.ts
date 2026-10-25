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
