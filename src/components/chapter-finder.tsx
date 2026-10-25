import { useState } from "react"
import { Icon } from "@/components/icon"
import { CHAPTERS, REGIONS } from "@/content/chapters"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const W = 1000
const H = 500
const project = (lat: number, lon: number) => ({ x: ((lon + 180) / 360) * W, y: ((90 - lat) / 180) * H })

export function ChapterFinder() {
  const [region, setRegion] = useState<string>("All")
  const [query, setQuery] = useState("")
  const [active, setActive] = useState<string | null>(null)

  const visible = CHAPTERS.filter(
    (c) =>
      (region === "All" || c.region === region) &&
      `${c.city} ${c.country} ${c.focus}`.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div className="grid gap-8 xl:grid-cols-[3fr_2fr]">
      <div className="min-w-0 space-y-4">
        <figure className="min-w-0 rounded-2xl border bg-card p-3 sm:p-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="map-title map-desc">
            <title id="map-title">Illustrative map of BridgeGoodx chapters</title>
            <desc id="map-desc">
              Pins show {visible.length} chapters. The same chapters are listed beside the map with full details.
            </desc>
            <defs>
              <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.6" fill="var(--border)" />
              </pattern>
            </defs>
            <rect width={W} height={H} rx="16" fill="var(--muted)" />
            <rect width={W} height={H} rx="16" fill="url(#dots)" />
            <line x1="0" x2={W} y1={H / 2} y2={H / 2} stroke="var(--border)" strokeDasharray="6 8" />
            {visible.map((c) => {
              const { x, y } = project(c.lat, c.lon)
              const on = active === c.id
              return (
                <g key={c.id} transform={`translate(${x} ${y})`} aria-hidden="true">
                  <circle r={on ? 16 : 10} fill="var(--primary)" opacity={on ? 0.25 : 0.15} />
                  <circle r="6" fill="var(--primary)" stroke="white" strokeWidth="2" />
                  {on && (
                    <text y="-20" textAnchor="middle" className="fill-foreground text-[20px] font-bold">
                      {c.city}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
          <figcaption className="mt-2 text-muted-foreground">
            Illustrative map, not to scale. Hover over or focus a chapter in the list to highlight it.
          </figcaption>
        </figure>
      </div>

      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex min-w-0 flex-1 basis-56 flex-col gap-1">
            <Label htmlFor="chapter-search">Search</Label>
            <Input id="chapter-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="City, country or focus" />
          </div>
          <fieldset className="flex min-w-0 flex-col gap-1">
            <legend className="type-label">Region</legend>
            <div className="flex flex-wrap gap-1">
              {["All", ...REGIONS].map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={region === r}
                  onClick={() => setRegion(r)}
                  className={cn(
                    "inline-flex min-h-12 items-center gap-1.5 rounded-md border-[1.5px] border-input bg-card px-3 font-semibold",
                    region === r ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                >
                  {region === r && <Icon name="check" />}
                  {r}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <h2 className="sr-only">Chapter list</h2>
        <p role="status" className="text-muted-foreground">
          {visible.length} {visible.length === 1 ? "chapter" : "chapters"} found
        </p>

        <div className="max-h-[38rem] overflow-y-auto pr-1" role="region" aria-label="Chapter list" tabIndex={0}>
        <ul className="space-y-3">
          {visible.map((c) => (
            <li
              key={c.id}
              id={c.id}
              onMouseEnter={() => setActive(c.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(c.id)}
              className={cn("rounded-xl border bg-card p-4", active === c.id && "border-primary")}
            >
              <article aria-labelledby={`${c.id}-title`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 id={`${c.id}-title`} className="type-title-3">
                    {c.city}, {c.country}
                  </h3>
                  {c.synthetic && <SyntheticBadge />}
                </div>
                <p className="mt-1">
                  Ambassador: <span className="font-bold">{c.ambassador}</span>, {c.organisation}
                </p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Icon name="calendar_today" className="mt-1 text-base" /> <span>Meets: {c.meets}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="location_on" className="mt-1 text-base" /> <span>Focus: {c.focus}</span>
                  </li>
                </ul>
                <a
                  href={`mailto:${c.email}`}
                  className="mt-3 inline-flex min-h-12 max-w-full items-center gap-2 font-semibold text-primary underline underline-offset-4"
                >
                  <Icon name="mail" className="text-base" />
                  <span className="min-w-0 [overflow-wrap:anywhere]">{c.email}</span>
                </a>
              </article>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  )
}
