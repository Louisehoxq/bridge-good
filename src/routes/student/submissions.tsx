import { PageHeader } from "@/components/app-shell"
import { StudentSubmissions } from "@/components/demo/submissions"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Submissions & feedback")

export default function SubmissionsPage() {
  return (
    <>
      <PageHeader title="Share your work, start a growth conversation">
        Say what you think is working and where you want help. Your mentor reads that first, then writes what&apos;s
        working and one next step for each pillar they comment on. There are no scores and no pass or fail.
      </PageHeader>
      <StudentSubmissions />
    </>
  )
}
