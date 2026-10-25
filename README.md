# BridgeGoodx

A hackathon-for-social-good project exploring how [BRIDGEGOOD](https://bridgegood.org) can codify and scale its **Design for Social Good** philosophy, so that students, alumni, mentors, volunteers, staff, partners, and outside communities can understand it, practice it, teach it, improve it, and carry it forward as the organization grows beyond any one person.

## The challenge

> How might BRIDGEGOOD codify and scale its Design for Social Good philosophy so students, alumni, mentors, volunteers, staff, partners, and outside communities can understand, practice, and carry it forward as the organization grows beyond any one person?

The full brief is in [docs/challenge.md](docs/challenge.md).

## What we built

A **desktop-first web app**, following the team's wireframe. One public library explains the philosophy. Each role has an area that shows *their path* through it and links back into the library instead of keeping its own copy.

### Sitemap

**Public**

| Page | URL | What's there |
|---|---|---|
| Welcome | `/` | "Start where you are" routing by role, the 5 pillars (the spine), how BRIDGEGOOD works (the 6 principles, with a by-role table behind a disclosure), the impact loop, and who the philosophy belongs to |
| Library | `/learn` | Index of everything below, with the framework's version and BRIDGEGOOD authorship note |
| Pillars | `/learn/pillars/:pillarId` | BRIDGEGOOD's official meaning (versioned), field notes from chapters beneath it, a "this didn't fit" flag, a synthetic example, the learning outcome, the pillar's reflection prompts, where it's taught |
| Reflection prompts | `/learn/prompts` | The 12 prompts, their pillars, and where they come up in the app |
| Terms of reference | `/learn/terms` | How Design for Social Good differs from other approaches, and what each term means, isn't, and looks like when it's missing (moved here from the welcome page) |
| Role tracks | `/learn/tracks/apprentices`, `mentors`, `ambassadors`, `company-hosts` | Modules (any order, with pillar chips), a one-page explainer, example case studies, related guides |
| Guides | `/learn/guides/:slug` | Mock case, real case, teaching AI and social good, mentor commitment, ambassador vetting, adapt don't copy, inclusive language |
| Changelog | `/learn/changelog` | Every version of the framework: what BRIDGEGOOD changed, why, where the feedback came from, and credit (only with consent) |
| Self-check | `/learn/self-check` | "Is this a good fit for you right now?" No form, nothing stored, links to the official criteria |
| Chapters (concept) | `/chapters` | Proposed chapter model: illustrative map and list |
| Log in | `/login` | Six synthetic demo accounts |
| Design system | `/design` | Bridge Studio tokens and signature components, for the team |

Every library page has a stable URL, breadcrumbs and previous/next links. Signed in, it also shows a strip such as "Part of step 1 of your path: Bootcamp · Back to your path". Old `/training/*` URLs redirect to the library.

**Role areas** (sidebars grouped into "Your path" and "Your people")

| Role | Demo account (synthetic) | Pages |
|---|---|---|
| **Apprentice** `/student` | Ari Santos | Your path, the home page (your people or team, bootcamp → mini project → choose a project → capstone → alumni) · Practice `/student/practice` · Choose a project · Submissions & feedback · Reflection companion · My mentor (messages + office hours) · Community of practice |
| **Mentor** `/mentor` | Jordan Lee, a BRIDGEGOOD alum | Overview · Prepare · Growth conversations `/mentor/conversations` (with the questions apprentices shared) · My mentee (team, profile, path, messages, office hours) |
| **Ambassador: chapter lead** `/ambassador` | Priya Raman | Overview · Playbook · Matching & milestones · Partner pipeline · Outreach & partner toolkits |
| **Ambassador: company host** `/ambassador` | Dana Whitfield | Same area, with its own overview and playbook |
| **Community partner** `/partner` | Eastside Tenants Network | Overview · Submit a problem (AI scoping studio) · My project and team (with a project retrospective) · Project gallery · Toolkit & FAQs (including funding and legal templates, coming soon) |
| **BRIDGEGOOD steward** `/steward` | Morgan Ellis, program staff | Inbox (every kind of feedback, tagged by pillar, guide or prompt) · one page per piece of feedback with the decision form · Versions and wording · Public changelog |

Chapter lead and company host share one `ambassador` role key; the session stores which kind.

Old URLs redirect (301): `/student/path` → `/student`, `/student/activities` → `/student/practice`, `/mentor/submissions` → `/mentor/conversations`, `/partner/legal` → `/partner/toolkit#legal`, and `/training/*` → the library.

Everything connects through one loop: **a community partner shares a problem → an ambassador gathers support → apprentices design with the community while mentors guide → feedback goes back to BRIDGEGOOD, which decides what changes in the philosophy.**

## Running it

```bash
npm install
cp .env.example .env.local   # optional: add an API key to switch on the AI scoping assistant and Reflection Companion
npm run dev
```

Open http://localhost:5173, choose **Log in**, and pick a demo account.

- `npm run build` creates a production build and `npm start` serves it.
- Checks, which CI also runs on every pull request:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run check:contrast` (every design token pair, light and dark)
  - `npm run test:unit` (the evaluator)
  - `npm run test:a11y` (axe plus WCAG reflow, zoom and text-spacing checks on every page, light and dark)
- Everything runs locally. The only outside calls are to the AI model when an assistant is switched on, and to Google Fonts.
- Without an API key, the AI features say they're off: partners fill in the brief by hand, and apprentices reflect with BRIDGEGOOD's questions without AI.

### Demo walkthrough (cross-role)
1. Log in as **Apprentice** (Ari). You land on **Your path**: your people, and step 2, the mini project. Submit a mock case with your self-assessment. Then go to **Choose a project** and tell your chapter lead why you'd like the tenant-rights brief.
2. Switch to **Mentor** (Jordan). In **Growth conversations**, read Ari's self-assessment first, then write "What's working" and "One next step" for one or more pillars. No scores.
3. Switch to **Chapter lead** (Priya). On **Matching & milestones**, read the apprentices' notes and form a team with Jordan as mentor. Mark a milestone reached.
4. Log in as **Community partner**. **My project and team** now shows the team and the sprint. Send feedback. Or open **Submit a problem** and build a brief: "How will the people you serve shape this?" is required.
5. Back as **Apprentice**, your mentor's words are on **Submissions & feedback**, and your path has moved on to the capstone.
6. Open any library page while signed in to see where it sits on your path.

### Demo walkthrough: the feedback loop (milestone 3)
1. Log in as **Chapter lead** (Priya). At the bottom of **Playbook**, use **Propose an adaptation**: pick a pillar, say what your chapter changed, why, and what you kept, and choose whether to credit the Chicago chapter.
2. Log in as **BRIDGEGOOD steward** (Morgan). The **Inbox** has your proposal next to synthetic examples of every other kind: "this didn't fit" flags, AI disagreement counts from the Reflection Companion, a partner retrospective and an aggregated community feedback card. Filter by pillar, open the proposal, choose **Accept** → **Show it as a field note**, write a reason, and record the decision.
3. Open **Public changelog**: the entry says what changed, why, where it came from, and credits the chapter only if Priya said yes. The pillar page now shows the field note beneath BRIDGEGOOD's official wording, labelled as a local adaptation.
4. Back as **Chapter lead**, the playbook shows "BRIDGEGOOD accepted this" with the steward's reason.
5. To change the official wording, accept a flag on a pillar with **Change BRIDGEGOOD's official wording**, or use **Versions and wording**. That publishes version 0.2 with the old and new text side by side in the changelog. Only the steward can do this.

Demo data lives in this browser's localStorage. Use **Reset demo data** in the footer to start again.

## How it works

- **Stack:** React Router 7 in framework mode on Vite, React 19, TanStack Query, Tailwind 4 and shadcn/ui on Base UI. This is close to [BRIDGEGOOD's own stack](https://bridgegood.com/stack) but without a database.
- **Design system: Bridge Studio** ([DESIGN.md](DESIGN.md)). Warm paper and navy ink, with body text at AAA contrast, in light and dark. Atkinson Hyperlegible Next and Bricolage Grotesque, Lucide icons, and signature components in `src/components/studio/`: AI draft frame, people and paths, pinned notes, highlighter and role badges. It keeps BRIDGEGOOD's logo, navy and gold lineage, and tone.
- **Demo login:** the `/login` action sets an httpOnly `bgx-session` cookie holding the role, plus the ambassador kind for chapter leads and company hosts (`src/lib/session.server.ts`). Each role area's layout `loader` checks it and redirects to `/login` otherwise. **Not real authentication.**
- **Desktop-first layout:** a full top navigation bar and, inside role areas, a sticky left sidebar beside a wide content column (`src/components/app-shell.tsx`). Below `lg` the sidebar becomes a tab strip, and below `md` the top nav becomes a sheet menu.
- **Demo store:** `src/lib/demo-store.ts` keeps collections in localStorage, seeded from `src/content/seed.ts`. All roles share it, so flows connect across roles.
- **AI scoping:** the resource route `src/routes/api.scope.ts` uses the AI SDK (`streamText`, Claude Sonnet 5.5) with an `updateBrief` tool. It requires the partner session, validates the conversation, accepts only user and assistant turns, and caps message length and screenshots (shrunk in the browser first). The client (`src/components/partner/scoping-studio.tsx`) merges tool calls into an editable brief. Human judgment stays central: the brief is labelled a draft, it's always editable, BRIDGEGOOD reviews it, and the assistant never asks for personal details.
- **Feedback loop:** `src/lib/feedback/` holds the types, the rules and the store. Only a steward decides, every decision needs a reason, credit needs consent, and only wording changes publish a new version. The steward area is `src/routes/steward/`, the changelog page is `src/routes/learn/changelog.tsx`, and the forms, flags and changelog components are in `src/components/feedback/`. Version history is in `src/content/framework-history.ts`, with synthetic seed data in `src/content/feedback-seed.ts`. Free-text feedback is screened for email addresses and phone numbers before it's saved.
- **Reflection Companion:** `src/routes/api.reflect.ts` and `src/lib/evaluator/`. It asks apprentices questions tied to the pillars and prompts, says what it can't judge, never scores, and lets them share questions with their mentor. A Gemma 4 prototype sits behind `EVALUATOR_PROVIDER` ([docs/gemma-prototype.md](docs/gemma-prototype.md)).
- **Content:** editable copy and data live in `src/content/`. Every person, organization, chapter and project is a **synthetic example** and labelled as one.

## Repository layout

```
DESIGN.md                Bridge Studio design system spec
docs/                    challenge brief, evaluations, design notes, AI evaluator design, concept notes
scripts/                 contrast check, evaluator comparison
tests/                   Playwright accessibility tests and the feedback-loop walkthrough
.github/workflows/       CI
src/
  root.tsx               HTML shell, fonts, session loader, error page
  routes.ts              route table
  app.css                Bridge Studio tokens (light and dark), type scale, base styles
  routes/
    home.tsx             Welcome
    learn/               public library: index, pillars, prompts, terms, role tracks, guides, self-check
    login.tsx logout.ts chapters.tsx
    legacy-redirect.ts redirects.ts   old URLs (/training/*, merged role pages)
    student/ mentor/ ambassador/ partner/ steward/   role areas (layout.tsx guards the role and renders RoleShell)
    api.scope.ts         AI scoping assistant (resource route)
    api.reflect.ts       Reflection Companion (resource route)
    design.tsx           design system page
  components/            shell, nav, notices and form errors, impact loop, principles, problem board, training, toolkits
  components/feedback/   feedback loop: adaptation form, flags, retrospective, decision form, changelog, field notes
  components/demo/       messages, office hours, submissions & growth conversations, matching data, milestones, community, snapshots
  components/library/    library page frame, breadcrumbs, prompt list, pillar chip
  components/path/       role path stepper and the "your path" strip on library pages
  components/partner/    scoping studio, submitted briefs
  components/reflection/ Reflection Companion UI
  components/studio/     Bridge Studio signature components
  components/team/       team views: people chips joined by the gold path
  components/ui/         Bridge Studio primitives (button, fields, select, sheet)
  content/               framework, guides, eligibility, training, principles, glossary, problems, chapters, toolkits, journey and seed data
  lib/                   roles, session (cookie + guard), library index, role paths, demo store, brief schema, AI config
  lib/evaluator/         evaluator schema, prompts, checks, providers, tests
  lib/feedback/          feedback loop types, decision and version rules, store, tests
```

## Guardrails we're holding ourselves to

- This is not a checklist, a slogan generator, or a marketing campaign.
- Community voice, feedback, care, and lived experience stay at the center.
- Technology supports human judgment and relationships. It doesn't replace them.
- BRIDGEGOOD keeps authorship, identity, and ownership of the philosophy.
- We use only synthetic, aggregated, anonymized, or explicitly consented participant information.
- Content follows inclusive-language and accessibility (WCAG 2.2 AA) standards.

## Where it stands and what's next

See [docs/evaluation-milestone-2.md](docs/evaluation-milestone-2.md) for the full review.

- **Done:** the React Router migration, Bridge Studio tokens and components, the public library with role paths, the new roles, growth conversations, and Reflection Companion phase 1.
- **Done in milestone 2.5:** Bridge Studio on every page (type scale, no all caps, no pill links, the AI draft frame on both AI surfaces, people and paths on team views, pinned notes, the highlighted prompt, role badges), all known layout failures fixed, a manual accessibility pass, and the content reorganization above. Results are in `docs/design-followups.md`.
- **Done in milestone 3:** the feedback loop. A BRIDGEGOOD steward role and inbox, local adaptations, "this didn't fit" flags, AI disagreement records from the companion, partner retrospectives, an aggregated community feedback card, field notes on pillar pages, and a versioned framework with a public changelog.
- **Needs an API key:** a live check of the scoping assistant, the Reflection Companion and the Gemma comparison.
- **Needs BRIDGEGOOD:**
  - official logo files
  - approval of the framework wording and of BridgeGoodx having its own visual style
  - real training assets
  - the funding and legal templates
