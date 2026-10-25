import { anthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI, google } from "@ai-sdk/google"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"

/**
 * Which model the Reflection Companion runs on, chosen by EVALUATOR_PROVIDER (docs/gemma-prototype.md).
 * Read at request time, so switching needs no code change: change the variable and redeploy.
 *
 * - unset or "claude": Claude Sonnet 5.5, with a direct Anthropic key if present, otherwise the Vercel AI Gateway.
 * - "gemma-google": Gemma 4 through the Google AI Studio free tier (GOOGLE_GENERATIVE_AI_API_KEY).
 * - "gemma-openrouter": Gemma 4 through OpenRouter (OPENROUTER_API_KEY). The ":free" model is the default; set
 *   EVALUATOR_MODEL=google/gemma-4-31b-it for the paid one when the free limits run out.
 * - "gemma-gateway": Gemma 4 through the Vercel AI Gateway (AI_GATEWAY_API_KEY, billed per token).
 * - "gemma-local": Gemma 4 on an OpenAI-compatible server you run (Ollama, vLLM): EVALUATOR_BASE_URL.
 *
 * EVALUATOR_MODEL overrides the model ID for any Gemma provider.
 *
 * Free tiers (Google AI Studio, OpenRouter ":free" models) may use what's sent to improve the host's products, so
 * they stay off unless whoever deploys sets EVALUATOR_FREE_TIER=synthetic-only, and the page then says so.
 */
export const EVALUATOR_PROVIDERS = ["claude", "gemma-google", "gemma-openrouter", "gemma-gateway", "gemma-local"] as const
export type EvaluatorProvider = (typeof EVALUATOR_PROVIDERS)[number]
type GemmaProvider = Exclude<EvaluatorProvider, "claude">

const DEFAULT_MODEL: Record<GemmaProvider, string> = {
  "gemma-google": "gemma-4-31b-it",
  "gemma-openrouter": "google/gemma-4-31b-it:free",
  "gemma-gateway": "google/gemma-4-31b-it",
  "gemma-local": "gemma4:12b",
}

const HOST: Record<GemmaProvider, string> = {
  "gemma-google": "Google AI Studio",
  "gemma-openrouter": "OpenRouter",
  "gemma-gateway": "the Vercel AI Gateway",
  "gemma-local": "a model server you run",
}

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

/** Whether the provider is a free tier whose host may use what's sent to improve its products. */
export function isFreeTier(provider = evaluatorProvider()) {
  if (provider === "gemma-google") return true
  if (provider === "gemma-openrouter") return gemmaModelId(provider).endsWith(":free")
  return false
}

/** Free tiers only run when whoever deploys says every input is synthetic, never real apprentice work. */
const freeTierAllowed = () => process.env.EVALUATOR_FREE_TIER?.trim() === "synthetic-only"
const FREE_TIER_FLAG = "EVALUATOR_FREE_TIER=synthetic-only"

/** The environment variable a provider needs, for the "not configured" message. */
export function evaluatorNeeds(provider: EvaluatorProvider) {
  switch (provider) {
    case "gemma-google":
      return `GOOGLE_GENERATIVE_AI_API_KEY and ${FREE_TIER_FLAG}`
    case "gemma-openrouter":
      return isFreeTier(provider) ? `OPENROUTER_API_KEY and ${FREE_TIER_FLAG}` : "OPENROUTER_API_KEY"
    case "gemma-gateway":
      return "AI_GATEWAY_API_KEY"
    case "gemma-local":
      return "EVALUATOR_BASE_URL"
    default:
      return "ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY"
  }
}

/** Whether the companion can run with the chosen provider. An Anthropic key alone isn't enough for Gemma. */
export function isEvaluatorConfigured(provider = evaluatorProvider()) {
  switch (provider) {
    case "gemma-google":
      return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY) && freeTierAllowed()
    case "gemma-openrouter":
      return Boolean(process.env.OPENROUTER_API_KEY) && (!isFreeTier(provider) || freeTierAllowed())
    case "gemma-gateway":
      return hasGateway()
    case "gemma-local":
      return Boolean(process.env.EVALUATOR_BASE_URL?.trim())
    default:
      return Boolean(process.env.ANTHROPIC_API_KEY) || hasGateway()
  }
}

function gemmaModelId(provider: GemmaProvider) {
  return process.env.EVALUATOR_MODEL?.trim() || DEFAULT_MODEL[provider]
}

/** Options for tests: `fetch` replaces the network, so a test can check each provider's request and reply offline. */
type ModelOptions = { fetch?: typeof globalThis.fetch }

export function evaluatorModel(provider = evaluatorProvider(), { fetch }: ModelOptions = {}) {
  if (provider === "claude") return process.env.ANTHROPIC_API_KEY ? anthropic("claude-sonnet-5-5") : "anthropic/claude-sonnet-5.5"
  const id = gemmaModelId(provider)
  if (provider === "gemma-gateway") return id
  if (provider === "gemma-google") return (fetch ? createGoogleGenerativeAI({ fetch }) : google)(id)
  const compatible =
    provider === "gemma-openrouter"
      ? createOpenAICompatible({ name: "openrouter", baseURL: "https://openrouter.ai/api/v1", apiKey: process.env.OPENROUTER_API_KEY, supportsStructuredOutputs: true, fetch })
      : createOpenAICompatible({ name: "gemma-local", baseURL: process.env.EVALUATOR_BASE_URL?.trim() ?? "", apiKey: process.env.EVALUATOR_API_KEY, supportsStructuredOutputs: true, fetch })
  return compatible(id)
}

/** A readable size from a Gemma 4 model ID, e.g. "gemma-4-26b-a4b-it" -> "Gemma 4 26B A4B". Null for any other model. */
function gemmaName(id: string) {
  const m = /gemma[-:]?4[-:]?(e?\d+b)(?:-(a\d+b))?/i.exec(id)
  if (!m) return null
  return ["Gemma 4", m[1].toUpperCase(), m[2]?.toUpperCase()].filter(Boolean).join(" ")
}

/**
 * A plain name for "How this was made", so the page always names the model that wrote the review. Only a Gemma
 * model ID is credited to Google; any other EVALUATOR_MODEL is named by its ID.
 */
export function evaluatorLabel(provider = evaluatorProvider()) {
  if (provider === "claude") return "Claude Sonnet 5.5 (Anthropic)"
  const id = gemmaModelId(provider)
  const name = gemmaName(id)
  return `${name ? `${name} (Google, open weights)` : id}, through ${HOST[provider]}${isFreeTier(provider) ? "'s free tier" : ""}`
}

/** What the page tells the apprentice before they send anything, when a free tier is running. */
export function evaluatorFreeTierNotice(provider = evaluatorProvider()) {
  if (!isFreeTier(provider)) return null
  return `This demo runs on ${HOST[provider as GemmaProvider]}'s free tier, which may use what you send to improve its products. Use synthetic examples only: never real work, screenshots of real people, or anyone's details.`
}
