import { PageHeader } from "@/components/app-shell"
import { YourUpcomingEvents } from "@/components/events/event-lists"
import { ImpactLoop } from "@/components/impact-loop"
import { MentorSnapshot } from "@/components/demo/snapshots"
import { PathStepper } from "@/components/path/path-stepper"
import { ROLE_INFO } from "@/lib/roles"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Mentor overview")

export default function MentorHome() {
  return (
    <>
      <PageHeader title={`Welcome back, ${ROLE_INFO.mentor.demoAccount.name.split(" ")[0]}`}>
        You finished the BRIDGEGOOD apprenticeship and came back to mentor (synthetic example). Care, honesty and
        encouragement are what make this work.
      </PageHeader>
      <div className="space-y-8">
        <PathStepper pathKey="mentor" variant="compact" />
        <MentorSnapshot />
      </div>
      <YourUpcomingEvents />

      <section aria-labelledby="loop-title" className="mt-12">
        <h2 id="loop-title" className="mb-6 type-title-2">
          Where you fit
        </h2>
        <ImpactLoop current="mentor" />
      </section>
    </>
  )
}
