import { generateText, Output } from "ai"
import { z } from "zod"
import type { Route } from "./+types/api.reflect"
import { scenarioBySlug } from "@/content/lab"
import { evaluatorModel, isEvaluatorConfigured } from "@/lib/model.server"
import { containsContactDetails } from "@/lib/playbook"

const fail = (status: number, error: string) => Response.json({ error }, { status })

const MAX_FIELD = 1500

const requestSchema = z.object({
  scenario: z.string().max(100),
  approach: z.string().max(MAX_FIELD),
  reasoning: z.string().max(MAX_FIELD).default(""),
  answers: z.record(z.string(), z.string().max(MAX_FIELD)).default({}),
})

/** The helper asks questions. It never scores, ranks, or says which approach is right. */
export const helperSchema = z.object({
  noticed: z.string().describe("One sentence reflecting back what the person seems to be weighing, in their own terms. No judgment."),
  questions: z.array(z.string()).min(2).max(4).describe("Open follow-up questions that deepen reflection on assumptions, power, and who is missing."),
  voiceToSeek: z.string().describe("One kind of person or group whose perspective could add most, and why, in one sentence."),
})

const SYSTEM = `You are the BridgeGoodx reflection helper in BRIDGEGOOD's Design Decision Lab.
Someone has worked through a fictional design dilemma and written a reflection. Help them think more deeply.

BRIDGEGOOD's principles, as questions to return to:
1. Start with people, not assumptions. 2. Make room for every voice. 3. Build confidence, not dependency. 4. Learn, adapt, and give back.

Rules:
- Never grade, score, rank, or say an approach is right or wrong. Multiple approaches can be defensible.
- Ask open questions about assumptions, trade-offs, power, who benefits, and who may be excluded.
- Build on what they wrote; don't lecture or repeat the scenario back at length.
- Plain, warm language at about a grade 8 reading level. Short sentences.
- Don't ask for or repeat personal details about real people.
- If the reflection is empty or very thin, ask gentle starter questions.`

/** GET tells the page whether the helper is switched on, without exposing any configuration. */
export function loader() {
  return Response.json({ enabled: isEvaluatorConfigured() })
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") return fail(405, "Use POST.")
  if (!isEvaluatorConfigured()) return fail(503, "The reflection helper isn't switched on. Your own reflection is what matters most.")

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return fail(400, "That request couldn't be read.")
  }
  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) return fail(400, "That reflection couldn't be read. Try shortening it.")
  const { scenario: slug, approach, reasoning, answers } = parsed.data
  const scenario = scenarioBySlug(slug)
  if (!scenario) return fail(400, "That scenario doesn't exist.")
  const text = [approach, reasoning, ...Object.values(answers)].join("\n")
  if (containsContactDetails(text)) return fail(400, "Please remove email addresses and phone numbers first.")

  const prompt = [
    `Scenario: ${scenario.title}. ${scenario.situation}`,
    `Approach they chose: ${approach || "(not given)"}`,
    reasoning && `Their reasoning: ${reasoning}`,
    ...Object.entries(answers)
      .filter(([, v]) => v.trim())
      .map(([k, v]) => `Reflection (${k}): ${v}`),
  ]
    .filter(Boolean)
    .join("\n")

  try {
    const { output } = await generateText({
      model: evaluatorModel(),
      system: SYSTEM,
      prompt,
      output: Output.object({ schema: helperSchema }),
      maxOutputTokens: 800,
    })
    return Response.json(output)
  } catch {
    return fail(502, "The helper couldn't reply just now. Try again in a moment.")
  }
}
