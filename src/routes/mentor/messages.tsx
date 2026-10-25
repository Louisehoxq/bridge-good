import { PageHeader } from "@/components/app-shell"
import { MentorInbox } from "@/components/demo/conversation"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Messages")

export default function MentorMessages() {
  return (
    <>
      <PageHeader eyebrow="Messages" title="Conversations with students" />
      <MentorInbox />
    </>
  )
}
