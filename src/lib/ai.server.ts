import { anthropic } from "@ai-sdk/anthropic"

/** Whether the partner AI assistant can run. Read at request time, so adding a key needs no rebuild. */
export function isAiConfigured() {
  // On Vercel the AI Gateway authenticates with the project's OIDC token; locally use an API key.
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN)
}

/** Direct Anthropic key if present, otherwise the Vercel AI Gateway. */
export function scopingModel() {
  return process.env.ANTHROPIC_API_KEY ? anthropic("claude-sonnet-5-5") : "anthropic/claude-sonnet-5.5"
}
