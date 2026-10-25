/**
 * SYNTHETIC problem statements for the prototype. None of these organisations
 * or projects are real. Replace with consented submissions before any real use.
 */
export type ProblemStatus = "needs-sponsor" | "open-for-students" | "in-progress" | "completed"

export type Problem = {
  id: string
  title: string
  organisationType: string
  location: string
  community: string
  summary: string
  skills: string[]
  accessibilityFocus?: string
  status: ProblemStatus
  /** For completed capstones shown in the gallery. */
  outcome?: string
  team?: string
}

export const STATUS_LABEL: Record<ProblemStatus, string> = {
  "needs-sponsor": "Needs an ambassador sponsor",
  "open-for-students": "Open for students",
  "in-progress": "In progress",
  completed: "Completed capstone",
}

export const PROBLEMS: Problem[] = [
  {
    id: "food-pantry-booking",
    title: "Booking a food pantry visit without a smartphone",
    organisationType: "Neighbourhood food pantry",
    location: "Oakland, CA",
    community: "Older adults and families with limited internet access",
    summary:
      "Visitors queue for hours because there's no simple way to reserve a pickup time. A text-message or phone-based booking flow could save time and protect dignity.",
    skills: ["Service design", "SMS / voice UX", "User research"],
    accessibilityFocus: "Works without a smartphone or data plan",
    status: "open-for-students",
  },
  {
    id: "youth-sports-signup",
    title: "Multilingual sign-up for a youth sports league",
    organisationType: "Volunteer-run youth sports league",
    location: "Houston, TX",
    community: "Spanish- and Vietnamese-speaking parents",
    summary:
      "Registration is a paper form in English only. Parents need a mobile-friendly sign-up they can complete in their own language.",
    skills: ["UI design", "Content design", "Localisation"],
    accessibilityFocus: "Plain language in three languages",
    status: "needs-sponsor",
  },
  {
    id: "tenant-rights-site",
    title: "A tenant-rights website people can actually find answers on",
    organisationType: "Tenant advocacy non-profit",
    location: "Chicago, IL",
    community: "Renters facing eviction",
    summary:
      "The current site has 60+ PDFs. Renters in crisis need to find the right next step in minutes, on a phone.",
    skills: ["Information architecture", "UX writing", "Web design"],
    accessibilityFocus: "Screen-reader friendly and low-bandwidth",
    status: "open-for-students",
  },
  {
    id: "deaf-arts-access",
    title: "Making arts events accessible to Deaf audiences",
    organisationType: "Community arts collective",
    location: "London, UK",
    community: "Deaf and hard-of-hearing residents",
    summary:
      "Event listings don't say which shows have BSL interpretation or captions, so people stop checking. The collective wants a better listings experience co-designed with Deaf residents.",
    skills: ["Co-design", "Accessibility", "Visual design"],
    accessibilityFocus: "Co-designed with Deaf community members",
    status: "needs-sponsor",
  },
  {
    id: "clinic-intake",
    title: "A calmer intake process for a free health clinic",
    organisationType: "Free community health clinic",
    location: "Atlanta, GA",
    community: "Uninsured patients, many visiting for the first time",
    summary:
      "First-time patients describe intake as confusing and stressful. The clinic wants a clearer journey from arrival to appointment.",
    skills: ["Journey mapping", "Service design", "Signage"],
    status: "in-progress",
  },
  {
    id: "library-digital-skills",
    title: "Finding free digital skills classes at the library",
    organisationType: "Public library foundation",
    location: "Detroit, MI",
    community: "Adults returning to work",
    summary: "Classes were listed in a 20-page PDF. The team co-designed a simple class finder with library patrons.",
    skills: ["Co-design", "Information architecture", "Web design"],
    accessibilityFocus: "Large text mode and plain language",
    status: "completed",
    outcome: "Patrons in testing found a suitable class in under a minute, down from several minutes with the PDF.",
    team: "4 students, 2 mentors, 1 ambassador",
  },
  {
    id: "refugee-welcome-kit",
    title: "A welcome guide for newly arrived refugee families",
    organisationType: "Refugee resettlement non-profit",
    location: "Toronto, Canada",
    community: "Newly arrived families speaking Dari, Arabic and Tigrinya",
    summary: "An illustrated, multilingual guide to the first two weeks, co-created with families who had arrived the year before.",
    skills: ["Illustration", "Content design", "Localisation"],
    accessibilityFocus: "Picture-led content for low literacy",
    status: "completed",
    outcome: "Caseworkers reported fewer repeated questions in the first week, and families asked for a printed version.",
    team: "5 students, 2 mentors",
  },
  {
    id: "wheelchair-transit-map",
    title: "Step-free routes for a community transit map",
    organisationType: "Disability rights collective",
    location: "Melbourne, Australia",
    community: "Wheelchair users and parents with prams",
    summary: "Mapped step-free routes with wheelchair users and designed a printable and web map that shows lifts, ramps and outages.",
    skills: ["Research", "Cartography", "Accessibility"],
    accessibilityFocus: "Designed with and tested by wheelchair users",
    status: "completed",
    outcome: "The collective now updates the map monthly with volunteers.",
    team: "3 students, 1 mentor, 1 ambassador",
  },
]
