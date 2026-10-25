import { z } from "zod"

/** Project brief built with the AI scoping assistant. Every field is optional so the AI can fill it in gradually. */
export const briefSchema = z.object({
  title: z.string().describe("Short, plain-language project title").optional(),
  organization: z.string().describe("Type of organization, e.g. 'tenant advocacy nonprofit'. No personal names.").optional(),
  problem: z.string().describe("What isn't working today and what happens because of it").optional(),
  community: z.string().describe("Who is affected, described as a group. No personal details.").optional(),
  communityShaping: z
    .string()
    .describe(
      "How the people the partner serves will shape the work: who the team can hear from, how (interviews, testing, feedback at Demo Day), with consent, and how they are thanked or paid for their time. Groups, not named individuals."
    )
    .optional(),
  accessibilityNeeds: z.array(z.string()).describe("Access needs the design must meet").optional(),
  goals: z.string().describe("What the partner hopes will change").optional(),
  successMeasures: z.string().describe("How the community and partner will know it worked").optional(),
  constraints: z.string().describe("Timeline, budget, tools, or other constraints").optional(),
  suggestedScope: z.string().describe("A scope a student team can finish in a four-week sprint that ends at Demo Day").optional(),
  skills: z.array(z.string()).describe("Design skills the student team will need").optional(),
  openQuestions: z.array(z.string()).describe("Questions BRIDGEGOOD or the team should still ask").optional(),
})

export type Brief = z.infer<typeof briefSchema>

export const BRIEF_FIELDS: { key: keyof Brief; label: string; list?: boolean; long?: boolean; hint?: string }[] = [
  { key: "title", label: "Project title" },
  { key: "organization", label: "Organization type" },
  { key: "problem", label: "Problem", long: true },
  { key: "community", label: "Community affected", long: true },
  {
    key: "communityShaping",
    label: "How will the people you serve shape this?",
    long: true,
    hint: "For example: who the team can talk to and test with, how you'll ask for their consent, and how they'll be thanked or paid for their time. Describe groups, not individuals.",
  },
  { key: "accessibilityNeeds", label: "Accessibility needs", list: true },
  { key: "goals", label: "Goals", long: true },
  { key: "successMeasures", label: "Success measures", long: true },
  { key: "constraints", label: "Constraints", long: true },
  { key: "suggestedScope", label: "Suggested project scope", long: true },
  { key: "skills", label: "Skills needed", list: true },
  { key: "openQuestions", label: "Open questions", list: true },
]
