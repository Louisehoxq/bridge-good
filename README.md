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
| Welcome | `/` | Mission, why Design for Social Good, the framework (5 pillars), the impact loop, principles by role, terms, resources |
| Library | `/learn` | Index of everything below, with the framework's version and BRIDGEGOOD authorship note |
| Pillars | `/learn/pillars/:pillarId` | Meaning, a synthetic example, the learning outcome, the pillar's reflection prompts, where it's taught |
| Reflection prompts | `/learn/prompts` | The 12 prompts, their pillars, and where they come up in the app |
| Role tracks | `/learn/tracks/apprentices`, `mentors`, `ambassadors`, `company-hosts` | Modules (any order, with pillar chips), a one-page explainer, example case studies, related guides |
| Guides | `/learn/guides/:slug` | Mock case, real case, teaching AI and social good, mentor commitment, ambassador vetting, adapt don't copy, inclusive language |
| Self-check | `/learn/self-check` | "Is this a good fit for you right now?" No form, nothing stored, links to the official criteria |
| Chapters (concept) | `/chapters` | Proposed chapter model: illustrative map and list |
| Log in | `/login` | Five synthetic demo accounts |

Every library page has a stable URL, breadcrumbs and previous/next links. Signed in, it also shows a strip such as "Part of step 1 of your path: Bootcamp · Back to your path". Old `/training/*` URLs redirect to the library.

**Role areas** (sidebars grouped into "Your path" and "Your people")

| Role | Demo account (synthetic) | Pages |
|---|---|---|
| **Apprentice** `/student` | Ari Santos | Overview · Your path (bootcamp → mini project → choose a project → capstone → alumni) · Practice · Choose a project · Submissions & feedback · Reflection companion · My mentor (messages + office hours) · Community of practice |
| **Mentor** `/mentor` | Jordan Lee, a BRIDGEGOOD alum | Overview · Prepare · Growth conversations · My mentee (profile, path, messages, office hours) |
| **Ambassador: chapter lead** `/ambassador` | Priya Raman | Overview · Playbook · Matching & milestones · Partner pipeline · Outreach & partner toolkits |
| **Ambassador: company host** `/ambassador` | Dana Whitfield | Same area, with its own overview and playbook |
| **Community partner** `/partner` | Eastside Tenants Network | Overview · Submit a problem (AI scoping studio) · My project and team · Project gallery · Toolkit & FAQs · Funding & legal templates (coming soon) |

Chapter lead and company host share one `ambassador` role key; the session stores which kind.

Everything connects through one loop: **a community partner shares a problem → an ambassador gathers support → apprentices design with the community while mentors guide → feedback goes back to BRIDGEGOOD, which decides what changes in the philosophy.**

## Running it

```bash
npm install
cp .env.example .env.local   # optional: add ANTHROPIC_API_KEY to switch on the partner AI assistant
npm run dev
```

Open http://localhost:5173, choose **Log in**, and pick a demo account.

- `npm run build` creates a production build and `npm start` serves it. `npm run typecheck` generates route types and type-checks, and `npm run lint` lints.
- Everything runs locally. The only outside call is to Claude (Anthropic) when the partner assistant is switched on.
- Without an API key, the partner page explains that the assistant is off, and the brief can still be filled in by hand.

### Demo walkthrough (cross-role)
1. Log in as **Apprentice** (Ari). Open **Your path**: you're on step 2, the mini project. Submit a mock case with your self-assessment. Then go to **Choose a project** and tell your chapter lead why you'd like the tenant-rights brief.
2. Switch to **Mentor** (Jordan). In **Growth conversations**, read Ari's self-assessment first, then write "What's working" and "One next step" for one or more pillars. No scores.
3. Switch to **Chapter lead** (Priya). On **Matching & milestones**, read the apprentices' notes and form a team with Jordan as mentor. Mark a milestone reached.
4. Log in as **Community partner**. **My project and team** now shows the team and the sprint. Send feedback. Or open **Submit a problem** and build a brief: "How will the people you serve shape this?" is required.
5. Back as **Apprentice**, your mentor's words are on **Submissions & feedback**, and your path has moved on to the capstone.
6. Open any library page while signed in to see where it sits on your path.

Demo data lives in this browser's localStorage. Use **Reset demo data** in the footer to start again.

## How it works

- **Stack:** React Router 7 in framework mode on Vite, React 19, TanStack Query, Tailwind 4 and shadcn/ui on Base UI, styled with the BRIDGEGOOD Design System (Material 3 tokens, Google Sans, Material Symbols, light and dark themes). This is close to [BRIDGEGOOD's own stack](https://bridgegood.com/stack) but without a database.
- **Demo login:** the `/login` action sets an httpOnly `bgx-session` cookie holding the role, plus the ambassador kind for chapter leads and company hosts (`src/lib/session.server.ts`). Each role area's layout `loader` checks it and redirects to `/login` otherwise. **Not real authentication.**
- **Desktop-first layout:** a full top navigation bar and, inside role areas, a sticky left sidebar beside a wide content column (`src/components/app-shell.tsx`). Below `lg` the sidebar becomes a tab strip, and below `md` the top nav becomes a sheet menu.
- **Demo store:** `src/lib/demo-store.ts` keeps collections in localStorage, seeded from `src/content/seed.ts`. All roles share it, so flows connect across roles.
- **AI scoping:** the resource route `src/routes/api.scope.ts` uses the AI SDK (`streamText`, Claude Sonnet 5.5) with an `updateBrief` tool. It requires the partner session, validates the conversation, accepts only user and assistant turns, and caps message length and screenshots (shrunk in the browser first). The client (`src/components/partner/scoping-studio.tsx`) merges tool calls into an editable brief. Human judgment stays central: the brief is labelled a draft, it's always editable, BRIDGEGOOD reviews it, and the assistant never asks for personal details.
- **Content:** editable copy and data live in `src/content/`. Every person, organization, chapter and project is a **synthetic example** and labelled as one.

## Repository layout

```
docs/                    challenge brief, design system, evaluation and concept notes
src/
  root.tsx               HTML shell, fonts, session loader, error page
  routes.ts              route table
  app.css                BRIDGEGOOD Material 3 tokens, type scale, base styles
  routes/
    home.tsx             Welcome
    learn/               public library: index, pillars, prompts, role tracks, guides, self-check
    login.tsx logout.ts chapters.tsx
    legacy-redirect.ts redirects.ts   old URLs (/training/*, merged role pages)
    student/ mentor/ ambassador/ partner/   role areas (layout.tsx guards the role and renders RoleShell)
    api.scope.ts         AI scoping assistant (resource route)
  components/            shell, nav, impact loop, principles, problem board, training, toolkits
  components/demo/       messages, office hours, submissions & growth conversations, matching data, milestones, community, snapshots
  components/library/    library page frame, breadcrumbs, prompt list, pillar chip
  components/path/       role path stepper and the "your path" strip on library pages
  components/partner/    scoping studio, submitted briefs
  content/               framework, guides, eligibility, training, principles, glossary, problems, chapters, toolkits, journey and seed data
  lib/                   roles, session (cookie + guard), library index, role paths, demo store, brief schema, AI config
```

## Guardrails we're holding ourselves to

- This is not a checklist, a slogan generator, or a marketing campaign.
- Community voice, feedback, care, and lived experience stay at the center.
- Technology supports human judgment and relationships. It doesn't replace them.
- BRIDGEGOOD keeps authorship, identity, and ownership of the philosophy.
- We use only synthetic, aggregated, anonymized, or explicitly consented participant information.
- Content follows inclusive-language and accessibility (WCAG 2.2 AA) standards.

## Still to come
- The official BRIDGEGOOD logo files (tokens, type and icons are in; the wordmark is still a placeholder)
- Details for the AI Reflection Companion
- Real training assets and templates
- The P1 funding & legal templates
