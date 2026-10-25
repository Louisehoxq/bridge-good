import { PageHeader } from "@/components/app-shell"
import { ProblemBoard } from "@/components/problem-board"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Project gallery")

export default function GalleryPage() {
  return (
    <>
      <PageHeader title="Example partner projects">
        Examples of what a partner project could produce. Synthetic examples. Real projects appear only with everyone&apos;s
        permission.
      </PageHeader>
      <h2 className="sr-only">Example projects</h2>
      <ProblemBoard status={["completed"]} />
    </>
  )
}
