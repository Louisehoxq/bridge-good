import { useState, type ReactNode } from "react"
import { AppShell } from "@/components/app-shell"
import { Icon, ICON_NAMES } from "@/components/icon"
import { DraftFrame, DraftTextarea } from "@/components/studio/draft-frame"
import { FieldNote } from "@/components/studio/field-note"
import { Highlight } from "@/components/studio/highlight"
import { JourneyStepper, TeamPath } from "@/components/studio/path"
import { PeopleChip } from "@/components/studio/people-chip"
import { PinnedNote } from "@/components/studio/pinned-note"
import { RoleBadge, STUDIO_ROLES, type StudioRole } from "@/components/studio/role-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PRINCIPLES } from "@/content/principles"
import { pageMeta } from "@/lib/meta"

/** Dev page: Bridge Studio (DESIGN.md) rendered with the app's own tokens and components. */
export const meta = () => [...pageMeta("Bridge Studio design system"), { name: "robots", content: "noindex" }]

const SWATCHES: { token: string; name: string; use: string }[] = [
  { token: "paper", name: "Paper", use: "Page background" },
  { token: "surface", name: "Surface", use: "Cards, panels, inputs" },
  { token: "surface-sunken", name: "Surface sunken", use: "Wells, table headers, the sidebar" },
  { token: "ink", name: "Ink", use: "Body text and headings" },
  { token: "ink-muted", name: "Ink muted", use: "Secondary text and hints" },
  { token: "action", name: "Action", use: "Primary buttons, links, focus" },
  { token: "line", name: "Line", use: "Decorative dividers and card edges" },
  { token: "line-strong", name: "Line strong", use: "Control borders" },
  { token: "marker", name: "Marker", use: "Highlighter background only" },
  { token: "note", name: "Note", use: "Pinned note background" },
  { token: "gold", name: "Gold", use: "Paths and rules only, never text" },
  { token: "draft", name: "Draft", use: "AI draft frame and label" },
  { token: "success", name: "Success", use: "With a check icon" },
  { token: "error", name: "Error", use: "With an alert icon" },
  { token: "apprentice", name: "Apprentice", use: "Role accent" },
  { token: "mentor", name: "Mentor", use: "Role accent" },
  { token: "ambassador", name: "Ambassador", use: "Chapter lead and company host" },
  { token: "partner", name: "Community partner", use: "Role accent" },
]

const TYPE: { className: string; name: string; spec: string; sample: string }[] = [
  { className: "type-display", name: "Display", spec: "48/56 Bricolage 600, welcome hero only", sample: "Design with your community" },
  { className: "type-title-1", name: "Title 1", spec: "36/44 Bricolage 600, page heading", sample: "Shape your problem into a project brief" },
  { className: "type-title-2", name: "Title 2", spec: "28/36 Bricolage 600, section heading", sample: "Who is on your team" },
  { className: "type-title-3", name: "Title 3", spec: "22/30 Bricolage 600, card heading", sample: "Who might be left out?" },
  { className: "type-body-lg", name: "Body large", spec: "18/30 Atkinson 400, long reading", sample: "Describe what isn't working, in plain language. A person at BRIDGEGOOD reads every brief." },
  { className: "type-body", name: "Body", spec: "16/26 Atkinson 400, default", sample: "Il1 O0 rn m: letters that stay distinct for readers with low vision." },
  { className: "type-label", name: "Label", spec: "16/24 Atkinson 600, labels and buttons", sample: "Project title" },
  { className: "type-small", name: "Small", spec: "14/22 Atkinson 400, metadata only", sample: "Submitted Tuesday" },
]

const STATUS = [
  { icon: "circle-check", tone: "bg-success-soft text-success", title: "Brief sent for review", body: "A person at BRIDGEGOOD will reply within 3 working days." },
  { icon: "triangle-alert", tone: "bg-marker text-ink", title: "No community voice yet", body: "Add how the people you serve will shape this before sending." },
  { icon: "circle-alert", tone: "bg-error-soft text-destructive", title: "Two fields need an answer", body: "Describe the community affected and the problem." },
  { icon: "info", tone: "bg-apprentice-soft text-apprentice", title: "Step 3 of your path", body: "Choose a project from the open briefs." },
] as const

function Section({ id, title, intro, children }: { id: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="space-y-6 border-b border-border py-12 last:border-b-0">
      <div className="max-w-[70ch] space-y-2">
        <h2 id={id} className="type-title-2">
          {title}
        </h2>
        {intro && <p className="text-muted-foreground">{intro}</p>}
      </div>
      {children}
    </section>
  )
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
      <h3 className="type-title-3">{title}</h3>
      {children}
    </div>
  )
}

/** "Use this draft" turns the frame solid, as accepting AI output does. */
function AcceptableDraft() {
  const [accepted, setAccepted] = useState(false)
  return (
    <DraftFrame edited={accepted} editedLabel="Accepted by you">
      <p>Suggested scope: redesign the sign-up form and confirmation text in English and Spanish, tested with five families.</p>
      <Button variant="ghost" size="sm" className="mt-2 -ml-3" onClick={() => setAccepted((a) => !a)} aria-pressed={accepted}>
        {accepted ? "Undo" : "Use this draft"}
      </Button>
    </DraftFrame>
  )
}

export default function DesignPage() {
  const principle = PRINCIPLES[0]
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-[70ch] space-y-4 pb-4">
          <RoleBadge role="steward">Bridge Studio</RoleBadge>
          <h1 className="type-title-1 lg:type-display">Design that shows who&apos;s connected and what&apos;s still a draft</h1>
          <p className="type-body-lg text-muted-foreground">
            The BridgeGoodx design system, built from <code>DESIGN.md</code>. Body text meets AAA contrast, every role
            carries an icon and a label, and AI output always looks like a draft. The Design for Social Good philosophy is
            authored and stewarded by BRIDGEGOOD. All people and projects on this page are synthetic examples.
          </p>
        </div>

        <Section
          id="color"
          title="Color"
          intro="Warm paper, navy ink and gold paths. Switch your system theme to see the dark values. npm run check:contrast tests every pair."
        >
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3">
            {SWATCHES.map((s) => (
              <li key={s.token} className="overflow-hidden rounded-[0.75rem] border border-border bg-card">
                <div className="h-14 border-b border-border" style={{ background: `var(--${s.token})` }} />
                <p className="px-3 py-2.5 type-small">
                  <span className="block font-semibold">{s.name}</span>
                  <code className="block">--{s.token}</code>
                  <span className="block text-muted-foreground">{s.use}</span>
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="type" title="Type" intro="Atkinson Hyperlegible Next for reading, Bricolage Grotesque for headings at 20px and up.">
          <dl className="divide-y divide-border rounded-xl border border-border bg-card">
            {TYPE.map((t) => (
              <div key={t.name} className="grid gap-2 p-6 lg:grid-cols-[14rem_1fr] lg:gap-6">
                <dt>
                  <span className="block font-semibold">{t.name}</span>
                  <code className="block type-small text-muted-foreground">{t.className}</code>
                  <span className="block type-small text-muted-foreground">{t.spec}</span>
                </dt>
                <dd className={t.className}>{t.sample}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="components" title="Components" intro="48px controls, 10px radius, 1.5px borders. Focus is a 3px outline that is never removed.">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Buttons">
              <div className="flex flex-wrap items-center gap-3">
                <Button>Send brief</Button>
                <Button variant="secondary">Save for later</Button>
                <Button variant="ghost">Cancel</Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="destructive">
                  <Icon name="x" />
                  Remove brief
                </Button>
                <Button variant="outline" size="sm">
                  Small
                </Button>
                <Button variant="outline" size="icon" aria-label="Send">
                  <Icon name="send" />
                </Button>
                <Button disabled>Not ready yet</Button>
              </div>
            </Card>

            <Card title="Fields">
              <div className="grid gap-1.5">
                <Label htmlFor="ds-title">Project title</Label>
                <Input id="ds-title" defaultValue="Food pantry sign-up in two languages" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="ds-community">Community affected</Label>
                <p id="ds-community-hint" className="text-muted-foreground">
                  Describe people as a group. No names.
                </p>
                <Textarea id="ds-community" aria-invalid="true" aria-describedby="ds-community-hint ds-community-error" />
                <p id="ds-community-error" className="flex items-center gap-1.5 font-semibold text-destructive">
                  <Icon name="circle-alert" />
                  Describe the community affected
                </p>
              </div>
            </Card>

            <Card title="Roles">
              <p className="text-muted-foreground">Every role shows an icon, a label and a color together.</p>
              <ul className="flex flex-wrap gap-2">
                {(Object.keys(STUDIO_ROLES) as StudioRole[]).map((role) => (
                  <li key={role}>
                    <RoleBadge role={role} />
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Notices">
              <ul className="space-y-3">
                {STATUS.map((n) => (
                  <li key={n.title} className={`flex gap-3 rounded-[0.75rem] p-4 ${n.tone}`}>
                    <Icon name={n.icon} className="mt-0.5" />
                    <p className="text-foreground">
                      <strong className="block">{n.title}</strong>
                      {n.body}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Section>

        <Section
          id="signature"
          title="Signature elements"
          intro="The marks of a design studio. Use them sparingly so they keep their meaning."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="People chips">
              <ul className="space-y-4">
                <li>
                  <PeopleChip name="Ari Santos" role="apprentice" you />
                </li>
                <li>
                  <PeopleChip name="Jordan Lee" role="mentor" detail="alum" />
                </li>
                <li>
                  <PeopleChip name="Priya Raman" role="chapter-lead" detail="Chicago" />
                </li>
                <li>
                  <PeopleChip name="Eastside Food Pantry" role="community-partner" />
                </li>
              </ul>
              <p className="type-small text-muted-foreground">Initials only.</p>
            </Card>

            <Card title="Path">
              <p className="text-muted-foreground">Only where the relationship is real: a team, a journey, the impact loop.</p>
              <TeamPath label="Your team">
                <li>
                  <PeopleChip stacked name="Ari Santos" role="apprentice" you />
                </li>
                <li>
                  <PeopleChip stacked name="Jordan Lee" role="mentor" />
                </li>
                <li>
                  <PeopleChip stacked name="Eastside Food Pantry" role="community-partner" />
                </li>
              </TeamPath>
              <div data-archetype="apprentice">
                <JourneyStepper
                  label="Your apprenticeship path"
                  steps={[
                    { label: "Bootcamp", status: "done" },
                    { label: "Mini project", status: "done" },
                    { label: "Choose a project", status: "current" },
                    { label: "Capstone", status: "todo" },
                    { label: "Alumni", status: "todo" },
                  ]}
                />
              </div>
            </Card>

            <Card title="Highlighter and pinned note">
              <p className="type-body-lg">
                Before you submit: who might be <Highlight>left out</Highlight> of this sign-up flow?
              </p>
              <PinnedNote title="Note from Jordan, your mentor">
                <p>Try the form with a screen reader before Thursday. The date picker might be the barrier.</p>
              </PinnedNote>
            </Card>

            <Card title="AI draft frame">
              <AcceptableDraft />
              <DraftFrame edited>
                <p>Redesign the sign-up form in English and Spanish, and test it with families at Saturday distribution.</p>
              </DraftFrame>
              <DraftTextarea
                label="Problem"
                draft="The sign-up form is English-only, so Spanish-speaking families sign up on paper or not at all."
              />
            </Card>

            <Card title="Field note">
              <div className="space-y-1 border-l-4 border-gold pl-4">
                <p className="font-semibold">{principle.name}</p>
                <p>{principle.meaning}</p>
                <p className="type-small text-muted-foreground">BRIDGEGOOD&apos;s wording</p>
              </div>
              <FieldNote chapter="the Chicago chapter">
                <p>In our chapter, lived experience includes language. We ask every brief which languages its community speaks.</p>
              </FieldNote>
            </Card>

            <Card title="Icons">
              <p className="text-muted-foreground">Lucide outline icons, 1.75px stroke. Decorative next to visible text.</p>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-2">
                {ICON_NAMES.map((name) => (
                  <li key={name} className="flex items-center gap-2 type-small">
                    <Icon name={name} />
                    <code className="min-w-0 [overflow-wrap:anywhere]">{name}</code>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Section>
      </div>
    </AppShell>
  )
}
