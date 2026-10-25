import { PageHeader } from "@/components/app-shell"
import { StudentSubmissions } from "@/components/demo/submissions"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Project submissions")

export default function SubmissionsPage() {
  return (
    <>
      <PageHeader eyebrow="Project submissions" title="Share your work, get feedback">
        Mentors review every submission against the Design for Social Good principles, so feedback covers community
        voice and accessibility, not just visuals.
      </PageHeader>
      <StudentSubmissions />
    </>
  )
}
