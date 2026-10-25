import { Link } from "react-router"
import { AppShell } from "@/components/app-shell"
import { PublicPage } from "@/components/cycle"
import { Icon, type IconName } from "@/components/icon"
import { RESOURCES } from "@/content/practice-library"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Teach & Facilitate")

const GUIDES: { title: string; who: string; body: string; icon: IconName; resource?: string }[] = [
  {
    title: "Mentor guide",
    who: "Mentors and volunteers",
    body: "How to support someone's growth with care: start from their own view, give feedback that builds confidence, and know when to hand a conversation to BRIDGEGOOD staff.",
    icon: "message-circle-heart",
    resource: "mentor-onboarding",
  },
  {
    title: "Workshop facilitation notes",
    who: "Educators, chapter leads, alumni",
    body: "Run a session on one principle: an opening question, a Decision Lab scenario in small groups, a reflection round, and how to send what you learned back.",
    icon: "users",
    resource: "workshop-facilitation",
  },
  {
    title: "Facilitating different viewpoints",
    who: "Anyone leading a group",
    body: "Set expectations for respectful disagreement, make room for quieter voices, and handle tension about identity, bias or conflict with care.",
    icon: "messages-square",
    resource: "facilitating-viewpoints",
  },
]

const TRAIN_THE_FACILITATOR = [
  { step: "Experience it", body: "Take part in a full session as a participant before running one." },
  { step: "Co-facilitate", body: "Run a session alongside an experienced facilitator, then debrief together." },
  { step: "Lead with support", body: "Lead your own session with a mentor observing, and reflect on what you'd change." },
  { step: "Give back", body: "Share an adaptation or lesson in the Living Playbook, so the next facilitator benefits." },
]

const STAYS = [
  "The people closest to a challenge help shape the problem and judge the result",
  "Barriers to taking part are named and removed on purpose",
  "Participants' growth and confidence count as outcomes",
  "Feedback is collected, acted on, and shared back",
  "Consent comes before any story, image or piece of work is used",
  "BRIDGEGOOD is credited as the author of the philosophy",
]

const CHANGES = [
  "Which communities, challenges and partners you focus on",
  "Language, examples, cultural references and scenarios",
  "Session length, format and where you meet",
  "Which tools you use first, and how you adapt them",
  "How you recognize and celebrate participants",
]

export default function TeachPage() {
  const starter = RESOURCES.find((r) => r.slug === "chapter-starter-kit")
  const adaptGuide = RESOURCES.find((r) => r.slug === "adapting-a-tool")
  return (
    <AppShell>
      <PublicPage
        title="Teach & Facilitate"
        stage="teach"
        next={{ label: "Back to Understand", href: "/understand" }}
        lede="Help the philosophy travel through people and communities. Resources for mentors, educators, volunteers, alumni and chapter leads to pass on the mindset, adapting examples to local context while keeping BRIDGEGOOD's authorship and core values clear."
      >
        <div className="space-y-16">
          <section id="guides" aria-labelledby="guides-title" className="scroll-mt-24">
            <h2 id="guides-title" className="mb-6 type-title-2">
              Facilitator and mentor guides
            </h2>
            <ul className="grid gap-4 lg:grid-cols-3">
              {GUIDES.map((g) => (
                <li key={g.title} className="flex flex-col gap-3 rounded-2xl border bg-card p-6">
                  <Icon name={g.icon} className="text-2xl text-action" />
                  <h3 className="type-title-3">{g.title}</h3>
                  <p className="type-small font-semibold text-muted-foreground">For: {g.who}</p>
                  <p>{g.body}</p>
                  {g.resource && (
                    <Link to={`/library/${g.resource}`} className="mt-auto inline-flex min-h-12 items-center gap-1 font-semibold text-action underline underline-offset-4">
                      Open the guide
                      <Icon name="arrow-right" className="text-base" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="starter-title" className="grid gap-6 rounded-2xl bg-surface-sunken p-6 lg:grid-cols-[2fr_3fr] lg:p-8">
            <div className="space-y-3">
              <h2 id="starter-title" className="type-title-2">
                Chapter starter kit
              </h2>
              <p>{starter?.helps}</p>
              {starter && (
                <Link to={`/library/${starter.slug}`} className="inline-flex min-h-12 items-center gap-1 font-semibold text-action underline underline-offset-4">
                  Open the starter kit
                  <Icon name="arrow-right" className="text-base" />
                </Link>
              )}
            </div>
            <ol className="space-y-2">
              {starter?.how.map((h, i) => (
                <li key={h} className="flex gap-3 rounded-lg bg-card p-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-action font-bold text-on-action" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="pt-1">{h}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="ttf-title">
            <h2 id="ttf-title" className="type-title-2">
              Train-the-facilitator
            </h2>
            <p className="mt-2 mb-6 max-w-3xl text-muted-foreground">
              So mentors, alumni and chapter leads can facilitate the approach without needing the founder or core team
              present every time.
            </p>
            <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {TRAIN_THE_FACILITATOR.map((t, i) => (
                <li key={t.step} className="rounded-xl border bg-card p-5">
                  <p className="font-semibold text-action">Step {i + 1}</p>
                  <h3 className="type-title-3">{t.step}</h3>
                  <p className="mt-1 text-muted-foreground">{t.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="adapt" aria-labelledby="adapt-title" className="scroll-mt-24">
            <h2 id="adapt-title" className="type-title-2">
              Adaptation notes: what can change, what stays grounded
            </h2>
            <p className="mt-2 mb-6 max-w-3xl text-muted-foreground">
              Different communities may need to interpret and practice the philosophy differently. Here&apos;s what is
              foundational, and what you&apos;re free to adapt.
            </p>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border-2 border-action bg-card p-6">
                <h3 className="flex items-center gap-2 type-title-3">
                  <Icon name="flag" className="text-action" />
                  Stays grounded in the philosophy
                </h3>
                <ul className="mt-3 list-disc space-y-1.5 pl-5">
                  {STAYS.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="flex items-center gap-2 type-title-3">
                  <Icon name="pencil" className="text-action" />
                  Adapt to your community
                </h3>
                <ul className="mt-3 list-disc space-y-1.5 pl-5">
                  {CHANGES.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-4">
              {adaptGuide && (
                <Link to={`/library/${adaptGuide.slug}`} className="inline-flex min-h-12 items-center underline underline-offset-4">
                  {adaptGuide.title}
                </Link>
              )}
            </p>
          </section>

          <section aria-labelledby="review-title" className="rounded-2xl bg-surface-sunken p-6 lg:p-8">
            <h2 id="review-title" className="type-title-2">
              Proposing a contribution or revision
            </h2>
            <p className="mt-2 max-w-3xl">
              Adapted a tool? Found guidance that didn&apos;t fit your community? Propose it in the Living Playbook. A
              BRIDGEGOOD steward reviews every contribution for relevance, consent, privacy, accessibility and alignment
              before it&apos;s shared more widely.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6">
              <Link to="/playbook/contribute" className="inline-flex min-h-12 items-center gap-1 font-semibold text-action underline underline-offset-4">
                Contribute to the Living Playbook
                <Icon name="arrow-right" className="text-base" />
              </Link>
              <Link to="/about#review" className="inline-flex min-h-12 items-center underline underline-offset-4">
                How review works
              </Link>
            </div>
          </section>
        </div>
      </PublicPage>
    </AppShell>
  )
}
