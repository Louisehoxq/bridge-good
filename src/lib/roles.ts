export const ROLES = ["student", "mentor", "ambassador", "partner"] as const

export type Role = (typeof ROLES)[number]

export const SESSION_COOKIE = "bgx-session"

export type NavItem = { label: string; href: string }

type RoleInfo = {
  label: string
  plural: string
  summary: string
  home: string
  /** Their part in the problem → support → design → feedback loop. */
  loopRole: string
  /** Synthetic demo account used by the "Log in as…" screen. */
  demoAccount: { name: string; detail: string }
  sidebar: NavItem[]
}

export const ROLE_INFO: Record<Role, RoleInfo> = {
  student: {
    label: "Student",
    plural: "Students & early-career designers",
    summary: "Learn UI/UX and design thinking on real community problems, and build a portfolio that shows your impact.",
    home: "/student",
    loopRole: "Design with the community and build a portfolio from real work",
    demoAccount: { name: "Ari Santos", detail: "Second-year design student, Oakland" },
    sidebar: [
      { label: "Overview", href: "/student" },
      { label: "Learning modules", href: "/student/learn" },
      { label: "Activities", href: "/student/activities" },
      { label: "Project submissions", href: "/student/submissions" },
      { label: "Reflection companion", href: "/student/reflection" },
      { label: "Community of practice", href: "/student/community" },
      { label: "Office hours", href: "/student/office-hours" },
      { label: "Messages", href: "/student/messages" },
    ],
  },
  mentor: {
    label: "Mentor",
    plural: "Mentors",
    summary: "Guide students with care, review their work against the principles, and share what industry really looks like.",
    home: "/mentor",
    loopRole: "Guide students, give feedback, and model the care the philosophy asks for",
    demoAccount: { name: "Jordan Lee", detail: "Senior product designer, volunteer mentor" },
    sidebar: [
      { label: "Overview", href: "/mentor" },
      { label: "Training", href: "/mentor/training" },
      { label: "Student submissions", href: "/mentor/submissions" },
      { label: "Office hours", href: "/mentor/office-hours" },
      { label: "Messages", href: "/mentor/messages" },
    ],
  },
  ambassador: {
    label: "Ambassador",
    plural: "Ambassadors",
    summary: "Carry the philosophy to your city or organisation, and rally funding, mentors and resources around real problems.",
    home: "/ambassador",
    loopRole: "Bring together the mentors, funding and resources that make the work possible",
    demoAccount: { name: "Priya Raman", detail: "Ambassador, Chicago chapter" },
    sidebar: [
      { label: "Overview", href: "/ambassador" },
      { label: "Training", href: "/ambassador/training" },
      { label: "Partner projects", href: "/ambassador/projects" },
      { label: "Outreach & partner toolkits", href: "/ambassador/toolkits" },
    ],
  },
  partner: {
    label: "Partner",
    plural: "Partners (problem owners)",
    summary: "Non-profits and social organisations share a design problem and work with students and mentors to solve it.",
    home: "/partner",
    loopRole: "Bring the problem and your community's voice, and stay a partner throughout",
    demoAccount: { name: "Eastside Tenants Network", detail: "Tenant advocacy non-profit" },
    sidebar: [
      { label: "Overview", href: "/partner" },
      { label: "Submit a problem", href: "/partner/submit" },
      { label: "Capstone gallery", href: "/partner/gallery" },
      { label: "Toolkit & FAQs", href: "/partner/toolkit" },
      { label: "Funding & legal templates", href: "/partner/legal" },
    ],
  },
}

export const PUBLIC_NAV: NavItem[] = [
  { label: "Welcome", href: "/" },
  { label: "Training", href: "/training" },
  { label: "Find a chapter", href: "/chapters" },
]

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value)
}
