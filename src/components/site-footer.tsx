import Link from "next/link"
import { ARCHETYPE_INFO, ARCHETYPES } from "@/lib/archetype"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-muted">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-3">
          <p className="max-w-prose">
            The Design for Social Good philosophy is created and stewarded by BRIDGEGOOD. It grows through feedback from
            the students, alumni, mentors, ambassadors and communities who practise it.
          </p>
          <p className="text-sm text-muted-foreground">
            Hackathon prototype. Every person, organisation and project shown is a synthetic example, not a real
            BRIDGEGOOD participant. Forms don&apos;t store anything.
          </p>
        </div>
        <nav aria-label="Views">
          <ul className="space-y-1">
            {ARCHETYPES.map((a) => (
              <li key={a}>
                <Link href={ARCHETYPE_INFO[a].href} className="inline-flex min-h-11 items-center underline underline-offset-4">
                  {ARCHETYPE_INFO[a].label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
