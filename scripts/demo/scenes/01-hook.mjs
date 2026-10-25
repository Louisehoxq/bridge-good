export default {
  id: "01-hook",
  budgetSeconds: 12,
  state: "fresh",
  async run({ page, goto, caption, hold, scrollBy, scrollIntoView }) {
    await goto("/")
    await caption("BRIDGEGOOD's Design for Social Good travels person to person.", 4)
    await hold(1800)
    await scrollIntoView(page.getByText("BRIDGEGOOD authors it. A community practices it.").first(), { ms: 1800 })
    await hold(300)
    await caption("BridgeGoodx lets communities practice it, and sends what they learn back.", 3.6)
    await hold(3000)
    await caption("Every person and group shown is synthetic.", 2)
    await hold(1800)
  },
}
