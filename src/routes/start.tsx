import { data, Link } from "react-router"
import type { Route } from "./+types/start"
import { AppShell } from "@/components/app-shell"
import { PublicPage } from "@/components/cycle"
import { Icon } from "@/components/icon"
import { CYCLE, isAudience, PATHWAYS } from "@/content/philosophy"
import { pageMeta } from "@/lib/meta"

export function loader({ params }: Route.LoaderArgs) {
  if (!isAudience(params.audience)) throw data("Not found", { status: 404 })
  return { audience: params.audience }
}

export const meta = ({ data }: Route.MetaArgs) => pageMeta(PATHWAYS.find((p) => p.id === data?.audience)?.title)

/** One pathway per Welcome card: a suggestion at every stage of the cycle, so people can start anywhere. */
export default function StartPage({ loaderData }: Route.ComponentProps) {
  const pathway = PATHWAYS.find((p) => p.id === loaderData.audience)!
  return (
    <AppShell>
      <PublicPage
        title={pathway.title}
        lede={
          <>
            <p>{pathway.body}</p>
            <p className="mt-2">
              There&apos;s no fixed curriculum. Start at whichever stage makes sense for you, and come back when you need
              support.
            </p>
          </>
        }
      >
        <ol className="grid gap-4 lg:grid-cols-2">
          {CYCLE.map((stage) => {
            const step = pathway.steps[stage.id]
            return (
              <li key={stage.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-6">
                <p className="flex items-center gap-2 font-semibold text-action">
                  <Icon name={stage.icon} />
                  Stage {stage.number}: {stage.title}
                </p>
                <h2 className="type-title-3">{step.label}</h2>
                <p className="text-muted-foreground">{step.why}</p>
                <Link to={step.href} className="mt-auto inline-flex min-h-12 items-center gap-1 font-semibold text-action underline underline-offset-4">
                  Open it
                  <Icon name="arrow-right" className="text-base" />
                </Link>
              </li>
            )
          })}
        </ol>

        <section aria-labelledby="more-title" className="mt-12 rounded-2xl bg-surface-sunken p-6">
          <h2 id="more-title" className="type-title-3">
            More for you
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-6">
            <li>
              <Link to={`/library?role=${pathway.libraryRole}`} className="inline-flex min-h-12 items-center underline underline-offset-4">
                Practice Library tools for you
              </Link>
            </li>
            <li>
              <Link to="/lab" className="inline-flex min-h-12 items-center underline underline-offset-4">
                All Decision Lab scenarios
              </Link>
            </li>
            <li>
              <Link to="/playbook" className="inline-flex min-h-12 items-center underline underline-offset-4">
                What others have learned
              </Link>
            </li>
            {pathway.id === "company-host" && (
              <li>
                <Link to="/login?next=/host" className="inline-flex min-h-12 items-center underline underline-offset-4">
                  Log in to the company host area (demo)
                </Link>
              </li>
            )}
          </ul>
        </section>
      </PublicPage>
    </AppShell>
  )
}
