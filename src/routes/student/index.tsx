import { PageHeader } from "@/components/app-shell"
import { ImpactLoop } from "@/components/impact-loop"
import { StudentSnapshot } from "@/components/demo/snapshots"
import { PathStepper } from "@/components/path/path-stepper"
import { ROLE_INFO } from "@/lib/roles"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Apprentice overview")

export default function StudentHome() {
  return (
    <>
      <PageHeader eyebrow="Apprentice area" title={`Welcome back, ${ROLE_INFO.student.demoAccount.name.split(" ")[0]}`}>
        Your background is a strength. Here&apos;s where you are on your path, and what&apos;s waiting for you.
      </PageHeader>
      <div className="space-y-8">
        <PathStepper pathKey="student" variant="compact" />
        <StudentSnapshot />
      </div>
      <section aria-labelledby="loop-title" className="mt-12">
        <h2 id="loop-title" className="mb-6 text-2xl font-bold">
          Where you fit
        </h2>
        <ImpactLoop current="student" />
      </section>
    </>
  )
}
