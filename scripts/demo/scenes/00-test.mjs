export default {
  id: "00-test",
  budgetSeconds: 6,
  state: "fresh",
  async run({ page, goto, caption, click, hold }) {
    await goto("/")
    await caption("Helper test caption", 2.5)
    await hold(1500)
    await click(page.getByRole("link", { name: "Library" }).first())
    await hold(1500)
  },
}
