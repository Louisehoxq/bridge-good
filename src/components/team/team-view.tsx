import { TeamPath } from "@/components/studio/path"
import { PeopleChip } from "@/components/studio/people-chip"
import type { StudioRole } from "@/components/studio/role-badge"
import { DEMO_MENTOR, DEMO_STUDENT } from "@/content/seed"
import { PARTNER_PROBLEM_ID, type TeamMatch } from "@/content/journey"
import { PROBLEMS } from "@/content/problems"
import { ROLE_INFO } from "@/lib/roles"

export type TeamMember = { name: string; role: StudioRole; detail?: string; you?: boolean }

export const CHAPTER_LEAD = ROLE_INFO.ambassador.demoAccount.name
export const PARTNER_NAME = ROLE_INFO.partner.demoAccount.name

/**
 * A real team, joined by the gold path: the people who work together on one project or one mentoring
 * relationship. Every person here is synthetic, and the path is decorative (each chip has its own label).
 */
export function TeamView({ label, members }: { label: string; members: TeamMember[] }) {
  return (
    <TeamPath label={label}>
      {members.map((m) => (
        <li key={`${m.role}-${m.name}`}>
          <PeopleChip name={m.name} role={m.role} detail={m.detail} you={m.you} stacked />
        </li>
      ))}
    </TeamPath>
  )
}

/**
 * The people on a matched partner project, in the order the work flows: partner, apprentices, mentor,
 * chapter lead. Only the demo partner's own project has a named partner; other organizations show by type.
 */
export function teamFor(match: TeamMatch, you?: string): TeamMember[] {
  const partner = PROBLEMS.find((p) => p.id === match.problemId)
  const partnerName = match.problemId === PARTNER_PROBLEM_ID ? PARTNER_NAME : (partner?.organisationType ?? "Community partner")
  return [
    { name: partnerName, role: "community-partner", you: you === partnerName },
    ...match.apprentices.map((name) => ({ name, role: "apprentice" as const, you: you === name })),
    { name: match.mentorName, role: "mentor", you: you === match.mentorName },
    { name: CHAPTER_LEAD, role: "chapter-lead", you: you === CHAPTER_LEAD },
  ]
}

/** The demo apprentice's mentoring relationship, before or alongside a project team. */
export function mentoringPair(you: "apprentice" | "mentor"): TeamMember[] {
  return [
    { name: DEMO_STUDENT, role: "apprentice", you: you === "apprentice" },
    { name: DEMO_MENTOR, role: "mentor", detail: "alum", you: you === "mentor" },
    { name: CHAPTER_LEAD, role: "chapter-lead" },
  ]
}
