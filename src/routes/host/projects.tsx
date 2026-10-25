import { PageHeader } from "@/components/app-shell"
import { Notice } from "@/components/notice"
import { ProblemBoard } from "@/components/problem-board"
import { HOST_LINE } from "@/content/company-host"
import { STATUS_LABEL, type ProblemStatus } from "@/content/problems"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Partner projects")

const ORDER: ProblemStatus[] = ["needs-sponsor", "in-progress", "completed"]

export default function HostProjects() {
  return (
    <>
      <PageHeader title="Partner projects">
        Projects community partners have brought to chapters. Sponsor the ones that need support, or host mentors for a team.
      </PageHeader>
      <Notice className="mb-10">{HOST_LINE}</Notice>
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
