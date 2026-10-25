import type { CommunityRole } from "@/lib/roles"

/**
 * Design for Social Good principles, drawn from the BRIDGEGOOD challenge brief.
 * Each one says what it looks like in practice for each archetype, so it reads
 * as something to do rather than a slogan.
 *
 * Principles describe how BRIDGEGOOD works with every role. The 5 pillars in
 * framework.ts describe what students learn. Show them as separate things.
 * DRAFT wording. BRIDGEGOOD should review and own the final language.
 */
export type Principle = {
  id: string
  name: string
  meaning: string
  inPractice: Record<CommunityRole, string>
}

/** One line to show above the principles, so they don't compete with the pillars. */
export const PRINCIPLES_INTRO =
  "How BRIDGEGOOD works with everyone involved. The five pillars cover what students learn. These principles cover how mentors, ambassadors, partners and students work together."

export const PRINCIPLES: Principle[] = [
  {
    id: "lived-experience",
    name: "Lived experience is expertise",
    meaning:
      "The people closest to a problem understand it in ways outsiders can't. That includes designers whose own backgrounds give them insight others miss.",
    inPractice: {
      student:
        "Treat your own story as a strength in research and in your portfolio. Then go and listen to the people the project affects before you sketch anything.",
      mentor:
        "Ask students what their own experience tells them about the problem, and treat it as insight rather than bias to correct.",
      ambassador:
        "Recruit mentors and teams who reflect the communities you serve, and pay community members for their time when they share their experience.",
      partner:
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
        "In critiques and research, notice who hasn't spoken yet and invite them in. Design for the people most likely to be left out, not just the average user.",
      mentor:
        "In critiques, invite quieter students in first. Open doors for students the way others opened them for you.",
      ambassador:
        "Use your position to open doors: bring students and community members into rooms where decisions and budgets are made.",
      partner:
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
      mentor:
        "Be ready to talk about identity, bias and workplace challenges honestly. If a conversation needs more support, involve BRIDGEGOOD staff.",
      ambassador:
        "Set expectations for respectful teamwork, and know how to handle conflict with care. BRIDGEGOOD's approach to conflict comes from social work, so bring in BRIDGEGOOD staff when a situation needs trained support.",
      partner:
        "Share openly the barriers your community faces, including access needs, language and trust, so the design responds to them.",
    },
  },
  {
    id: "feedback",
    name: "Feedback changes the plan",
    meaning:
      "We respond to what participants and communities tell us, even when that's harder than doing what's easiest for the organization.",
    inPractice: {
      student:
        "Share regular reflections on what's working and what isn't. Your feedback shapes how programs change.",
      mentor:
        "Give specific, kind feedback on the work, and ask students how your mentoring is landing for them.",
      ambassador:
        "Run regular check-ins with your local cohort and send what you learn back to BRIDGEGOOD so the philosophy keeps improving.",
      partner:
        "Tell us how the collaboration felt and whether the result works for your community. That shapes how future projects run.",
    },
  },
  {
    id: "many-successes",
    name: "There is more than one definition of success",
    meaning:
      "We help people make informed choices about their path instead of pushing everyone toward the same job or title.",
    inPractice: {
      student:
        "Explore in-house, agency, nonprofit, civic tech, freelance and further study, then choose what fits your life and values.",
      mentor:
        "Share your real path, including detours. Don't steer students toward the path you took.",
      ambassador:
        "Introduce students to a range of professionals and paths, not only the most prestigious employer in town.",
      partner:
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
      mentor:
        "Ask questions before giving answers. Let students make the decisions and own the result.",
      ambassador:
        "Give students real responsibility and visible credit. Step back so they can lead.",
      partner:
        "Treat the student team as partners, and give them direct access to decision-makers in your organization.",
    },
  },
]
