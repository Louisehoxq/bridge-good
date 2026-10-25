export default {
  id: "05-community",
  budgetSeconds: 18,
  state: "fresh",
  async run({ page, goto, caption, hold, hover, scrollBy, scrollIntoView }) {
    // Warm the map's tiles and worker in a second tab while the kit is on screen, so /chapters settles quickly.
    const warm = await page.context().newPage()
    const warmed = warm
      .goto("/chapters")
      .then(() => warm.getByText("Loading the map").waitFor({ state: "hidden", timeout: 40000 }))
      .catch(() => {})
    await goto("/learn/carry-it-forward")
    await caption("The kit lets any group run a critique circle, no account needed.", 4.2)
    await scrollBy(380, 900)
    await hover(page.getByRole("button", { name: "Print the kit and cards" }))
    await hold(1200)
    await caption("It prints, and carries BRIDGEGOOD's credit line.", 3.5)
    await scrollIntoView(page.getByRole("heading", { name: "Credit line" }), { ms: 1400 })
    await hold(1000)
    await scrollIntoView(page.getByRole("heading", { name: "The 12 prompt cards" }), { ms: 1200 })
    await hold(700)

    await Promise.race([warmed, hold(8000)])
    await goto("/chapters")
    await page.waitForSelector("canvas.maplibregl-canvas")
    await page.getByText("Loading the map").waitFor({ state: "hidden", timeout: 20000 })
    await hold(900)
    await caption("Chapters are city-level only, with a shared inbox.", 4)
    await hold(3200)
  },
}
