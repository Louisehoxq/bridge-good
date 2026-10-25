import { PageHeader } from "@/components/app-shell"
import { ToolkitList } from "@/components/toolkit-list"
import { ORGANIZATION_TOOLKIT, PROBLEM_OWNER_TOOLKIT } from "@/content/toolkits"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Outreach & partner toolkits")

export default function AmbassadorToolkits() {
  return (
    <>
      <PageHeader title="Tools to grow your chapter">
        Templates and guides for working with problem owners and partner organizations.
      </PageHeader>
      <section aria-labelledby="po-title" className="mb-14">
        <h2 id="po-title" className="type-title-2">
          Problem owner toolkit
        </h2>
        <p className="mt-1 mb-6 text-muted-foreground">
          Resources for recruiting, onboarding and supporting problem owners who bring real-world case studies.
        </p>
        <ToolkitList sections={PROBLEM_OWNER_TOOLKIT} />
      </section>
      <section aria-labelledby="org-title">
        <h2 id="org-title" className="type-title-2">
          Organization toolkit
        </h2>
        <p className="mt-1 mb-6 text-muted-foreground">
          Materials and strategies for engaging partner companies and corporate stakeholders.
        </p>
        <ToolkitList sections={ORGANIZATION_TOOLKIT} />
      </section>
    </>
  )
}
