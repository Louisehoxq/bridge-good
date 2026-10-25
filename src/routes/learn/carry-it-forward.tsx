import { useId, useState } from "react"
import { Link } from "react-router"
import { CopyButton } from "@/components/copy-button"
import { KitFeedbackForm } from "@/components/feedback/kit-feedback"
import { FrameworkVersion } from "@/components/feedback/framework-hooks"
import { Icon, type IconName } from "@/components/icon"
import { DraftNote, LibraryPage } from "@/components/library/library-page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KIT } from "@/content/carry-forward"
import { getPillar, REFLECTION_PROMPTS } from "@/content/framework"
import { useFramework } from "@/lib/feedback/store"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Carry it forward: run a critique circle")

/**
 * The carry-it-forward kit: public, no login, printable. A group outside BRIDGEGOOD can run a session,
 * keep the core commitments, credit BRIDGEGOOD, and send back what they changed.
 */
export default function CarryItForward() {
  return (
    <LibraryPage
      href="/learn/carry-it-forward"
      title={KIT.title}
      intro={
        <>
          <p>{KIT.forWho}</p>
          <p className="mt-3">
            No login needed. Print this page for the session: the navigation and the form are left off, and the prompt cards print
            ready to cut out.
          </p>
        </>
      }
    >
      <ul className="mb-6 flex flex-wrap gap-2" aria-label="At a glance">
        {KIT.facts.map((f) => (
          <li key={f.label} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 font-semibold">
            <Icon name={f.icon as IconName} />
            {f.label}
          </li>
        ))}
      </ul>
      <Button type="button" onClick={() => window.print()} className="mb-12 print:hidden">
        <Icon name="printer" />
        Print the kit and cards
      </Button>

      <div className="space-y-14">
        <section aria-labelledby="need-title" className="max-w-3xl space-y-3">
          <h2 id="need-title" className="type-title-2">
            What you need
          </h2>
          <ul className="list-disc space-y-1 pl-6 type-body-lg">
            {KIT.materials.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="session-title" className="max-w-3xl space-y-4 break-inside-avoid">
          <h2 id="session-title" className="type-title-2">
            The session, step by step
          </h2>
          <ol className="space-y-4">
            {KIT.steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3rem_1fr] items-start gap-4">
                <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-full border-2 border-gold bg-card font-bold">
                  {i + 1}
                </span>
                <div>
                  <h3 className="type-title-3">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title} <span className="type-body font-normal text-muted-foreground">· {s.minutes} min</span>
                  </h3>
                  <p className="mt-1 type-body-lg">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="keep-title" className="space-y-4 break-inside-avoid">
          <h2 id="keep-title" className="type-title-2">
            Keep, and adapt
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="flex items-center gap-2 type-title-3">
                <Icon name="scroll-text" />
                Keep: BRIDGEGOOD&apos;s core commitments
              </h3>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                {KIT.keep.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-dashed border-input bg-card p-5">
              <h3 className="flex items-center gap-2 type-title-3">
                <Icon name="pencil" />
                Adapt freely
              </h3>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                {KIT.adapt.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <p className="mt-3 text-muted-foreground">
                Changed something? Tell BRIDGEGOOD at the end of this page. See also{" "}
                <Link to="/learn/guides/adapt-locally" className="underline underline-offset-4">
                  Adapt, don&apos;t copy
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <CreditLine />

        <section aria-labelledby="cards-title" className="space-y-4 print:break-before-page">
          <div className="max-w-3xl">
            <h2 id="cards-title" className="type-title-2">
              The 12 prompt cards
            </h2>
            <p className="mt-1 text-muted-foreground print:hidden">
              Print and cut them out. In step 3, draw three. The numbers match{" "}
              <Link to="/learn/prompts" className="underline underline-offset-4">
                the reflection prompts
              </Link>{" "}
              used across BRIDGEGOOD.
            </p>
          </div>
          <ul aria-label="Prompt cards" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 print:grid-cols-2">
            {REFLECTION_PROMPTS.map((p) => (
              <li key={p.id} className="flex min-h-36 flex-col justify-between gap-3 rounded-xl border-[1.5px] border-dashed border-input bg-card p-5 break-inside-avoid">
                <p className="font-heading text-xl leading-snug font-semibold">{p.text}</p>
                <p className="type-small text-muted-foreground">
                  Prompt {p.id} · {p.pillarIds.map((id) => getPillar(id).name).join(", ")}
                  <span className="block">
                    BRIDGEGOOD Design for Social Good, v<FrameworkVersion />
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <KitFeedbackForm />

        <DraftNote>
          The Design for Social Good philosophy is authored and stewarded by BRIDGEGOOD. This kit is draft wording for BRIDGEGOOD to
          review. The group in the example feedback is synthetic.
        </DraftNote>
      </div>
    </LibraryPage>
  )
}

/** The credit line, with the current framework version and the group's own name if they add it. */
function CreditLine() {
  const id = useId()
  const { version } = useFramework()
  const [group, setGroup] = useState("")
  const text = KIT.credit(version, group.trim())
  return (
    <section aria-labelledby={`${id}-title`} className="max-w-3xl space-y-3 break-inside-avoid">
      <h2 id={`${id}-title`} className="type-title-2">
        Credit line
      </h2>
      <p className="text-muted-foreground print:hidden">
        Put this on your slides, handouts or anything you make from the session. It keeps BRIDGEGOOD visible as the author.
      </p>
      <div className="space-y-1.5 print:hidden">
        <Label htmlFor={`${id}-group`}>
          Your group&apos;s name <span className="font-normal text-muted-foreground">(optional, stays in this browser)</span>
        </Label>
        <Input id={`${id}-group`} value={group} onChange={(e) => setGroup(e.target.value)} className="max-w-md" />
      </div>
      <p className="rounded-xl border bg-card p-4 type-body-lg">{text}</p>
      <CopyButton text={text} label="Copy credit line" className="print:hidden" />
    </section>
  )
}
