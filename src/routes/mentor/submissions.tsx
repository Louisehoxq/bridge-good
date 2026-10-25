import { PageHeader } from "@/components/app-shell"
import { MentorReview } from "@/components/demo/submissions"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Student submissions")

export default function MentorSubmissions() {
  return (
    <>
      <PageHeader eyebrow="Student submissions" title="Review and give feedback">
        Evaluate each piece against the principles. Lead with what&apos;s working, and make next steps specific.
      </PageHeader>
      <MentorReview />
    </>
  )
}
