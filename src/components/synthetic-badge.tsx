/** Marks made-up people, organizations and projects. A dashed edge, so it never reads as a status. */
export function SyntheticBadge() {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-dashed border-muted-foreground px-2 py-0.5 type-small font-semibold whitespace-nowrap text-muted-foreground">
      Synthetic example
    </span>
  )
}
