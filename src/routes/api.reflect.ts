import { convertToModelMessages, createUIMessageStreamResponse, Output, safeValidateUIMessages, streamText, toUIMessageStream, type UIMessage } from "ai"
import type { Route } from "./+types/api.reflect"
import { evaluatorModel, isEvaluatorConfigured } from "@/lib/evaluator/model.server"
import { studentSystemPrompt } from "@/lib/evaluator/prompts"
import { REFLECT_LIMITS } from "@/lib/evaluator/request"
import { studentReviewSchema } from "@/lib/evaluator/schema"
import { checkReflectMessages } from "@/lib/evaluator/validate"
import { getSessionRole } from "@/lib/session.server"

const fail = (status: number, error: string) => Response.json({ error }, { status })

/** GET tells the page whether the companion is switched on, without exposing any configuration. */
export function loader() {
  return Response.json({ enabled: isEvaluatorConfigured() })
}

/** The AI Reflection Companion (student lens of the evaluator in docs/ai-evaluator.md). */
export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") return fail(405, "Use POST.")
  if ((await getSessionRole(request)) !== "student") return fail(401, "Log in as a student to use the Reflection Companion.")
  if (!isEvaluatorConfigured()) return fail(503, "The Reflection Companion isn't switched on. You can still answer the questions yourself.")

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return fail(400, "That request couldn't be read.")
  }
  const validated = await safeValidateUIMessages<UIMessage>({ messages: (body as { messages?: unknown })?.messages })
  if (!validated.success) return fail(400, "That conversation couldn't be read. Start a new reflection and try again.")

  const checked = checkReflectMessages(validated.data)
  if (!checked.ok) return fail(checked.status, checked.error)

  const result = streamText({
    model: evaluatorModel(),
    system: studentSystemPrompt(),
    messages: await convertToModelMessages(checked.messages),
    output: Output.object({ schema: studentReviewSchema }),
    maxOutputTokens: REFLECT_LIMITS.outputTokens,
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: () => "The companion couldn't finish its reply. Try again in a moment.",
    }),
  })
}
