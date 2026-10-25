import { PageHeader } from "@/components/app-shell"
import { Conversation } from "@/components/demo/conversation"
import { StudentOfficeHours } from "@/components/demo/office-hours"
import { DEMO_MENTOR, DEMO_STUDENT } from "@/content/seed"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("My mentor")

export default function StudentMentor() {
  return (
    <>
      <PageHeader title={`${DEMO_MENTOR}, your mentor`}>
        {DEMO_MENTOR} is a product designer and BRIDGEGOOD alum who volunteers as a mentor (synthetic example). Message
        them any time, or book office hours for a longer conversation.
      </PageHeader>
      <div className="space-y-12">
        <div className="max-w-4xl">
          <Conversation thread={DEMO_STUDENT} as="student" title={`Messages with ${DEMO_MENTOR}`} />
        </div>
        <section aria-labelledby="hours-title">
          <h2 id="hours-title" className="mb-1 type-title-2">
            Office hours
          </h2>
          <p className="mb-4 text-muted-foreground">
            Book a 30-minute slot for portfolio feedback, research questions or career advice. Times are in Pacific Time
            (PT).
          </p>
          <StudentOfficeHours headingLevel={3} />
        </section>
      </div>
    </>
  )
}
