import { Link } from "react-router"
import { Icon } from "@/components/icon"
import { FRAMEWORK_META, PILLARS } from "@/content/framework"
import { PRINCIPLES } from "@/content/principles"
import { AppShell } from "@/components/app-shell"
import { ImpactLoop } from "@/components/impact-loop"
import { PrinciplesTable } from "@/components/principles-table"
import { RoleBadge, type StudioRole } from "@/components/studio/role-badge"
import { buttonVariants } from "@/components/ui/button"

/** "Start where you are": each role goes to the library page written for them, no login needed. */
const ROUTES: { role: StudioRole; who: string; href: string; cta: string }[] = [
  { role: "apprentice", who: "You're in the apprenticeship, or thinking about applying", href: "/learn/tracks/apprentices", cta: "The apprentice track" },
  { role: "mentor", who: "You guide apprentices, or would like to", href: "/learn/tracks/mentors", cta: "The mentor track" },
  { role: "chapter-lead", who: "You'd like to run a chapter in your city", href: "/learn/tracks/ambassadors", cta: "The chapter lead track" },
  { role: "company-host", who: "Your company could host mentors or sponsor a project", href: "/learn/tracks/company-hosts", cta: "The company host track" },
  { role: "community-partner", who: "Your organization has a problem a team could work on", href: "/learn/guides/real-case", cta: "How a partner project runs" },
]

export default function WelcomePage() {
  return (
    <AppShell>
      <section aria-labelledby="hero-title" className="border-b bg-surface-sunken">
        <div className="mx-auto max-w-7xl space-y-10 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl space-y-6">
            <h1 id="hero-title" className="type-title-1 lg:type-display">
              Design for Social Good: how BRIDGEGOOD works, and how you can work this way too
            </h1>
            <p className="max-w-[70ch] type-body-lg">
              In BRIDGEGOOD&apos;s approach, the community a project serves helps define the problem and judge the result.
              Emerging designers from groups underrepresented in design do the work, with mentors. A project counts only if
              it works for the community and the designers grow through it.
            </p>
          </div>

          <nav aria-labelledby="start-title">
            <h2 id="start-title" className="mb-4 type-title-3">
              Start where you are
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {ROUTES.map((r) => (
                <li key={r.role}>
                  <Link
                    to={r.href}
                    data-archetype={r.role}
                    className="group flex h-full flex-col gap-3 rounded-xl border bg-card p-4 hover:border-archetype hover:bg-archetype-soft"
                  >
                    <RoleBadge role={r.role} className="self-start" />
                    <span>{r.who}</span>
                    <span className="mt-auto inline-flex items-center gap-2 font-bold text-primary">
                      {r.cta}
                      <Icon name="arrow-right" className="text-base transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              <li>
                <Link to="/learn/practice" className="group flex h-full items-start gap-3 rounded-xl border border-dashed border-input bg-card p-4 hover:bg-muted">
                  <Icon name="scale" className="mt-0.5 text-primary" />
                  <span>
                    <span className="block font-bold">Practice moments</span>
                    <span className="block text-muted-foreground">Any role: make a call in a short dilemma, then see how BRIDGEGOOD reasons. Never scored.</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/learn/carry-it-forward" className="group flex h-full items-start gap-3 rounded-xl border border-dashed border-input bg-card p-4 hover:bg-muted">
                  <Icon name="globe" className="mt-0.5 text-primary" />
                  <span>
                    <span className="block font-bold">Outside BRIDGEGOOD? Carry it forward</span>
                    <span className="block text-muted-foreground">Teachers and organizers: run a critique circle in your community, and tell BRIDGEGOOD what you changed.</span>
                  </span>
                </Link>
              </li>
            </ul>
            <p className="mt-4">
              Already taking part?{" "}
              <Link to="/login" className="font-semibold text-primary underline underline-offset-4">
                Log in to your area
              </Link>{" "}
              (demo accounts, no password).
            </p>
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <section id="pillars" aria-labelledby="pillars-title" className="scroll-mt-24">
          <h2 id="pillars-title" className="type-title-2">
            Five pillars: what the work asks of you
          </h2>
          <p className="mt-3 mb-8 max-w-[70ch] type-body-lg text-muted-foreground">
            Each pillar has a plain meaning, an example from a project, a learning outcome, and reflection prompts that
            come up when decisions get made. {FRAMEWORK_META.author} authors and owns the framework.
          </p>
          <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {PILLARS.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/learn/pillars/${p.id}`}
                  className="group flex h-full flex-col gap-2 rounded-xl border bg-card p-5 hover:border-primary hover:bg-muted"
                >
                  <span className="type-small font-semibold text-muted-foreground">Pillar {p.number}</span>
                  <span className="type-title-3 font-heading">{p.name}</span>
                  <span>{p.meaning}</span>
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">You&apos;ll be able to: </span>
                    {p.learningOutcome}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-2 font-bold text-primary">
                    Read about {p.name}, with {p.promptIds.length} reflection {p.promptIds.length === 1 ? "prompt" : "prompts"}
                    <Icon name="arrow-right" className="text-base transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <Link to="/learn/terms" className="group flex h-full flex-col gap-2 rounded-xl border border-dashed border-input p-5 hover:bg-muted">
                <span className="type-title-3 font-heading">What the words mean</span>
                <span>
                  What BRIDGEGOOD means by inclusion, access and social good, and how this approach differs from
                  human-centered design and pro bono work.
                </span>
                <span className="mt-auto inline-flex items-center gap-2 pt-2 font-bold text-primary">
                  Terms of reference
                  <Icon name="arrow-right" className="text-base transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          </ol>
        </section>

        <section id="how" aria-labelledby="how-title" className="scroll-mt-24">
          <h2 id="how-title" className="type-title-2">
            How BRIDGEGOOD works with everyone involved
          </h2>
          <p className="mt-3 mb-8 max-w-[70ch] type-body-lg text-muted-foreground">
            The pillars describe what apprentices learn. These six ways of working describe how BRIDGEGOOD, mentors,
            ambassadors and partners work together so the pillars can happen. Draft wording, for BRIDGEGOOD to review.
          </p>
          <ul className="grid gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <li key={p.id} className="border-t-2 border-gold pt-3">
                <h3 className="type-title-3">{p.name}</h3>
                <p className="mt-1 text-muted-foreground">{p.meaning}</p>
              </li>
            ))}
          </ul>
          <details className="group mt-8 rounded-xl border bg-card">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 p-4 font-bold [&::-webkit-details-marker]:hidden">
              What each way of working asks of each role
              <Icon name="chevron-down" className="text-primary transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t p-4">
              <PrinciplesTable />
            </div>
          </details>
        </section>

        <section id="loop" aria-labelledby="loop-title" className="scroll-mt-24">
          <h2 id="loop-title" className="mb-2 type-title-2">
            How it fits together
          </h2>
          <p className="mb-8 max-w-[70ch] text-muted-foreground">
            Every project runs the same loop. What people learn along the way goes back to BRIDGEGOOD.
          </p>
          <ImpactLoop />
        </section>

        <section id="ownership" aria-labelledby="ownership-title" className="grid scroll-mt-24 gap-8 xl:grid-cols-2">
          <div className="space-y-4">
            <h2 id="ownership-title" className="type-title-2">
              Who this philosophy belongs to
            </h2>
            <p className="max-w-[70ch] type-body-lg">
              Since 2009, BRIDGEGOOD has helped people see themselves as creators, leaders and problem-solvers. Design for
              Social Good is the way of working behind that: design that benefits communities, values lived experience, and
              grows confidence, access and economic mobility for the people doing it. Apprentices pay no tuition, with no
              income share agreements (public fact; confirm with BRIDGEGOOD).
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="type-title-3">BRIDGEGOOD authors it. A community practices it.</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>BRIDGEGOOD authors and stewards it, and approves every change to its wording.</li>
              <li>Apprentices, mentors, ambassadors and partners practice it, and improve it through feedback.</li>
              <li>Communities can adapt it locally while keeping its core commitments.</li>
              <li>Technology on this site supports the relationships behind it. It doesn&apos;t replace them.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/learn/guides/adapt-locally" className={buttonVariants({ variant: "outline" })}>
                How local adaptation works
              </Link>
              <Link to="/learn/carry-it-forward" className="inline-flex min-h-12 items-center font-semibold text-primary underline underline-offset-4">
                Run a session in your community
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
