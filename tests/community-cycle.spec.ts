import { expect, test, type Page } from "@playwright/test"

/**
 * The community experience cycle end to end: practice in the Decision Lab, open a Practice Library tool,
 * contribute a lesson to the Living Playbook, then a steward reviews and publishes it.
 */
test.beforeEach(() => {
  test.skip(test.info().project.name !== "light", "Flow tests run once")
})

async function logInAs(page: Page, role: "company-host" | "steward", home: string) {
  await page.goto(`/login?next=${home}`)
  await page.locator(`form:has(input[name="role"][value="${role}"]) [type="submit"]`).click()
  await page.waitForURL((url) => url.pathname.startsWith(home))
}

test("Lab → Library → contribute → steward publishes", async ({ page }) => {
  // Practice: work through a scenario.
  await page.goto("/lab/community-service-redesign")
  await page.getByRole("button", { name: /^Next: Choose an approach/ }).click()
  await page.getByLabel(/Pilot a smaller, more accessible version/).check()
  await page.getByRole("button", { name: /^Next: Explore consequences/ }).click()
  await expect(page.getByText("Who might be left out").first()).toBeVisible()
  await page.getByRole("button", { name: /^Next: Hear other perspectives/ }).click()
  await page.getByRole("button", { name: /^Next: Reflect/ }).click()
  await page.getByLabel("What assumption did you make?").fill("That a pilot group would be easy to recruit.")
  await page.getByRole("button", { name: /^Next: Take it into practice/ }).click()
  await page.getByRole("button", { name: "Save reflection" }).click()
  await expect(page.getByText("Saved.")).toBeVisible()

  // Practice Library: open a linked tool.
  await page.getByRole("link", { name: "Small-scale pilot planner" }).first().click()
  await expect(page.getByRole("heading", { level: 1, name: "Small-scale pilot planner" })).toBeVisible()

  // Reflect and share: contribute a lesson.
  await page.goto("/playbook/contribute?kind=lesson&scenario=community-service-redesign")
  await page.getByRole("button", { name: "Submit for review" }).click()
  await expect(page.getByRole("alert")).toContainText("Give your contribution a short title")
  await page.getByLabel("Title").fill("Pilots need a recruitment plan")
  await page.getByLabel(/1\. Context/).fill("A practice scenario in the Decision Lab.")
  await page.getByLabel(/2\. Challenge/).fill("Choosing between speed and access.")
  await page.getByLabel("Credit me as").fill("A student in Oakland")
  await page.getByLabel(/I confirm this contribution/).check()
  await page.getByRole("button", { name: "Submit for review" }).click()
  await expect(page.getByText("Your contribution is submitted for review.")).toBeVisible()

  // Not public yet.
  await page.goto("/playbook")
  await expect(page.getByRole("region", { name: /Entries/ }).getByText("Pilots need a recruitment plan")).toHaveCount(0)

  // Teach and evolve: the steward reviews and publishes it.
  await logInAs(page, "steward", "/steward")
  await page.getByRole("link", { name: "Pilots need a recruitment plan" }).first().click()
  await page.getByRole("button", { name: "Publish", exact: true }).click()
  await expect(page.getByRole("alert")).toContainText("Every review check must pass")
  for (const check of ["Relevance", "Consent", "Privacy", "Accessibility", "Alignment"]) await page.getByLabel(new RegExp(`^${check}`)).check()
  await page.getByRole("button", { name: "Publish", exact: true }).click()
  await expect(page.getByText("Published. It now appears")).toBeVisible()

  await page.goto("/playbook")
  await expect(page.getByRole("link", { name: /Read it.*Pilots need a recruitment plan/ })).toBeVisible()
})

test("company host area is guarded and works", async ({ page }) => {
  await page.goto("/host")
  await expect(page).toHaveURL(/\/login\?next=%2Fhost/)
  await logInAs(page, "company-host", "/host")
  await expect(page.getByRole("heading", { level: 1, name: /Welcome back, Dana/ })).toBeVisible()
  for (const [link, heading] of [
    ["Host guide", "Company host guide"],
    ["Bring it to your workplace", "Bring it to your workplace"],
    ["Partner projects", "Partner projects"],
    ["Organization toolkit", "Organization toolkit"],
  ]) {
    await page.goto("/host")
    await page.getByRole("navigation", { name: /Company host area/ }).first().getByRole("link", { name: link }).click()
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible()
  }
})
