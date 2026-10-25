const DESCRIPTION =
  "Learn, practice and carry forward BRIDGEGOOD's Design for Social Good philosophy, whether you're a student, a mentor, an ambassador or an organization with a problem to solve."

/** Route `meta` export: "<page> · BridgeGoodx" plus the site description (child meta replaces the parent's). */
export function pageMeta(title?: string) {
  return [{ title: title ? `${title} · BridgeGoodx` : "BridgeGoodx · Design for Social Good" }, { name: "description", content: DESCRIPTION }]
}
