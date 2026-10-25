const DESCRIPTION =
  "BRIDGEGOOD's shared space for learning, practicing, and carrying forward Design for Social Good: understand the principles, practice in the Decision Lab, find tools in the Practice Library, and help the Living Playbook grow."

/** Route `meta` export: "<page> · BridgeGoodx" plus the site description (child meta replaces the parent's). */
export function pageMeta(title?: string) {
  return [{ title: title ? `${title} · BridgeGoodx` : "BridgeGoodx · Design for Social Good" }, { name: "description", content: DESCRIPTION }]
}
