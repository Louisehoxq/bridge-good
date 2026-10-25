import { PageHeader } from "@/components/app-shell"
import { ImpactLoop } from "@/components/impact-loop"
import { StudentSnapshot } from "@/components/demo/snapshots"
import { ROLE_INFO } from "@/lib/roles"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Student overview")

export default function StudentHome() {
  return (
    <>
      <PageHeader eyebrow="Student area" title={`Welcome back, ${ROLE_INFO.student.demoAccount.name.split(" ")[0]}`}>
        Your background is a strength. Here&apos;s where your learning, projects and community live.
      </PageHeader>
      <StudentSnapshot />
      <section aria-labelledby="loop-title" className="mt-12">
        <h2 id="loop-title" className="mb-6 text-2xl font-bold">
          Where you fit
        </h2>
        <ImpactLoop current="student" />
      </section>
    </>
  )
}
