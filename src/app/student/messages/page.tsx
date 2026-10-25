import type { Metadata } from "next"
import { PageHeader } from "@/components/app-shell"
import { Conversation } from "@/components/demo/conversation"
import { DEMO_MENTOR, DEMO_STUDENT } from "@/content/seed"

export const metadata: Metadata = { title: "Messages" }

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
