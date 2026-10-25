import { anthropic } from "@ai-sdk/anthropic"

/** Sonnet 5.5 for the interactive lenses: a direct Anthropic key if present, otherwise the Vercel AI Gateway. */
export function evaluatorModel() {
  return process.env.ANTHROPIC_API_KEY ? anthropic("claude-sonnet-5-5") : "anthropic/claude-sonnet-5.5"
}
