/**
 * Compare Reflection Companion models on the synthetic golden set (docs/gemma-prototype.md, step 7).
 *
 *   node --env-file-if-exists=.env.local --experimental-strip-types --no-warnings \
 *     --import ./src/lib/evaluator/test/register.mjs scripts/compare-evaluators.ts \
 *     [--providers claude,gemma-gateway] [--runs 3] [--only contrast,injection] [--dry-run]
 *
 * It sends the same system prompt, schema and checked messages as /api/reflect, one request at a time.
 * Synthetic inputs only. Raw replies go to .evaluator-runs/ (git-ignored). People still read the replies:
 * these numbers are signals, not a verdict on either model.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { parseArgs } from "node:util"
import { convertToModelMessages, Output, streamText, type UIMessage } from "ai"
import { GOLDENS, type Golden } from "../src/content/evaluator-goldens"
import { scoreReply, SCORE_LABELS, type GoldenScore } from "../src/lib/evaluator/golden-checks"
import { EVALUATOR_PROVIDERS, evaluatorLabel, evaluatorModel, isEvaluatorConfigured, type EvaluatorProvider } from "../src/lib/evaluator/model.server"
import { studentSystemPrompt } from "../src/lib/evaluator/prompts"
import { readReview } from "../src/lib/evaluator/read-review"
import { composeFirstMessage, REFLECT_LIMITS } from "../src/lib/evaluator/request"
import { studentReviewSchema } from "../src/lib/evaluator/schema"
import { checkReflectMessages } from "../src/lib/evaluator/validate"

const { values: args } = parseArgs({
  options: {
    providers: { type: "string", default: EVALUATOR_PROVIDERS.join(",") },
    runs: { type: "string", default: "3" },
    only: { type: "string" },
    "dry-run": { type: "boolean", default: false },
  },
})

const providers = args.providers.split(",").map((p) => p.trim()) as EvaluatorProvider[]
for (const p of providers) {
  if (!(EVALUATOR_PROVIDERS as readonly string[]).includes(p)) throw new Error(`Unknown provider "${p}". Options: ${EVALUATOR_PROVIDERS.join(", ")}.`)
}
const runs = Math.max(1, Number.parseInt(args.runs, 10) || 1)
const only = args.only?.split(",").map((s) => s.trim())
const goldens = only ? GOLDENS.filter((g) => only.includes(g.id)) : GOLDENS
const IMAGES = new URL("../src/content/evaluator-goldens/images/", import.meta.url)

/** The same first message the reflection page sends, then the route's own checks and redaction. */
async function messagesFor(golden: Golden): Promise<UIMessage[]> {
  const parts: UIMessage["parts"] = [
    { type: "text", text: composeFirstMessage({ stage: golden.stage, focus: golden.focus, note: golden.note, imageCount: golden.image ? 1 : 0 }) },
  ]
  if (golden.image) {
    const data = await readFile(new URL(golden.image, IMAGES))
    parts.push({ type: "file", mediaType: "image/png", filename: golden.image, url: `data:image/png;base64,${data.toString("base64")}` })
  }
  const checked = checkReflectMessages([{ id: golden.id, role: "user", parts }])
  if (!checked.ok) throw new Error(`Golden "${golden.id}" fails the route checks: ${checked.error}`)
  return checked.messages
}

type Run = {
  provider: EvaluatorProvider
  model: string
  golden: string
  run: number
  ms: number
  firstTokenMs: number | null
  inputTokens?: number
  outputTokens?: number
  error?: string
  text: string
  score: GoldenScore
}

async function runOnce(provider: EvaluatorProvider, golden: Golden, run: number): Promise<Run> {
  const started = performance.now()
  let firstTokenMs: number | null = null
  let error: string | undefined
  let text = ""
  let usage: { inputTokens?: number; outputTokens?: number } = {}
  try {
    const result = streamText({
      model: evaluatorModel(provider),
      system: studentSystemPrompt(),
      messages: await convertToModelMessages(await messagesFor(golden)),
      output: Output.object({ schema: studentReviewSchema }),
      maxOutputTokens: REFLECT_LIMITS.outputTokens,
      onError: ({ error: e }) => {
        error = e instanceof Error ? e.message : String(e)
      },
    })
    for await (const chunk of result.textStream) {
      firstTokenMs ??= performance.now() - started
      text += chunk
    }
    usage = await result.usage
  } catch (e) {
    error ??= e instanceof Error ? e.message : String(e)
  }
  const review = readReview(text)
  return {
    provider,
    model: evaluatorLabel(provider),
    golden: golden.id,
    run,
    ms: Math.round(performance.now() - started),
    firstTokenMs: firstTokenMs === null ? null : Math.round(firstTokenMs),
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
    error,
    text,
    score: scoreReply(golden, text, review),
  }
}

function summarize(results: Run[]) {
  const keys = Object.keys(SCORE_LABELS) as (keyof GoldenScore)[]
  const byProvider = providers.filter((p) => results.some((r) => r.provider === p))
  const cell = (rs: Run[], key: keyof GoldenScore) => {
    const applicable = rs.map((r) => r.score[key]).filter((v): v is boolean => v !== null)
    if (!applicable.length) return "n/a"
    const passed = applicable.filter(Boolean).length
    return `${passed}/${applicable.length} (${Math.round((passed / applicable.length) * 100)}%)`
  }
  const avg = (ns: (number | null | undefined)[]) => {
    const xs = ns.filter((n): n is number => typeof n === "number")
    return xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length).toLocaleString("en-US") : "n/a"
  }
  const rows = [
    ...keys.map((k) => [SCORE_LABELS[k], ...byProvider.map((p) => cell(results.filter((r) => r.provider === p), k))]),
    ["Errors", ...byProvider.map((p) => String(results.filter((r) => r.provider === p && r.error).length))],
    ["Avg time to first token (ms)", ...byProvider.map((p) => avg(results.filter((r) => r.provider === p).map((r) => r.firstTokenMs)))],
    ["Avg total time (ms)", ...byProvider.map((p) => avg(results.filter((r) => r.provider === p).map((r) => r.ms)))],
    ["Avg output tokens", ...byProvider.map((p) => avg(results.filter((r) => r.provider === p).map((r) => r.outputTokens)))],
  ]
  const header = ["Check", ...byProvider.map((p) => evaluatorLabel(p))]
  return [header, header.map(() => "---"), ...rows].map((r) => `| ${r.join(" | ")} |`).join("\n")
}

if (args["dry-run"]) {
  for (const g of goldens) {
    const [message] = await messagesFor(g)
    const text = message.parts.find((p) => p.type === "text")
    console.log(`ok  ${g.id}: ${g.title}${g.image ? ` (+ ${g.image})` : ""}`)
    if (text?.type === "text" && text.text.includes("removed]")) console.log("    personal details redacted before the model sees them")
  }
  console.log(`\n${goldens.length} synthetic goldens pass the route checks. Providers: ${providers.map((p) => `${p}${isEvaluatorConfigured(p) ? "" : " (not configured)"}`).join(", ")}.`)
  process.exit(0)
}

const ready = providers.filter((p) => {
  if (isEvaluatorConfigured(p)) return true
  console.warn(`Skipping ${p}: not configured. ${p === "gemma-gateway" ? "Set AI_GATEWAY_API_KEY." : "Set ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY."}`)
  return false
})
if (!ready.length) {
  console.error("No provider is configured, so nothing ran. Add keys to .env.local (see docs/gemma-prototype.md).")
  process.exit(1)
}

const results: Run[] = []
for (const provider of ready) {
  for (const golden of goldens) {
    for (let run = 1; run <= runs; run++) {
      const r = await runOnce(provider, golden, run)
      results.push(r)
      const failed = (Object.keys(r.score) as (keyof GoldenScore)[]).filter((k) => r.score[k] === false)
      console.log(`${provider.padEnd(14)} ${golden.id.padEnd(14)} run ${run}  ${r.ms} ms  ${r.error ? `error: ${r.error}` : failed.length ? `missed: ${failed.join(", ")}` : "all checks passed"}`)
    }
  }
}

const dir = new URL("../.evaluator-runs/", import.meta.url)
await mkdir(dir, { recursive: true })
await writeFile(new URL(".gitignore", dir), "*\n")
const file = new URL(`${new Date().toISOString().replace(/[:.]/g, "-")}.json`, dir)
await writeFile(file, JSON.stringify({ runs, goldens: goldens.map((g) => g.id), results }, null, 2))

console.log(`\n${summarize(results)}\n`)
console.log(`Raw replies: ${file.pathname}`)
console.log("Next: have a person read 10 replies per model for tone and groundedness (docs/gemma-prototype.md, step 7).")
