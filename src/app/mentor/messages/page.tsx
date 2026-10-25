import type { Metadata } from "next"
import { PageHeader } from "@/components/app-shell"
import { MentorInbox } from "@/components/demo/conversation"

export const metadata: Metadata = { title: "Messages" }

export default function MentorMessages() {
  return (
    <>
      <PageHeader eyebrow="Messages" title="Conversations with students" />
      <MentorInbox />
    </>
  )
}
