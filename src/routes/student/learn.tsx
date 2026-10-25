import { PageHeader } from "@/components/app-shell"
import { PrinciplesInPractice } from "@/components/principles-in-practice"
import { TrainingTrack } from "@/components/training-track"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Learning modules")

export default function LearnPage() {
  return (
    <>
      <PageHeader eyebrow="Learning materials" title="Design for Good modules">
        Each module pairs a design skill with the mindset behind it. Work through them in order before your first project.
      </PageHeader>
      <TrainingTrack audience="student" />
      <section aria-labelledby="principles-title" className="mt-14">
        <h2 id="principles-title" className="mb-2 text-2xl font-bold">
          The principles, for you
        </h2>
        <p className="mb-6 text-muted-foreground">Open each one to see what it asks of you as a student.</p>
        <PrinciplesInPractice role="student" />
      </section>
    </>
  )
}
