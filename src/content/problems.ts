/**
 * SYNTHETIC problem statements for the prototype. None of these organizations
 * or projects are real, and the outcomes are made up to show what a team might
 * report. Replace with consented submissions before any real use.
 */
export type ProblemStatus = "needs-sponsor" | "open-for-students" | "in-progress" | "completed"

export type Problem = {
  id: string
  title: string
  /** Kept as `organisationType` for compatibility. Values use US spelling. */
  organisationType: string
  location: string
  community: string
  summary: string
  skills: string[]
  accessibilityFocus?: string
  status: ProblemStatus
  /** For completed projects shown in the gallery. Made up, never a verified result. */
  outcome?: string
  team?: string
  synthetic?: boolean
}

export const STATUS_LABEL: Record<ProblemStatus, string> = {
  "needs-sponsor": "Needs an ambassador sponsor",
  "open-for-students": "Open for students",
  "in-progress": "In progress",
  completed: "Completed project",
}

/** Use this instead of "Outcome:" so made-up results never read as fact. */
export const OUTCOME_LABEL = "Example outcome (synthetic)"

export const PROBLEMS: Problem[] = [
  {
    id: "food-pantry-booking",
    title: "Booking a food pantry visit without a smartphone",
    organisationType: "Neighborhood food pantry",
    location: "Oakland, CA",
    community: "Older adults and families with limited internet access",
    summary:
      "Visitors wait in line for hours because there's no simple way to reserve a pickup time. Booking by text message or phone call could save time and protect dignity.",
    skills: ["Service design", "SMS and voice UX", "User research"],
    accessibilityFocus: "Works without a smartphone or data plan",
    status: "open-for-students",
    synthetic: true,
  },
  {
    id: "youth-sports-signup",
    title: "Sign-up in three languages for a youth sports league",
    organisationType: "Volunteer-run youth sports league",
    location: "Houston, TX",
    community: "Parents who speak Spanish or Vietnamese",
    summary:
      "Registration is a paper form in English only. Parents need a sign-up they can finish on a phone, in their own language.",
    skills: ["UI design", "Content design", "Localization"],
    accessibilityFocus: "Plain language in English, Spanish and Vietnamese",
    status: "needs-sponsor",
    synthetic: true,
  },
  {
    id: "tenant-rights-site",
    title: "A tenant-rights website people can actually find answers on",
    organisationType: "Tenant advocacy nonprofit",
    location: "Chicago, IL",
    community: "Renters facing eviction",
    summary:
      "The current site has more than 60 PDFs. Renters in crisis need to find the right next step in minutes, on a phone.",
    skills: ["Information architecture", "UX writing", "Web design"],
    accessibilityFocus: "Works with a screen reader and on a slow connection",
    status: "open-for-students",
    synthetic: true,
  },
  {
    id: "deaf-arts-access",
    title: "Making arts events accessible to Deaf audiences",
    organisationType: "Community arts collective",
    location: "London, UK",
    community: "Deaf and hard-of-hearing residents",
    summary:
      "Event listings don't say which shows have British Sign Language (BSL) interpreters or captions, so people stop checking. The collective wants better listings, designed together with Deaf residents.",
    skills: ["Co-design", "Accessibility", "Visual design"],
    accessibilityFocus: "Designed with Deaf community members",
    status: "needs-sponsor",
    synthetic: true,
  },
  {
    id: "clinic-intake",
    title: "A calmer check-in process for a free health clinic",
    organisationType: "Free community health clinic",
    location: "Atlanta, GA",
    community: "Patients without health insurance, many visiting for the first time",
    summary:
      "First-time patients describe check-in as confusing and stressful. The clinic wants a clearer path from arriving at the door to seeing a doctor.",
    skills: ["Journey mapping", "Service design", "Signage"],
    status: "in-progress",
    synthetic: true,
  },
  {
    id: "library-digital-skills",
    title: "Finding free digital skills classes at the library",
    organisationType: "Public library foundation",
    location: "Detroit, MI",
    community: "Adults returning to work",
    summary: "Classes were listed in a 20-page PDF. The team designed a simple class finder together with library patrons.",
    skills: ["Co-design", "Information architecture", "Web design"],
    accessibilityFocus: "Large text mode and plain language",
    status: "completed",
    outcome:
      "In this made-up example, patrons in testing found a class that suited them in under a minute. With the PDF it took several minutes.",
    team: "4 students, 2 mentors, 1 ambassador",
    synthetic: true,
  },
  {
    id: "refugee-welcome-kit",
    title: "A welcome guide for newly arrived refugee families",
    organisationType: "Refugee resettlement nonprofit",
    location: "Toronto, Canada",
    community: "Newly arrived families who speak Dari, Arabic or Tigrinya",
    summary:
      "An illustrated guide to the first two weeks, in three languages, made together with families who had arrived the year before.",
    skills: ["Illustration", "Content design", "Localization"],
    accessibilityFocus: "Picture-led pages for families who prefer images to text",
    status: "completed",
    outcome:
      "In this made-up example, caseworkers said families asked fewer repeat questions in the first week, and families asked for a printed copy.",
    team: "5 students, 2 mentors",
    synthetic: true,
  },
  {
    id: "wheelchair-transit-map",
    title: "Step-free routes for a community transit map",
    organisationType: "Disability rights collective",
    location: "Melbourne, Australia",
    community: "Wheelchair users and parents with strollers",
    summary:
      "The team mapped step-free routes with wheelchair users and designed a printable map and a web map that show elevators, ramps and outages.",
    skills: ["Research", "Map design", "Accessibility"],
    accessibilityFocus: "Designed with and tested by wheelchair users",
    status: "completed",
    outcome: "In this made-up example, the collective keeps the map up to date each month with volunteers.",
    team: "3 students, 1 mentor, 1 ambassador",
    synthetic: true,
  },
]
