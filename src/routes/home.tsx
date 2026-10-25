import { Link } from "react-router"
import { HeroTitle } from "@/components/hero-title"
import { Icon, type IconName } from "@/components/icon"
import { FRAMEWORK_META, PILLARS } from "@/content/framework"
import { PRINCIPLES } from "@/content/principles"
import { AppShell } from "@/components/app-shell"
import { ImpactLoop } from "@/components/impact-loop"
import { PrinciplesTable } from "@/components/principles-table"
import { STUDIO_ROLES, type StudioRole } from "@/components/studio/role-badge"
import { buttonVariants } from "@/components/ui/button"

/** "Start where you are": each role goes to the library page written for them, no login needed. */
const MAIN_ROLES: { role: StudioRole; iam: string; who: string; href: string; cta: string }[] = [
  {
    role: "apprentice",
    iam: "I'm an apprentice",
    who: "I'm in the apprenticeship, or thinking about applying. I want to grow as a designer on real community projects, with a mentor beside me.",
    href: "/learn/tracks/apprentices",
    cta: "The apprentice track",
  },
  {
    role: "chapter-lead",
    iam: "I'm a chapter lead",
    who: "I'd like to run a chapter in my city: host events, bring people together and adapt the work to my community.",
    href: "/learn/tracks/ambassadors",
    cta: "The chapter lead track",
  },
  {
    role: "community-partner",
    iam: "I'm a community partner",
    who: "My organization has a problem a team could work on, and our community should help define it and judge the result.",
    href: "/learn/guides/real-case",
    cta: "How a partner project runs",
  },
]

/** Mentors and company hosts support the work; they get a smaller link each. */
const SUPPORT_ROLES: { role: StudioRole; iam: string; href: string }[] = [
  { role: "mentor", iam: "I'm a mentor, or would like to be", href: "/learn/tracks/mentors" },
  { role: "company-host", iam: "I'm with a company that could host mentors or sponsor a project", href: "/learn/tracks/company-hosts" },
]

/** Tools for any role, inside BRIDGEGOOD or not. */
const TOOLKITS: { icon: IconName; title: string; body: string; href: string; cta: string }[] = [
  {
    icon: "scale",
    title: "Practice moments",
    body: "Make a call in a short, synthetic dilemma, then see how BRIDGEGOOD reasons about it. Never scored.",
    href: "/learn/practice",
    cta: "Try a practice moment",
  },
  {
    icon: "globe",
    title: "Carry it forward kit",
    body: "Outside BRIDGEGOOD? Teachers and organizers can run a critique circle in their own community, and tell BRIDGEGOOD what they changed.",
    href: "/learn/carry-it-forward",
    cta: "Open the printable kit",
  },
  {
    icon: "messages-square",
    title: "The 12 reflection prompts",
    body: "Questions to ask at the moments decisions get made, answered in your own words.",
    href: "/learn/prompts",
    cta: "Read the prompts",
  },
]

export default function WelcomePage() {
  return (
    <AppShell>
      <section aria-labelledby="hero-title" className="border-b bg-surface-sunken">
        <div className="mx-auto max-w-7xl space-y-12 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-5xl space-y-6">
            <HeroTitle id="hero-title" />
            <p className="max-w-[60ch] type-body-lg">
              How BRIDGEGOOD designs with communities, not for them, and how you can work this way too.
            </p>
          </div>

          <nav aria-labelledby="start-title">
            <h2 id="start-title" className="mb-4 type-title-3">
              Start where you are
            </h2>
            <ul className="grid gap-4 lg:grid-cols-3">
              {MAIN_ROLES.map((r) => (
                <li key={r.role}>
                  <Link
                    to={r.href}
                    data-archetype={r.role}
                    className="group flex h-full flex-col gap-4 rounded-2xl border-2 border-archetype/30 bg-card p-6 hover:border-archetype hover:bg-archetype-soft"
                  >
                    <span className="flex size-12 items-center justify-center rounded-full bg-archetype-soft text-archetype group-hover:bg-card">
                      <Icon name={STUDIO_ROLES[r.role].icon} className="text-2xl" />
                    </span>
                    <span className="type-title-2 text-archetype">{r.iam}</span>
                    <span>{r.who}</span>
                    <span className="mt-auto inline-flex items-center gap-2 pt-2 font-bold text-primary">
                      {r.cta}
                      <Icon name="arrow-right" className="text-base transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {SUPPORT_ROLES.map((r) => (
                <li key={r.role}>
                  <Link
                    to={r.href}
                    data-archetype={r.role}
                    className="group flex h-full min-h-12 items-center gap-3 rounded-xl border bg-card px-4 py-3 hover:border-archetype hover:bg-archetype-soft"
                  >
                    <Icon name={STUDIO_ROLES[r.role].icon} className="text-archetype" />
                    <span className="font-semibold">{r.iam}</span>
                    <Icon name="arrow-right" className="ml-auto text-base text-primary transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              Already taking part?{" "}
              <Link to="/login" className="font-semibold text-primary underline underline-offset-4">
                Log in to your area
              </Link>{" "}
              (demo accounts, no password).
            </p>
          </nav>
        </div>
      </section>

      <section id="toolkits" aria-labelledby="toolkits-title" className="scroll-mt-24 border-b">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 id="toolkits-title" className="type-title-2">
            Toolkits for any role
          </h2>
          <p className="mt-3 mb-8 max-w-[70ch] type-body-lg text-muted-foreground">
            Try the way of working before you sign up for anything, or take it to your own community. No login needed.
          </p>
          <ul className="grid gap-4 md:grid-cols-3">
            {TOOLKITS.map((t) => (
              <li key={t.href}>
                <Link to={t.href} className="group flex h-full flex-col gap-3 rounded-2xl border bg-card p-5 hover:border-primary hover:bg-muted">
                  <Icon name={t.icon} className="text-2xl text-primary" />
                  <span className="type-title-3 font-heading">{t.title}</span>
                  <span className="text-muted-foreground">{t.body}</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-2 font-bold text-primary">
                    {t.cta}
                    <Icon name="arrow-right" className="text-base transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
