/** SYNTHETIC chapters and ambassadors. Contacts use the reserved example.org domain. */
export type Chapter = {
  id: string
  city: string
  country: string
  region: "North America" | "Europe" | "Asia-Pacific"
  lat: number
  lon: number
  ambassador: string
  organisation: string
  email: string
  meets: string
  focus: string
}

export const CHAPTERS: Chapter[] = [
  { id: "oakland", city: "Oakland", country: "USA", region: "North America", lat: 37.8, lon: -122.3, ambassador: "Rosa Delgado", organisation: "Community design studio", email: "oakland@chapters.example.org", meets: "Every other Thursday", focus: "Food access, housing" },
  { id: "chicago", city: "Chicago", country: "USA", region: "North America", lat: 41.9, lon: -87.6, ambassador: "Priya Raman", organisation: "Fintech company (design team)", email: "chicago@chapters.example.org", meets: "First Saturday monthly", focus: "Tenant rights, digital inclusion" },
  { id: "houston", city: "Houston", country: "USA", region: "North America", lat: 29.8, lon: -95.4, ambassador: "Marcus Bell", organisation: "Healthcare provider (UX team)", email: "houston@chapters.example.org", meets: "Monthly, hybrid", focus: "Multilingual services" },
  { id: "atlanta", city: "Atlanta", country: "USA", region: "North America", lat: 33.7, lon: -84.4, ambassador: "Keisha Grant", organisation: "University design programme", email: "atlanta@chapters.example.org", meets: "Weekly during term", focus: "Health equity" },
  { id: "detroit", city: "Detroit", country: "USA", region: "North America", lat: 42.3, lon: -83.0, ambassador: "Tom Nowak", organisation: "Automotive company (accessibility team)", email: "detroit@chapters.example.org", meets: "Monthly", focus: "Workforce re-entry" },
  { id: "new-york", city: "New York", country: "USA", region: "North America", lat: 40.7, lon: -74.0, ambassador: "Aisha Rahman", organisation: "Media company (product design)", email: "nyc@chapters.example.org", meets: "Every other Wednesday", focus: "Civic tech" },
  { id: "toronto", city: "Toronto", country: "Canada", region: "North America", lat: 43.7, lon: -79.4, ambassador: "Daniel Osei", organisation: "Non-profit tech collective", email: "toronto@chapters.example.org", meets: "Monthly", focus: "Newcomer services" },
  { id: "london", city: "London", country: "UK", region: "Europe", lat: 51.5, lon: -0.1, ambassador: "Hannah Clarke", organisation: "Government digital service", email: "london@chapters.example.org", meets: "Monthly", focus: "Deaf access, arts" },
  { id: "singapore", city: "Singapore", country: "Singapore", region: "Asia-Pacific", lat: 1.35, lon: 103.8, ambassador: "Wei Ling Tan", organisation: "Bank (inclusive design office)", email: "singapore@chapters.example.org", meets: "Monthly", focus: "Ageing population, social services" },
  { id: "melbourne", city: "Melbourne", country: "Australia", region: "Asia-Pacific", lat: -37.8, lon: 145.0, ambassador: "Liam O'Connor", organisation: "Disability-led design agency", email: "melbourne@chapters.example.org", meets: "Every other Tuesday", focus: "Accessible transport" },
]

export const REGIONS = ["North America", "Europe", "Asia-Pacific"] as const
