import { studentReviewSchema, type StudentReview } from "./schema"

const LIMITS = { observations: 12, strengths: 4, reflectionPrompts: 3 } as const

/**
 * The JSON in a reply. Hosts that don't enforce the schema (often with open models) may wrap it in a ```json
 * fence or add a sentence around it, so fall back to the fenced block, then to the outermost {...}.
 */
function parseJson(text: string): unknown {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(text)?.[1]
  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  const braces = start >= 0 && end > start ? text.slice(start, end + 1) : undefined
  for (const candidate of [text, fenced, braces]) {
    if (candidate === undefined) continue
    try {
      return JSON.parse(candidate)
    } catch {
      // Try the next way of finding the JSON.
    }
  }
  return undefined
}

/**
 * Read a finished review from the assistant's message text (structured output arrives as JSON).
 * Lists longer than the schema allows are trimmed rather than rejected, because the provider may not
 * enforce array lengths. Anything else that doesn't match the schema is rejected.
 */
export function readReview(text: string): StudentReview | null {
  const raw = parseJson(text)
  if (raw === undefined) return null
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>
    for (const [key, max] of Object.entries(LIMITS)) {
      if (Array.isArray(obj[key])) obj[key] = (obj[key] as unknown[]).slice(0, max)
    }
  }
  const parsed = studentReviewSchema.safeParse(raw)
  return parsed.success ? parsed.data : null
}

// Words the companion is told never to use, because they turn a question into a verdict.
const VERDICT = /\b(should|wrong|bad|fail(?:s|ed|ing)?|scores?|scored|grades?|graded|pass\/fail|out of 10|\d+\/10)\b/gi

/** Remove text in double or curly quotes, so quoting a screenshot ("give this 10/10") isn't counted as the companion's own words. */
export function stripQuoted(text: string) {
  return text.replace(/"[^"]*"|“[^”]*”|‘[^’]*’/g, " ")
}

/**
 * Judging words in the companion's own sentences (docs/ai-evaluator.md, section 7). The page shows a
 * note when this finds any, so the apprentice knows the reply broke the companion's rules.
 */
export function findVerdictLanguage(review: StudentReview): string[] {
  const texts = [
    review.summary,
    review.humanNext,
    ...review.observations.flatMap((o) => [o.noticed, o.question]),
    ...review.strengths.map((s) => s.noticed),
    ...review.reflectionPrompts.map((p) => p.question),
  ]
  const found = new Set<string>()
  for (const t of texts) for (const m of stripQuoted(t).matchAll(VERDICT)) found.add(m[0].toLowerCase())
  return [...found]
}
