import type { Metadata } from "next"
import { ArchetypeHero } from "@/components/archetype-hero"
import { DemoForm } from "@/components/demo-form"
import { ImpactLoop } from "@/components/impact-loop"
import { PrinciplesInPractice } from "@/components/principles-in-practice"
import { ProblemBoard } from "@/components/problem-board"
import { Section } from "@/components/section"

export const metadata: Metadata = {
  title: "For ambassadors",
  description: "Understand BRIDGEGOOD's Design for Social Good philosophy and bring it to your city and organisation.",
}

const ADAPT = {
  keep: [
    "Community voice leads: the people affected help define the problem and judge the result",
    "Students do real work and get visible credit",
    "Accessibility and inclusion are built in from the start",
    "Feedback is collected and acted on",
    "BRIDGEGOOD is credited as the author of the philosophy",
  ],
  adapt: [
    "Which communities and problems you focus on",
    "Language, cultural references and examples",
    "How often and where you meet",
    "Which local partners, funders and mentors you work with",
    "How you recognise and celebrate participants",
  ],
}

const PLAYBOOK = [
  {
    title: "Find your allies",
    body: "Identify colleagues who care about inclusive design, such as an employee resource group, an accessibility team or a design leader.",
  },
  {
    title: "Make the case",
    body: "Connect social-impact design to your organisation's goals: talent pipelines, inclusive products, community trust. Ask for time, budget or both.",
  },
  {
    title: "Recruit mentors",
    body: "Invite designers, researchers and engineers to mentor. Share the principles so they know the care and tone expected.",
  },
  {
    title: "Sponsor a problem",
    body: "Choose a problem from a local organisation and match it with a student team and mentors.",
  },
  {
    title: "Run it with care",
    body: "Hold weekly reflections, address conflict early, and make sure the community stays involved, not just consulted.",
  },
  {
    title: "Close the loop",
    body: "Share outcomes with the organisation, credit the students, and send your learnings back to BRIDGEGOOD.",
  },
]

const VETTING = [
  "Tell us about yourself and your community",
  "A conversation with the BRIDGEGOOD team about values and fit",
  "Orientation on the philosophy and frameworks",
  "Start locally, with ongoing support and check-ins",
]

export default function AmbassadorsPage() {
  return (
    <>
      <ArchetypeHero
        eyebrow="For ambassadors"
        title="Carry Design for Social Good to your city and your organisation."
        aside={
          <div className="rounded-2xl border bg-card p-6">
            <p className="text-sm font-bold text-archetype">As an ambassador you…</p>
            <ul className="mt-3 space-y-2">
              <li>Learn the philosophy and how to adapt it responsibly</li>
              <li>Rally funding, mentors and resources inside your organisation</li>
              <li>Connect local problem owners with student teams</li>
              <li>Feed what you learn back to BRIDGEGOOD</li>
            </ul>
          </div>
        }
      >
        <p>
          BRIDGEGOOD vets ambassadors in cities beyond California and around the world. You might be part of a large
          organisation that wants inclusive, socially minded design in its culture and products.
        </p>
      </ArchetypeHero>

      <Section
        id="philosophy"
        eyebrow="Philosophy & frameworks"
        title="What makes this different"
        intro="Many organisations talk about social impact or human-centred design. Here's what BRIDGEGOOD's approach asks people to actually do. Open each principle to see what it means for you."
      >
        <PrinciplesInPractice archetype="ambassador" />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border-2 border-archetype bg-card p-5">
            <h3 className="text-lg font-bold">Keep these the same everywhere</h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              {ADAPT.keep.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h3 className="text-lg font-bold">Adapt these to your community</h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              {ADAPT.adapt.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        id="playbook"
        tone="soft"
        eyebrow="Playbook"
        title="Bringing it into your organisation"
        intro="A starting sequence. Every organisation is different, so use your judgement and talk with BRIDGEGOOD along the way."
      >
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLAYBOOK.map((step, i) => (
            <li key={step.title} className="rounded-xl border bg-card p-5">
              <p className="text-sm font-bold text-archetype">Step {i + 1}</p>
              <h3 className="mt-1 text-lg font-bold">{step.title}</h3>
              <p className="mt-1 text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="problems"
        eyebrow="Needs a sponsor"
        title="Problems waiting for support"
        intro="These organisations have shared a problem and need an ambassador to bring together mentors and resources."
      >
        <ProblemBoard status={["needs-sponsor"]} />
      </Section>

      <Section id="loop" tone="muted" eyebrow="Where you fit" title="You hold the loop together">
        <ImpactLoop current="ambassador" />
      </Section>

      <Section
        id="apply"
        eyebrow="Get involved"
        title="Becoming an ambassador"
        intro="BRIDGEGOOD vets every ambassador. That protects the communities we work with and the integrity of the philosophy."
      >
        <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
          <ol className="space-y-4">
            {VETTING.map((v, i) => (
              <li key={v} className="flex gap-4">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-archetype font-bold text-white"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="pt-1.5">
                  <span className="sr-only">Step {i + 1}: </span>
                  {v}
                </span>
              </li>
            ))}
          </ol>
          <DemoForm
            submitLabel="Express interest"
            successTitle="Thanks for your interest"
            successBody="In the real service, someone from BRIDGEGOOD would get in touch to arrange a conversation."
            fields={[
              { name: "name", label: "Your name", type: "text", required: true, autoComplete: "name" },
              { name: "email", label: "Email address", type: "email", autoComplete: "email" },
              { name: "city", label: "City and country", type: "text", required: true, errorMessage: "Enter your city and country" },
              { name: "organisation", label: "Organisation", type: "text", hint: "If you'd bring this into a workplace." },
              {
                name: "why",
                label: "Why do you want to be an ambassador?",
                type: "textarea",
                required: true,
                hint: "Tell us about the community you'd serve and what you could bring.",
                errorMessage: "Tell us why you'd like to be an ambassador",
              },
            ]}
          />
        </div>
      </Section>
    </>
  )
}
