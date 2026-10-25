/** DRAFT organization toolkit for company hosts. Downloads are placeholders until BRIDGEGOOD supplies real templates. */
export type ToolkitSection = { title: string; items: { name: string; description: string; format: string }[] }

export const ORGANIZATION_TOOLKIT: ToolkitSection[] = [
  {
    title: "Make the case",
    items: [
      {
        name: "Business case deck",
        description: "For leadership: how hosting a chapter helps your products work for more people, widens who you hire, and builds trust locally.",
        format: "Slides",
      },
      {
        name: "Budget & funding proposal",
        description:
          "Typical costs for a chapter cohort, and how to fund it from corporate social responsibility (CSR), employee resource group (ERG) or learning and development (L&D) budgets.",
        format: "Template",
      },
    ],
  },
  {
    title: "Engage people",
    items: [
      { name: "Mentor recruitment kit", description: "Internal announcement, FAQ, and what we ask of volunteer mentors.", format: "Kit" },
      { name: "Lunch-and-learn session", description: "A 45-minute intro to Design for Social Good for product teams.", format: "Workshop" },
    ],
  },
  {
    title: "Sustain",
    items: [
      {
        name: "Impact reporting template",
        description: "Report what changed in the community's own words, with evidence, rather than numbers that only look good, like page views.",
        format: "Template",
      },
      { name: "Attribution guidelines", description: "How to credit BRIDGEGOOD's philosophy and the students' work.", format: "Guide" },
    ],
  },
]
