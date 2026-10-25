import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

/**
 * The milestone 3 feedback loop, end to end: a chapter lead proposes an adaptation, the BRIDGEGOOD steward
 * accepts it with a reason, the changelog entry and field note appear, and the chapter lead sees the outcome.
 * Demo data lives in localStorage, which every demo login in the same browser shares.
 */

async function logInAs(page: Page, role: string) {
  await page.goto(`/login?next=/${role}`)
  await page.locator(`form:has(input[name="role"][value="${role}"]) [type="submit"]`).first().click()
  await page.waitForURL((url) => url.pathname.startsWith(`/${role}`))
}

async function expectNoAxeViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze()
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([])
}

test("a chapter lead's adaptation becomes a field note and a changelog entry", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "light", "One run is enough; the axe checks cover dark mode")

  // 1. The chapter lead proposes an adaptation from the playbook. (Logging in as "ambassador" picks the chapter lead.)
  await logInAs(page, "ambassador")
  await page.goto("/ambassador/playbook")
  await page.getByRole("button", { name: "Send to BRIDGEGOOD" }).click()
  await expect(page.getByRole("alert")).toContainText("Fix")
  await expectNoAxeViolations(page)

  await page.getByLabel("Which pillar is it about?").selectOption("craft")
  await page.getByLabel("What did you change?").fill("We critique on paper prototypes first, because many apprentices share one laptop.")
  await page.getByLabel("Why does it fit your community better?").fill("Laptops are scarce at our community center, and paper lets everyone take part.")
  await page.getByLabel("Which core commitments did you keep?").fill("Hierarchy, writing and error states still get checked before anything ships.")
  await page.getByLabel("Recognize it as our local variant").check()
  await page.getByLabel(/Credit the Chicago chapter/).check()
  await page.getByRole("button", { name: "Send to BRIDGEGOOD" }).click()
  await expect(page.getByRole("status").filter({ hasText: "Sent to the BRIDGEGOOD steward" })).toBeVisible()

  // 2. The steward finds it in the inbox, filtered by pillar, and accepts it as a field note with a reason.
  await logInAs(page, "steward")
  await page.getByLabel("Tagged").selectOption("pillar:craft")
  await page.getByRole("link", { name: "Chicago chapter: Good Design Craft" }).click()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Chicago chapter: Good Design Craft")
  await page.getByLabel("Accept").check()
  await page.getByLabel("Show it as a field note").check()
  await expect(page.getByLabel(/Field note, as it will appear/)).toHaveValue(/paper prototypes/)
  await page.getByLabel("Your reason").fill("Keeps the craft commitments and removes a barrier other chapters face too.")
  await expectNoAxeViolations(page)
  await page.getByRole("button", { name: "Record decision" }).click()
  await page.waitForURL(/\/steward\?decided=/)
  await expect(page.getByRole("status").filter({ hasText: "Decision recorded" })).toBeVisible()

  // 3. The public changelog shows it, credited because the chapter lead said yes.
  await page.goto("/learn/changelog")
  const entry = page.getByRole("article", { name: "Field note: Good Design Craft, Chicago chapter" })
  await expect(entry).toContainText("Keeps the craft commitments")
  await expect(entry.getByRole("definition").filter({ hasText: /^Chicago chapter$/ })).toBeVisible()

  // 4. The field note sits beneath the official wording on the pillar page, labelled as local.
  await page.goto("/learn/pillars/craft")
  await expect(page.getByText("Local adaptation from Chicago chapter")).toBeVisible()
  await expect(page.getByText(/paper prototypes/)).toBeVisible()

  // 5. The chapter lead sees the outcome and the reason on their playbook.
  await logInAs(page, "ambassador")
  await page.goto("/ambassador/playbook")
  await expect(page.getByText("BRIDGEGOOD accepted this")).toBeVisible()
  await expect(page.getByText("Keeps the craft commitments")).toBeVisible()
  await expectNoAxeViolations(page)
})

test("an apprentice's one-tap flag reaches the steward, who changes the official wording", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "light", "One run is enough")

  await logInAs(page, "student")
  await page.goto("/learn/pillars/ethics-impact")
  await page.getByRole("button", { name: "This didn't fit" }).click()
  await expect(page.getByRole("status").filter({ hasText: "Flag sent" })).toBeVisible()
  await page.getByLabel(/What didn't fit/).fill("Call me at 510 555 0123")
  await page.getByRole("button", { name: "Add note" }).click()
  await expect(page.getByText("Take out email addresses and phone numbers")).toBeVisible()
  await page.getByLabel(/What didn't fit/).fill("Our partner asked what counts as harm, and the wording didn't help us answer.")
  await page.getByRole("button", { name: "Add note" }).click()
  await expectNoAxeViolations(page)

  await logInAs(page, "steward")
  await page.getByRole("link", { name: /Didn’t fit: Pillar: Ethics & Impact/ }).click()
  await page.getByLabel("Accept").check()
  await page.getByLabel("Change BRIDGEGOOD's official wording").check()
  await page.getByLabel(/New official wording/).fill("Every design has effects beyond what it was meant to do, including harm to the people it serves.")
  await page.getByLabel("Your reason").fill("Apprentices need words to name harm with partners.")
  await page.getByRole("button", { name: "Record decision" }).click()
  await page.waitForURL(/\/steward\?decided=/)

  await page.goto("/learn/pillars/ethics-impact")
  await expect(page.getByText("including harm to the people it serves")).toBeVisible()
  await expect(page.getByText(/changed in version 0\.2/)).toBeVisible()
  await page.goto("/learn/changelog")
  await expect(page.getByRole("heading", { name: "Version 0.2" })).toBeVisible()
})
