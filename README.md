# BridgeGoodx

A hackathon-for-social-good project exploring how [BRIDGEGOOD](https://bridgegood.org) can codify and scale its **Design for Social Good** philosophy, so that students, alumni, mentors, volunteers, staff, partners, and outside communities can understand it, practice it, teach it, improve it, and carry it forward as the organization grows beyond any one person.

## The challenge

> How might BRIDGEGOOD codify and scale its Design for Social Good philosophy so students, alumni, mentors, volunteers, staff, partners, and outside communities can understand, practice, and carry it forward as the organization grows beyond any one person?

The full brief is in [docs/challenge.md](docs/challenge.md).

## What we built

**Design for people. Build for good.** BridgeGoodx is BRIDGEGOOD's shared space for learning, practicing, and carrying forward Design for Social Good. It's built around the **community experience cycle**:

**Understand → Practice → Reflect and Share → Teach and Evolve → Understand again.**

People can enter at whichever point makes sense, return when they need support, and contribute to shared learning over time. Each page shows where it sits in the cycle and links to the next step: a Decision Lab scenario opens a Practice Library tool, which prompts a reflection, which can become a lesson in the Living Playbook.

### Sitemap

**Public (no login)**

| Page | URL | What's there |
|---|---|---|
| Welcome | `/` | The philosophy, the four principles as questions to return to, five audience pathways, the cycle, and "Help it grow" |
| Pathways | `/start/:audience` | Student, alumnus, mentor or volunteer, chapter / partner / educator, and company host: one suggestion at each stage of the cycle |
| Understand | `/understand` | Each principle with its reasoning and a concrete design choice, how it differs from generic claims, what "access", "inclusion", "community benefit" and "economic mobility" mean here, realistic tensions, and questions about assumptions and power |
| Design Decision Lab | `/lab`, `/lab/:slug` | Six synthetic dilemmas. Six steps each: meet the situation, choose or propose an approach, explore consequences (who's helped, who's left out), hear other perspectives, reflect, take it into practice. Never graded. An optional AI reflection helper asks follow-up questions |
| Practice Library | `/library`, `/library/:slug` | 24 tools in six task-based categories, filterable by role, goal, format, experience level and time. Every tool says what it helps you do, when, who, how, the questions to consider, accessibility, how to reflect, source/owner/version, and how to suggest an improvement |
| Living Playbook | `/playbook`, `/playbook/:id`, `/playbook/contribute` | Core philosophy (BRIDGEGOOD-authored), practice examples, local adaptations and open questions, kept clearly apart. Contribute with the seven-part template, including permission and attribution |
| Teach & Facilitate | `/teach` | Facilitator and mentor guides, chapter starter kit, train-the-facilitator steps, what can adapt and what stays grounded, and how to propose a revision |
| Community events | `/events`, `/events/:id`, `/events/host` | Chapter calendars (Reflect and Share): critique circles, listening sessions, portfolio reviews, Demo Days. Every event says how accessible it is. Anyone can RSVP, as a guest if not logged in. Afterwards the host shares "what we learned" in the Living Playbook |
| Chapters | `/chapters`, `/chapters/:id` | An interactive map and list of synthetic, proposed chapters (Teach and Evolve), each with its lead, partners, company hosts, calendar and what it shared in the Living Playbook |
| About the Philosophy | `/about` | Authorship and stewardship, the six-step review workflow, trust and safety, how to request a correction or withdrawal, design guardrails, and what success could look like |

**Demo login** (`/login`, no password)

| Role | URL | What's there |
|---|---|---|
| **Company host** (Dana Whitfield) | `/host` | Overview and host path, host guide (explainer, modules, what BRIDGEGOOD looks for), "Bring it to your workplace" (workplace Lab scenarios, tools, share a workplace reflection), partner projects to sponsor (hosts never choose the problems), organization toolkit |
| **Chapter lead** (Priya Raman) and **Community partner** (Eastside Tenants Network) | `/events` | No area of their own: they host events on their chapter's calendar and share what they learned |
| **BRIDGEGOOD steward** (Morgan Ellis) | `/steward` | Review queue, review page (checklist for relevance, consent, privacy, accessibility and alignment; discuss with the contributor; label; publish or decline with a reason; tag themes), maintenance log (source, version, review date, history), recurring themes |

## Running it

```bash
npm install
cp .env.example .env.local   # optional: add an API key to switch on the Decision Lab's AI reflection helper
npm run dev
```

Open http://localhost:5173.

- `npm run build` creates a production build and `npm start` serves it.
- Checks, which CI also runs on every pull request:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run check:contrast` (every design token pair, light and dark)
  - `npm run test:unit` (the Living Playbook review workflow)
  - `npm run test:a11y` (axe plus WCAG reflow, zoom and text-spacing checks on every page, light and dark, plus the community-cycle flow tests)
- Without an API key, the reflection helper says it's off. Everything else works without it.

### Demo walkthrough
1. On **Welcome**, choose a pathway, for example "I'm a student".
2. Open the Decision Lab scenario. Work through all six steps, write a reflection, and save it.
3. Open a related Practice Library tool, then choose **Reflect and share what happened** to contribute a lesson to the Living Playbook. It says "Submitted for review" and isn't public yet.
4. **Log in** as the **BRIDGEGOOD steward**. Open the contribution, tick the review checks, label it, and publish. It now appears in the Living Playbook with the attribution the contributor chose.
5. **Log in** as the **company host**. See the host path, the projects that need a sponsor, and share a workplace reflection.
6. **Log in** as the **chapter lead**, open **Host an event**, and put a critique circle on the Chicago calendar. RSVP to it as a guest (logged out), then, as the host, choose "pretend this event has happened" and share what we learned. The steward reviews it like any other contribution.

Demo data lives in this browser's localStorage. **Reset demo data** in the footer starts again.

## How it works

- **Routes** are listed in `src/routes.ts`. Route modules are in `src/routes/`.
- **Content** is in `src/content/`: `philosophy.ts` (principles, cycle, pathways), `lab.ts`, `practice-library.ts`, `playbook.ts`, `company-host.ts`. All of it is draft copy for BRIDGEGOOD to review, and all examples are synthetic and labelled.
- **Living Playbook logic** (validation, publishing, versions, themes) is pure functions in `src/lib/playbook.ts`, unit tested in `src/lib/test/`.
- **Demo login:** `bgx-session` cookie, guarded by `requireRole` in the host and steward layout loaders. Not real authentication.
- **AI:** `src/routes/api.reflect.ts` uses the AI SDK with Claude Sonnet 5.5 (or Gemma through the AI Gateway, see `src/lib/model.server.ts`). It returns follow-up questions only, never a score.

## Guardrails we're holding ourselves to

- This is not a checklist, a slogan generator, or a marketing campaign.
- Community voice, feedback, care, and lived experience stay at the center.
- Technology supports human judgment and relationships. It doesn't replace them.
- BRIDGEGOOD keeps authorship, identity, and ownership of the philosophy.
- We use only synthetic, aggregated, anonymized, or explicitly consented participant information.
- Content follows inclusive-language and accessibility (WCAG 2.2 AA) standards.

## Where it stands and what's next

- **What's shipped:** [CHANGELOG.md](CHANGELOG.md).
- **What's next:** [docs/BACKLOG.md](docs/BACKLOG.md).
- The concept this version follows is the *Welcome Page and Community Playbook* draft. Its principles and feature descriptions should be reviewed with BRIDGEGOOD so they reflect the organization's own language, values and approved practices.
