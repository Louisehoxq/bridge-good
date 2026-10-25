import { useState } from "react"
import { Icon } from "@/components/icon"
import { CHAPTERS, REGIONS } from "@/content/chapters"
import { SyntheticBadge } from "@/components/synthetic-badge"
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
      <div className="space-y-4">
        <figure className="rounded-2xl border bg-card p-4">
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
          <figcaption className="mt-2 text-sm text-muted-foreground">
            Illustrative map, not to scale. Hover over or focus a chapter in the list to highlight it.
          </figcaption>
        </figure>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-1 flex-col gap-1 text-sm font-bold">
            Search
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="City, country or focus"
              className="h-11 rounded-lg border border-input bg-background px-3 text-base font-normal"
            />
          </label>
          <fieldset className="flex flex-col gap-1">
            <legend className="text-sm font-bold">Region</legend>
            <div className="flex flex-wrap gap-1">
              {["All", ...REGIONS].map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={region === r}
                  onClick={() => setRegion(r)}
                  className={cn(
                    "min-h-12 rounded-lg border border-input px-3 text-sm font-semibold",
                    region === r ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <h2 className="sr-only">Chapter list</h2>
        <p role="status" className="text-sm text-muted-foreground">
          {visible.length} {visible.length === 1 ? "chapter" : "chapters"} found
        </p>

        <ul className="max-h-[38rem] space-y-3 overflow-y-auto pr-1" role="region" aria-label="Chapter list" tabIndex={0}>
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
                <div className="flex items-start justify-between gap-2">
                  <h3 id={`${c.id}-title`} className="text-lg font-bold">
                    {c.city}, {c.country}
                  </h3>
                  {c.synthetic && <SyntheticBadge />}
                </div>
                <p className="mt-1">
                  Ambassador: <span className="font-bold">{c.ambassador}</span>, {c.organisation}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Icon name="calendar_today" className="text-base" /> Meets: {c.meets}
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="location_on" className="text-base" /> Focus: {c.focus}
                  </li>
                </ul>
                <a
                  href={`mailto:${c.email}`}
                  className="mt-3 inline-flex min-h-12 items-center gap-2 font-semibold text-primary underline underline-offset-4"
                >
                  <Icon name="mail" className="text-base" />
                  {c.email}
                </a>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
