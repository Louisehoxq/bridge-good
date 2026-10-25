import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

/**
 * Practice moments and the carry-it-forward kit, end to end. Demo data lives in localStorage, which every
 * demo login in the same browser shares, so each role sees the other side of the flow.
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

test("a practice moment: choose, see the reasoning, share with a mentor, and a local adaptation becomes a field note", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "light", "One run is enough; the axe checks cover dark mode")

  // 1. An apprentice makes a call. There's no score, and nothing is revealed until they choose.
  await logInAs(page, "student")
  await page.goto("/learn/practice/skip-the-interviews")
  await page.getByRole("button", { name: "See how BRIDGEGOOD reasons about it" }).click()
  await expect(page.getByText("Choose an option first.")).toBeVisible()
  await page.getByLabel(/Propose something small/).check()
  await page.getByRole("button", { name: "See how BRIDGEGOOD reasons about it" }).click()
  await expect(page.getByRole("heading", { name: "How BRIDGEGOOD reasons about it" })).toBeFocused()
  await expect(page.getByText("You chose: Something small.")).toBeVisible()
  await expect(page.getByRole("table", { name: /What others chose/ })).toContainText("62%")
  await expectNoAxeViolations(page)

  // 2. "Talk it over with my mentor" saves a conversation starter, with the choice only if they tick it.
  await page.getByLabel("Include which option I chose").check()
  await page.getByRole("button", { name: "Talk it over with my mentor" }).click()
  await expect(page.getByRole("status").filter({ hasText: "Saved for Jordan Lee" })).toBeVisible()

  // 3. "This would play out differently" goes to the steward as a local adaptation on this moment.
  await page.getByRole("button", { name: "This would play out differently" }).click()
  const community = page.getByRole("textbox", { name: "Your community or chapter" })
  await expect(community).toBeFocused()
  await community.fill("Detroit chapter")
  await page.getByLabel("What would play out differently?").fill("Our partners are clinics, so we hold the short conversations in the waiting room.")
  await page.getByLabel("Why is it different in your community?").fill("People already wait there, so they don't need a second trip.")
  await expectNoAxeViolations(page)
  await page.getByRole("button", { name: "Send to BRIDGEGOOD" }).click()
  await expect(page.getByRole("status").filter({ hasText: "Sent to the BRIDGEGOOD steward" })).toBeVisible()

  // 4. The mentor sees the conversation starter.
  await logInAs(page, "mentor")
  await page.goto("/mentor/conversations")
  await expect(page.getByText(/I leaned towards “Something small”/)).toBeVisible()

  // 5. The steward accepts it as a field note on the practice moment.
  await logInAs(page, "steward")
  await page.getByLabel("Tagged").selectOption("practice")
  await page.getByRole("link", { name: "Detroit chapter: “Can we skip the interviews?”" }).click()
  await expect(page.getByRole("heading", { name: "The practice moment today" })).toBeVisible()
  await page.getByLabel("Accept").check()
  await page.getByLabel("Show it as a field note").check()
  await expect(page.getByLabel(/Field note, as it will appear on the practice moment/)).toHaveValue(/waiting room/)
  await page.getByLabel("Your reason").fill("It keeps families' voice in the work and meets them where they already are.")
  await page.getByRole("button", { name: "Record decision" }).click()
  await page.waitForURL(/\/steward\?decided=/)

  // 6. The field note shows on the practice moment, labelled as local, and not on the pillar page.
  await page.goto("/learn/practice/skip-the-interviews")
  await expect(page.getByText("Local adaptation from Detroit chapter")).toBeVisible()
  await page.goto("/learn/pillars/design-for-good")
  await expect(page.getByText("Local adaptation from Detroit chapter")).toHaveCount(0)
})

test("the kit: credit line, feedback with a reply code, a steward reply, and checking it by code", async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== "light", "One run is enough")
  await context.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => {})

  // 1. Public, no login: the credit line carries the current version and the group's own name.
  await page.goto("/learn/carry-it-forward")
  await page.getByLabel(/Your group's name/).fill("Lakeview High design class")
  await expect(page.getByText(/Based on BRIDGEGOOD's Design for Social Good framework, version 0\.1 .*Adapted by Lakeview High design class\./)).toBeVisible()
  await page.getByRole("button", { name: "Copy credit line" }).click()
  await expect(page.getByRole("status").filter({ hasText: /Copied|copy it/ })).toBeVisible()
  await expect(page.getByRole("list", { name: "Prompt cards" }).getByRole("listitem")).toHaveCount(12)

  // 2. Feedback with no name or email. Credit only because they ticked the box.
  await page.getByRole("button", { name: "Send to BRIDGEGOOD" }).click()
  await expect(page.getByRole("alert")).toContainText("Fix 2 things")
  await page.getByLabel("A school or college class").check()
  await page.getByLabel("What did you change about the session?").fill("Each small group drew two cards instead of three, so everyone got a turn.")
  await page.getByLabel(/may credit our group/).check()
  await page.getByLabel("Group name to credit").fill("Lakeview High design class")
  await page.getByRole("button", { name: "Send to BRIDGEGOOD" }).click()
  await expect(page.getByRole("heading", { name: "Sent to BRIDGEGOOD" })).toBeFocused()
  const code = (await page.getByText(/^BG-[A-Z0-9]{4}-[A-Z0-9]{4}$/).textContent())!.trim()
  await expectNoAxeViolations(page)

  // 3. The steward finds it as an outside-community item and replies.
  await logInAs(page, "steward")
  await page.getByLabel("Type").selectOption("outside-community")
  await page.getByRole("link", { name: "Outside community: a school or college class" }).click()
  await expect(page.getByText("Outside BRIDGEGOOD: Lakeview High design class")).toBeVisible()
  await page.getByLabel("Reply first").check()
  await page.getByLabel("Your reply").fill("Thank you. Did two cards give each group enough to talk about?")
  await expectNoAxeViolations(page)
  await page.getByRole("button", { name: "Send reply" }).click()
  await expect(page.getByRole("status").filter({ hasText: "Reply sent" })).toBeVisible()

  // 4. Logged out, the group checks the reply with its code, typed loosely, and answers.
  await context.clearCookies()
  await page.goto("/learn/carry-it-forward/reply")
  await page.getByLabel("Your reply code").fill(code.toLowerCase().replaceAll("-", " "))
  await page.getByRole("button", { name: "Check" }).click()
  await expect(page.getByText("Did two cards give each group enough to talk about?")).toBeVisible()
  expect(page.url()).not.toContain(code.slice(3, 7))
  await page.getByLabel("Answer the steward").fill("Yes. Shy students spoke more in small groups.")
  await page.getByRole("button", { name: "Send reply" }).click()
  await expect(page.getByRole("status").filter({ hasText: "Reply sent to BRIDGEGOOD." })).toBeVisible()
  await expectNoAxeViolations(page)
})
