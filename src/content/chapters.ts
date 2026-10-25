/**
 * SYNTHETIC chapters and ambassadors for a PROPOSED chapter model. These are not
 * BRIDGEGOOD chapters. Contacts use the reserved example.org domain.
 */
export type Chapter = {
  id: string
  city: string
  country: string
  region: "North America" | "Europe" | "Asia-Pacific"
  lat: number
  lon: number
  ambassador: string
  /** Kept as `organisation` for compatibility. Values use US spelling. */
  organisation: string
  email: string
  meets: string
  focus: string
  synthetic?: boolean
}

/** Show this label wherever chapters appear. */
export const CHAPTER_MODEL_LABEL = "Proposed chapter model (concept)"

export const CHAPTER_MODEL_NOTE =
  "These chapters are made up to show how a chapter model could work. They are not BRIDGEGOOD chapters. A real chapter would need BRIDGEGOOD's approval and an ambassador BRIDGEGOOD has vetted."

export const CHAPTERS: Chapter[] = [
  { id: "oakland", city: "Oakland", country: "USA", region: "North America", lat: 37.8, lon: -122.3, ambassador: "Rosa Delgado", organisation: "Community design studio", email: "oakland@chapters.example.org", meets: "Every other Thursday", focus: "Food access, housing", synthetic: true },
  { id: "chicago", city: "Chicago", country: "USA", region: "North America", lat: 41.9, lon: -87.6, ambassador: "Priya Raman", organisation: "Fintech company (design team)", email: "chicago@chapters.example.org", meets: "First Saturday of each month", focus: "Tenant rights, digital inclusion", synthetic: true },
  { id: "houston", city: "Houston", country: "USA", region: "North America", lat: 29.8, lon: -95.4, ambassador: "Marcus Bell", organisation: "Health care provider (UX team)", email: "houston@chapters.example.org", meets: "Monthly, in person and online", focus: "Services in many languages", synthetic: true },
  { id: "atlanta", city: "Atlanta", country: "USA", region: "North America", lat: 33.7, lon: -84.4, ambassador: "Keisha Grant", organisation: "University design program", email: "atlanta@chapters.example.org", meets: "Weekly during the semester", focus: "Health equity", synthetic: true },
  { id: "detroit", city: "Detroit", country: "USA", region: "North America", lat: 42.3, lon: -83.0, ambassador: "Tom Nowak", organisation: "Automotive company (accessibility team)", email: "detroit@chapters.example.org", meets: "Monthly", focus: "Returning to work", synthetic: true },
  { id: "new-york", city: "New York", country: "USA", region: "North America", lat: 40.7, lon: -74.0, ambassador: "Aisha Rahman", organisation: "Media company (product design)", email: "nyc@chapters.example.org", meets: "Every other Wednesday", focus: "Civic tech", synthetic: true },
  { id: "toronto", city: "Toronto", country: "Canada", region: "North America", lat: 43.7, lon: -79.4, ambassador: "Daniel Osei", organisation: "Nonprofit tech collective", email: "toronto@chapters.example.org", meets: "Monthly", focus: "Services for newcomers", synthetic: true },
  { id: "london", city: "London", country: "UK", region: "Europe", lat: 51.5, lon: -0.1, ambassador: "Hannah Clarke", organisation: "Government digital service", email: "london@chapters.example.org", meets: "Monthly", focus: "Deaf access, arts", synthetic: true },
  { id: "singapore", city: "Singapore", country: "Singapore", region: "Asia-Pacific", lat: 1.35, lon: 103.8, ambassador: "Wei Ling Tan", organisation: "Bank (inclusive design office)", email: "singapore@chapters.example.org", meets: "Monthly", focus: "Older adults, social services", synthetic: true },
  { id: "melbourne", city: "Melbourne", country: "Australia", region: "Asia-Pacific", lat: -37.8, lon: 145.0, ambassador: "Liam O'Connor", organisation: "Disability-led design agency", email: "melbourne@chapters.example.org", meets: "Every other Tuesday", focus: "Accessible transit", synthetic: true },
]

export const REGIONS = ["North America", "Europe", "Asia-Pacific"] as const
