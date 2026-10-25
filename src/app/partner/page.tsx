import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/app-shell"
import { ImpactLoop } from "@/components/impact-loop"
import { SubmittedBriefs } from "@/components/partner/submitted-briefs"
import { buttonVariants } from "@/components/ui/button"
import { ROLE_INFO } from "@/lib/roles"

export const metadata: Metadata = { title: "Partner overview" }

export default function PartnerHome() {
  return (
    <>
      <PageHeader eyebrow="Partner area" title={`Welcome, ${ROLE_INFO.partner.demoAccount.name}`}>
        You know your community best. Share a problem, and we&apos;ll help shape it into a capstone that a student team
        can take on with mentor support.
      </PageHeader>
      <div className="grid gap-6 xl:grid-cols-[2fr_3fr]">
        <div className="space-y-3 rounded-2xl bg-archetype-soft p-6">
          <h2 className="text-xl font-bold">Have a new problem?</h2>
          <p>Chat with the scoping assistant, add screenshots, and build a capstone brief in minutes.</p>
          <Link href="/partner/submit" className={buttonVariants({ size: "lg", className: "bg-archetype text-white hover:bg-archetype/90" })}>
            Submit a problem
          </Link>
        </div>
        <SubmittedBriefs />
      </div>
      <section aria-labelledby="loop-title" className="mt-12">
        <h2 id="loop-title" className="mb-6 text-2xl font-bold">
          Where you fit
        </h2>
        <ImpactLoop current="partner" />
      </section>
    </>
  )
}
