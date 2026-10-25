import { data, Link } from "react-router"
import type { Route } from "./+types/training.audience"
import { AUDIENCES, TRAINING, type Audience } from "@/content/training"
import { AppShell } from "@/components/app-shell"
import { TrainingTrack } from "@/components/training-track"
import { cn } from "@/lib/utils"
import { pageMeta } from "@/lib/meta"

const isAudience = (v: string): v is Audience => (AUDIENCES as readonly string[]).includes(v)
const COLOUR: Record<Audience, string | undefined> = { student: "student", mentor: "mentor", ambassador: "ambassador", company: undefined }

export function loader({ params }: Route.LoaderArgs) {
  if (!isAudience(params.audience)) throw data(null, { status: 404 })
  return { audience: params.audience }
}

export const meta = ({ loaderData }: Route.MetaArgs) =>
  pageMeta(loaderData ? `Training ${TRAINING[loaderData.audience].label.toLowerCase()}` : "Training")

export default function TrainingAudiencePage({ loaderData }: Route.ComponentProps) {
  const { audience } = loaderData
  const track = TRAINING[audience]

  return (
    <AppShell>
      <div data-archetype={COLOUR[audience]} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <nav aria-label="Training tracks" className="mb-8 border-b">
          <ul className="-mb-px flex overflow-x-auto">
            <li>
              <Link to="/training" className="inline-flex min-h-12 items-center px-3 text-muted-foreground hover:bg-muted">
                All tracks
              </Link>
            </li>
            {AUDIENCES.map((a) => (
              <li key={a}>
                <Link
                  to={`/training/${a}`}
                  aria-current={a === audience ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-12 items-center border-b-4 border-transparent px-3 font-medium whitespace-nowrap hover:bg-muted",
                    a === audience && "border-archetype font-bold"
                  )}
                >
                  {TRAINING[a].label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mb-10 max-w-3xl space-y-3">
          <p className="text-sm font-bold tracking-wide text-archetype uppercase">Training</p>
          <h1 className="text-4xl font-bold lg:text-5xl">{track.label}</h1>
          <p className="text-lg text-muted-foreground">{track.intro}</p>
        </div>
        <TrainingTrack audience={audience} />
      </div>
    </AppShell>
  )
}
