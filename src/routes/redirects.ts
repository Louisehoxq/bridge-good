/** Old URL → new URL. `/training/:audience` maps to the matching library track. Used by routes.ts and legacy-redirect.ts. */
export const REDIRECTS: Record<string, string> = {
  "/students": "/student",
  "/ambassadors": "/ambassador",
  "/problem-owners": "/partner",
  "/training": "/learn",
  "/training/student": "/learn/tracks/apprentices",
  "/training/mentor": "/learn/tracks/mentors",
  "/training/ambassador": "/learn/tracks/ambassadors",
  "/training/company": "/learn/tracks/company-hosts",
  "/student/learn": "/student",
  "/student/path": "/student",
  "/student/activities": "/student/practice",
  "/student/messages": "/student/mentor",
  "/student/office-hours": "/student/mentor",
  "/mentor/training": "/mentor/prepare",
  "/mentor/messages": "/mentor/mentee",
  "/mentor/submissions": "/mentor/conversations",
  "/mentor/office-hours": "/mentor/mentee",
  "/ambassador/training": "/ambassador/playbook",
  "/partner/legal": "/partner/toolkit#legal",
}

export const REDIRECT_PATHS = [
  ...Object.keys(REDIRECTS)
    .filter((p) => !p.startsWith("/training/"))
    .map((p) => p.slice(1)),
  "training/*",
]
