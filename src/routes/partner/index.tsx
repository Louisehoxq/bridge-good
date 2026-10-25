import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { ImpactLoop } from "@/components/impact-loop"
import { PathStepper } from "@/components/path/path-stepper"
import { SubmittedBriefs } from "@/components/partner/submitted-briefs"
import { buttonVariants } from "@/components/ui/button"
import { ROLE_INFO } from "@/lib/roles"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Community partner overview")

export default function PartnerHome() {
  return (
    <>
      <PageHeader title={`Welcome, ${ROLE_INFO.partner.demoAccount.name}`}>
        You know your community best. Share a problem, and we&apos;ll help shape it into a four-week partner project. An
        apprentice team takes it on with mentor support, and it ends at Demo Day.
      </PageHeader>
      <div className="mb-8">
        <PathStepper pathKey="partner" variant="compact" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[2fr_3fr]">
        <div className="space-y-3 rounded-2xl border bg-archetype-soft p-6">
          <h2 className="type-title-3">Have a new problem?</h2>
          <p>Chat with the scoping assistant, add screenshots, and build a project brief. A person at BRIDGEGOOD reviews it before anything happens.</p>
          <Link to="/partner/submit" className={buttonVariants({ size: "lg", className: "bg-archetype text-on-archetype hover:bg-archetype/90" })}>
            Submit a problem
          </Link>
        </div>
        <SubmittedBriefs />
      </div>
      <section aria-labelledby="loop-title" className="mt-12">
        <h2 id="loop-title" className="mb-6 type-title-2">
          Where you fit
        </h2>
        <ImpactLoop current="partner" />
      </section>
    </>
  )
}
