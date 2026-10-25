export default {
  id: "02-library",
  budgetSeconds: 16,
  state: "fresh",
  async run({ page, goto, caption, click, hold, scrollBy, scrollIntoView }) {
    await goto("/learn/pillars/ethics-impact")
    await caption("Each pillar says what it means in practice.", 3.8)
    await hold(1500)
    await scrollBy(420, 1200)
    await hold(600)
    await goto("/learn/practice/skip-the-interviews")
    await caption("Practice moment: BRIDGEGOOD's reasoning, no score.", 8)
    await hold(900)
    await click(page.getByLabel(/Propose something small/), { after: 300 })
    await click(page.getByRole("button", { name: "See how BRIDGEGOOD reasons about it" }), { after: 500 })
    await scrollIntoView(page.getByRole("heading", { name: "How BRIDGEGOOD reasons about it" }), { ms: 800 })
    await hold(2200)
  },
}
