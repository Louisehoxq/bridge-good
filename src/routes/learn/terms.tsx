import { DraftNote, LibraryPage } from "@/components/library/library-page"
import { COMPARISON, GLOSSARY } from "@/content/glossary"
import { FRAMEWORK_META } from "@/content/framework"
import { pageMeta } from "@/lib/meta"
import { cn } from "@/lib/utils"

export const meta = () => pageMeta("Terms of reference")

/** What the words mean, and how Design for Social Good differs from approaches it builds on. Moved here from the welcome page. */
export default function TermsPage() {
  const ours = COMPARISON.approaches.length - 1
  return (
    <LibraryPage
      href="/learn/terms"
      intro={
        <p>
          Words like &ldquo;inclusion&rdquo; and &ldquo;social good&rdquo; can become empty. Here&apos;s what BRIDGEGOOD
          means by them, what each looks like in practice, and how you&apos;d notice it&apos;s missing.
        </p>
      }
    >
      <section id="compare" aria-labelledby="compare-title" className="scroll-mt-24">
        <h2 id="compare-title" className="type-title-2">
          How it differs from other approaches
        </h2>
        <p className="mt-2 mb-6 max-w-[70ch] text-muted-foreground">
          Design for Social Good builds on human-centered design and design thinking. The difference is in who holds power,
          who does the work, and who benefits.
        </p>
        <div className="overflow-x-auto rounded-xl border bg-card" role="region" aria-label="Comparison table, scrolls sideways" tabIndex={0}>
          <table className="w-full min-w-[56rem] border-collapse text-left">
            <caption className="sr-only">How Design for Social Good compares with other approaches</caption>
            <thead className="bg-muted">
              <tr>
                <td className="p-4" />
                {COMPARISON.approaches.map((a, i) => (
                  <th key={a} scope="col" className={cn("p-4 font-bold", i === ours && "bg-primary text-primary-foreground")}>
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
                    <td key={i} className={cn("p-4", i === ours ? "bg-accent font-semibold text-accent-foreground" : "text-muted-foreground")}>
                      {ans}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="terms" aria-labelledby="terms-title" className="mt-14 scroll-mt-24">
        <h2 id="terms-title" className="mb-6 type-title-2">
          Terms
        </h2>
        <dl className="grid gap-4 md:grid-cols-2">
          {GLOSSARY.map((g) => (
            <div key={g.term} className="rounded-xl border bg-card p-5">
              <dt className="type-title-3">{g.term}</dt>
              <dd className="mt-1">{g.definition}</dd>
              <dd className="mt-3 border-t pt-3">
                <span className="font-bold">In practice: </span>
                {g.inPractice}
              </dd>
              {g.notThis && (
                <dd className="mt-2">
                  <span className="font-bold">What it isn&apos;t: </span>
                  {g.notThis}
                </dd>
              )}
              {g.missingWhen && (
                <dd className="mt-2">
                  <span className="font-bold">How you&apos;d notice it&apos;s missing: </span>
                  {g.missingWhen}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-10">
        <DraftNote>
          Draft wording, version {FRAMEWORK_META.version}. {FRAMEWORK_META.note}
        </DraftNote>
      </div>
    </LibraryPage>
  )
}
