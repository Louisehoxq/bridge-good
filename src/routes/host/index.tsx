import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { Icon } from "@/components/icon"
import { ProblemBoard } from "@/components/problem-board"
import { HOST_GIVES, HOST_LINE, HOST_STAGES } from "@/content/company-host"
import { ROLE_INFO } from "@/lib/roles"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Company host overview")

export default function HostHome() {
  const account = ROLE_INFO["company-host"].demoAccount
  return (
    <>
      <PageHeader title={`Welcome back, ${account.name.split(" ")[0]}`}>
        {account.detail}. Here&apos;s where your company&apos;s time and money can help, without steering what communities work on.
      </PageHeader>
      <div className="space-y-10">
        <section aria-labelledby="path-title">
          <h2 id="path-title" className="mb-4 type-title-2">
            Your company host path
          </h2>
          <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {HOST_STAGES.map((s, i) => (
              <li key={s.id}>
                <Link to={s.href} className="flex h-full gap-3 rounded-xl border bg-card p-4 hover:border-archetype">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-archetype font-bold text-on-archetype" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-bold">
                      <span className="sr-only">Step {i + 1}: </span>
                      {s.title}
                    </span>
                    <span className="text-muted-foreground">{s.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <section aria-labelledby="give-title" className="rounded-2xl border bg-card p-5">
            <h2 id="give-title" className="type-title-3">
              What your company gives
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {HOST_GIVES.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="line-title" className="rounded-2xl border-2 border-archetype p-5">
            <h2 id="line-title" className="type-title-3">
              Where the line is
            </h2>
            <p className="mt-2">{HOST_LINE}</p>
            <Link to="/host/guide#vetted" className="mt-2 inline-flex min-h-12 items-center font-semibold text-archetype underline underline-offset-4">
              What BRIDGEGOOD looks for
            </Link>
          </section>
        </div>

        <section aria-labelledby="sponsor-title">
          <h2 id="sponsor-title" className="mb-1 type-title-2">
            Projects that need a sponsor
          </h2>
          <p className="mb-4 text-muted-foreground">Chapters have already taken these on. Sponsoring one covers costs; it doesn&apos;t change the brief.</p>
          <ProblemBoard status={["needs-sponsor"]} />
        </section>

        <section aria-labelledby="work-title" className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-archetype-soft p-6">
          <div className="max-w-2xl">
            <h2 id="work-title" className="type-title-3">
              Bring it to your workplace
            </h2>
            <p className="mt-1">Practice the principles in your own product work, then tell BRIDGEGOOD what changed.</p>
          </div>
          <Link to="/host/workplace" className="inline-flex min-h-12 items-center gap-1 font-semibold text-archetype underline underline-offset-4">
            Start here
            <Icon name="arrow-right" className="text-base" />
          </Link>
        </section>
      </div>
    </>
  )
}
