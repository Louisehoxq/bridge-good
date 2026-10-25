import { Link } from "react-router"
import { AppShell } from "@/components/app-shell"
import { PublicPage } from "@/components/cycle"
import { Icon } from "@/components/icon"
import { ENTRY_TYPES } from "@/content/playbook"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("About the Philosophy")

const WORKFLOW = [
  { step: "Submit", body: "A community member contributes a lesson, adaptation, or suggested change." },
  { step: "Review", body: "An authorized BRIDGEGOOD editor or steward checks relevance, consent, privacy, accessibility, and alignment with the philosophy." },
  { step: "Discuss", body: "Where useful, invite clarification or constructive feedback from the contributor or relevant community members." },
  { step: "Publish", body: "Share approved contributions with clear attribution or agreed anonymity." },
  { step: "Maintain", body: "Record the source, review date, version, and any later revisions." },
  { step: "Improve", body: "Use recurring themes to update resources, scenarios, and facilitator guidance." },
]

const SAFETY = [
  "Use aggregated, anonymized, synthetic, or appropriately consented information.",
  "Never publish personal stories, identities, portfolios, artwork, or participant-created products without explicit permission.",
  "Explain how contributions will be used, attributed, reviewed, and retained.",
  "Provide an accessible way to request corrections or withdrawal, subject to clearly stated limits.",
  "Keep human judgment central to moderation and interpretation.",
  "Avoid presenting one community's adaptation as universally appropriate.",
]

const GUARDRAILS = [
  { title: "Keep the human element central", body: "Technology can help people find resources, explore scenarios, and share learning. It should not replace trust, personal conversations, encouragement, context, or human judgment." },
  { title: "Be specific about social good", body: "Use concrete examples and questions. Explain what access, inclusion, community benefit, and economic mobility mean in a given situation instead of relying on these terms as branding language." },
  { title: "Make space for context", body: "Different communities may need to interpret and practice the philosophy differently. Explain what is foundational and what can be adapted." },
  { title: "Protect dignity and consent", body: "Use only aggregated, anonymized, synthetic, or appropriately consented information. Obtain explicit permission before using personal stories, identities, portfolios, artwork, or participant-created work." },
  { title: "Design for accessibility", body: "Use inclusive language, accessible interaction patterns, clear navigation, readable content, keyboard-friendly controls, and alternatives to visual or audio-only information." },
  { title: "Maintain BRIDGEGOOD's authorship", body: "Identify BRIDGEGOOD-authored philosophy and guidance clearly. Label community contributions and local adaptations, and establish a human review process for changes to core material." },
  { title: "Treat feedback as part of the system", body: "Provide clear ways to flag problems, suggest improvements, and understand what happens after feedback is submitted." },
]

const SUCCESS = [
  { label: "Understanding", q: "Can users explain the reasoning behind BRIDGEGOOD's approach in their own words?" },
  { label: "Application", q: "Can users identify and apply the mindset in a design challenge or real project?" },
  { label: "Reflection", q: "Can users articulate trade-offs, assumptions, and whose perspectives they need to include?" },
  { label: "Transfer", q: "Can mentors, alumni, and chapter leads facilitate the approach without needing the founder or core team present every time?" },
  { label: "Adaptation", q: "Can users explain how they adapted a tool for their context while retaining the underlying intent?" },
  { label: "Community learning", q: "Do contributions lead to concrete improvements in tools, scenarios, or guidance?" },
  { label: "Trust and stewardship", q: "Do users understand authorship, consent, privacy, and how contributions are reviewed?" },
]

export default function AboutPage() {
  return (
    <AppShell>
      <PublicPage
        title="About the Philosophy"
        lede="BRIDGEGOOD's authorship, context, and stewardship approach: how the philosophy stays BRIDGEGOOD's own while the community helps it grow."
      >
        <div className="space-y-16">
          <section aria-labelledby="core-title" className="grid gap-8 lg:grid-cols-[3fr_2fr]">
            <div className="space-y-4">
              <h2 id="core-title" className="type-title-2">
                The core idea
              </h2>
              <p className="border-l-4 border-gold pl-4 type-body-lg font-semibold">
                BRIDGEGOOD&apos;s philosophy should not live only in the people who have experienced it firsthand. It should
                live in the questions people ask, the choices they make, the way they work with others, and the lessons they
                pass on.
              </p>
              <p className="type-body-lg">
                This website is shared infrastructure for that process: Understand → Practice → Reflect and Share → Teach and
                Evolve → Understand again.
              </p>
              <p className="type-body-lg">
                The goal is not to make every person work in exactly the same way. It is to help more people understand the
                thinking, care, and responsibility behind BRIDGEGOOD&apos;s work — and carry that mindset into the communities
                and systems they influence.
              </p>
            </div>
            <div className="h-fit rounded-2xl bg-surface-sunken p-6">
              <h3 className="type-title-3">Since 2009</h3>
              <p className="mt-2">
                BRIDGEGOOD&apos;s work has connected design with confidence, access, community, and economic mobility,
                helping people see themselves as creators, leaders, and problem-solvers.
              </p>
            </div>
          </section>

          <section aria-labelledby="authorship-title">
            <h2 id="authorship-title" className="type-title-2">
              Who wrote what
            </h2>
            <p className="mt-2 mb-6 max-w-3xl text-muted-foreground">
              The Living Playbook keeps four kinds of content apart, so BRIDGEGOOD retains clear authorship while welcoming
              meaningful contributions from the wider community.
            </p>
            <dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {ENTRY_TYPES.map((t) => (
                <div key={t.id} className="rounded-xl border bg-card p-5">
                  <dt className="flex items-center gap-2 type-title-3">
                    <Icon name={t.icon} className="text-action" />
                    {t.label}
                  </dt>
                  <dd className="mt-2">{t.description}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="review" aria-labelledby="workflow-title" className="scroll-mt-24">
            <h2 id="workflow-title" className="type-title-2">
              A responsible contribution workflow
            </h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {WORKFLOW.map((w, i) => (
                <li key={w.step} className="flex gap-4 rounded-xl border bg-card p-5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-action font-bold text-on-action" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="type-title-3">
                      <span className="sr-only">Step {i + 1}: </span>
                      {w.step}
                    </h3>
                    <p className="mt-1">{w.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="safety" aria-labelledby="safety-title" className="grid scroll-mt-24 gap-8 lg:grid-cols-2">
            <div>
              <h2 id="safety-title" className="type-title-2">
                Trust, safety, and stewardship
              </h2>
              <ul className="mt-4 space-y-2">
                {SAFETY.map((s) => (
                  <li key={s} className="flex gap-3">
                    <Icon name="circle-check" className="mt-1 text-success" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div id="withdraw" className="h-fit scroll-mt-24 rounded-2xl border-2 border-action p-6">
              <h3 className="type-title-3">Request a correction or withdrawal</h3>
              <p className="mt-2">
                If something you contributed, or something about you, appears in the Living Playbook and you&apos;d like it
                corrected or removed, tell us. A BRIDGEGOOD steward reads every request and replies.
              </p>
              <p className="mt-2 text-muted-foreground">
                Limits: we can&apos;t remove learning that has already shaped BRIDGEGOOD-authored guidance, but we will remove
                your words, name and any identifying detail. In this prototype, requests go through the Playbook&apos;s
                contribution form.
              </p>
              <Link to="/playbook/contribute?about=withdrawal" className="mt-3 inline-flex min-h-12 items-center gap-1 font-semibold text-action underline underline-offset-4">
                Make a request
                <Icon name="arrow-right" className="text-base" />
              </Link>
            </div>
          </section>

          <section aria-labelledby="guardrails-title">
            <h2 id="guardrails-title" className="type-title-2">
              Design guardrails
            </h2>
            <p className="mt-2 mb-6 max-w-3xl text-muted-foreground">
              This platform aims to make the philosophy easier to share without reducing it to slogans, rigid checklists, or
              a generic social-impact course.
            </p>
            <dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {GUARDRAILS.map((g) => (
                <div key={g.title} className="rounded-xl border bg-card p-5">
                  <dt className="type-title-3">{g.title}</dt>
                  <dd className="mt-2">{g.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="success-title">
            <h2 id="success-title" className="type-title-2">
              What success could look like
            </h2>
            <p className="mt-2 mb-6 max-w-3xl text-muted-foreground">
              Judged by whether people understand and use the philosophy — not by page views, content volume, or course
              completion.
            </p>
            <dl className="grid gap-3 md:grid-cols-2">
              {SUCCESS.map((s) => (
                <div key={s.label} className="rounded-lg bg-surface-sunken p-4">
                  <dt className="font-bold">{s.label}</dt>
                  <dd>{s.q}</dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="rounded-lg border border-dashed p-4 text-muted-foreground">
            Draft note: the copy and concept on this site are a proposal for a hackathon prototype. The principles and
            feature descriptions should be reviewed with BRIDGEGOOD to ensure they accurately reflect the organization&apos;s
            own language, values, and approved practices.
          </p>
        </div>
      </PublicPage>
    </AppShell>
  )
}
