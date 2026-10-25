/**
 * Deterministic WCAG contrast check (kind A in docs/ai-evaluator.md). It works on real color values
 * the apprentice enters, never on colors guessed from a screenshot.
 */
export type Rgb = [number, number, number]

/** Parse #rgb or #rrggbb (the # is optional). Returns null for anything else. */
export function parseHex(value: string): Rgb | null {
  const hex = value.trim().replace(/^#/, "")
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return null
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as Rgb
}

/** Relative luminance, as defined in WCAG 2.2. */
export function luminance([r, g, b]: Rgb) {
  const channel = (v: number) => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(a: Rgb, b: Rgb) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

export type ContrastCheck = { ruleId: string; label: string; required: number; passes: boolean }

/** The three WCAG 2.2 AA contrast requirements for a foreground and background pair. */
export function checkContrast(foreground: Rgb, background: Rgb): { ratio: number; checks: ContrastCheck[] } {
  const ratio = contrastRatio(foreground, background)
  const rule = (ruleId: string, label: string, required: number) => ({ ruleId, label, required, passes: ratio >= required })
  return {
    ratio,
    checks: [
      rule("WCAG 1.4.3", "Body text", 4.5),
      rule("WCAG 1.4.3", "Large text (24px, or 18.5px bold)", 3),
      rule("WCAG 1.4.11", "Icons, borders and other non-text parts", 3),
    ],
  }
}

/** Ratios are shown rounded down to 2 decimals, so 4.499 never displays as a passing 4.5. */
export function formatRatio(ratio: number) {
  return `${(Math.floor(ratio * 100) / 100).toFixed(2)}:1`
}
