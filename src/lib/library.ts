import { AMBASSADOR_VETTING, AI_SOCIAL_GOOD_GUIDE, MENTOR_COMMITMENT, MOCK_CASE_GUIDE, REAL_CASE_GUIDE } from "@/content/guides"
import { SELF_CHECK } from "@/content/eligibility"
import { PILLARS } from "@/content/framework"
import { TRAINING, type Audience } from "@/content/training"

/**
 * The public library at /learn: one stable URL per page, in one reading order.
 * Role areas link into these pages instead of repeating them.
 */
export const LIBRARY_SECTIONS = [
  { id: "framework", label: "The framework" },
  { id: "tracks", label: "Role tracks" },
  { id: "guides", label: "Guides" },
  { id: "joining", label: "Joining" },
] as const

export type LibrarySectionId = (typeof LIBRARY_SECTIONS)[number]["id"]

export type LibraryEntry = { href: string; title: string; section: LibrarySectionId; summary: string }

/** Role tracks: URL slug → training audience. Labels say "apprentice" and "company host", as BRIDGEGOOD does. */
export const TRACKS: { slug: string; audience: Audience; title: string }[] = [
  { slug: "apprentices", audience: "student", title: "For apprentices" },
  { slug: "mentors", audience: "mentor", title: "For mentors" },
  { slug: "ambassadors", audience: "ambassador", title: "For chapter leads" },
  { slug: "company-hosts", audience: "company", title: "For company hosts" },
]

export const GUIDE_SLUGS = [
  "mock-case",
  "real-case",
  "ai-and-social-good",
  "mentor-commitment",
  "ambassador-vetting",
  "adapt-locally",
  "inclusive-language",
] as const

export type GuideSlug = (typeof GUIDE_SLUGS)[number]

export const GUIDE_TITLES: Record<GuideSlug, { title: string; summary: string }> = {
  "mock-case": { title: MOCK_CASE_GUIDE.title, summary: MOCK_CASE_GUIDE.summary },
  "real-case": { title: REAL_CASE_GUIDE.title, summary: REAL_CASE_GUIDE.summary },
  "ai-and-social-good": { title: AI_SOCIAL_GOOD_GUIDE.title, summary: AI_SOCIAL_GOOD_GUIDE.summary },
  "mentor-commitment": {
    title: MENTOR_COMMITMENT.title,
    summary: "What a mentor commits to, why each commitment matters, and what BRIDGEGOOD offers in return.",
  },
  "ambassador-vetting": { title: AMBASSADOR_VETTING.title, summary: AMBASSADOR_VETTING.howItWorks },
  "adapt-locally": {
    title: "Adapt, don't copy",
    summary: "What every chapter keeps the same, what it adapts for its community, and how changes go back to BRIDGEGOOD.",
  },
  "inclusive-language": {
    title: "Inclusive language guide",
    summary: "How we write: reading level, spelling, pronouns, disability language, and words to avoid.",
  },
}

export const LIBRARY: LibraryEntry[] = [
  ...PILLARS.map((p) => ({
    href: `/learn/pillars/${p.id}`,
    title: `${p.number}. ${p.name}`,
    section: "framework" as const,
    summary: p.learningOutcome,
  })),
  {
    href: "/learn/prompts",
    title: "The 12 reflection prompts",
    section: "framework",
    summary: "Questions to ask at the moments decisions get made. Answered in your own words, never scored.",
  },
  ...TRACKS.map((t) => ({ href: `/learn/tracks/${t.slug}`, title: t.title, section: "tracks" as const, summary: TRAINING[t.audience].tagline })),
  ...GUIDE_SLUGS.map((g) => ({ href: `/learn/guides/${g}`, title: GUIDE_TITLES[g].title, section: "guides" as const, summary: GUIDE_TITLES[g].summary })),
  { href: "/learn/self-check", title: SELF_CHECK.title, section: "joining", summary: SELF_CHECK.intro },
]

export function libraryEntry(href: string) {
  return LIBRARY.find((e) => e.href === href)
}

/** The page before and after this one in reading order. The last page leads back to the library. */
export function libraryNeighbors(href: string) {
  const i = LIBRARY.findIndex((e) => e.href === href)
  return {
    previous: i > 0 ? LIBRARY[i - 1] : undefined,
    next: i >= 0 && i < LIBRARY.length - 1 ? LIBRARY[i + 1] : undefined,
  }
}

export function sectionLabel(id: LibrarySectionId) {
  return LIBRARY_SECTIONS.find((s) => s.id === id)!.label
}
