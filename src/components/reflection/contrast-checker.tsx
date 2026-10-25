import { Check, Contrast, X } from "lucide-react"
import { useId, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { checkContrast, formatRatio, parseHex } from "@/lib/evaluator/checks/contrast"

function ColorField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  const rgb = parseHex(value)
  const valid = rgb !== null
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="font-bold">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={valid ? undefined : true}
          aria-describedby={valid ? undefined : `${id}-error`}
          className="font-mono"
        />
        <input
          type="color"
          aria-label={`Pick ${label.toLowerCase()}`}
          // The color input only takes #rrggbb, so expand a 3-digit hex first.
          value={rgb ? `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}` : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="size-12 shrink-0 cursor-pointer rounded-xs border border-input bg-transparent p-1"
        />
      </div>
      {!valid && (
        <p id={`${id}-error`} className="text-sm font-semibold text-destructive">
          Use a hex color like #1A2B3C.
        </p>
      )}
    </div>
  )
}

/**
 * Deterministic contrast check: kind A in docs/ai-evaluator.md. Shown apart from the AI review,
 * because only real color values can pass or fail a WCAG rule.
 */
export function ContrastChecker() {
  const id = useId()
  const [fg, setFg] = useState("#767676")
  const [bg, setBg] = useState("#FFFFFF")
  const fgRgb = parseHex(fg)
  const bgRgb = parseHex(bg)
  const result = fgRgb && bgRgb ? checkContrast(fgRgb, bgRgb) : null
  const swatch = (rgb: [number, number, number]) => `rgb(${rgb.join(" ")})`

  return (
    <section aria-labelledby={`${id}-title`} className="space-y-4 rounded-2xl border bg-card p-5">
      <div className="flex items-start gap-3">
        <Contrast aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <h2 id={`${id}-title`} className="text-lg font-bold">
            Contrast checker
          </h2>
          <p className="text-sm text-muted-foreground">Automated check, not AI. Enter the real colors from your design file.</p>
        </div>
      </div>
      <div className="grid gap-3">
        <ColorField id={`${id}-fg`} label="Text or icon color" value={fg} onChange={setFg} />
        <ColorField id={`${id}-bg`} label="Background color" value={bg} onChange={setBg} />
      </div>
      {result && fgRgb && bgRgb && (
        <div className="space-y-3">
          <p className="rounded-lg border p-3 text-lg font-bold" style={{ color: swatch(fgRgb), backgroundColor: swatch(bgRgb) }}>
            Sample text, {formatRatio(result.ratio)}
          </p>
          <ul className="space-y-1 text-sm">
            {result.checks.map((c) => (
              <li key={c.label} className="flex items-start gap-2">
                {c.passes ? (
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                ) : (
                  <X aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-destructive" />
                )}
                <span>
                  <span className="font-bold">{c.passes ? "Meets" : "Doesn't meet"}</span> {c.ruleId} for {c.label.toLowerCase()} (needs{" "}
                  {c.required}:1)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        Automated checks find only some accessibility problems. Test with a keyboard, a screen reader and zoom, and with disabled
        people.
      </p>
    </section>
  )
}
