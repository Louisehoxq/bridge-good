import { PageHeader } from "@/components/app-shell"
import { Conversation } from "@/components/demo/conversation"
import { DEMO_MENTOR, DEMO_STUDENT } from "@/content/seed"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Messages")

export default function StudentMessages() {
  return (
    <>
      <PageHeader eyebrow="Messages" title={`Your mentor, ${DEMO_MENTOR}`} />
      <div className="max-w-4xl">
        <Conversation thread={DEMO_STUDENT} as="student" title={`Conversation with ${DEMO_MENTOR}`} />
      </div>
    </>
  )
}
