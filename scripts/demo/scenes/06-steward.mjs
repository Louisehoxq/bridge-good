export default {
  id: "06-steward",
  budgetSeconds: 18,
  state: "steward-before",
  async run({ page, goto, caption, click, type, hold, scrollIntoView }) {
    await goto("/steward")
    await caption("All feedback lands in one inbox, from every role.", 3.4)
    await hold(1700)
    await page.getByLabel("Type").selectOption("outside-community")
    await hold(300)
    await click(page.getByRole("link", { name: "Outside community: a community organization" }), { after: 300 })
    await caption("Only the steward changes the wording, always with a reason.", 5)
    await click(page.getByLabel("Accept"), { after: 150 })
    await click(page.getByLabel("Show it as a field note"), { after: 150 })
    await type(
      page.getByLabel("Your reason"),
      "It removes a language barrier without dropping any prompt, and other groups face the same barrier.",
      { delay: 8 },
    )
    await hold(700)
    await click(page.getByRole("button", { name: "Record decision" }), { after: 500 })
    await page.waitForURL(/\/steward\?decided=/)
    await caption("The change is public, and credits the group that asked.", 6)
    await goto("/learn/pillars/access-inclusion")
    const note = page.getByText("Eastside Tenants Network").first()
    await note.waitFor()
    await scrollIntoView(note)
    await hold(5200)
  },
}
