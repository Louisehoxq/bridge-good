import { Link, useSearchParams } from "react-router"
import { Icon } from "@/components/icon"
import { LibraryPage } from "@/components/library/library-page"
import { MomentRoles } from "@/components/practice/practice-moment"
import { STUDIO_ROLES } from "@/components/studio/role-badge"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { getPillar, PILLARS, type PillarId } from "@/content/framework"
import { PRACTICE_MOMENTS, PRACTICE_ROLES, type PracticeRole } from "@/content/practice"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Practice moments")

const isPillar = (v: string | null): v is PillarId => PILLARS.some((p) => p.id === v)
const isRole = (v: string | null): v is PracticeRole => (PRACTICE_ROLES as readonly string[]).includes(v ?? "")

/** The index of practice moments, filterable by pillar and role. Filters live in the URL, so a filtered list can be shared. */
export default function PracticeIndex() {
  const [params, setParams] = useSearchParams()
  const pillar = isPillar(params.get("pillar")) ? (params.get("pillar") as PillarId) : undefined
  const role = isRole(params.get("role")) ? (params.get("role") as PracticeRole) : undefined
  const shown = PRACTICE_MOMENTS.filter((m) => (!pillar || m.pillarIds.includes(pillar)) && (!role || m.roles.includes(role)))

  function set(key: "pillar" | "role", value: string) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true, preventScrollReset: true }
    )
  }

  return (
    <LibraryPage
      href="/learn/practice"
      intro={
        <p>
          Short, real-world dilemmas. Make a call, then see how BRIDGEGOOD reasons about it and what every option costs. There&apos;s
          no score and no right answer: the point is practicing judgment, and talking it over with the people you work with.
        </p>
      }
    >
      <fieldset className="mb-6 grid gap-4 rounded-2xl border bg-card p-4 sm:grid-cols-2">
        <legend className="sr-only">Filter practice moments</legend>
        <div className="space-y-1.5">
          <Label htmlFor="practice-pillar">Pillar</Label>
          <NativeSelect id="practice-pillar" value={pillar ?? ""} onChange={(e) => set("pillar", e.target.value)}>
            <option value="">All pillars</option>
            {PILLARS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.number}. {p.name}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="practice-role">Written for</Label>
          <NativeSelect id="practice-role" value={role ?? ""} onChange={(e) => set("role", e.target.value)}>
            <option value="">Everyone</option>
            {PRACTICE_ROLES.map((r) => (
              <option key={r} value={r}>
                {STUDIO_ROLES[r].label}s
              </option>
            ))}
          </NativeSelect>
        </div>
      </fieldset>
      <p role="status" className="mb-4 text-muted-foreground">
        Showing {shown.length} of {PRACTICE_MOMENTS.length} practice moments
        {pillar ? ` on ${getPillar(pillar).name}` : ""}
        {role ? ` for ${STUDIO_ROLES[role].label.toLowerCase()}s` : ""}.
      </p>

      {shown.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
          No practice moment matches both filters yet. Try another pillar or role.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {shown.map((m) => (
            <li key={m.slug} className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-5">
              <div className="flex flex-wrap items-center gap-2 type-small text-muted-foreground">
                <span className="font-semibold text-foreground">{m.pillarIds.map((p) => getPillar(p).name).join(" · ")}</span>
                <span className="inline-flex items-center gap-1">
                  <Icon name="clock" className="text-base" />
                  {m.minutes} min
                </span>
                <SyntheticBadge />
              </div>
              <h2 className="type-title-3">
                <Link to={`/learn/practice/${m.slug}`} className="underline-offset-4 hover:underline">
                  {m.title}
                </Link>
              </h2>
              <p className="text-muted-foreground">{m.teaser}</p>
              <div className="mt-auto pt-1">
                <MomentRoles moment={m} />
              </div>
            </li>
          ))}
        </ul>
      )}

    </LibraryPage>
  )
}
