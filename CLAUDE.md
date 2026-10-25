# BridgeGoodx: working notes for Claude

@AGENTS.md

## Stack

React Router 7 in framework mode on Vite 8 (`src/` is the app directory, server rendering on), React 19, TanStack Query 5, Tailwind 4, shadcn/ui on Base UI (`render` prop, not `asChild`), zod 4, and AI SDK v7 (docs in `node_modules/ai/docs`). No database: demo data lives in the browser. Deploy on Vercel (the `@vercel/react-router` preset switches on when `VERCEL` is set).

- Routes are listed in `src/routes.ts`; route modules live in `src/routes/`. Use `meta` exports with `pageMeta()` from `src/lib/meta.ts` for titles.
- Layout is **desktop-first**. Public pages use `AppShell`. Role areas (`src/routes/{student,mentor,ambassador,partner}`) use a layout route with `RoleShell` and a sidebar driven by `ROLE_INFO` in `src/lib/roles.ts`.
- Login is a demo cookie (`bgx-session`, httpOnly) handled in `src/lib/session.server.ts`. Each role layout's `loader` calls `requireRole`, and the root loader exposes the role to `useSessionRole()`. Interactive data goes through `useCollection` in `src/lib/demo-store.ts`.
- The design system is **Bridge Studio**: spec and implementation notes in `DESIGN.md`, static showcase in `docs/design/examples.html` (update it when tokens or signature components change). Tokens live in `src/app.css`; use the `type-*` scale and Bridge Studio token names, not the old Material 3 aliases. Icons are Lucide via `<Icon>` in `src/components/icon.tsx`. Signature components (`DraftFrame`, `PeopleChip`, `Path`, `PinnedNote`, `Highlight`, `RoleBadge`, `FieldNote`) are in `src/components/studio/` and shown on `/design`.
- The public library is `/learn` (content in `src/content/framework.ts`, `guides.ts`, `training.ts`). Role areas link into it; they don't copy training content.
- Practice moments (`/learn/practice`, content in `src/content/practice.ts`, components in `src/components/practice/`) are synthetic dilemmas with BRIDGEGOOD's draft reasoning: never scored, and the choice stays in component state unless shared. The carry-it-forward kit (`/learn/carry-it-forward`, content in `src/content/carry-forward.ts`) is public and printable; its feedback is the "outside-community" kind, read back with a reply code at `/learn/carry-it-forward/reply` (the code never goes in a URL).
- Community events (`/events`, `/events/:id`, `/events/host`) are Luma-style chapter calendars, not ticketing: rules in `src/lib/events/`, templates and synthetic seeds in `src/content/events.ts`, components in `src/components/events/`. Access details are required, places are an area only, and use `useServerNow()` (root loader) for anything date-dependent so server and browser agree. The host's "what we learned" is the `event-learning` feedback kind.
- Chapters (`/chapters`, `/chapters/:id`) are a synthetic, proposed chapter model in `src/content/chapters.ts`: city-level coordinates only, a shared `example.org` chapter inbox, never a personal address. The map (`src/components/chapters/chapter-map.tsx`) is MapLibre GL with OpenFreeMap tiles (no key), loaded in an effect so it never runs on the server. It's an enhancement: the chapter list does everything without it. MapLibre's worker is bundled by Vite in the build and served from `node_modules` by a dev-only plugin in `vite.config.ts`.
- Checks: `npm run typecheck`, `lint`, `build`, `check:contrast`, `test:unit` and `test:a11y` (axe plus WCAG reflow, zoom and text-spacing checks on every page, light and dark). CI runs them on every PR.
- Evaluations: `/evaluate-mission` scores the app against the brief and writes `docs/evaluation-<label>.md`; `/evaluate-rubric` scores it against the judging rubric and demo readiness and writes `docs/evaluation-rubric-<label>.md`. Both are project skills in `.claude/skills/`, keep the criteria fixed so scores compare, and archive the previous report.

## AI features

- Every AI surface must be labelled as AI, show its output in a `DraftFrame` until a person edits or accepts it, leave the human with the final decision (editable output, BRIDGEGOOD review), and never request personal data.
- Partner scoping is the resource route `src/routes/api.scope.ts`, and the student Reflection Companion is `src/routes/api.reflect.ts` with `src/lib/evaluator/`. Both validate messages, require the right session and cap sizes. Server-only helpers are in `src/lib/ai.server.ts`. The design is in `docs/ai-evaluator.md`.
- The companion's model is `EVALUATOR_PROVIDER` in `src/lib/evaluator/model.server.ts`: Gemma first (`gemma-local`, `gemma-google`, `gemma-openrouter`), Claude as the fallback. Setup and the provider table are in `docs/gemma-prototype.md`; `npm run keys` manages `.env.local`. Free tiers may train on inputs, so they stay off without `EVALUATOR_FREE_TIER=synthetic-only` and must only ever see synthetic examples. Provider changes need the offline contract tests in `src/lib/evaluator/test/providers.test.ts` to pass.

## Keep the docs current

Every PR, in the same PR:
- adds a line to `CHANGELOG.md` under "Unreleased": what changed for each role it touches, then technical highlights
- updates `docs/BACKLOG.md`: removes the items it finishes and adds any it finds or leaves open
- updates this file when conventions, structure or commands change

Superseded reviews and plans go to `docs/archive/` with a status table, not deleted.

## Roadmap

- Milestone 3 (built): the feedback loop. The steward role (`/steward`) is the only one that decides on feedback or changes the framework's official wording, always with a reason. Rules and store are in `src/lib/feedback/`, components in `src/components/feedback/`, version history in `src/content/framework-history.ts`, and the public changelog at `/learn/changelog`. Existing pages show it through small hooks marked "Milestone 3". Next: see `docs/BACKLOG.md`.

Hackathon project for BRIDGEGOOD: codify and scale the Design for Social Good philosophy. The full brief is in `docs/challenge.md`. Read it before proposing concepts or writing content.

## Non-negotiables (from the brief)

- No checklists, slogans, inspirational quotes, or marketing copy standing in for the philosophy. Give "social good", "inclusion", "access", and "human-centered" concrete, specific meaning.
- Don't default to a course or training format.
- Technology supports human judgment and relationships (mentors, staff, community). It must not replace them. Any AI feature should keep a human in the loop and say clearly where it is limited.
- Use only synthetic, aggregated, anonymized, or explicitly consented participant data. Never invent stories presented as real BRIDGEGOOD participants. Label synthetic examples as synthetic.
- Keep BRIDGEGOOD's authorship and ownership of the philosophy visible.
- Allow for different communities to interpret and adapt the philosophy, with feedback loops back to BRIDGEGOOD.
- Accessibility (WCAG 2.2 AA) and inclusive language in all UI and content.
