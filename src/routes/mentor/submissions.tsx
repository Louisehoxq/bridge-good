import { PageHeader } from "@/components/app-shell"
import { MentorReview } from "@/components/demo/submissions"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Growth conversations")

export default function MentorSubmissions() {
  return (
    <>
      <PageHeader eyebrow="Growth conversations" title="Reply to your apprentices' work">
        Start from the apprentice&apos;s own self-assessment. Then, for the pillars that matter most, say what&apos;s
        working and one next step. Lead with what&apos;s working, and make next steps specific. There are no scores and
        no pass or fail.
      </PageHeader>
      <MentorReview />
    </>
  )
}
