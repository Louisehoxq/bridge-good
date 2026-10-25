import type { Metadata } from "next"
import { PageHeader } from "@/components/app-shell"
import { MentorOfficeHours } from "@/components/demo/office-hours"

export const metadata: Metadata = { title: "Office hours" }

export default function MentorOfficeHoursPage() {
  return (
    <>
      <PageHeader eyebrow="Office hours" title="Your office hours">
        Offer slots for students to book, and see what they&apos;d like to talk about.
      </PageHeader>
      <MentorOfficeHours />
    </>
  )
}
