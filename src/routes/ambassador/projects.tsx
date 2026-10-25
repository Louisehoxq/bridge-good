import { PageHeader } from "@/components/app-shell"
import { ProblemBoard } from "@/components/problem-board"
import { STATUS_LABEL, type ProblemStatus } from "@/content/problems"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Partner pipeline")

const ORDER: ProblemStatus[] = ["needs-sponsor", "open-for-students", "in-progress", "completed"]

export default function AmbassadorProjects() {
  return (
    <>
      <PageHeader title="Your project pipeline">
        Problems submitted by community partners, from first contact to Demo Day. Find sponsors for the ones that need support, and form teams on Matching &amp; milestones.
      </PageHeader>
      <div className="space-y-12">
        {ORDER.map((status) => (
          <section key={status} aria-labelledby={`${status}-title`}>
            <h2 id={`${status}-title`} className="mb-4 type-title-3">
              {STATUS_LABEL[status]}
            </h2>
            <ProblemBoard status={[status]} />
          </section>
        ))}
      </div>
    </>
  )
}
