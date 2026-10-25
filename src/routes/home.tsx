import { Link } from "react-router"
import { Icon } from "@/components/icon"
import { COMPARISON, GLOSSARY } from "@/content/glossary"
import { AppShell } from "@/components/app-shell"
import { ImpactLoop } from "@/components/impact-loop"
import { PrinciplesTable } from "@/components/principles-table"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const TOC = [
  { id: "mission", label: "Mission" },
  { id: "why", label: "Why Design for Social Good" },
  { id: "loop", label: "How it fits together" },
  { id: "principles", label: "Principles by role" },
  { id: "terms", label: "Terms of reference" },
  { id: "resources", label: "Resources" },
]

const RESOURCES = [
  { title: "Design for Social Good principles (one-page summary)", kind: "PDF", status: "Coming soon" },
  { title: "Inclusive language guide", kind: "Guide", status: "Coming soon" },
  { title: "Consent & privacy for community research", kind: "Guide", status: "Coming soon" },
  { title: "Capstone project lifecycle", kind: "Diagram", status: "Coming soon" },
]

const EXTERNAL = [
  { title: "WCAG 2.2 quick reference (W3C)", href: "https://www.w3.org/WAI/WCAG22/quickref/" },
  { title: "Introduction to web accessibility (W3C WAI)", href: "https://www.w3.org/WAI/fundamentals/accessibility-intro/" },
]

export default function WelcomePage() {
  return (
    <AppShell>
      <section aria-labelledby="hero-title" className="bg-surface-container">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[3fr_2fr] lg:items-end lg:px-8 lg:py-24">
          <div className="space-y-6">
            <p className="text-sm font-bold tracking-wide text-primary uppercase">BRIDGEGOOD · Design for Social Good</p>
            <h1 id="hero-title" className="text-5xl font-bold lg:text-6xl">
              Design that starts with community, and leaves it stronger.
            </h1>
            <p className="max-w-2xl text-xl">
              A shared home for BRIDGEGOOD&apos;s philosophy: what it means, why it&apos;s different, and how students,
              mentors, ambassadors and partners put it into practice.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/login" className={buttonVariants({ size: "lg" })}>
                Log in to your area
                <Icon name="arrow_forward" />
              </Link>
              <Link to="/chapters" className={buttonVariants({ size: "lg", variant: "outline" })}>
                Find a chapter near you
              </Link>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            {[
              ["Since 2009", "connecting design with confidence, access, community and economic mobility"],
              ["4 roles", "students, mentors, ambassadors and partners, all in one loop"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-background p-5">
                <dt className="font-heading text-2xl font-bold">{k}</dt>
                <dd className="mt-1 text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-[14rem_1fr] lg:gap-12 lg:px-8">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-16 py-12">
            <p className="mb-3 text-sm font-bold tracking-wide text-muted-foreground uppercase">On this page</p>
            <ul className="space-y-1 border-l">
              {TOC.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="-ml-px flex min-h-12 items-center border-l-2 border-transparent pl-4 hover:border-primary">
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="min-w-0 space-y-20 py-12 lg:py-16">
          <section id="mission" aria-labelledby="mission-title" className="grid gap-8 xl:grid-cols-2">
            <div className="space-y-4">
              <h2 id="mission-title" className="text-3xl font-bold lg:text-4xl">
                Mission & philosophy
              </h2>
              <blockquote className="border-l-4 border-primary pl-5 text-xl">
                [BRIDGEGOOD&apos;s official mission statement goes here. Use the Design System&apos;s approved wording.]
              </blockquote>
              <p className="text-lg">
                Since 2009, BRIDGEGOOD has helped people see themselves as creators, leaders and problem-solvers. Design
                for Social Good is the way of working behind that: design that benefits communities, values lived
                experience, and grows confidence, access and economic mobility for the people doing it.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-lg font-bold">This philosophy belongs to a community</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>BRIDGEGOOD authors and stewards it.</li>
                <li>Students, mentors, ambassadors and partners practise it, and improve it through feedback.</li>
                <li>Communities can adapt it locally while keeping its core commitments.</li>
                <li>Technology on this site supports the relationships behind it. It doesn&apos;t replace them.</li>
              </ul>
            </div>
          </section>

          <section id="why" aria-labelledby="why-title">
            <h2 id="why-title" className="text-3xl font-bold lg:text-4xl">
              Why Design for Social Good, rather than other philosophies?
            </h2>
            <p className="mt-3 mb-8 max-w-3xl text-lg text-muted-foreground">
              It builds on human-centred design and design thinking. The difference is in who holds power, who does the
              work, and who benefits.
            </p>
            <div className="overflow-x-auto rounded-xl border" role="region" aria-label="Comparison of design approaches" tabIndex={0}>
              <table className="w-full min-w-[56rem] border-collapse text-left">
                <caption className="sr-only">How Design for Social Good compares with other approaches</caption>
                <thead className="bg-muted">
                  <tr>
                    <td className="p-4" />
                    {COMPARISON.approaches.map((a, i) => (
                      <th
                        key={a}
                        scope="col"
                        className={cn("p-4 font-bold", i === COMPARISON.approaches.length - 1 && "bg-primary text-primary-foreground")}
                      >
                        {a}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.rows.map((row) => (
                    <tr key={row.question} className="border-t align-top">
                      <th scope="row" className="p-4 font-bold">
                        {row.question}
                      </th>
                      {row.answers.map((ans, i) => (
                        <td
                          key={i}
                          className={cn("p-4", i === row.answers.length - 1 ? "bg-accent font-semibold text-accent-foreground" : "text-muted-foreground")}
                        >
                          {ans}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="loop" aria-labelledby="loop-title">
            <h2 id="loop-title" className="mb-8 text-3xl font-bold lg:text-4xl">
              How it fits together
            </h2>
            <ImpactLoop />
          </section>

          <section id="principles" aria-labelledby="principles-title">
            <h2 id="principles-title" className="text-3xl font-bold lg:text-4xl">
              Principles by role
            </h2>
            <p className="mt-3 mb-8 max-w-3xl text-lg text-muted-foreground">
              Each principle is something people do, so it means something specific for each role. Draft wording, for
              BRIDGEGOOD to review.
            </p>
            <PrinciplesTable />
          </section>

          <section id="terms" aria-labelledby="terms-title">
            <h2 id="terms-title" className="text-3xl font-bold lg:text-4xl">
              Terms of reference
            </h2>
            <p className="mt-3 mb-8 max-w-3xl text-lg text-muted-foreground">
              Words like &ldquo;inclusion&rdquo; and &ldquo;social good&rdquo; can become empty. Here&apos;s what we mean
              by them, and what each looks like in practice.
            </p>
            <dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {GLOSSARY.map((g) => (
                <div key={g.term} className="rounded-xl border bg-card p-5">
                  <dt className="text-lg font-bold">{g.term}</dt>
                  <dd className="mt-1">{g.definition}</dd>
                  <dd className="mt-3 border-t pt-3 text-sm text-muted-foreground">
                    <span className="font-bold text-foreground">In practice: </span>
                    {g.inPractice}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="resources" aria-labelledby="resources-title">
            <h2 id="resources-title" className="mb-8 text-3xl font-bold lg:text-4xl">
              Resources
            </h2>
            <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
              <ul className="divide-y rounded-xl border">
                {RESOURCES.map((r) => (
                  <li key={r.title} className="flex items-center gap-4 p-4">
                    <Icon name="description" className="text-xl shrink-0 text-primary" />
                    <span className="flex-1">
                      <span className="block font-bold">{r.title}</span>
                      <span className="text-sm text-muted-foreground">{r.kind}</span>
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 text-sm">{r.status}</span>
                  </li>
                ))}
              </ul>
              <div>
                <h3 className="mb-3 font-bold">External references</h3>
                <ul className="space-y-1">
                  {EXTERNAL.map((e) => (
                    <li key={e.href}>
                      <a href={e.href} className="inline-flex min-h-12 items-center gap-2 underline underline-offset-4">
                        {e.title}
                        <Icon name="open_in_new" className="text-base" />
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-muted-foreground">
                  Full training for each role is in <Link to="/training" className="underline underline-offset-4">Training</Link>.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  )
}
