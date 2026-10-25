/**
 * A cheap personal-data pre-screen for typed text (docs/ai-evaluator.md, section 5). It finds email
 * addresses and phone numbers only. It can't see faces or names in screenshots, so the upload copy
 * still asks people to crop those out, and the model reports `personalDataNoticed`.
 */
const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
// 10 or more digits with the usual separators, e.g. (510) 555-0123, +1 510 555 0123, 510.555.0123.
const PHONE = /(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}\b/g

export type PersonalDataKind = "email" | "phone"

export function findPersonalData(text: string): PersonalDataKind[] {
  const found: PersonalDataKind[] = []
  if (new RegExp(EMAIL).test(text)) found.push("email")
  if (new RegExp(PHONE).test(text)) found.push("phone")
  return found
}

/** Server-side backstop: the model never sees an email address or phone number that slipped through. */
export function redactPersonalData(text: string) {
  return text.replace(EMAIL, "[email removed]").replace(PHONE, "[phone number removed]")
}
