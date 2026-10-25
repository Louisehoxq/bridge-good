import { PageHeader } from "@/components/app-shell"
import { PrinciplesInPractice } from "@/components/principles-in-practice"
import { TrainingTrack } from "@/components/training-track"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Ambassador training")

const KEEP = [
  "Community voice leads: the people affected help define the problem and judge the result",
  "Students do real work and get visible credit",
  "Accessibility and inclusion are built in from the start",
  "Feedback is collected and acted on",
  "BRIDGEGOOD is credited as the author of the philosophy",
]
const ADAPT = [
  "Which communities and problems you focus on",
  "Language, cultural references and examples",
  "How often and where you meet",
  "Which local partners, funders and mentors you work with",
  "How you recognise and celebrate participants",
]

export default function AmbassadorTraining() {
  return (
    <>
      <PageHeader eyebrow="Training" title="Carrying the philosophy forward">
        Everything you need to start and run a chapter responsibly.
      </PageHeader>
      <TrainingTrack audience="ambassador" />
      <section aria-labelledby="adapt-title" className="mt-14">
        <h2 id="adapt-title" className="mb-6 text-2xl font-bold">
          Adapt, don&apos;t copy
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border-2 border-archetype bg-card p-5">
            <h3 className="text-lg font-bold">Keep these the same everywhere</h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">{KEEP.map((k) => <li key={k}>{k}</li>)}</ul>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h3 className="text-lg font-bold">Adapt these to your community</h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">{ADAPT.map((k) => <li key={k}>{k}</li>)}</ul>
          </div>
        </div>
      </section>
      <section aria-labelledby="principles-title" className="mt-14">
        <h2 id="principles-title" className="mb-6 text-2xl font-bold">
          The principles, for ambassadors
        </h2>
        <PrinciplesInPractice role="ambassador" />
      </section>
    </>
  )
}
