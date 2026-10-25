import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/app-shell"
import { ImpactLoop } from "@/components/impact-loop"
import { PROBLEMS } from "@/content/problems"
import { ROLE_INFO } from "@/lib/roles"

export const metadata: Metadata = { title: "Ambassador overview" }

export default function AmbassadorHome() {
  const count = (s: string) => PROBLEMS.filter((p) => p.status === s).length
  const stats = [
    { label: "Need a sponsor", value: count("needs-sponsor"), href: "/ambassador/projects" },
    { label: "Open for students", value: count("open-for-students"), href: "/ambassador/projects" },
    { label: "In progress", value: count("in-progress"), href: "/ambassador/projects" },
    { label: "Completed capstones", value: count("completed"), href: "/ambassador/projects" },
  ]
  return (
    <>
      <PageHeader eyebrow="Ambassador area" title={`Welcome back, ${ROLE_INFO.ambassador.demoAccount.name.split(" ")[0]}`}>
        {ROLE_INFO.ambassador.demoAccount.detail}. Here&apos;s your partner pipeline and the tools to grow it.
      </PageHeader>
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="flex flex-col gap-1 rounded-2xl border bg-card p-5 hover:border-archetype hover:bg-archetype-soft">
              <span className="text-sm font-bold text-muted-foreground">{s.label}</span>
              <span className="font-heading text-3xl font-bold">{s.value}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-sm text-muted-foreground">Counts come from synthetic example projects.</p>
      <section aria-labelledby="loop-title" className="mt-12">
        <h2 id="loop-title" className="mb-6 text-2xl font-bold">
          Where you fit
        </h2>
        <ImpactLoop current="ambassador" />
      </section>
    </>
  )
}
