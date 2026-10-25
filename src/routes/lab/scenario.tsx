import { data } from "react-router"
import type { Route } from "./+types/scenario"
import { AppShell } from "@/components/app-shell"
import { PublicPage } from "@/components/cycle"
import { ScenarioFlow } from "@/components/lab/scenario-flow"
import { SavedReflections } from "@/components/lab/saved-reflections"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { scenarioBySlug } from "@/content/lab"
import { pageMeta } from "@/lib/meta"

export function loader({ params }: Route.LoaderArgs) {
  if (!scenarioBySlug(params.slug)) throw data("Not found", { status: 404 })
  return { slug: params.slug }
}

export const meta = ({ data }: Route.MetaArgs) => pageMeta(data ? scenarioBySlug(data.slug)?.title : "Decision Lab")

export default function ScenarioPage({ loaderData }: Route.ComponentProps) {
  const scenario = scenarioBySlug(loaderData.slug)!
  return (
    <AppShell>
      <PublicPage
        title={scenario.title}
        stage="practice"
        next={{ label: "Practice Library", href: "/library" }}
        lede={
          <span className="flex flex-wrap items-center gap-2">
            <span>Decision Lab · {scenario.theme}</span>
            <SyntheticBadge />
          </span>
        }
      >
        {/* key: reset the flow when moving between scenarios */}
        <ScenarioFlow key={scenario.slug} scenario={scenario} />
        <div className="mt-14">
          <SavedReflections scenario={scenario.slug} />
        </div>
      </PublicPage>
    </AppShell>
  )
}
