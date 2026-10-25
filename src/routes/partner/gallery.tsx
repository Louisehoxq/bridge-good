import { PageHeader } from "@/components/app-shell"
import { ProblemBoard } from "@/components/problem-board"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Project gallery")

export default function GalleryPage() {
  return (
    <>
      <PageHeader title="Example partner projects (synthetic)">
        Examples of what a partner project could produce. These are synthetic: the organizations, teams and outcomes are
        made up. Real projects would only appear with everyone&apos;s explicit permission.
      </PageHeader>
      <h2 className="sr-only">Example projects</h2>
      <ProblemBoard status={["completed"]} />
    </>
  )
}
