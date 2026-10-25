import { Link } from "react-router"
import { PUBLIC_NAV } from "@/lib/roles"
import { ResetDemoButton } from "@/components/reset-demo-button"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-muted print:hidden">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div className="space-y-3">
          <p className="max-w-prose">
            Rooted in BRIDGEGOOD&apos;s philosophy. Shaped by lived experience. Carried forward together. The core
            philosophy is authored and stewarded by BRIDGEGOOD; community contributions are labelled as such.
          </p>
          <p className="text-muted-foreground">
            Hackathon prototype. Every person, organization, scenario and contribution shown is a synthetic example, not a
            real BRIDGEGOOD participant. Demo data stays in this browser.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-1">
            {PUBLIC_NAV.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="inline-flex min-h-12 items-center underline underline-offset-4">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/chapters" className="inline-flex min-h-12 items-center underline underline-offset-4">
                Chapters
              </Link>
            </li>
            <li>
              <Link to="/events" className="inline-flex min-h-12 items-center underline underline-offset-4">
                Community events
              </Link>
            </li>
            <li>
              <Link to="/login" className="inline-flex min-h-12 items-center underline underline-offset-4">
                Log in
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <ResetDemoButton />
        </div>
      </div>
    </footer>
  )
}
