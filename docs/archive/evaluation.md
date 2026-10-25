# Evaluation: where BridgeGoodx stands (2026-10-24)

> **Archived (October 2026).** This reviewed the app after PR #1, before milestone 2. It's kept for its reasoning. What shipped is in [CHANGELOG.md](../../CHANGELOG.md), and what's open is in [BACKLOG.md](../BACKLOG.md). The later review is [evaluation-milestone-2.md](evaluation-milestone-2.md). The team decided on **desktop-first** layouts for every role (design work happens on a laptop), so the phone-first notes below stay as a check (phone widths must still reflow, tested since #5), not a layout target.

## Status of the recommendations

| Recommendation | Section | Status |
|---|---|---|
| Put the team's framework (pillars, prompts, outcomes) in the app as the spine | Headline 1, §1 | Implemented (PR #3) |
| Reflection prompts at decision points | Headline 2, pivot 1 | Implemented (PR #3 content, PR #4 in the flows) |
| Steward queue, adaptations, versioned framework, public changelog | Headline 3, pivot 2 | Implemented (PR #7) |
| Pages for missing journey stages: choose a project, my mentee, matching, milestones, my project | §1 | Implemented (PR #4) |
| Certification and portfolio stage | §1 | Portfolio in backlog ([resilience kit slice](../BACKLOG.md#next)); certification waits on BRIDGEGOOD ([open questions](../BACKLOG.md#needs-bridgegood)) |
| One public training layer; role areas show progress | §1 | Implemented (PR #4, the `/learn` library) |
| Welcome page routes by role; terms move to the library | §1 | Implemented (PR #6) |
| Sidebars grouped into "Your path" and "Your people"; merge messages and office hours into "My mentor" | §1 | Implemented (PR #4) |
| Wayfinding: stepper, "what's next", breadcrumbs | §1 | Implemented (PR #4) |
| Links between related records (submission ↔ brief ↔ mentor) | §1 | In backlog ([Later 10](../BACKLOG.md#later)) |
| Eligibility as goals in the student's own words, no demographic fields | §2 | Implemented (PR #3, the self-check stores nothing) |
| Phone-first student and partner flows | §2 | Decided against: desktop-first, with reflow checked on every page (PR #5, PR #6) |
| Office hours beyond one time zone; cost and language | §2 | In backlog ([Later 6](../BACKLOG.md#later)) |
| Split the ambassador into chapter lead and company host | §2 | Implemented (PR #4) |
| Mentor review as a growth conversation; mentor seeded as an alum | §2 | Implemented (PR #4) |
| Show the student → alum → mentor path | §2 | In backlog ([Later 9](../BACKLOG.md#later)) |
| Rename to "Community partner"; add "Your path"; a BRIDGEGOOD review view | §2 | Implemented (PR #4; review view PR #7) |
| Community members in the partner flow (consent and feedback) | §2 | In backlog ([Later 2](../BACKLOG.md#later)) |
| Practice moments instead of course tracks | Pivot 3 | In backlog ([Next 4](../BACKLOG.md#next)) |
| "Carry it forward" kit | Pivot 4 | In backlog ([Next 5](../BACKLOG.md#next)) |
| Minimal AI Reflection Companion | Pivot 5 | Implemented (PR #4) |
| Web app issues: brief list fields, `/api/scope` validation and caps, image size, focus outline, live regions, focus management, "Start another brief", AI on/off at request time, bad demo data, security headers, checked links | §4 | Implemented (PR #3) |
| Rate limiting on the AI routes | §4 | In backlog ([Later 8](../BACKLOG.md#later)) |
| Mobile breakages (overflow, sideways scrolling) | §4 | Implemented (PR #5 and PR #6: every page passes 320px reflow) |
| US spelling, real program facts, slogans cut, inclusive language, synthetic labels, missing guides | §5 | Implemented (PR #3) |
| Jargon above grade 8 | §5 | In backlog ([Later 5](../BACKLOG.md#later)) |
| Placeholder mission statement | §5 | Waits on BRIDGEGOOD ([framework wording](../BACKLOG.md#needs-bridgegood)) |
| Ambassador adaptation feedback form | §5 | Implemented (PR #7) |
| Align the stack with BRIDGEGOOD's (React Router, Vite, TanStack Query) | §6 | Implemented (PR #3) |
| 48px targets, dark mode | §6 | Implemented (PR #3 dark mode, PR #4 targets) |
| BridgeGoodx's own visual style | §6 | Built (PR #4); approval waits on BRIDGEGOOD ([visual style](../BACKLOG.md#needs-bridgegood)) |

---

Five read-only reviews of the app at `434deaf`, plus two companion docs: [social-good.md](../social-good.md) (what the terms mean in practice) and [ai-evaluator.md](../ai-evaluator.md) (one evaluator, four uses).

## The headline

The app is a well-built **program-operations portal**: role logins, training, submissions, office hours, an AI scoping studio. The brief asks for something else: a way to **codify and spread a mindset** so it lives beyond BRIDGEGOOD's staff. Today a judge could describe the app without using the word "philosophy".

Three things close most of the gap:

1. **Put the team's own framework in the app.** The 5 pillars, 12 reflection prompts and 5 learning outcomes appear nowhere in `src/`. Instead there are 6 principles, a 5-criterion rubric and per-module outcomes, which compete with each other.
2. **Practice the philosophy at decision points, don't just describe it.** Before a student submits, while a mentor critiques, and when a partner writes a brief, show 2–3 of the reflection prompts relevant to that moment.
3. **Make the feedback loop and authorship real.** Add a BRIDGEGOOD steward queue that receives adaptations and disagreements, plus a versioned, public changelog of the philosophy. Right now the loop exists only as prose in `impact-loop.tsx`.

## 1. Content organization and information hierarchy

- **Framework missing; three competing structures.** Add `src/content/framework.ts` (pillars → outcome → prompts) and make it the spine. Student modules follow the pillars, rubric rows map to the pillars, and the Welcome page gets a "The framework" section straight after "Why". The 6 principles can stay as "how we work", presented as something separate from the pillars.
- **Journey stages with no page:**
  - Student: choose a project, capstone sprints and presentation, certification and portfolio.
  - Mentor: my mentee and pairing, curriculum guides.
  - Ambassador: vetting, recruiting mentors, matching, milestones.
  - Partner: "my project" status after submitting.
- **Training is duplicated.** Role "Training" pages re-render `/training/[audience]`. Make `/training/*` the single public "understand before you join" layer, and turn the role-area pages into progress views. Move the ambassador Keep/Adapt content out from behind login.
- **The Welcome page doesn't route by role.**
  - Hero: four "I'm a…" cards.
  - Then: Why → Framework → Loop → Terms.
  - The principles × role matrix becomes role tabs.
  - Resources (all "coming soon") move to the footer.
- **Sidebars are named for features, not tasks.** Group them into "Your path" (in stage order) and "Your people". Merge Messages and Office hours into "My mentor".
- **Wayfinding.** Add a journey stepper on each overview, "what's next" links, breadcrumbs on `/training/*`, and links between related records (submission ↔ brief ↔ mentor).

### Proposed sitemap

- **Public:** Welcome · Framework (pillars + prompts) · Training (students, mentors, ambassadors, problem owners, companies) · Capstone gallery · Find a chapter · Log in
- **Student:** Overview (stepper) · Your path: 1 Bootcamp by pillar → 2 Mini project → 3 Choose a project → 4 Capstone → 5 Certification & portfolio · Reflect · My mentor · Community of practice
- **Mentor:** Overview · Prepare (pillars, curriculum guides, rubric) · My mentee · Review & critique · Final conversation
- **Ambassador:** Overview (cohort milestones) · Vet applicants · Mentors · Problem owners & pipeline · Matching · Milestones · Toolkits · Feedback to BRIDGEGOOD
- **Partner:** Overview · Submit a problem · My project · Gallery · Toolkit & FAQs

## 2. Are the users well-defined?

Each role is clearly defined by its *job in the app*, but thinly defined as *people*: their constraints and what success looks like for them.

- **Missing stakeholders the brief names:** alumni, BRIDGEGOOD staff, volunteers, outside communities, and the community members a partner serves. Nobody in the app receives "BRIDGEGOOD reviews this".
- **Student scope conflicts.** The spec says US, but there are global chapters. "Vetted for eligibility" (low income, minorities, women) invites collecting sensitive data. Frame eligibility as goals and barriers in the student's own words, store no demographic fields, and point to bridgegood.com/apprenticeship for the official criteria.
- **Real constraints are ignored.** Students and partners are the most phone-dependent users, but the app is desktop-first. Office hours are Pacific time only. Cost and language are never addressed.
- **The ambassador role is overloaded:** chapter steward + company host + vetter/matcher. Split it into **Chapter steward** and **Company host** (the company host absorbs the orphaned "company" training audience).
- **Mentors "evaluate success/failure".** That contradicts the brief's "don't push one definition of success". Reframe it as a growth conversation that starts from the student's self-assessment. Recruit mentors from alumni and community members too, not only big tech.
- **One role per session** (`proxy.ts`) can't show the student → alum → mentor path that is central to how BRIDGEGOOD works.

| Role | Job to be done | Key constraint | Success signal |
|---|---|---|---|
| Student | Skills, confidence and a portfolio from real community work | Phone-first, money, shifts, time zone | Can explain *why* a choice served the community; 2 portfolio pieces; an informed career choice |
| Mentor | Guide with care; honest view of industry | A few volunteer hours | Mentee reports confidence and belonging; mentor can explain the philosophy |
| Ambassador | Adapt locally; gather people and money | Day job; conflicts of interest | Chapter retros reach BRIDGEGOOD; partners sponsored |
| Community partner | Turn a pain point into a scoped brief; stay involved | No budget, low tech skills, little staff time | The handover gets used; the community they serve gives feedback |

**For the demo:**
- Rename Partner to "Community partner".
- Add a "Your path" view.
- Seed the mentor as a synthetic alum.
- Add a read-only "BRIDGEGOOD review" view.
- Represent community members inside the partner flow (consent and feedback), not as a login.

## 3. Mission fit (judge's view)

| Brief criterion | Score /5 | Why |
|---|---|---|
| Codify the values *and the reasoning* | 3 | Glossary is strong ("inclusion = changing who decides"), but the "why we believe this" is missing and the mission is a placeholder |
| Not a course by default | 2 | Course tracks with durations, "work through in order", certification |
| No checklists or slogans | 3 | Toolkits labelled "Checklist"; hero and stat cards read as marketing |
| Practiced in the flows | 2 | Rubric and scoping prompt are good; submission asks only "what did you learn?" |
| Community adaptation | 2 | A static Keep/Adapt list only |
| Feedback loop to BRIDGEGOOD | 1 | No mechanism |
| BRIDGEGOOD authorship | 3 | Stated, not structural (no versions, no attribution on principles) |
| Human judgment around AI | 4 | Draft, editable, reviewed, no personal data |
| Reach (alumni, staff, outside) | 2 | Not modelled |

**Make the delta explicit.** BRIDGEGOOD already runs a 13-week Apprenticeship, a 4-week Social Impact Accelerator and Open Labs. Rebuilding those as software isn't the contribution. Making the *reasoning* usable where BRIDGEGOOD isn't in the room is.

**Pivots, sized for a hackathon:**
1. Reflection prompts at decision points. This is the strongest demo moment, about a day of work.
2. **Philosophy commons:** canonical wording with a version, a "why we believe this" for each principle, synthetic chapter field notes, and "propose a change / share an adaptation" → steward queue → public changelog.
3. **Practice moments instead of course tracks:** short synthetic scenarios from the brief's hard topics (a critique gets heated, a partner wants to skip interviews), each with BRIDGEGOOD's reasoning shown.
4. **"Carry it forward" kit** for outside teachers and community leaders: run one critique session with the prompts, attribution built in, and one click to tell BRIDGEGOOD what you changed.
5. **A minimal AI Reflection Companion:** it asks the prompts about *your* submission, never scores, and passes conversation starters to the mentor. See [ai-evaluator.md](../ai-evaluator.md).

## 4. Web application issues

Lint is clean and the build passes. `tsc --noEmit` fails on a clean checkout (missing generated `PageProps`/`LayoutProps`) until `next typegen` or a build runs. Set `turbopack.root` in `next.config.ts`.

| Severity | Where | Issue → fix |
|---|---|---|
| Blocker | `scoping-studio.tsx:215` | List fields in the brief strip spaces and newlines on every keystroke, so they can't be typed into. Keep the raw string and split only on submit. |
| High | `api/scope/route.ts:28` | Body and messages aren't validated; system-role messages can be injected; no caps; not behind the proxy; no rate limit. Fix: `safeValidateUIMessages`, user/assistant roles only, caps, `maxOutputTokens`, require the partner session, rate limiting. |
| High | `scoping-studio.tsx:23` | 4 MB images become ~5.3 MB base64, over Vercel's 4.5 MB body limit, and history resends them every turn. Downscale on the client, drop old file parts, check size on the server. |
| High | `ui/button.tsx:6`, `input.tsx:11`, `textarea.tsx:9` | `outline-none` kills the 3px focus outline; the replacement ring is 2.36:1, which fails WCAG 1.4.11. Use a full-opacity ring with an offset. |
| Medium | `scoping-studio.tsx:87`, `community.tsx:56` | Whole lists set as `aria-live`, so streamed tokens are read out in fragments. Use one sr-only status. |
| Medium | office hours, brief submit, master–detail lists | Focus is lost to `<body>`; error summaries aren't focused or linked to their fields; no `aria-describedby` or `aria-invalid`. |
| Medium | `scoping-studio.tsx:248` | "Start another brief" restores the old draft. |
| Medium | `partner/submit/page.tsx:8` | AI on/off is fixed at build time because the page is static. |
| Medium | `demo-store.ts:28` | Bad localStorage data crashes the page; there's no `error.tsx`. |
| Low | `next.config.ts`, `actions.ts:12`, `submissions.tsx:297`, `--border` token | No security headers; cookie isn't `secure`; user links aren't checked; borders are 1.45:1. |

**Mobile breakages:**
- Chat is `min-h-[40rem]` above the brief, and the "Updated your brief →" arrow points off-screen.
- Map pins are about 2px at 375px.
- The map's list scrolls inside the page and can't take keyboard focus.
- Long URLs and filenames overflow.
- The table of contents is hidden below `lg`.
- The 8-tab strip scrolls sideways with no hint.

No dead links.

## 5. Content improvements

- **BRIDGEGOOD's voice** (bridgegood.com/design): supportive, direct, trustworthy, approachable; grade 6–8 reading level; sentence case; gender-neutral; **US spelling**. The app has ~40 UK spellings (organisation, centred, programme, colour, practise).
- **Facts that conflict with real programs.** The partner FAQ says capstones take "8–12 weeks", but the Accelerator is a 4-week sprint ending at Demo Day. BRIDGEGOOD says "apprentices", the app says "students". Global chapters should be labelled "proposed chapter model (concept)".
- **Slogans to cut or replace with concrete statements:**
  - the hero h1
  - "Care is the method"
  - "Grow while you give"
  - "A steward, not a franchise"
  - "Every project leaves… a little stronger"
  - the "4 roles" stat
- **Placeholder mission statement** is visible on `/`.
- **Inclusive language.** Never use "under-privileged" or "minorities" (keep them out of the pitch too). Prefer "people from groups underrepresented in design" and asset-based framing. Pick one person-first or identity-first convention. Replace "prams" with "strollers" and "low literacy" with "prefer images to text".
- **Jargon above grade 8:** "social-worker-informed", CSR/ERG/L&D, "vanity metrics", and "capstone" (undefined for partners).
- **Synthetic labels** are missing on seeded people in submissions, messages and community posts. Gallery outcomes are stated as fact.
- **Missing pieces:**
  - 5 pillars page
  - 12 prompts
  - Mock Case and Real Case how-tos (for mentors)
  - AI & Social Good teaching guide
  - student eligibility self-check (nothing stored)
  - mentor commitment
  - partner FAQ (hours, eligibility, upkeep, how screenshots are handled)
  - ambassador vetting criteria and an adaptation feedback form
  - inclusive language guide

## 6. Design system and stack alignment

Source: bridgegood.com/design and bridgegood.com/stack.

| | BRIDGEGOOD | BridgeGoodx today |
|---|---|---|
| UI framework | React 18.3, Vite 5, React Router 7, TanStack Query 5 | Next.js 16 (App Router), React 19 |
| Styling | Tailwind 3 with Material 3 tokens; Framer Motion | Tailwind 4, shadcn/ui on Base UI |
| Icons | Material Symbols Rounded | lucide |
| Data / auth | Supabase (Postgres with row-level security, Auth, Storage, Realtime, Deno edge functions) | Demo cookie + localStorage |
| Colour | Navy `#003366`, royal `#0059B3` (primary), gold `#CC9900` (secondary; **2.16:1, so use Amber Bronze `#AB6624` for text under 24px**), tertiary `#2D8686`, error `#B3261E`, surface `#FAFCFF`, on-surface `#1A1D1F` | Placeholder teal and role hues |
| Type | Material 3 scale (Display 57 → Label 14) | Custom |
| Targets | 48dp | 44px |
| Theme | Dark mode, reduced motion | Light only, reduced motion |
