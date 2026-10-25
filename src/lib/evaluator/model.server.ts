import { anthropic } from "@ai-sdk/anthropic"

/**
 * Which model the Reflection Companion runs on, chosen by EVALUATOR_PROVIDER (docs/gemma-prototype.md).
 * Read at request time, so switching needs no rebuild.
 *
 * - unset or "claude": Claude Sonnet 5.5, with a direct Anthropic key if present, otherwise the Vercel AI Gateway.
 * - "gemma-gateway": Gemma 4 (Google, open weights) through the Vercel AI Gateway. EVALUATOR_MODEL can pick the size.
 */
export const EVALUATOR_PROVIDERS = ["claude", "gemma-gateway"] as const
export type EvaluatorProvider = (typeof EVALUATOR_PROVIDERS)[number]

const GEMMA_MODELS: Record<string, string> = {
  "google/gemma-4-31b-it": "Gemma 4 31B",
  "google/gemma-4-26b-a4b-it": "Gemma 4 26B A4B",
}
const DEFAULT_GEMMA = "google/gemma-4-31b-it"

let warned = false

export function evaluatorProvider(): EvaluatorProvider {
  const value = process.env.EVALUATOR_PROVIDER?.trim() || "claude"
  if ((EVALUATOR_PROVIDERS as readonly string[]).includes(value)) return value as EvaluatorProvider
  // A typo shouldn't silently switch models: say so once in the server log and use the default.
  if (!warned) console.warn(`Unknown EVALUATOR_PROVIDER "${value}". Using "claude". Options: ${EVALUATOR_PROVIDERS.join(", ")}.`)
  warned = true
  return "claude"
}

const hasGateway = () => Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN)

/** Whether the companion can run with the chosen provider. Gemma needs the AI Gateway; an Anthropic key alone isn't enough. */
export function isEvaluatorConfigured(provider = evaluatorProvider()) {
  return provider === "gemma-gateway" ? hasGateway() : Boolean(process.env.ANTHROPIC_API_KEY) || hasGateway()
}

function gemmaModelId() {
  return process.env.EVALUATOR_MODEL?.trim() || DEFAULT_GEMMA
}

export function evaluatorModel(provider = evaluatorProvider()) {
  if (provider === "gemma-gateway") return gemmaModelId()
  return process.env.ANTHROPIC_API_KEY ? anthropic("claude-sonnet-5-5") : "anthropic/claude-sonnet-5.5"
}

/** A plain name for "How this was made", so the page always names the model that wrote the review. */
export function evaluatorLabel(provider = evaluatorProvider()) {
  if (provider === "gemma-gateway") {
    const id = gemmaModelId()
    return `${GEMMA_MODELS[id] ?? id} (Google, open weights), through the Vercel AI Gateway`
  }
  return "Claude Sonnet 5.5 (Anthropic)"
}
