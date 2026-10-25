import { expect, test } from "@playwright/test"

/**
 * The chapter map is an enhancement: pins work by keyboard, filters move the map and the list together, and the list
 * still does everything when the map can't load.
 */

// Playwright needs the fixtures argument destructured, even when empty.
// eslint-disable-next-line no-empty-pattern
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== "light", "One run is enough; the axe checks cover dark mode")
})

test("pins work by keyboard, and the list moves the map", async ({ page }) => {
  await page.goto("/chapters")
  // The map loads tiles from the network, which can be slow while other tests run.
  await expect(page.locator(".bgx-pin")).toHaveCount(15, { timeout: 30_000 })

  // Tab from the map to the first pin, open it, and focus lands in the popup. Escape goes back to the pin.
  await page.getByRole("region", { name: /Chapter map/ }).focus()
  await page.keyboard.press("Tab")
  await expect(page.getByRole("button", { name: /^Oakland chapter, USA/ })).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.locator(".maplibregl-popup").getByRole("link", { name: "Open the chapter page" })).toBeFocused()
  await expect(page.getByRole("status").filter({ hasText: "Showing Oakland on the map" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.locator(".maplibregl-popup")).toHaveCount(0)
  await expect(page.getByRole("button", { name: /^Oakland chapter, USA/ })).toBeFocused()

  // "Show on the map" in the list opens the popup without taking focus.
  const show = page.getByRole("button", { name: /Show on the map.*Atlanta/ })
  await show.click()
  await expect(show).toHaveAttribute("aria-pressed", "true")
  await expect(show).toBeFocused()
  await expect(page.locator(".maplibregl-popup")).toContainText("Atlanta, USA")
  await expect(page.locator('.bgx-pin[data-selected]')).toHaveAccessibleName(/^Atlanta chapter/)

  // The zoom buttons are 48px.
  const zoomIn = await page.getByRole("button", { name: "Zoom in" }).boundingBox()
  expect(zoomIn?.width).toBeGreaterThanOrEqual(48)
  expect(zoomIn?.height).toBeGreaterThanOrEqual(48)
})

test("filters change the map and the list together", async ({ page }) => {
  await page.goto("/chapters")
  await expect(page.locator(".bgx-pin")).toHaveCount(15, { timeout: 30_000 })
  await page.getByLabel("Has upcoming events").check()
  const listed = page.getByRole("region", { name: "Chapters" }).getByRole("heading", { level: 3 })
  const count = await listed.count()
  expect(count).toBeGreaterThan(0)
  expect(count).toBeLessThan(15)
  await expect(page.locator(".bgx-pin")).toHaveCount(count)

  await page.getByLabel("Region").selectOption("Europe")
  await expect(listed).toHaveText(["London, UK"])
  await expect(page.locator(".bgx-pin")).toHaveCount(1)
  await expect(page.getByRole("status").filter({ hasText: "1 chapter matches your filters" })).toBeVisible()

  await page.getByRole("button", { name: "Clear filters" }).click()
  await page.getByLabel("Focus").selectOption("Food access")
  await expect(listed).toHaveText(["Oakland, USA", "Toronto, Canada"])
  await expect(page.locator(".bgx-pin")).toHaveCount(2)
})

test("without the map, the list still finds and opens every chapter", async ({ page }) => {
  await page.route(/openfreemap\.org/, (route) => route.abort())
  await page.goto("/chapters")
  await expect(page.getByText("The map couldn't load in this browser.")).toBeVisible()
  await expect(page.locator(".bgx-pin")).toHaveCount(0)

  await page.getByLabel("Search").fill("Singapore")
  await page.getByRole("link", { name: "Singapore chapter page" }).click()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Singapore chapter, Singapore")
  await expect(page.getByRole("heading", { name: "Upcoming events" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Local field notes" })).toBeVisible()
})

test("a chapter page offers 'Host an event here' to people who can host, on that chapter's calendar", async ({ page }) => {
  await page.goto("/chapters/houston")
  await expect(page.getByRole("link", { name: "Host an event here" })).toHaveCount(0)
  await page.getByRole("link", { name: "Log in to host" }).click()
  await page.locator('form:has(input[name="role"][value="ambassador"]) [type="submit"]').first().click()
  await page.waitForURL("**/events/host?chapter=houston")
  await expect(page.getByLabel("Chapter calendar")).toHaveValue("houston")

  await page.goto("/chapters/oakland")
  await page.getByRole("link", { name: "Host an event here" }).click()
  await expect(page.getByLabel("Chapter calendar")).toHaveValue("oakland")
})
