/**
 * SYNTHETIC chapters for a PROPOSED chapter model. These are not BRIDGEGOOD chapters, and the people, companies and
 * partners in them are made up. Locations are a city's center only, never an address. Contacts are a shared chapter
 * inbox on the reserved example.org domain, never a personal address.
 */
export const REGIONS = ["US West", "US Midwest", "US South", "US Northeast", "Americas, outside the US", "Europe", "Asia-Pacific"] as const
export type Region = (typeof REGIONS)[number]

export const FOCUS_AREAS = [
  "Food access",
  "Housing",
  "Digital inclusion",
  "Health equity",
  "Language access",
  "Disability access",
  "Work and careers",
  "Civic services",
  "Older adults",
  "Transit and climate",
] as const
export type FocusArea = (typeof FOCUS_AREAS)[number]

export type Chapter = {
  id: string
  city: string
  country: string
  region: Region
  /** The city's center, rounded. Never a street address. */
  lat: number
  lon: number
  /** IANA time zone, for event times. */
  timeZone: string
  /** The chapter lead (an ambassador). */
  lead: string
  /** Where the chapter lead works, described, not named. */
  leadOrg: string
  focus: FocusArea[]
  meets: string
  members: number
  /** Companies that host sessions or give designers' time, described, not named. */
  companyHosts: string[]
  /** Organizations that bring problems to the chapter. */
  communityPartners: string[]
  /** A shared chapter inbox, read by the chapter lead and BRIDGEGOOD. */
  inbox: string
  synthetic: true
}

/** Show this label wherever chapters appear. */
export const CHAPTER_MODEL_LABEL = "Proposed chapter model (concept)"

export const CHAPTER_MODEL_NOTE =
  "These chapters are made up to show how a chapter model could work. They are not BRIDGEGOOD chapters. A real chapter would need BRIDGEGOOD's approval and an ambassador BRIDGEGOOD has vetted."

const inbox = (id: string) => `${id}@chapters.example.org`

export const CHAPTERS: Chapter[] = [
  {
    id: "oakland",
    city: "Oakland",
    country: "USA",
    region: "US West",
    lat: 37.8,
    lon: -122.27,
    timeZone: "America/Los_Angeles",
    lead: "Rosa Delgado",
    leadOrg: "Community design studio",
    focus: ["Food access", "Housing"],
    meets: "Every other Thursday",
    members: 34,
    companyHosts: ["A cloud software company's design team", "A public radio station's digital team"],
    communityPartners: ["A neighborhood food co-op", "A youth housing nonprofit"],
    inbox: inbox("oakland"),
    synthetic: true,
  },
  {
    id: "seattle",
    city: "Seattle",
    country: "USA",
    region: "US West",
    lat: 47.61,
    lon: -122.33,
    timeZone: "America/Los_Angeles",
    lead: "Mai Nguyen",
    leadOrg: "Online retailer (accessibility team)",
    focus: ["Language access", "Digital inclusion"],
    meets: "Monthly, online first",
    members: 27,
    companyHosts: ["An online retailer's accessibility team"],
    communityPartners: ["A refugee resettlement agency", "A public library's digital skills program"],
    inbox: inbox("seattle"),
    synthetic: true,
  },
  {
    id: "los-angeles",
    city: "Los Angeles",
    country: "USA",
    region: "US West",
    lat: 34.05,
    lon: -118.24,
    timeZone: "America/Los_Angeles",
    lead: "Andrés Morales",
    leadOrg: "Streaming company (product design)",
    focus: ["Work and careers", "Transit and climate"],
    meets: "First Wednesday of each month",
    members: 41,
    companyHosts: ["A streaming company's product design team", "A game studio's UX research team"],
    communityPartners: ["A workforce training nonprofit", "A bus riders' union"],
    inbox: inbox("los-angeles"),
    synthetic: true,
  },
  {
    id: "chicago",
    city: "Chicago",
    country: "USA",
    region: "US Midwest",
    lat: 41.88,
    lon: -87.63,
    timeZone: "America/Chicago",
    lead: "Priya Raman",
    leadOrg: "Fintech company (design team)",
    focus: ["Housing", "Digital inclusion"],
    meets: "First Saturday of each month",
    members: 38,
    companyHosts: ["A fintech company's design team", "An insurance company's service design team"],
    communityPartners: ["Eastside Tenants Network", "A legal aid clinic"],
    inbox: inbox("chicago"),
    synthetic: true,
  },
  {
    id: "detroit",
    city: "Detroit",
    country: "USA",
    region: "US Midwest",
    lat: 42.33,
    lon: -83.05,
    timeZone: "America/Detroit",
    lead: "Tom Nowak",
    leadOrg: "Automotive company (accessibility team)",
    focus: ["Work and careers", "Disability access"],
    meets: "Monthly",
    members: 22,
    companyHosts: ["An automotive company's accessibility team"],
    communityPartners: ["A reentry employment program", "A disability rights center"],
    inbox: inbox("detroit"),
    synthetic: true,
  },
  {
    id: "minneapolis",
    city: "Minneapolis",
    country: "USA",
    region: "US Midwest",
    lat: 44.98,
    lon: -93.27,
    timeZone: "America/Chicago",
    lead: "Hodan Ali",
    leadOrg: "Health insurer (service design)",
    focus: ["Health equity", "Language access"],
    meets: "Every other Monday evening",
    members: 19,
    companyHosts: ["A health insurer's service design team"],
    communityPartners: ["A community health clinic", "A Somali-language parent network"],
    inbox: inbox("minneapolis"),
    synthetic: true,
  },
  {
    id: "houston",
    city: "Houston",
    country: "USA",
    region: "US South",
    lat: 29.76,
    lon: -95.37,
    timeZone: "America/Chicago",
    lead: "Marcus Bell",
    leadOrg: "Health care provider (UX team)",
    focus: ["Language access", "Health equity"],
    meets: "Monthly, in person and online",
    members: 31,
    companyHosts: ["A hospital system's UX team", "An energy company's digital team"],
    communityPartners: ["A free clinic network", "A flood recovery coalition"],
    inbox: inbox("houston"),
    synthetic: true,
  },
  {
    id: "atlanta",
    city: "Atlanta",
    country: "USA",
    region: "US South",
    lat: 33.75,
    lon: -84.39,
    timeZone: "America/New_York",
    lead: "Keisha Grant",
    leadOrg: "University design program",
    focus: ["Health equity", "Civic services"],
    meets: "Weekly during the semester",
    members: 46,
    companyHosts: ["A payments company's design team"],
    communityPartners: ["A maternal health nonprofit", "A neighborhood planning unit"],
    inbox: inbox("atlanta"),
    synthetic: true,
  },
  {
    id: "new-orleans",
    city: "New Orleans",
    country: "USA",
    region: "US South",
    lat: 29.95,
    lon: -90.07,
    timeZone: "America/Chicago",
    lead: "Jasmine Thibodeaux",
    leadOrg: "Independent design consultancy",
    focus: ["Transit and climate", "Housing"],
    meets: "Second Tuesday of each month",
    members: 16,
    companyHosts: ["A shipping company's internal tools team"],
    communityPartners: ["A storm preparedness network", "A community land trust"],
    inbox: inbox("new-orleans"),
    synthetic: true,
  },
  {
    id: "new-york",
    city: "New York",
    country: "USA",
    region: "US Northeast",
    lat: 40.71,
    lon: -74.01,
    timeZone: "America/New_York",
    lead: "Aisha Rahman",
    leadOrg: "Media company (product design)",
    focus: ["Civic services", "Digital inclusion"],
    meets: "Every other Wednesday",
    members: 52,
    companyHosts: ["A media company's product design team", "A bank's inclusive design office"],
    communityPartners: ["A benefits navigation nonprofit", "A public housing residents' council"],
    inbox: inbox("new-york"),
    synthetic: true,
  },
  {
    id: "toronto",
    city: "Toronto",
    country: "Canada",
    region: "Americas, outside the US",
    lat: 43.65,
    lon: -79.38,
    timeZone: "America/Toronto",
    lead: "Daniel Osei",
    leadOrg: "Nonprofit tech collective",
    focus: ["Language access", "Food access"],
    meets: "Monthly",
    members: 29,
    companyHosts: ["A telecom company's accessibility team"],
    communityPartners: ["A newcomer settlement agency", "A food bank network"],
    inbox: inbox("toronto"),
    synthetic: true,
  },
  {
    id: "mexico-city",
    city: "Mexico City",
    country: "Mexico",
    region: "Americas, outside the US",
    lat: 19.43,
    lon: -99.13,
    timeZone: "America/Mexico_City",
    lead: "Lucía Herrera",
    leadOrg: "Design school (social innovation lab)",
    focus: ["Civic services", "Older adults"],
    meets: "Every other Saturday, in Spanish",
    members: 24,
    companyHosts: ["A ride-hailing company's research team"],
    communityPartners: ["A neighborhood elder care network"],
    inbox: inbox("mexico-city"),
    synthetic: true,
  },
  {
    id: "london",
    city: "London",
    country: "UK",
    region: "Europe",
    lat: 51.51,
    lon: -0.13,
    timeZone: "Europe/London",
    lead: "Hannah Clarke",
    leadOrg: "Government digital service",
    focus: ["Disability access", "Civic services"],
    meets: "Monthly",
    members: 37,
    companyHosts: ["A government digital service team", "A retail bank's design team"],
    communityPartners: ["A Deaf-led arts charity", "A tenants' advice service"],
    inbox: inbox("london"),
    synthetic: true,
  },
  {
    id: "singapore",
    city: "Singapore",
    country: "Singapore",
    region: "Asia-Pacific",
    lat: 1.35,
    lon: 103.82,
    timeZone: "Asia/Singapore",
    lead: "Wei Ling Tan",
    leadOrg: "Bank (inclusive design office)",
    focus: ["Older adults", "Digital inclusion"],
    meets: "Monthly",
    members: 33,
    companyHosts: ["A bank's inclusive design office"],
    communityPartners: ["A senior activity center network", "A migrant workers' help desk"],
    inbox: inbox("singapore"),
    synthetic: true,
  },
  {
    id: "melbourne",
    city: "Melbourne",
    country: "Australia",
    region: "Asia-Pacific",
    lat: -37.81,
    lon: 144.96,
    timeZone: "Australia/Melbourne",
    lead: "Liam O'Connor",
    leadOrg: "Disability-led design agency",
    focus: ["Transit and climate", "Disability access"],
    meets: "Every other Tuesday",
    members: 26,
    companyHosts: ["A disability-led design agency", "A transit operator's digital team"],
    communityPartners: ["A wheelchair users' advocacy group"],
    inbox: inbox("melbourne"),
    synthetic: true,
  },
]

export function getChapter(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id)
}

/** How field notes and feedback name a chapter ("Oakland chapter"). */
export const chapterLabel = (chapter: Pick<Chapter, "city">) => `${chapter.city} chapter`
