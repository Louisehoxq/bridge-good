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

Open http://localhost:5173, choose **Log in**, and pick a demo account.

- `npm run build` creates a production build and `npm start` serves it. `npm run typecheck` generates route types and type-checks, and `npm run lint` lints.
- Everything runs locally. The only outside call is to Claude (Anthropic) when the partner assistant is switched on.
- Without an API key, the partner page explains that the assistant is off, and the brief can still be filled in by hand.

### Demo walkthrough (cross-role)
1. Log in as **Student** (Ari). Submit a project, book an office-hour slot, and message your mentor.
2. Switch role to **Mentor** (Jordan). The submission is in the review queue: score it against the rubric and send feedback. The booking and message are there too.
3. Switch back to **Student**. The feedback appears on the submissions page.
4. Log in as **Partner**. Chat with the scoping assistant (with a key), or fill in the brief, then send it. It appears on the partner overview.

Demo data lives in this browser's localStorage. Use **Reset demo data** in the footer to start again.

## How it works

- **Stack:** React Router 7 in framework mode on Vite, React 19, TanStack Query, Tailwind 4 and shadcn/ui on Base UI, styled with the BRIDGEGOOD Design System (Material 3 tokens, Google Sans, Material Symbols, light and dark themes). This is close to [BRIDGEGOOD's own stack](https://bridgegood.com/stack) but without a database.
- **Demo login:** the `/login` action sets an httpOnly `bgx-session` cookie holding the role (`src/lib/session.server.ts`). Each role area's layout `loader` checks it and redirects to `/login` otherwise. **Not real authentication.**
- **Desktop-first layout:** a full top navigation bar and, inside role areas, a sticky left sidebar beside a wide content column (`src/components/app-shell.tsx`). Below `lg` the sidebar becomes a tab strip, and below `md` the top nav becomes a sheet menu.
- **Demo store:** `src/lib/demo-store.ts` keeps collections in localStorage, seeded from `src/content/seed.ts`. All roles share it, so flows connect across roles.
- **AI scoping:** the resource route `src/routes/api.scope.ts` uses the AI SDK (`streamText`, Claude Sonnet 5.5) with an `updateBrief` tool. It requires the partner session, validates the conversation, accepts only user and assistant turns, and caps message length and screenshots (shrunk in the browser first). The client (`src/components/partner/scoping-studio.tsx`) merges tool calls into an editable brief. Human judgement stays central: the brief is labelled a draft, it's always editable, BRIDGEGOOD reviews it, and the assistant never asks for personal details.
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
    login.tsx logout.ts chapters.tsx training*.tsx
    student/ mentor/ ambassador/ partner/   role areas (layout.tsx guards the role and renders RoleShell)
    api.scope.ts         AI scoping assistant (resource route)
  components/            shell, nav, impact loop, principles, problem board, training, toolkits
  components/demo/       messages, office hours, submissions & review, community, snapshots
  components/partner/    scoping studio, submitted briefs
  content/               principles, glossary, problems, chapters, training, toolkits, seed data
  lib/                   roles, session (cookie + guard), demo store, brief schema, AI config
```

## Guardrails we're holding ourselves to

- This is not a checklist, a slogan generator, or a marketing campaign.
- Community voice, feedback, care, and lived experience stay at the centre.
- Technology supports human judgment and relationships. It doesn't replace them.
- BRIDGEGOOD keeps authorship, identity, and ownership of the philosophy.
- We use only synthetic, aggregated, anonymized, or explicitly consented participant information.
- Content follows inclusive-language and accessibility (WCAG 2.2 AA) standards.

## Still to come
- The official BRIDGEGOOD logo files (tokens, type and icons are in; the wordmark is still a placeholder)
- Details for the AI Reflection Companion
- Real training assets and templates
- The P1 funding & legal templates
