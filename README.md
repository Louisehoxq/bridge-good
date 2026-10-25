# BridgeGoodx

A hackathon-for-social-good project exploring how [BRIDGEGOOD](https://bridgegood.org) can codify and scale its **Design for Social Good** philosophy, so that students, alumni, mentors, volunteers, staff, partners, and outside communities can understand it, practice it, teach it, improve it, and carry it forward as the organization grows beyond any one person.

## The challenge

> How might BRIDGEGOOD codify and scale its Design for Social Good philosophy so students, alumni, mentors, volunteers, staff, partners, and outside communities can understand, practice, and carry it forward as the organization grows beyond any one person?

The full brief is in [docs/challenge.md](docs/challenge.md).

## What we built

A **desktop-first web app**, following the team's wireframe, that gives each role a home for practising the philosophy. A shared public layer explains the philosophy itself.

| Area | Who | What's there |
|---|---|---|
| **Welcome** `/` | everyone | Mission & philosophy, why Design for Social Good rather than other approaches (comparison table), the impact loop, principles-by-role matrix, terms of reference (glossary), resources |
| **Find a chapter** `/chapters` | everyone | Illustrative map and searchable list of chapters, with ambassador contacts |
| **Training** `/training` | everyone | Tracks for students, mentors, ambassadors and companies: modules, a one-page explainer, example case studies |
| **Student** `/student` | logged-in students | Design for Good modules, activities (fundamentals, mock case, case studies), project submissions with mentor feedback, AI Reflection Companion (placeholder), communities of practice, office hours, messages |
| **Mentor** `/mentor` | logged-in mentors | Training, rubric-based review of student submissions, office hours, messages |
| **Ambassador** `/ambassador` | logged-in ambassadors | Training, partner project pipeline, Problem Owner & Organisation toolkits |
| **Partner** `/partner` | logged-in partners | **AI scoping assistant** (chat + screenshot upload + live capstone brief builder), capstone gallery, toolkit & FAQs, funding & legal templates (P1, coming soon) |

Everything connects through one loop: **partner shares a problem → ambassador gathers support → students design with the community while mentors guide → feedback improves the philosophy.**

## Running it

```bash
npm install
cp .env.example .env.local   # optional: add ANTHROPIC_API_KEY to switch on the partner AI assistant
npm run dev
```

Open http://localhost:3000, choose **Log in**, and pick a demo account.

- `npm run build` creates a production build, and `npm run lint` lints.
- Without an API key, the partner page explains that the assistant is off, and the brief can still be filled in by hand.

### Demo walkthrough (cross-role)
1. Log in as **Student** (Ari). Submit a project, book an office-hour slot, and message your mentor.
2. Switch role to **Mentor** (Jordan). The submission is in the review queue: score it against the rubric and send feedback. The booking and message are there too.
3. Switch back to **Student**. The feedback appears on the submissions page.
4. Log in as **Partner**. Chat with the scoping assistant (with a key), or fill in the brief, then send it. It appears on the partner overview.

Demo data lives in this browser's localStorage. Use **Reset demo data** in the footer to start again.

## How it works

- **Demo login:** `/login` sets a `bgx-session` cookie holding the role. `src/proxy.ts` (Next 16's renamed middleware) guards `/student`, `/mentor`, `/ambassador` and `/partner`. **Not real authentication.**
- **Desktop-first layout:** a full top navigation bar and, inside role areas, a sticky left sidebar beside a wide content column (`src/components/app-shell.tsx`). Below `lg` the sidebar becomes a tab strip, and below `md` the top nav becomes a sheet menu.
- **Demo store:** `src/lib/demo-store.ts` keeps collections in localStorage, seeded from `src/content/seed.ts`. All roles share it, so flows connect across roles.
- **AI scoping:** `src/app/api/scope/route.ts` uses the AI SDK (`streamText`, Claude Sonnet 5.5) with an `updateBrief` tool. The client (`src/components/partner/scoping-studio.tsx`) merges tool calls into an editable brief. Human judgement stays central: the brief is labelled a draft, it's always editable, BRIDGEGOOD reviews it, and the assistant never asks for personal details.
- **Content:** editable copy and data live in `src/content/`. Every person, organisation, chapter and project is a **synthetic example** and labelled as one.

## Repository layout

```
docs/                    challenge brief, design system notes
src/
  app/
    page.tsx             Welcome
    login/ chapters/ training/
    student/ mentor/ ambassador/ partner/   role areas (each has a RoleShell layout)
    api/scope/route.ts   AI scoping assistant
    actions.ts           demo login / logout server actions
  proxy.ts               role guard
  components/            shell, nav, impact loop, principles, problem board, training, toolkits
  components/demo/       messages, office hours, submissions & review, community, snapshots
  components/partner/    scoping studio, submitted briefs
  content/               principles, glossary, problems, chapters, training, toolkits, seed data
  lib/                   roles, session, demo store, brief schema
```

## Guardrails we're holding ourselves to

- This is not a checklist, a slogan generator, or a marketing campaign.
- Community voice, feedback, care, and lived experience stay at the centre.
- Technology supports human judgment and relationships. It doesn't replace them.
- BRIDGEGOOD keeps authorship, identity, and ownership of the philosophy.
- We use only synthetic, aggregated, anonymized, or explicitly consented participant information.
- Content follows inclusive-language and accessibility (WCAG 2.2 AA) standards.

## Still to come
- The official BRIDGEGOOD Design System (colours, type, logo, tone)
- Details for the AI Reflection Companion
- Real training assets and templates
- The P1 funding & legal templates
