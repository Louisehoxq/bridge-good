import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { ToolkitList } from "@/components/toolkit-list"
import { ORGANIZATION_TOOLKIT } from "@/content/toolkits"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Organization toolkit")

export default function HostToolkit() {
  return (
    <>
      <PageHeader title="Organization toolkit">
        Materials and strategies for making the case inside your company, engaging colleagues, and sustaining the
        partnership. Downloads are placeholders for now.
      </PageHeader>
      <h2 className="sr-only">Toolkit sections</h2>
      <ToolkitList sections={ORGANIZATION_TOOLKIT} />
      <p className="mt-8">
        Recruiting mentors? Start with the{" "}
        <Link to="/library/mentor-onboarding" className="underline underline-offset-4">
          mentor onboarding guide
        </Link>
        .
      </p>
    </>
  )
}
