import type { Metadata } from "next"
import { PageHeader } from "@/components/app-shell"
import { PrinciplesInPractice } from "@/components/principles-in-practice"
import { TrainingTrack } from "@/components/training-track"

export const metadata: Metadata = { title: "Mentor training" }

export default function MentorTraining() {
  return (
    <>
      <PageHeader eyebrow="Training" title="Mentoring the BRIDGEGOOD way">
        Start with the one-page explainer, then work through the modules.
      </PageHeader>
      <TrainingTrack audience="mentor" />
      <section aria-labelledby="principles-title" className="mt-14">
        <h2 id="principles-title" className="mb-6 text-2xl font-bold">
          The principles, for mentors
        </h2>
        <PrinciplesInPractice role="mentor" />
      </section>
    </>
  )
}
