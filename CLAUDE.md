# BridgeGoodx: working notes for Claude

@AGENTS.md

## Stack

React Router 7 in framework mode on Vite 8 (`src/` is the app directory, server rendering on), React 19, TanStack Query 5, Tailwind 4, shadcn/ui on Base UI (`render` prop, not `asChild`), zod 4, and AI SDK v7 (docs in `node_modules/ai/docs`). No database: demo data lives in the browser. Deploy on Vercel (the `@vercel/react-router` preset switches on when `VERCEL` is set).

- Routes are listed in `src/routes.ts`; route modules live in `src/routes/`. Use `meta` exports with `pageMeta()` from `src/lib/meta.ts` for titles.
- Layout is **desktop-first**. Public pages use `AppShell`. Role areas (`src/routes/{student,mentor,ambassador,partner}`) use a layout route with `RoleShell` and a sidebar driven by `ROLE_INFO` in `src/lib/roles.ts`.
- Login is a demo cookie (`bgx-session`, httpOnly) handled in `src/lib/session.server.ts`. Each role layout's `loader` calls `requireRole`, and the root loader exposes the role to `useSessionRole()`. Interactive data goes through `useCollection` in `src/lib/demo-store.ts`.
- Design tokens follow the BRIDGEGOOD Design System (Material 3) and live in `src/app.css`. Icons are Material Symbols Rounded via `<Icon>` in `src/components/icon.tsx`. See `docs/design-system.md` before changing styles or copy.

## AI features

- Every AI surface must be labelled as AI, leave the human with the final decision (editable output, BRIDGEGOOD review), and never request personal data.
- Partner scoping is the resource route `src/routes/api.scope.ts` (validated messages, partner session required, size caps). Server-only helpers are in `src/lib/ai.server.ts`.

Hackathon project for BRIDGEGOOD: codify and scale the Design for Social Good philosophy. The full brief is in `docs/challenge.md`. Read it before proposing concepts or writing content.

## Non-negotiables (from the brief)

- No checklists, slogans, inspirational quotes, or marketing copy standing in for the philosophy. Give "social good", "inclusion", "access", and "human-centered" concrete, specific meaning.
- Don't default to a course or training format.
- Technology supports human judgment and relationships (mentors, staff, community). It must not replace them. Any AI feature should keep a human in the loop and say clearly where it is limited.
- Use only synthetic, aggregated, anonymized, or explicitly consented participant data. Never invent stories presented as real BRIDGEGOOD participants. Label synthetic examples as synthetic.
- Keep BRIDGEGOOD's authorship and ownership of the philosophy visible.
- Allow for different communities to interpret and adapt the philosophy, with feedback loops back to BRIDGEGOOD.
- Accessibility (WCAG 2.2 AA) and inclusive language in all UI and content.
