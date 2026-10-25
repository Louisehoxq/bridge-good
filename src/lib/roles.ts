/**
 * The public site needs no login. Demo accounts add:
 * - Company host: hosts mentors, sponsors partner projects, brings the approach into its own work, and hosts events.
 * - Chapter lead and community partner: host community events for their chapter (no area of their own).
 * - BRIDGEGOOD steward: reviews Living Playbook contributions and keeps the core philosophy's wording.
 */
export const ROLES = ["company-host", "chapter-lead", "community-partner", "steward"] as const

export type Role = (typeof ROLES)[number]

export const SESSION_COOKIE = "bgx-session"

export type NavItem = { label: string; href: string }

/** A labeled block of sidebar links. The first group (no label) holds the overview. */
export type NavGroup = { label?: string; items: NavItem[] }

export type DemoAccount = { name: string; detail: string }

type RoleInfo = {
  label: string
  plural: string
  summary: string
  home: string
  /** Synthetic demo account used by the "Log in as…" screen. */
  demoAccount: DemoAccount
  /** Roles with a guarded area of their own. Chapter leads and partners only host public events. */
  hasArea: boolean
  sidebar: NavGroup[]
}

export const ROLE_INFO: Record<Role, RoleInfo> = {
  "company-host": {
    label: "Company host",
    plural: "Company hosts",
    summary: "Bring your company in: host mentors, sponsor partner projects, and carry the approach into your own product work.",
    home: "/host",
    demoAccount: { name: "Dana Whitfield", detail: "Company host, design manager at a fintech company (synthetic)" },
    hasArea: true,
    sidebar: [
      { items: [{ label: "Overview", href: "/host" }] },
      {
        label: "Your path",
        items: [
          { label: "Host guide", href: "/host/guide" },
          { label: "Bring it to your workplace", href: "/host/workplace" },
        ],
      },
      {
        label: "Support a chapter",
        items: [
          { label: "Partner projects", href: "/host/projects" },
          { label: "Organization toolkit", href: "/host/toolkit" },
        ],
      },
      { label: "Community", items: [{ label: "Community events", href: "/events" }] },
    ],
  },
  "chapter-lead": {
    label: "Chapter lead",
    plural: "Chapter leads",
    summary: "Run your local chapter's calendar: host critique circles, listening sessions and meetups, then share what you learned.",
    home: "/events",
    demoAccount: { name: "Priya Raman", detail: "Chapter lead, Chicago chapter (synthetic)" },
    hasArea: false,
    sidebar: [],
  },
  "community-partner": {
    label: "Community partner",
    plural: "Community partners",
    summary: "Host listening sessions and site visits with the people you serve, then share what you learned with BRIDGEGOOD.",
    home: "/events",
    demoAccount: { name: "Eastside Tenants Network", detail: "Tenant advocacy nonprofit, Chicago (synthetic)" },
    hasArea: false,
    sidebar: [],
  },
  steward: {
    label: "BRIDGEGOOD steward",
    plural: "BRIDGEGOOD stewards",
    summary: "Review what the community contributes to the Living Playbook, publish it with the right attribution, and keep the core philosophy's wording.",
    home: "/steward",
    demoAccount: { name: "Morgan Ellis", detail: "Program staff, stewards the Living Playbook (synthetic)" },
    hasArea: true,
    sidebar: [
      { items: [{ label: "Review queue", href: "/steward" }] },
      {
        label: "Stewardship",
        items: [
          { label: "Maintenance log", href: "/steward/log" },
          { label: "Recurring themes", href: "/steward/themes" },
        ],
      },
    ],
  },
}

/** The demo session: just the role. */
export type Session = { role: Role }

/** Label and synthetic account for whoever is signed in. */
export function accountFor(session: Session) {
  return { label: ROLE_INFO[session.role].label, ...ROLE_INFO[session.role].demoAccount }
}

/** Site navigation, in the order of the concept's information architecture. */
export const PUBLIC_NAV: NavItem[] = [
  { label: "Welcome", href: "/" },
  { label: "Understand", href: "/understand" },
  { label: "Decision Lab", href: "/lab" },
  { label: "Practice Library", href: "/library" },
  { label: "Living Playbook", href: "/playbook" },
  { label: "Teach & Facilitate", href: "/teach" },
  { label: "About", href: "/about" },
]

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value)
}
