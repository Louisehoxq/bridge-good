import type { Metadata } from "next"
import { ArchetypeHero } from "@/components/archetype-hero"
import { ImpactLoop } from "@/components/impact-loop"
import { PrinciplesInPractice } from "@/components/principles-in-practice"
import { ProblemBoard } from "@/components/problem-board"
import { Section, SyntheticBadge } from "@/components/section"

export const metadata: Metadata = {
  title: "For students & early-career designers",
  description: "Learn UI/UX and design thinking on real community problems, with mentors and a portfolio that shows your impact.",
}

const PATH = [
  {
    stage: "Listen",
    title: "Start with people, not pixels",
    tasks: ["Interview someone affected by the problem", "Map what they do, think and feel", "Notice what your own experience helps you see"],
  },
  {
    stage: "Frame",
    title: "Name the real problem",
    tasks: ["Write a 'how might we' with the community", "Agree on what success means to them", "List access needs up front"],
  },
  {
    stage: "Make",
    title: "Sketch, prototype, test",
    tasks: ["Start with low-fidelity sketches", "Test with real users, including people with disabilities", "Change course based on what you hear"],
  },
  {
    stage: "Share",
    title: "Hand over and reflect",
    tasks: ["Present to the organisation and professionals", "Write up what changed and why", "Give feedback on how the project ran"],
  },
]

const PORTFOLIO = [
  { q: "Who was this for?", a: "Describe the community and the organisation, in their own words where you have consent." },
  { q: "What was the real problem?", a: "Show how listening changed your understanding of it." },
  { q: "What did you do?", a: "Be specific about your role and your decisions, including the trade-offs." },
  { q: "How did you include people?", a: "Show research, co-design and accessibility testing, not only the final screens." },
  { q: "What changed?", a: "Outcomes for the community: time saved, access gained, trust built." },
  { q: "What did you learn?", a: "Reflect honestly. Hiring managers value self-awareness." },
]

const CAREERS = [
  { path: "In-house product teams", note: "Shape products used by millions, from the inside." },
  { path: "Agencies & studios", note: "Variety, pace and a wide range of clients." },
  { path: "Non-profits & civic tech", note: "Design public and community services directly." },
  { path: "Freelance & entrepreneurship", note: "Independence, your own clients, your own studio." },
  { path: "Further study", note: "Deepen a specialism such as research, accessibility or service design." },
  { path: "Adjacent roles", note: "Content, research, product, front-end. Design thinking travels." },
]

export default function StudentsPage() {
  return (
    <>
      <ArchetypeHero
        eyebrow="For students & early-career designers"
        title="Learn design by doing work that matters."
        aside={
          <figure className="rounded-2xl border bg-card p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-archetype">A week on a project might look like</p>
              <SyntheticBadge />
            </div>
            <ul className="space-y-2">
              <li>Monday: listening session at a neighbourhood food pantry</li>
              <li>Wednesday: critique with a mentor from a product team</li>
              <li>Friday: weekly reflection on what worked and what didn&apos;t</li>
            </ul>
          </figure>
        }
      >
        <p>
          Your background is a strength. Here you learn UI/UX and design thinking on real problems from community
          organisations, guided by working professionals.
        </p>
        <p>You leave with skills, relationships and a portfolio that shows the difference you made.</p>
      </ArchetypeHero>

      <Section
        id="path"
        eyebrow="Your path"
        title="From listening to launching"
        intro="Design thinking, broken into steps you can practise. Every step involves the community you're designing with."
      >
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PATH.map((step, i) => (
            <li key={step.stage} className="rounded-xl border bg-card p-5">
              <p className="text-sm font-bold text-archetype">
                Step {i + 1}: {step.stage}
              </p>
              <h3 className="mt-1 text-lg font-bold">{step.title}</h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
                {step.tasks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="projects"
        tone="soft"
        eyebrow="Open projects"
        title="Real problems from community organisations"
        intro="Ambassadors match each project with mentors and support. These examples show what projects can look like."
      >
        <ProblemBoard status={["open-for-students", "in-progress"]} />
      </Section>

      <Section
        id="portfolio"
        eyebrow="Portfolio"
        title="A portfolio that speaks for itself"
        intro="Strong social-impact case studies tell the story of the people and the change, not only the final screens. Answer these six questions."
      >
        <dl className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PORTFOLIO.map((item) => (
            <div key={item.q} className="rounded-xl border bg-card p-5">
              <dt className="text-lg font-bold">{item.q}</dt>
              <dd className="mt-1 text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        id="careers"
        tone="muted"
        eyebrow="Careers"
        title="Your path, your definition of success"
        intro="There's no single right answer. Meet professionals from different paths, ask honest questions, and choose what fits your life and values."
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAREERS.map((c) => (
            <li key={c.path} className="rounded-xl border bg-card p-5">
              <h3 className="font-bold">{c.path}</h3>
              <p className="mt-1 text-muted-foreground">{c.note}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="principles"
        eyebrow="How we work"
        title="The principles, in practice"
        intro="Open each one to see what it asks of you as a student or early-career designer."
      >
        <PrinciplesInPractice archetype="student" />
      </Section>

      <Section id="loop" tone="muted" eyebrow="Where you fit" title="You're part of a bigger loop">
        <ImpactLoop current="student" />
      </Section>
    </>
  )
}
