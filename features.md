# BridgeGoodx features

BridgeGoodx is a prototype of how BRIDGEGOOD's Design for Social Good philosophy could be shared, practiced and improved. BRIDGEGOOD authors and owns the philosophy. Every person, chapter, organization and project shown is synthetic, and demo data lives in the browser.

## Roles

| Role | Who | Home |
| --- | --- | --- |
| Apprentice | Student learning UI/UX and design thinking on real community problems | `/student` |
| Mentor | Volunteer who guides apprentices | `/mentor` |
| Ambassador | Chapter lead or company host who carries the philosophy to a city or organization | `/ambassador` |
| Community partner | Nonprofit or community organization that brings a design problem | `/partner` |
| BRIDGEGOOD steward | Program staff who keep the framework | `/steward` |

Login is a demo cookie (no password): "Log in as…" picks a synthetic account for a role.

## Public pages

- **Welcome page (`/`)**: animated "Design for … social good" title (still under reduced motion), three "I'm a …" entry cards (apprentice, chapter lead, community partner), smaller links for mentors and company hosts, and a "Toolkits for any role" section.
- **Library (`/learn`)**: the philosophy and training, with one stable URL per page.
  - Pillars (`/learn/pillars/:id`), reflection prompts (12), glossary of terms, and the self-check.
  - Role tracks (`/learn/tracks/:slug`) and guides (`/learn/guides/:slug`).
  - **Practice moments** (`/learn/practice`): synthetic dilemmas with BRIDGEGOOD's draft reasoning. Never scored; your choice stays in the browser unless you share it.
  - **Carry-it-forward kit** (`/learn/carry-it-forward`): public, printable session plan for groups outside BRIDGEGOOD, with feedback read back through a reply code (`/learn/carry-it-forward/reply`).
  - **Public changelog** (`/learn/changelog`): version history of the framework wording, with credit for where each change came from.
- **Chapters (`/chapters`, `/chapters/:id`)**: a proposed, synthetic chapter model. Chapter list plus an interactive world map (MapLibre, OpenFreeMap tiles). Locations are city-level only; contact is a shared chapter inbox, never a personal address. The list works without the map.
- **Community events (`/events`, `/events/:id`, `/events/host`)**: Luma-style chapter calendars (not ticketing).
  - Six templates: critique circle, site visit, portfolio review, listening session, Demo Day, chapter meetup.
  - Event pages with RSVP; access details are required and places are an area only.
  - Host form, and a "what we learned" write-up after the event that feeds the feedback loop.
- **Design system page (`/design`)**: showcase of Bridge Studio and its signature components.

## Apprentice area (`/student`)

- **Your path**: stepper through the apprentice journey.
- **Practice**: practice moments embedded in the path.
- **Choose a project**: browse community problems.
- **Submissions and feedback**: submit work and read feedback.
- **Reflection Companion** (AI): reviews your reflection against the BRIDGEGOOD rubric, starting from your own words. Personal-data screen, editable draft output, feedback controls on every review, and a "How this was made" note naming the model and host.
- **My mentor**: saved questions, office hours, messaging (saved in this browser).
- **Community of practice**.

## Mentor area (`/mentor`)

- **Prepare**: training for giving feedback with care.
- **Growth conversations**: structured conversations that start from the apprentice's own reflection.
- **My mentee**: mentee progress and conversation.

## Ambassador area (`/ambassador`)

- **Playbook**: starting and running a chapter or company-host program.
- **Matching and milestones**: pair partners, apprentices and mentors; track progress.
- **Partner pipeline**: incoming partner problems.
- **Outreach and partner toolkits**.

## Community partner area (`/partner`)

- **Submit a problem** with a **scoping studio** (AI): conversational help to turn a need into a brief. Includes a required "How will the people you serve shape this?" field. The AI output sits in a draft frame, and the partner stays the author.
- **My project and team**, including a retrospective.
- **Project gallery** of example projects.
- **Toolkit and FAQs**.

## Steward area (`/steward`)

- **Inbox**: all feedback in one place (from apprentices, mentors, ambassadors, partners, event hosts and outside groups using the kit).
- **Feedback detail**: the steward decides on each item, always with a reason; the sender sees the outcome.
- **Versions and wording**: the only place the framework's official wording changes, with version history feeding the public changelog.
- **Adaptations**: communities can propose local adaptations ("didn't fit", "propose an adaptation"), with chapter field notes.

## AI features

All AI is labelled, shown in a draft frame until a person edits or accepts it, never asks for personal data, and leaves the final decision to a human.

- **Reflection Companion** (`/api/reflect`): rubric-based review with a contrast checker, review panel and feedback controls.
- **Partner scoping assistant** (`/api/scope`).
- **Model providers**: Gemma first (local via Ollama or LM Studio, Google AI Studio, OpenRouter), Claude as the fallback. Free tiers stay off unless explicitly set to synthetic-only.
- Offline contract tests and golden-set comparison script.

## Design and accessibility

- **Bridge Studio** design system with tokens, a `type-*` scale, light and dark themes, and signature components (`DraftFrame`, `PeopleChip`, `Path`, `PinnedNote`, `Highlight`, `RoleBadge`, `FieldNote`).
- WCAG 2.2 AA: axe checks, reflow, zoom and text-spacing checks on every page in light and dark, plus a contrast check.
- Desktop-first layout; inclusive, plain language.

## Tech stack

- **Framework**: React Router 7 (framework mode, server rendering) on Vite 8
- **UI**: React 19, Tailwind CSS 4, shadcn/ui on Base UI, Lucide icons
- **Data**: TanStack Query 5, zod 4; no database (demo data and steward decisions in browser localStorage)
- **AI**: AI SDK v7, with Gemma providers and Claude as the fallback
- **Maps**: MapLibre GL with OpenFreeMap tiles (no key)
- **Auth**: demo cookie `bgx-session` (httpOnly)
- **Deploy**: Vercel (`@vercel/react-router` preset)
- **Checks (CI on every PR)**: typecheck, lint, build, contrast, unit tests, accessibility tests (axe plus WCAG reflow/zoom/spacing)

## Not built yet

See [docs/BACKLOG.md](docs/BACKLOG.md): AI lenses for mentors, partners and ambassadors, live model verification, the resilience kit slice, more practice moments, a real store and accounts, and the dual-outcome project view.
