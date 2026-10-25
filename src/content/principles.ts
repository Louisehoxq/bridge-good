import type { Archetype } from "@/lib/archetype"

/**
 * Design for Social Good principles, drawn from the BRIDGEGOOD challenge brief.
 * Each one says what it looks like in practice for each archetype, so it reads
 * as something to do rather than a slogan.
 * DRAFT wording. BRIDGEGOOD should review and own the final language.
 */
export type Principle = {
  id: string
  name: string
  meaning: string
  inPractice: Record<Archetype, string>
}

export const PRINCIPLES: Principle[] = [
  {
    id: "lived-experience",
    name: "Lived experience is expertise",
    meaning:
      "The people closest to a problem understand it in ways outsiders can't. That includes designers whose own backgrounds give them insight others miss.",
    inPractice: {
      student:
        "Treat your own story as a strength in research and in your portfolio. Then go and listen to the people the project affects before you sketch anything.",
      ambassador:
        "Recruit mentors and teams who reflect the communities you serve, and pay community members for their time when they share their experience.",
      "problem-owner":
        "Help the design team meet the people you serve, with their consent, so solutions come from real needs rather than assumptions.",
    },
  },
  {
    id: "overlooked-voices",
    name: "Make room for voices that are often overlooked",
    meaning:
      "Who is in the room shapes what gets built. Inclusion means changing who decides, not only who is invited.",
    inPractice: {
      student:
        "In critiques and research, notice who hasn't spoken yet and invite them in. Design for the people at the margins of your users, not just the average user.",
      ambassador:
        "Use your position to open doors: bring students and community members into rooms where decisions and budgets are made.",
      "problem-owner":
        "Tell us which groups are hardest to reach so the project plans for them from the start.",
    },
  },
  {
    id: "name-it",
    name: "Address the hard things directly",
    meaning:
      "Identity, accessibility, discrimination and conflict affect design work and workplaces. We talk about them openly instead of working around them.",
    inPractice: {
      student:
        "Expect real conversations about identity, bias and workplace challenges. Accessibility is part of every project from day one, never an add-on.",
      ambassador:
        "Set expectations for respectful collaboration, and know how to handle conflict with care. Keep BRIDGEGOOD's social-worker-informed approach in mind.",
      "problem-owner":
        "Share openly the barriers your community faces, including access needs, language and trust, so the design responds to them.",
    },
  },
  {
    id: "feedback",
    name: "Feedback changes the plan",
    meaning:
      "We respond to what participants and communities tell us, even when that's harder than doing what's easiest for the organisation.",
    inPractice: {
      student:
        "Share regular reflections on what's working and what isn't. Your feedback shapes how programmes change.",
      ambassador:
        "Run regular check-ins with your local cohort and send what you learn back to BRIDGEGOOD so the philosophy keeps improving.",
      "problem-owner":
        "Tell us how the collaboration felt and whether the result works for your community. That shapes how future projects run.",
    },
  },
  {
    id: "many-successes",
    name: "There is more than one definition of success",
    meaning:
      "We help people make informed choices about their path instead of pushing everyone towards the same job or title.",
    inPractice: {
      student:
        "Explore in-house, agency, non-profit, civic tech, freelance and further study, then choose what fits your life and values.",
      ambassador:
        "Introduce students to a range of professionals and paths, not only the most prestigious employer in town.",
      "problem-owner":
        "Define what success looks like for your community, which might be trust, access or time saved rather than clicks.",
    },
  },
  {
    id: "creators",
    name: "Everyone can be a creator, leader and problem-solver",
    meaning:
      "Confidence grows by doing real work that matters. Access and economic mobility follow from skills, relationships and belief in yourself.",
    inPractice: {
      student:
        "Lead parts of a real project, present your work to professionals, and leave with relationships as well as a portfolio.",
      ambassador:
        "Give students real responsibility and visible credit. Step back so they can lead.",
      "problem-owner":
        "Treat the student team as partners, and give them direct access to decision-makers in your organisation.",
    },
  },
]
