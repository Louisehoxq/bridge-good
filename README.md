# BridgeGoodx

A hackathon-for-social-good project exploring how [BRIDGEGOOD](https://bridgegood.org) can codify and scale its **Design for Social Good** philosophy, so that students, alumni, mentors, volunteers, staff, partners, and outside communities can understand it, practice it, teach it, improve it, and carry it forward as the organization grows beyond any one person.

## The challenge

> How might BRIDGEGOOD codify and scale its Design for Social Good philosophy so students, alumni, mentors, volunteers, staff, partners, and outside communities can understand, practice, and carry it forward as the organization grows beyond any one person?

**Codifying** means making the values and the reasoning behind BRIDGEGOOD's work explicit and shareable.
**Success** means more people can explain how and why BRIDGEGOOD works, and can put that understanding into practice.

The full brief is in [docs/challenge.md](docs/challenge.md).

## Project brief

A mobile-ready website with a different view and layout for each of three archetypes:

1. **Students & early-career designers** from under-resourced backgrounds (low income, minorities, women and others). They learn UI/UX and design thinking while contributing to social-impact outcomes, get early industry exposure, and build a portfolio that leads to good jobs.
2. **Ambassadors**, vetted by BRIDGEGOOD, in states beyond California and in global cities, often inside large organisations. They learn the philosophy and frameworks, then rally funding, resources and mentors around problems from problem owners.
3. **Problem owners**: non-profits and social organisations that have a problem better design could fix, but lack the resources to fix it themselves.

All three are connected by one loop: **problem owner shares a problem → ambassador gathers support → students design with the community → feedback improves the philosophy.** Each view shows the visitor where they sit in that loop. Each principle is shown as what it asks *that* archetype to do, so the philosophy is something to practise rather than a set of slogans.

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Use `npm run build` for a production build and `npm run lint` to lint.

## How it works

- **Routes:** `/` (the "Who are you?" chooser), `/students`, `/ambassadors`, `/problem-owners`. Visitors choose for themselves, with no login, and can switch at any time from the menu.
- **Last view:** visiting an archetype page sets a `bgx-archetype` cookie, so the landing page can offer "Continue". It never hides the other choices.
- **Theming:** `data-archetype` on each view sets the accent colour. All brand tokens live in `src/app/globals.css`. See [docs/design-system.md](docs/design-system.md).
- **Content:** editable copy and data live in `src/content/`. Every person, organisation and project is a **synthetic example** and labelled as one.
- **Forms:** demo only. They validate with zod and confirm, but store nothing.

## Repository layout

```
docs/
  challenge.md        Full problem statement, current process, ideal outcome, risks & guardrails
  design-system.md    Token locations, accessibility baseline, interim writing rules
src/
  app/
    page.tsx          Landing + archetype chooser
    (archetypes)/     students/, ambassadors/, problem-owners/ — each with its own layout
  components/         Header/switcher, impact loop, principles, problem board, demo form
  components/ui/      shadcn/ui primitives (Base UI)
  content/            principles.ts, problems.ts (synthetic)
  lib/archetype.ts    Archetype definitions, labels, nav
```

## Guardrails we're holding ourselves to

- This is not a checklist, a slogan generator, or a marketing campaign.
- Community voice, feedback, care, and lived experience stay at the centre.
- Technology supports human judgment and relationships. It doesn't replace them.
- BRIDGEGOOD keeps authorship, identity, and ownership of the philosophy.
- We use only synthetic, aggregated, anonymized, or explicitly consented participant information.
- Content follows inclusive-language and accessibility (WCAG 2.2 AA) standards.

## Status

First working prototype. **Still to come:** the official BRIDGEGOOD Design System, the wireframe and architecture, and real content assets.
