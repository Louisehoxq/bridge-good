import { PageHeader } from "@/components/app-shell"
import { MentorReview } from "@/components/demo/submissions"
import { MentorConversationStarters } from "@/components/reflection/shared-lists"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Growth conversations")

export default function MentorConversations() {
  return (
    <>
      <PageHeader title="Reply to your apprentices' work">
        Start from the apprentice&apos;s own self-assessment. Then, for the pillars that matter most, say what&apos;s
        working and one next step. Lead with what&apos;s working, and make next steps specific. There are no scores and
        no pass or fail.
      </PageHeader>
      <div className="mb-10 max-w-4xl">
        <MentorConversationStarters />
      </div>
      <MentorReview />
    </>
  )
}
