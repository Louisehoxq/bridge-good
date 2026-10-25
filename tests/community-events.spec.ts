import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

/**
 * Community events, end to end: a chapter lead hosts a critique circle, an apprentice RSVPs, the host sends
 * "what we learned", and the steward replies. Demo data lives in localStorage, which every demo login in the
 * same browser shares, so each role sees the other side of the flow.
 */

async function logInAs(page: Page, role: string, next?: string) {
  await page.goto(`/login?next=${encodeURIComponent(next ?? `/${role}`)}`)
  await page.locator(`form:has(input[name="role"][value="${role}"]) [type="submit"]`).first().click()
  await page.waitForURL((url) => url.pathname.startsWith(next ?? `/${role}`))
}

async function expectNoAxeViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze()
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([])
}

test("host a critique circle, RSVP, send what we learned, and the steward replies", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "light", "One run is enough; the axe checks cover dark mode")

  // 0. Logged out, the event page explains how to join instead of offering an RSVP.
  await page.goto("/events/ev-chicago-critique")
  await expect(page.getByRole("link", { name: "Log in to RSVP" })).toBeVisible()
  await expect(page.getByRole("button", { name: /RSVP as/ })).toHaveCount(0)

  // 1. The chapter lead hosts a critique circle. The template comes from the carry-it-forward kit.
  await logInAs(page, "ambassador", "/events/host")
  await page.getByRole("button", { name: "Publish to the Chicago calendar" }).click()
  await expect(page.getByRole("alert")).toBeFocused()
  await expect(page.getByRole("alert")).toContainText("Step-free access")

  await page.getByRole("radio", { name: /^Critique circle/ }).check()
  await expect(page.getByText("Pre-filled from the carry-it-forward kit")).toBeVisible()
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
  await expect(page.getByRole("heading", { name: "Access" })).toBeVisible()
  await expect(page.getByText("English, Spanish")).toBeVisible()
  await expect(page.getByRole("link", { name: /carry-it-forward kit/ })).toBeVisible()
  await expectNoAxeViolations(page)

  // 2. It's on the chapter's calendar, and on the chapter's entry at /chapters.
  await page.goto("/events?chapter=chicago")
  await expect(page.getByRole("link", { name: "Critique circle: the rent relief sign-up form" })).toBeVisible()
  await page.goto("/chapters/chicago")
  await expect(page.getByRole("link", { name: "Critique circle: the rent relief sign-up form" })).toBeVisible()

  // 3. An apprentice RSVPs. It shows on their overview.
  await logInAs(page, "student", eventUrl)
  await page.getByRole("button", { name: "RSVP as Ari Santos" }).click()
  await expect(page.getByRole("heading", { name: "You're going" })).toBeFocused()
  await expect(page.getByRole("status").filter({ hasText: "You're going." })).toBeVisible()
  await page.goto("/student")
  await expect(page.getByRole("heading", { name: "Your upcoming events" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Critique circle: the rent relief sign-up form" })).toBeVisible()

  // 4. The host sees who's coming, skips ahead (demo only) and sends what we learned. No phone numbers.
  await logInAs(page, "ambassador", eventUrl)
  await expect(page.getByRole("heading", { name: "Who's coming" })).toBeVisible()
  await expect(page.getByText("Ari Santos")).toBeVisible()
  await page.getByRole("button", { name: "Demo only: pretend this event has happened" }).click()
  await expect(page.getByRole("heading", { name: "What we learned" })).toBeFocused()
  await page.getByLabel("What did you learn about the approach?").fill("Tenants read the form aloud first. Call 312-555-0142.")
  await page.getByRole("button", { name: "Send to BRIDGEGOOD" }).click()
  await expect(page.getByRole("alert")).toContainText("phone numbers")
  await page.getByLabel("What did you learn about the approach?").fill("Two tenants read the form aloud and stopped at the same question about income.")
  await page.getByLabel("About how many came?").fill("9")
  await page.getByLabel(/Credit Chicago chapter/).check()
  await expectNoAxeViolations(page)
  await page.getByRole("button", { name: "Send to BRIDGEGOOD" }).click()
  await expect(page.getByRole("status").filter({ hasText: "Sent to the BRIDGEGOOD steward" })).toBeVisible()

  // 5. The steward finds it under Community events and replies with a question.
  await logInAs(page, "steward")
  await expect(page.getByRole("heading", { name: "Featured events" })).toBeVisible()
  await page.getByLabel("Tagged").selectOption("events")
  await page.getByRole("link", { name: "What we learned: Critique circle: the rent relief sign-up form" }).click()
  await expect(page.getByText("9 (a number only, no names)")).toBeVisible()
  await expectNoAxeViolations(page)
  await page.getByLabel("Reply first").check()
  await page.getByLabel("Your reply").fill("Thank you. Would you be happy for two more chapters to try reading the work aloud first?")
  await page.getByRole("button", { name: "Send reply" }).click()
  await expect(page.getByRole("status").filter({ hasText: "Reply sent" })).toBeVisible()

  // 6. The host reads the reply on the event page.
  await logInAs(page, "ambassador", eventUrl)
  await expect(page.getByText("Would you be happy for two more chapters")).toBeVisible()
  await expect(page.getByText("In conversation")).toBeVisible()
})

test("the event list filters by chapter, type and format, and apprentices can't host", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "light", "One run is enough")
  await page.goto("/events")
  await page.getByLabel("Chapter").selectOption("london")
  await expect(page).toHaveURL(/chapter=london/)
  await expect(page.getByRole("heading", { name: "Upcoming on the London calendar" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Critique circle in English and BSL" })).toBeVisible()
  await page.getByLabel("Format").selectOption("online")
  await expect(page.getByText("No upcoming events with these filters.")).toBeVisible()

  await logInAs(page, "student", "/events/host")
  await expect(page.getByText("Apprentices host events with their chapter lead.")).toBeVisible()
  await expect(page.getByRole("button", { name: /Publish/ })).toHaveCount(0)
})
