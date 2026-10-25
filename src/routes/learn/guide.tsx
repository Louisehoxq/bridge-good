import { data } from "react-router"
import type { Route } from "./+types/guide"
import { DraftNote, LibraryPage, PromptList } from "@/components/library/library-page"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { DidntFit, guideTarget } from "@/components/feedback/didnt-fit" // Milestone 3 hook
import { ADAPTATION } from "@/content/adaptation"
import { AI_SOCIAL_GOOD_GUIDE, AMBASSADOR_VETTING, MENTOR_COMMITMENT, MOCK_CASE_GUIDE, REAL_CASE_GUIDE, type HowToGuide } from "@/content/guides"
import { DISABILITY_CONVENTION, PREFERRED_TERMS, WRITING_RULES } from "@/content/language"
import { GUIDE_SLUGS, GUIDE_TITLES, type GuideSlug } from "@/lib/library"
import { pageMeta } from "@/lib/meta"

const isGuide = (v: string): v is GuideSlug => (GUIDE_SLUGS as readonly string[]).includes(v)

export function loader({ params }: Route.LoaderArgs) {
  if (!isGuide(params.slug)) throw data(null, { status: 404 })
  return { slug: params.slug }
}

export const meta = ({ loaderData }: Route.MetaArgs) => pageMeta(loaderData ? GUIDE_TITLES[loaderData.slug].title : "Guide")

const DRAFT = "Draft wording for BRIDGEGOOD to review and own. BRIDGEGOOD confirms anything marked as our proposal."

export default function GuidePage({ loaderData }: Route.ComponentProps) {
  const { slug } = loaderData
  return (
    <LibraryPage href={`/learn/guides/${slug}`} intro={<p>{GUIDE_TITLES[slug].summary}</p>}>
      {slug === "mock-case" && <HowTo guide={MOCK_CASE_GUIDE} />}
      {slug === "real-case" && <HowTo guide={REAL_CASE_GUIDE} />}
      {slug === "ai-and-social-good" && <AiGuide />}
      {slug === "mentor-commitment" && <Commitment />}
      {slug === "ambassador-vetting" && <Vetting />}
      {slug === "adapt-locally" && <Adapt />}
      {slug === "inclusive-language" && <Language />}
      {/* Milestone 3 hook: "this didn't fit" flag. */}
      <div className="mt-10">
        <DidntFit {...guideTarget(slug)} />
      </div>
      <div className="mt-10">
        <DraftNote>{DRAFT}</DraftNote>
      </div>
    </LibraryPage>
  )
}

function Limits({ getHelp, limits }: { getHelp?: string; limits: string }) {
  return (
    <div className="mt-10 grid gap-4 lg:grid-cols-2">
      {getHelp && (
        <section aria-labelledby="help-title" className="rounded-2xl border-2 border-primary p-5">
          <h2 id="help-title" className="type-title-3">
            When to bring in BRIDGEGOOD staff
          </h2>
          <p className="mt-1">{getHelp}</p>
        </section>
      )}
      <section aria-labelledby="limits-title" className="rounded-2xl bg-muted p-5">
        <h2 id="limits-title" className="type-title-3">
          What this guide can&apos;t do
        </h2>
        <p className="mt-1">{limits}</p>
      </section>
    </div>
  )
}

function HowTo({ guide }: { guide: HowToGuide }) {
  return (
    <>
      <p className="mb-6 font-semibold">{guide.timing}</p>
      <ol className="space-y-4">
        {guide.steps.map((step, i) => (
          <li key={step.title} className="grid gap-4 rounded-2xl border bg-card p-5 sm:grid-cols-[2.5rem_1fr]">
            <span className="flex size-10 items-center justify-center rounded-full bg-muted font-bold" aria-hidden="true">
              {i + 1}
            </span>
            <div className="min-w-0 space-y-3">
              <h2 className="type-title-3">{step.title}</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                <p>
                  <span className="block font-bold">What to do</span>
                  {step.do}
                </p>
                <p>
                  <span className="block font-bold">Why</span>
                  {step.why}
                </p>
              </div>
              {step.promptIds && (
                <div>
                  <p className="mb-2 font-bold">Questions to bring in</p>
                  <PromptList prompts={step.promptIds} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
      <Limits getHelp={guide.getHelp} limits={guide.limits} />
    </>
  )
}

function AiGuide() {
  const g = AI_SOCIAL_GOOD_GUIDE
  return (
    <>
      <p className="mb-6">
        <span className="font-bold">Who it&apos;s for: </span>
        {g.audience}
      </p>
      <section aria-labelledby="rules-title" className="mb-10 rounded-2xl border-2 border-primary p-5">
        <h2 id="rules-title" className="type-title-3">
          Three ground rules
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {g.groundRules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>
      <ol className="space-y-4">
        {g.sections.map((s, i) => (
          <li key={s.title} className="rounded-2xl border bg-card p-5">
            <p className="type-small font-semibold text-muted-foreground">Session {i + 1}</p>
            <h2 className="type-title-3">{s.title}</h2>
            <div className="mt-3 grid gap-4 lg:grid-cols-2">
              <p>
                <span className="block font-bold">Talk about</span>
                {s.talkAbout}
              </p>
              <div>
                <p className="flex flex-wrap items-center gap-2 font-bold">
                  Try this <SyntheticBadge />
                </p>
                <p>{s.tryThis}</p>
              </div>
            </div>
            <div className="mt-3">
              <PromptList prompts={s.promptIds} />
            </div>
          </li>
        ))}
      </ol>
      <Limits limits={g.limits} />
    </>
  )
}

function Commitment() {
  const c = MENTOR_COMMITMENT
  return (
    <>
      <p className="mb-6 rounded-xl bg-muted p-4">
        <span className="font-bold">Time: </span>
        {c.time}
      </p>
      <ul className="grid gap-4 lg:grid-cols-2">
        {c.commitments.map((item) => (
          <li key={item.do} className="rounded-2xl border bg-card p-5">
            <p className="font-bold">{item.do}</p>
            <p className="mt-1 text-muted-foreground">
              <span className="font-semibold text-foreground">Why: </span>
              {item.why}
            </p>
          </li>
        ))}
      </ul>
      <section aria-labelledby="offers-title" className="mt-10 rounded-2xl border-2 border-primary p-5">
        <h2 id="offers-title" className="type-title-3">
          What BRIDGEGOOD offers mentors
        </h2>
        <p className="mt-1">{c.bridgegoodOffers}</p>
      </section>
    </>
  )
}

function Vetting() {
  const v = AMBASSADOR_VETTING
  return (
    <>
      <dl className="grid gap-4 lg:grid-cols-2">
        {v.criteria.map((c) => (
          <div key={c.name} className="rounded-2xl border bg-card p-5">
            <dt className="type-body-lg font-semibold">{c.name}</dt>
            <dd className="mt-1">{c.lookFor}</dd>
          </div>
        ))}
      </dl>
      <section aria-labelledby="never-title" className="mt-10 rounded-2xl border-2 border-primary p-5">
        <h2 id="never-title" className="type-title-3">
          What vetting never asks
        </h2>
        <p className="mt-1">{v.neverAsked}</p>
      </section>
    </>
  )
}

function Adapt() {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        {[ADAPTATION.core, ADAPTATION.local].map((block, i) => (
          <section key={block.title} aria-labelledby={`adapt-${i}`} className={i === 0 ? "rounded-2xl border-2 border-primary p-5" : "rounded-2xl border bg-card p-5"}>
            <h2 id={`adapt-${i}`} className="type-title-3">
              {block.title}
            </h2>
            <p className="mt-1 text-muted-foreground">{block.intro}</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section aria-labelledby="loop-title" className="mt-10">
        <h2 id="loop-title" className="mb-4 type-title-2">
          {ADAPTATION.loop.title}
        </h2>
        <ol className="grid gap-4 lg:grid-cols-3">
          {ADAPTATION.loop.steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border bg-card p-5">
              <p className="type-small font-semibold text-muted-foreground">Step {i + 1}</p>
              <h3 className="type-title-3">{s.title}</h3>
              <p className="mt-1">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}

function Language() {
  return (
    <>
      <dl className="grid gap-4 lg:grid-cols-2">
        {Object.entries({
          "Reading level": WRITING_RULES.readingLevel,
          Spelling: WRITING_RULES.spelling,
          Case: WRITING_RULES.case,
          Pronouns: WRITING_RULES.pronouns,
          "Synthetic examples": WRITING_RULES.synthetic,
        }).map(([k, v]) => (
          <div key={k} className="rounded-2xl border bg-card p-5">
            <dt className="font-bold">{k}</dt>
            <dd className="mt-1">{v}</dd>
          </div>
        ))}
      </dl>
      <section aria-labelledby="disability-title" className="mt-10 rounded-2xl border-2 border-primary p-5">
        <h2 id="disability-title" className="type-title-3">
          Disability language
        </h2>
        <p className="mt-1">{DISABILITY_CONVENTION.note}</p>
        <p className="mt-2">
          <span className="font-bold">For example: </span>
          {DISABILITY_CONVENTION.examples.join(", ")}
        </p>
      </section>
      <section aria-labelledby="terms-title" className="mt-10">
        <h2 id="terms-title" className="mb-4 type-title-2">
          Words to avoid, and what to say instead
        </h2>
        <div className="overflow-x-auto rounded-xl border" role="region" aria-label="Table: words to avoid and what to say instead" tabIndex={0}>
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="p-4">
                  Instead of
                </th>
                <th scope="col" className="p-4">
                  Say
                </th>
              </tr>
            </thead>
            <tbody>
              {PREFERRED_TERMS.map((t) => (
                <tr key={t.avoid} className="border-t align-top">
                  <td className="p-4 text-muted-foreground">{t.avoid}</td>
                  <td className="p-4">{t.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
