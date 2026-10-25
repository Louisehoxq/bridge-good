import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { AUDIENCES, TRAINING, type Audience } from "@/content/training"
import { AppShell } from "@/components/app-shell"

export const metadata: Metadata = { title: "Training materials" }

/** Companies have no role area, so they borrow the primary colour. */
const COLOUR: Record<Audience, string | undefined> = { student: "student", mentor: "mentor", ambassador: "ambassador", company: undefined }

export default function TrainingHub() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10 max-w-3xl space-y-3">
          <h1 className="text-4xl font-bold lg:text-5xl">Training materials</h1>
          <p className="text-lg text-muted-foreground">
            Everyone who carries the philosophy forward starts from the same foundation, adapted for their role. Open to
            all, no login needed.
          </p>
        </div>
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {AUDIENCES.map((a) => {
            const t = TRAINING[a]
            return (
              <li key={a} data-archetype={COLOUR[a]}>
                <Link
                  href={`/training/${a}`}
                  className="group flex h-full flex-col gap-3 rounded-2xl border-2 border-border bg-card p-6 hover:border-archetype hover:bg-archetype-soft"
                >
                  <span className="h-1.5 w-12 rounded-full bg-archetype" aria-hidden="true" />
                  <span className="text-xl font-bold">{t.label}</span>
                  <span className="text-muted-foreground">{t.tagline}</span>
                  <span className="text-sm">{t.modules.length} modules · one-page explainer · case studies</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-2 font-bold text-archetype">
                    Open track
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </AppShell>
  )
}
