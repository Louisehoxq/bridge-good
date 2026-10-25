import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

/**
 * Community events, end to end: a chapter lead hosts a critique circle, a visitor RSVPs as a guest, the host
 * reflects and shares "what we learned" in the Living Playbook, and the steward reviews and publishes it.
 * Demo data lives in localStorage, which every demo login in the same browser shares.
 */

async function logInAs(page: Page, role: string, next: string) {
  await page.goto(`/login?next=${encodeURIComponent(next)}`)
  await page.locator(`form:has(input[name="role"][value="${role}"]) [type="submit"]`).first().click()
  await page.waitForURL((url) => url.pathname.startsWith(next.split("?")[0]))
}

async function expectNoAxeViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze()
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([])
}

test("host a critique circle, RSVP as a guest, share what we learned, and the steward publishes it", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "light", "One run is enough; the axe checks cover dark mode")

  // 1. The chapter lead hosts a critique circle from its template.
  await logInAs(page, "chapter-lead", "/events/host")
  await page.getByRole("button", { name: "Publish to the Chicago calendar" }).click()
  await expect(page.getByRole("alert")).toBeFocused()
  await expect(page.getByRole("alert")).toContainText("Step-free access")

  await page.getByRole("radio", { name: /^Critique circle/ }).check()
  await expect(page.getByText("Pre-filled from the critique circle guide")).toBeVisible()
  await expect(page.getByLabel("Title", { exact: true })).toHaveValue("Run a critique circle in your community")
  await page.getByLabel("Title", { exact: true }).fill("Critique circle: the rent relief sign-up form")
  await page.getByLabel("Area").fill("1234 W 18th St")
  await page.getByRole("radio", { name: "Step-free throughout" }).check()
  await page.getByRole("radio", { name: "Not planned" }).check()
  await page.getByRole("radio", { name: "Yes, on site" }).check()
  await page.getByLabel("Languages").fill("English, Spanish")
  await page.getByRole("button", { name: "Publish to the Chicago calendar" }).click()
  await expect(page.getByRole("alert")).toContainText("not a street address")

  await page.getByLabel("Area").fill("Little Village, a community center")
  await expectNoAxeViolations(page)
  await page.getByRole("button", { name: "Publish to the Chicago calendar" }).click()
  await page.waitForURL(/\/events\/ev-[a-z0-9]+\?hosted=1$/)
  const eventUrl = new URL(page.url()).pathname
  await expect(page.getByText("Your event is on the Chicago chapter calendar.")).toBeVisible()
  await expect(page.getByRole("link", { name: /Workshop facilitation notes/ })).toBeVisible()
  await expectNoAxeViolations(page)

  // 2. It's on the chapter's calendar and its chapter page.
  await page.goto("/events?chapter=chicago")
  await expect(page.getByRole("link", { name: "Critique circle: the rent relief sign-up form" })).toBeVisible()
  await page.goto("/chapters/chicago")
  await expect(page.getByRole("link", { name: "Critique circle: the rent relief sign-up form" })).toBeVisible()

  // 3. A visitor without a login RSVPs as a guest.
  await page.request.post("/logout")
  await page.context().clearCookies()
  await page.goto(eventUrl)
  await page.getByRole("radio", { name: /Mentor/ }).check()
  await page.getByRole("button", { name: "RSVP as a guest" }).click()
  await expect(page.getByRole("heading", { name: "You're going" })).toBeFocused()

  // 4. The host sees who's coming, skips ahead (demo only) and shares what we learned. No phone numbers.
  await logInAs(page, "chapter-lead", eventUrl)
  await expect(page.getByRole("heading", { name: "Who's coming" })).toBeVisible()
  await expect(page.getByText("Guest in this browser")).toBeVisible()
  await page.getByRole("button", { name: "Demo only: pretend this event has happened" }).click()
  await expect(page.getByRole("heading", { name: "What we learned" })).toBeFocused()
  await page.getByLabel("What did you learn about the approach?").fill("Tenants read the form aloud first. Call 312-555-0142.")
  await page.getByLabel(/I confirm this doesn/).check()
  await page.getByRole("button", { name: "Share in the Living Playbook" }).click()
  await expect(page.getByRole("alert")).toContainText("phone numbers")
  await page.getByLabel("What did you learn about the approach?").fill("Two tenants read the form aloud and stopped at the same question about income.")
  await page.getByLabel("About how many came?").fill("9")
  await expectNoAxeViolations(page)
  await page.getByRole("button", { name: "Share in the Living Playbook" }).click()
  await expect(page.getByRole("status").filter({ hasText: "Shared with the Living Playbook" })).toBeVisible()

  // 5. The steward reviews it in the queue and publishes it as a practice example.
  await logInAs(page, "steward", "/steward")
  await page.getByRole("link", { name: "What we learned: Critique circle: the rent relief sign-up form" }).first().click()
  await expect(page.getByText(/about 9 people came/)).toBeVisible()
  for (const check of ["Relevance", "Consent", "Privacy", "Accessibility", "Alignment"]) await page.getByLabel(new RegExp(`^${check}`)).check()
  await page.getByRole("button", { name: "Publish", exact: true }).click()
  await expect(page.getByText("Published. It now appears")).toBeVisible()

  // 6. It's in Reflect and Share, credited to the host's chapter.
  await page.goto("/playbook")
  await expect(page.getByRole("region", { name: "Learn together at community events" }).getByRole("heading", { name: "What we learned: Critique circle: the rent relief sign-up form" })).toBeVisible()
})

test("the event list filters by chapter, type and format, and only hosts can host", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "light", "One run is enough")
  await page.goto("/events")
  await page.getByLabel("Chapter").selectOption("london")
  await expect(page).toHaveURL(/chapter=london/)
  await expect(page.getByRole("heading", { name: "Upcoming on the London calendar" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Critique circle in English and BSL" })).toBeVisible()
  await page.getByLabel("Format").selectOption("online")
  await expect(page.getByText("No upcoming events with these filters.")).toBeVisible()

  await logInAs(page, "steward", "/events/host")
  await expect(page.getByText("This form is for chapter leads, community partners and company hosts.")).toBeVisible()
  await expect(page.getByRole("button", { name: /Publish/ })).toHaveCount(0)

  await logInAs(page, "community-partner", "/events/host")
  await expect(page.getByRole("button", { name: "Publish to the Chicago calendar" })).toBeVisible()
})
