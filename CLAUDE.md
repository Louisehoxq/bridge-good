# BridgeGoodx: working notes for Claude

@AGENTS.md

## Stack

React Router 7 in framework mode on Vite 8 (`src/` is the app directory, server rendering on), React 19, TanStack Query 5, Tailwind 4, shadcn/ui on Base UI (`render` prop, not `asChild`), zod 4, and AI SDK v7 (docs in `node_modules/ai/docs`). No database: demo data lives in the browser. Deploy on Vercel (the `@vercel/react-router` preset switches on when `VERCEL` is set).

- Routes are listed in `src/routes.ts`; route modules live in `src/routes/`. Use `meta` exports with `pageMeta()` from `src/lib/meta.ts` for titles.
- The site follows the community experience cycle (Understand → Practice → Reflect and Share → Teach and Evolve). Public pages use `AppShell` and `PublicPage` from `src/components/cycle.tsx`, which shows the page's cycle stage and next step. Content lives in `src/content/` (`philosophy.ts`, `lab.ts`, `practice-library.ts`, `playbook.ts`, `company-host.ts`).
- Only two areas need the demo login: company host (`/host`) and BRIDGEGOOD steward (`/steward`). They use a layout route with `RoleShell` and a sidebar from `ROLE_INFO` in `src/lib/roles.ts`. Login is a demo cookie (`bgx-session`, httpOnly) in `src/lib/session.server.ts`; each layout's `loader` calls `requireRole`.
- Community events (`/events`, `/events/:id`, `/events/host`) are chapter calendars, not ticketing: rules in `src/lib/events/`, templates and synthetic seeds in `src/content/events.ts`, components in `src/components/events/`. Only chapter leads, community partners and company hosts host (`HOST_ROLES`); anyone can RSVP, as a guest if logged out. Use `useServerNow()` for anything date-dependent. The host's "what we learned" becomes a Living Playbook contribution (`event-learning`), reviewed by the steward. Events belong to Reflect and Share.
- Chapters (`/chapters`, `/chapters/:id`) are a synthetic, proposed chapter model in `src/content/chapters.ts`: city-level coordinates only, a shared `example.org` inbox. The map (`src/components/chapters/chapter-map.tsx`) is MapLibre GL with OpenFreeMap tiles, loaded in an effect so it never runs on the server; the list works without it. Chapters belong to Teach and Evolve.
- Interactive data (Lab reflections, Playbook contributions, review state) goes through `useCollection` in `src/lib/demo-store.ts`. Living Playbook rules are pure functions in `src/lib/playbook.ts`, unit tested in `src/lib/test/`.
- The design system is **Bridge Studio**: spec and implementation notes in `DESIGN.md`, static showcase in `docs/design/examples.html` (update it when tokens or signature components change). Tokens live in `src/app.css`; use the `type-*` scale and Bridge Studio token names, not the old Material 3 aliases. Icons are Lucide via `<Icon>` in `src/components/icon.tsx`. Signature components (`DraftFrame`, `PeopleChip`, `Path`, `PinnedNote`, `Highlight`, `RoleBadge`, `FieldNote`) are in `src/components/studio/` and shown on `/design`.
- Checks: `npm run typecheck`, `lint`, `build`, `check:contrast`, `test:unit` and `test:a11y` (axe plus WCAG reflow, zoom and text-spacing checks on every page, light and dark). CI runs them on every PR.

## AI features

- Every AI surface must be labelled as AI, show its output in a `DraftFrame` until a person edits or accepts it, leave the human with the final decision (editable output, BRIDGEGOOD review), and never request personal data.
- The only AI surface is the Decision Lab's reflection helper: `src/routes/api.reflect.ts`, model choice in `src/lib/model.server.ts`. It validates and caps input, rejects contact details, and returns follow-up questions only. It never grades or picks an approach.

## Keep the docs current

Every PR, in the same PR:
- adds a line to `CHANGELOG.md` under "Unreleased": what changed for each role it touches, then technical highlights
- updates `docs/BACKLOG.md`: removes the items it finishes and adds any it finds or leaves open
- updates this file when conventions, structure or commands change

Superseded reviews and plans go to `docs/archive/` with a status table, not deleted.

## Roadmap

- v3 (built): rebuilt around the Welcome Page and Community Playbook concept. The earlier apprentice, mentor, chapter lead, partner and feedback-loop areas were removed; only the company host was kept, as an extra role. Next: see `docs/BACKLOG.md`.

Hackathon project for BRIDGEGOOD: codify and scale the Design for Social Good philosophy. The full brief is in `docs/challenge.md`. Read it before proposing concepts or writing content.

## Non-negotiables (from the brief)

- No checklists, slogans, inspirational quotes, or marketing copy standing in for the philosophy. Give "social good", "inclusion", "access", and "human-centered" concrete, specific meaning.
- Don't default to a course or training format.
- Technology supports human judgment and relationships (mentors, staff, community). It must not replace them. Any AI feature should keep a human in the loop and say clearly where it is limited.
- Use only synthetic, aggregated, anonymized, or explicitly consented participant data. Never invent stories presented as real BRIDGEGOOD participants. Label synthetic examples as synthetic.
- Keep BRIDGEGOOD's authorship and ownership of the philosophy visible.
- Allow for different communities to interpret and adapt the philosophy, with feedback loops back to BRIDGEGOOD.
- Accessibility (WCAG 2.2 AA) and inclusive language in all UI and content.
