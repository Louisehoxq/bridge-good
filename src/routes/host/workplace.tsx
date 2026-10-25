import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { Icon } from "@/components/icon"
import { StatusTag, usePlaybook } from "@/components/playbook/shared"
import { buttonVariants } from "@/components/ui/button"
import { LAB_SCENARIOS } from "@/content/lab"
import { RESOURCES } from "@/content/practice-library"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Bring it to your workplace")

/** Scenarios most relevant to product teams, workplace one first. */
const SCENARIOS = ["limited-budget-unequal-access", "feedback-challenges-plan", "conflicting-stakeholder-needs", "team-conflict-trust"]

export default function Workplace() {
  const [entries] = usePlaybook()
  const scenarios = SCENARIOS.map((s) => LAB_SCENARIOS.find((x) => x.slug === s)!)
  const tools = RESOURCES.filter((r) => (r.roles as string[]).includes("company")).slice(0, 8)
  const mine = entries.filter((e) => e.mine && e.kind === "workplace")

  return (
    <>
      <PageHeader title="Bring it to your workplace">
        Design for Social Good isn&apos;t only for chapter projects. Practice the principles in your own product work, then
        share what changed so others can learn from it.
      </PageHeader>
      <div className="space-y-12">
        <section aria-labelledby="lab-title">
          <h2 id="lab-title" className="mb-1 type-title-2">
            Workplace dilemmas in the Decision Lab
          </h2>
          <p className="mb-4 text-muted-foreground">Good for a team retro or a lunch-and-learn. No single right answer.</p>
          <ul className="grid gap-4 md:grid-cols-2">
            {scenarios.map((s) => (
              <li key={s.slug}>
                <Link to={`/lab/${s.slug}`} className="flex h-full flex-col gap-2 rounded-xl border bg-card p-5 hover:border-archetype">
                  <span className="type-small font-semibold text-muted-foreground">{s.theme}</span>
                  <span className="type-title-3">{s.title}</span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 font-semibold text-archetype">
                    Work through it
                    <Icon name="arrow-right" className="text-base" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="tools-title">
          <h2 id="tools-title" className="mb-4 type-title-2">
            Tools for product teams
          </h2>
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {tools.map((r) => (
              <li key={r.slug}>
                <Link to={`/library/${r.slug}`} className="flex h-full flex-col gap-1 rounded-xl border bg-card p-4 hover:border-archetype">
                  <span className="font-bold">{r.title}</span>
                  <span className="text-muted-foreground">{r.helps}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/library?role=company" className="mt-3 inline-flex min-h-12 items-center underline underline-offset-4">
            All tools for company hosts
          </Link>
        </section>

        <section aria-labelledby="share-title" className="rounded-2xl bg-archetype-soft p-6">
          <h2 id="share-title" className="type-title-2">
            Send learning back
          </h2>
          <p className="mt-2 max-w-3xl">
            What did your company change in its own product work, and what got in the way? Share a workplace reflection. A
            BRIDGEGOOD steward reviews it before it&apos;s published as a practice example.
          </p>
          <Link to="/playbook/contribute?about=workplace" className={buttonVariants({ className: "mt-4" })}>
            Share a workplace reflection
          </Link>
          {mine.length > 0 && (
            <ul className="mt-6 space-y-2">
              {mine.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-card p-3">
                  <Link to={`/playbook/${e.id}`} className="font-semibold underline underline-offset-4">
                    {e.title}
                  </Link>
                  <StatusTag status={e.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
