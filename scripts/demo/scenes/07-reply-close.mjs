export default {
  id: "07-reply-close",
  budgetSeconds: 12,
  state: "eastside-decided",
  async run({ page, goto, caption, click, scrollIntoView, hold, endCard, meta }) {
    const { replyCode } = meta()
    await goto("/learn/carry-it-forward/reply")
    await caption("No name, no email: Eastside reads the answer with a reply code.", 4)
    const field = page.getByLabel("Your reply code")
    await field.focus()
    await field.pressSequentially(replyCode.toLowerCase().replaceAll("-", " "), { delay: 45 })
    await hold(300)
    await click(page.getByRole("button", { name: "Check" }), { after: 300 })
    const accepted = page.getByText("BRIDGEGOOD accepted this").first()
    await accepted.waitFor({ timeout: 5000 })
    await scrollIntoView(accepted, { ms: 600 })
    await caption("The decision comes back with BRIDGEGOOD's reason.", 3)
    await hold(2000)
    await endCard(["BridgeGoodx", "BRIDGEGOOD's philosophy, your community's practice", "All people and data shown are synthetic"])
    await hold(2800)
  },
}
