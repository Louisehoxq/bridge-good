import { Link } from "react-router"
import { ChangelogList } from "@/components/feedback/changelog-list"
import { FrameworkVersion } from "@/components/feedback/framework-hooks"
import { LibraryPage } from "@/components/library/library-page"
import { FRAMEWORK_META } from "@/content/framework"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Changelog")

/** The public changelog: how the framework changes, and whose feedback changed it. */
export default function ChangelogPage() {
  return (
    <LibraryPage
      href="/learn/changelog"
      intro={
        <p>
          The framework changes when the people using it tell {FRAMEWORK_META.author} what didn&apos;t work. A BRIDGEGOOD steward reads
          every piece of feedback and decides, with a reason. This page shows each version, what changed and why, and where it came
          from. People are credited only when they said yes.
        </p>
      }
    >
      <div className="mb-10 grid gap-4 lg:grid-cols-3">
        <section aria-labelledby="now-title" className="rounded-2xl border-2 border-primary p-5">
          <h2 id="now-title" className="type-title-3">
            Current version
          </h2>
          <p className="mt-1 type-title-2">
            <FrameworkVersion />
          </p>
          <p className="mt-1 text-muted-foreground">{FRAMEWORK_META.status}</p>
        </section>
        <section aria-labelledby="kinds-title" className="rounded-2xl border bg-card p-5 lg:col-span-2">
          <h2 id="kinds-title" className="type-title-3">
            Three kinds of change
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <span className="font-semibold">Official wording changed:</span> BRIDGEGOOD rewrote part of the framework. This publishes a new
              version.
            </li>
            <li>
              <span className="font-semibold">Field note recognized:</span> one chapter&apos;s local practice, shown beneath the official wording
              on a pillar page. The official wording stays the same.
            </li>
            <li>
              <span className="font-semibold">Noted for the next review:</span> BRIDGEGOOD agreed something should change and says what.
            </li>
          </ul>
        </section>
      </div>
      <ChangelogList />
      <p className="mt-10 max-w-prose">
        Want to suggest a change? Chapter leads can{" "}
        <Link to="/ambassador/playbook#propose" className="underline underline-offset-4">
          propose an adaptation
        </Link>
        , and apprentices and mentors can flag any pillar, guide or prompt that didn&apos;t fit.
      </p>
    </LibraryPage>
  )
}
