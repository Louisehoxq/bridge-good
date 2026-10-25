import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { PathStepper } from "@/components/path/path-stepper"
import { PrinciplesInPractice } from "@/components/principles-in-practice"
import { ProposeAdaptation } from "@/components/feedback/propose-adaptation" // Milestone 3 hook
import { AMBASSADOR_KIND_INFO } from "@/lib/roles"
import { useSession } from "@/lib/session"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Playbook")

export default function AmbassadorPlaybook() {
  const kind = useSession()?.ambassadorKind ?? "chapter-lead"
  const label = AMBASSADOR_KIND_INFO[kind].label.toLowerCase()

  return (
    <>
      <PageHeader title={`Your ${label} playbook`}>
        The stages of carrying the philosophy forward as a {label}. The guides and tracks live in the public library, so
        partners and mentors can read the same pages.
      </PageHeader>
      <div className="grid gap-8 xl:grid-cols-[3fr_2fr]">
        <PathStepper pathKey={kind} />
        <aside className="h-fit space-y-4">
          <section aria-labelledby="keep-title" className="rounded-2xl border-2 border-archetype p-5">
            <h2 id="keep-title" className="type-title-3">
              Adapt, don&apos;t copy
            </h2>
            <p className="mt-1">
              What every chapter keeps the same, what it adapts, and how changes go back to BRIDGEGOOD. BRIDGEGOOD keeps
              authorship and approves any change to the core.
            </p>
            <Link to="/learn/guides/adapt-locally" className="mt-2 inline-flex min-h-12 items-center font-semibold text-archetype underline underline-offset-4">
              Read the guide
            </Link>
          </section>
          <section aria-labelledby="track-title" className="rounded-2xl border bg-card p-5">
            <h2 id="track-title" className="type-title-3">
              Your track in the library
            </h2>
            <Link
              to={kind === "chapter-lead" ? "/learn/tracks/ambassadors" : "/learn/tracks/company-hosts"}
              className="inline-flex min-h-12 items-center font-semibold text-archetype underline underline-offset-4"
            >
              {kind === "chapter-lead" ? "For chapter leads" : "For company hosts"}
            </Link>
          </section>
        </aside>
      </div>
      {/* Milestone 3 hook: chapter leads propose local adaptations to the BRIDGEGOOD steward. */}
      <ProposeAdaptation />
      <section aria-labelledby="principles-title" className="mt-14">
        <h2 id="principles-title" className="mb-6 type-title-2">
          How BRIDGEGOOD works with ambassadors
        </h2>
        <PrinciplesInPractice role="ambassador" />
      </section>
    </>
  )
}
