import type { Metadata } from "next"
import { PageHeader } from "@/components/app-shell"
import { ProblemBoard } from "@/components/problem-board"

export const metadata: Metadata = { title: "Capstone gallery" }

export default function GalleryPage() {
  return (
    <>
      <PageHeader eyebrow="Capstone gallery" title="Previous capstone projects">
        What partners, students and mentors have built together. These are synthetic examples. Real projects would only
        appear with everyone&apos;s explicit permission.
      </PageHeader>
      <h2 className="sr-only">Completed capstones</h2>
      <ProblemBoard status={["completed"]} />
    </>
  )
}
