import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { PracticeEmbed } from "@/components/practice/practice-embed"
import { ProblemBoard } from "@/components/problem-board"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { buttonVariants } from "@/components/ui/button"
import { PRACTICE_EMBEDS } from "@/content/practice"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Practice")

const FUNDAMENTALS = [
  { title: "Plain-language rewrite", time: "30 min", task: "Rewrite a confusing paragraph from a public service website so a 12-year-old could follow it." },
  { title: "Accessibility spot-check", time: "45 min", task: "Check one web page for contrast, headings, alt text and keyboard access. Note three fixes." },
  { title: "Inclusive form redesign", time: "60 min", task: "Redesign a sign-up form: clear labels, kind error messages, and only the questions that are really needed." },
  { title: "Interview practice", time: "45 min", task: "Practice a consent script and three open questions with a classmate. Swap roles." },
  { title: "Journey map from a story", time: "60 min", task: "Turn a user story into a journey map with emotions and pain points." },
]

const MOCK_CASE = {
  org: "Riverside Youth Sports League",
  problem: "Parents who speak Spanish or Vietnamese struggle with the English-only paper registration form, so their children miss the season.",
  steps: [
    "Listen: plan two short interviews with parents (role-played by peers) about registration.",
    "Frame: write a 'how might we' and agree what success means for parents.",
    "Make: sketch a mobile-friendly, multilingual sign-up in low fidelity.",
    "Test: run a quick test with a peer using a screen reader or a translation tool.",
    "Share: write up what you changed and why, and submit it for mentor feedback.",
  ],
}

export default function PracticePage() {
  return (
    <>
      <PageHeader title="Practice, then apply">
        Build skills in small steps, rehearse on a mock case, then look at example partner projects. The
        fundamentals are part of bootcamp, and the mock case is your mini project.
      </PageHeader>

      <nav aria-label="Kinds of practice" className="mb-10">
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            ["#fundamentals", "Basic fundamentals", "Short exercises on core skills, during bootcamp"],
            ["#mock-case", "Mock case", "Your mini project: a full practice project, end to end"],
            ["#case-studies", "Case studies", "Examples of finished partner projects"],
          ].map(([href, label, desc], i) => (
            <li key={href}>
              <a href={href} className="flex h-full flex-col rounded-2xl border bg-card p-5 hover:border-archetype hover:bg-archetype-soft">
                <span className="type-label">
                  {i + 1}. {label}
                </span>
                <span className="text-muted-foreground">{desc}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section id="fundamentals" aria-labelledby="fundamentals-title" className="mb-14 scroll-mt-24">
        <h2 id="fundamentals-title" className="mb-4 type-title-2">
          Basic fundamentals
        </h2>
        <ul className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {FUNDAMENTALS.map((f) => (
            <li key={f.title} className="rounded-xl border bg-card p-5">
              <h3 className="type-title-3">{f.title}</h3>
              <p className="type-small text-muted-foreground">About {f.time}</p>
              <p className="mt-2">{f.task}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="mock-case" aria-labelledby="mock-title" className="mb-14 grid scroll-mt-24 gap-6 rounded-2xl border bg-archetype-soft p-4 sm:p-6 xl:grid-cols-[2fr_3fr]">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="mock-title" className="type-title-2">
              Mock case
            </h2>
            <SyntheticBadge />
          </div>
          <p className="font-bold">{MOCK_CASE.org}</p>
          <p>{MOCK_CASE.problem}</p>
          <Link to="/student/submissions" className={buttonVariants({ className: "bg-archetype text-on-archetype hover:bg-archetype/90" })}>
            Submit your mock case
          </Link>
        </div>
        <ol className="space-y-3">
          {MOCK_CASE.steps.map((s, i) => (
            <li key={s} className="flex gap-3 rounded-xl border bg-card p-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-archetype font-bold text-on-archetype" aria-hidden="true">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <div id="mini-project-practice" className="mb-14 scroll-mt-24">
        <PracticeEmbed slug={PRACTICE_EMBEDS.miniProject}>
          A decision like this comes up in sign-up forms like your mock case. Make your call before you design yours.{" "}
          <Link to="/learn/practice" className="underline underline-offset-4">
            More practice moments
          </Link>
        </PracticeEmbed>
      </div>

      <section id="case-studies" aria-labelledby="cases-title" className="scroll-mt-24">
        <h2 id="cases-title" className="mb-4 type-title-2">
          Case studies
        </h2>
        <ProblemBoard status={["completed"]} />
      </section>
    </>
  )
}
