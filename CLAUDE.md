# BridgeGoodx: working notes for Claude

@AGENTS.md

## Stack

Next.js 16 (App Router, `src/`, Cache Components on), Tailwind 4, shadcn/ui on Base UI (`render` prop, not `asChild`), zod 4, and AI SDK v7 (docs in `node_modules/ai/docs`). Deploy on Vercel.

- Layout is **desktop-first**. Public pages use `AppShell`. Role areas (`src/app/{student,mentor,ambassador,partner}`) use `RoleShell` with a sidebar driven by `ROLE_INFO` in `src/lib/roles.ts`.
- Login is a demo cookie (`bgx-session`), guarded by `src/proxy.ts`. Interactive data goes through `useCollection` in `src/lib/demo-store.ts`.
- Brand tokens are in `src/app/globals.css`. See `docs/design-system.md` before changing styles or copy.

## AI features

- Every AI surface must be labelled as AI, leave the human with the final decision (editable output, BRIDGEGOOD review), and never request personal data.
- Partner scoping lives in `src/app/api/scope/route.ts`.

Hackathon project for BRIDGEGOOD: codify and scale the Design for Social Good philosophy. The full brief is in `docs/challenge.md`. Read it before proposing concepts or writing content.

## Non-negotiables (from the brief)

- No checklists, slogans, inspirational quotes, or marketing copy standing in for the philosophy. Give "social good", "inclusion", "access", and "human-centered" concrete, specific meaning.
- Don't default to a course or training format.
- Technology supports human judgment and relationships (mentors, staff, community). It must not replace them. Any AI feature should keep a human in the loop and say clearly where it is limited.
- Use only synthetic, aggregated, anonymized, or explicitly consented participant data. Never invent stories presented as real BRIDGEGOOD participants. Label synthetic examples as synthetic.
- Keep BRIDGEGOOD's authorship and ownership of the philosophy visible.
- Allow for different communities to interpret and adapt the philosophy, with feedback loops back to BRIDGEGOOD.
- Accessibility (WCAG 2.2 AA) and inclusive language in all UI and content.
