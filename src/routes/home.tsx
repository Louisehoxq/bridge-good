import { Link } from "react-router"
import { AppShell } from "@/components/app-shell"
import { CycleDiagram } from "@/components/cycle"
import { Icon } from "@/components/icon"
import { buttonVariants } from "@/components/ui/button"
import { PATHWAYS, PRINCIPLES } from "@/content/philosophy"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta()

export default function WelcomePage() {
  return (
    <AppShell>
      <section aria-labelledby="hero-title" className="border-b bg-surface-sunken">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-4xl space-y-6">
            <p className="type-small font-bold tracking-widest text-action uppercase">
              BRIDGEGOOD · <span className="text-muted-foreground">Design for Social Good</span>
            </p>
            <h1 id="hero-title" className="type-title-1 lg:type-display">
              Design for people. Build for good.
            </h1>
            <p className="max-w-[65ch] type-body-lg">
              Great design doesn&apos;t just solve problems. It helps people see their own potential, makes space for voices
              too often overlooked, and creates opportunities for communities to thrive.
            </p>
            <p className="max-w-[65ch] type-body-lg">
              Welcome to BRIDGEGOOD&apos;s shared space for learning, practicing, and carrying forward Design for Social Good.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/understand" className={buttonVariants({ size: "lg" })}>
                Explore the philosophy
                <Icon name="arrow-right" />
              </Link>
              <Link to="/lab" className={buttonVariants({ size: "lg", variant: "outline" })}>
                Put it into practice
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        <section aria-labelledby="more-title" className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:items-start">
          <h2 id="more-title" className="type-title-1">
            Design is more than what you make.
          </h2>
          <div className="space-y-4 type-body-lg">
            <p>
              It&apos;s how you listen. Whose perspectives you include. What you choose to question. And who benefits from
              the solutions you create.
            </p>
            <p>
              At BRIDGEGOOD, design is also a way to build confidence, expand access, strengthen communities, and open doors
              to economic opportunity.
            </p>
            <p className="font-semibold">
              This philosophy isn&apos;t something to memorize. It&apos;s something to practice, question, and carry into the
              world.
            </p>
          </div>
        </section>

        <section aria-labelledby="principles-title">
          <h2 id="principles-title" className="type-title-2">
            The principles behind the practice
          </h2>
          <p className="mt-2 mb-8 type-body-lg text-muted-foreground italic">Not rules to follow blindly, but questions to return to.</p>
          <ol className="grid gap-4 md:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <li key={p.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-6">
                <p className="w-fit border-b-4 border-gold pb-1 font-heading text-3xl font-bold text-action" aria-hidden="true">
                  {p.number}
                </p>
                <h3 className="type-title-3">
                  <span className="sr-only">Principle {p.number}: </span>
                  {p.title}
                </h3>
                <p>{p.body}</p>
                <Link
                  to={`/understand#${p.id}`}
                  className="mt-auto inline-flex min-h-12 items-center gap-1 font-semibold text-action underline underline-offset-4"
                >
                  The reasoning and an example
                  <Icon name="arrow-right" className="text-base" />
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="journey-title">
          <h2 id="journey-title" className="type-title-2">
            Your journey. Your way to contribute.
          </h2>
          <p className="mt-2 mb-8 max-w-3xl type-body-lg text-muted-foreground">
            Whether you&apos;re learning design, guiding someone else&apos;s growth, or bringing these values into a new
            organization, there&apos;s a place for you here.
          </p>
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {PATHWAYS.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/start/${p.id}`}
                  className="group flex h-full flex-col gap-3 rounded-2xl border-2 border-border bg-card p-5 transition-colors hover:border-action"
                >
                  <Icon name={p.icon} className="text-2xl text-action" />
                  <span className="type-title-3">{p.title}</span>
                  <span className="text-muted-foreground">{p.body}</span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 font-bold text-action">
                    {p.cta}
                    <Icon name="arrow-right" className="text-base transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="cycle-title">
          <h2 id="cycle-title" className="type-title-2">
            Understand, practice, reflect, teach, and again
          </h2>
          <p className="mt-2 mb-8 max-w-3xl type-body-lg text-muted-foreground">
            This is more than a resource portal. It helps you move through a repeatable cycle of understanding, action,
            reflection, and shared learning.
          </p>
          <CycleDiagram />
        </section>

        <section aria-labelledby="grow-title" className="rounded-3xl bg-surface-sunken p-8 lg:p-12">
          <div className="max-w-3xl space-y-4">
            <h2 id="grow-title" className="type-title-2">
              Don&apos;t just learn the philosophy. Help it grow.
            </h2>
            <p className="type-body-lg">
              Every community is different. Every challenge brings something new. The goal isn&apos;t to reproduce one perfect
              solution — it&apos;s to carry forward the thinking, care, and responsibility behind the work.
            </p>
            <p className="type-body-lg">Share a lesson. Reflect on a challenge. Adapt a tool. Mentor someone. Tell us what should change.</p>
            <p className="type-title-3 border-l-4 border-gold pl-4">The playbook belongs to the community that practices it.</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/playbook/contribute" className={buttonVariants({ size: "lg" })}>
                Share a lesson
              </Link>
              <Link to="/playbook" className={buttonVariants({ size: "lg", variant: "outline" })}>
                Read the Living Playbook
              </Link>
            </div>
            <p className="pt-4 text-muted-foreground italic">
              Rooted in BRIDGEGOOD&apos;s philosophy. Shaped by lived experience. Carried forward together.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
