import { PageHeader } from "@/components/app-shell"
import { ProblemBoard } from "@/components/problem-board"
import { STATUS_LABEL, type ProblemStatus } from "@/content/problems"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Partner projects")

const ORDER: ProblemStatus[] = ["needs-sponsor", "open-for-students", "in-progress", "completed"]

export default function AmbassadorProjects() {
  return (
    <>
      <PageHeader eyebrow="Partner projects" title="Your project pipeline">
        Problems submitted by partners, from first contact to completed capstone. Sponsor the ones that need support.
      </PageHeader>
      <div className="space-y-12">
        {ORDER.map((status) => (
          <section key={status} aria-labelledby={`${status}-title`}>
            <h2 id={`${status}-title`} className="mb-4 text-xl font-bold">
              {STATUS_LABEL[status]}
            </h2>
            <ProblemBoard status={[status]} />
          </section>
        ))}
      </div>
    </>
  )
}
