import { PageHeader } from "@/components/app-shell"
import { StudentOfficeHours } from "@/components/demo/office-hours"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Office hours")

export default function OfficeHoursPage() {
  return (
    <>
      <PageHeader eyebrow="Office hours" title="Time with a mentor">
        Book a 30-minute slot for portfolio feedback, research questions or career advice.
      </PageHeader>
      <StudentOfficeHours />
    </>
  )
}
