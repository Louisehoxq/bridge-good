import { LibraryPage, PromptList } from "@/components/library/library-page"
import { DidntFit } from "@/components/feedback/didnt-fit" // Milestone 3 hook
import { DECISION_MOMENT_INFO, DECISION_MOMENTS, PROMPTS_BY_MOMENT, REFLECTION_PROMPTS, type DecisionMoment } from "@/content/framework"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("The 12 reflection prompts")

const WHERE: Record<DecisionMoment, string> = {
  studentSubmit: "Apprentices see these when they submit work for a growth conversation.",
  mentorReview: "Mentors see these before they write feedback.",
  partnerBrief: "Community partners see these before they send a project brief.",
}

export default function PromptsPage() {
  return (
    <LibraryPage
      href="/learn/prompts"
      intro={
        <p>
          The framework works through questions, not rules. Each prompt belongs to one or more pillars. Ask them out loud
          in a critique, write answers in a reflection, or use them to start a conversation with a partner.
        </p>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
        <section aria-labelledby="all-title" className="min-w-0">
          <h2 id="all-title" className="mb-4 type-title-2">
            All 12 prompts
          </h2>
          <PromptList prompts={REFLECTION_PROMPTS} showPillars />
        </section>
        <section aria-labelledby="moments-title" className="min-w-0">
          <h2 id="moments-title" className="mb-2 type-title-2">
            Where they come up
          </h2>
          <p className="mb-4 text-muted-foreground">
            The app shows two or three prompts at the moments decisions get made. Answers are free text and never scored.
          </p>
          <ul className="space-y-4">
            {DECISION_MOMENTS.map((m) => (
              <li key={m} className="rounded-2xl border bg-card p-5">
                <h3 className="type-title-3">{DECISION_MOMENT_INFO[m].label}</h3>
                <p className="mt-1 text-muted-foreground">{WHERE[m]}</p>
                <p className="mt-2">
                  <span className="font-bold">Prompts: </span>
                  {PROMPTS_BY_MOMENT[m].join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
      {/* Milestone 3 hook: "this didn't fit" flag, with a choice of prompt. */}
      <div className="mt-10">
        <DidntFit target={{ type: "prompt" }} pillarIds={[]} promptChoices={REFLECTION_PROMPTS.map((p) => p.id)} what="a prompt" />
      </div>
    </LibraryPage>
  )
}
