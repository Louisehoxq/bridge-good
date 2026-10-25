import type { UIMessage } from "ai"
import { redactPersonalData } from "./privacy"
import { REFLECT_LIMITS as L } from "./request"

export type CheckResult = { ok: true; messages: UIMessage[] } | { ok: false; status: number; error: string }

const fail = (status: number, error: string): CheckResult => ({ ok: false, status, error })

/**
 * Checks a conversation that has already passed `safeValidateUIMessages`, and returns it with
 * emails and phone numbers removed from the apprentice's text. Only the browser's own turns and the
 * companion's replies are accepted, so a client can't inject system instructions.
 */
export function checkReflectMessages(messages: UIMessage[]): CheckResult {
  if (messages.length === 0) return fail(400, "Describe your project first.")
  if (messages.length > L.messages) return fail(413, "This conversation is long. Save what you want to keep, then start a new reflection.")
  if (messages.at(-1)?.role !== "user") return fail(400, "The last message should be yours.")

  let images = 0
  const cleaned: UIMessage[] = []
  for (const message of messages) {
    if (message.role !== "user" && message.role !== "assistant") return fail(400, "Unexpected message role.")
    const textLimit = message.role === "user" ? L.userText : L.assistantText
    const parts: UIMessage["parts"] = []
    for (const part of message.parts) {
      if (part.type === "step-start") {
        parts.push(part)
      } else if (part.type === "text") {
        if (part.text.length > textLimit) return fail(413, `Please keep your note under ${L.note.toLocaleString("en-US")} characters.`)
        parts.push(message.role === "user" ? { ...part, text: redactPersonalData(part.text) } : part)
      } else if (part.type === "file") {
        if (message.role !== "user" || !(L.imageTypes as readonly string[]).includes(part.mediaType)) {
          return fail(415, "Screenshots must be PNG, JPEG or WebP images.")
        }
        images++
        parts.push(part)
      } else {
        // No tools, data parts or reasoning in this conversation.
        return fail(400, "That conversation couldn't be read. Start a new reflection and try again.")
      }
    }
    cleaned.push({ ...message, parts })
  }
  if (images > L.images) return fail(413, `Share up to ${L.images} screenshots per reflection.`)
  return { ok: true, messages: cleaned }
}
