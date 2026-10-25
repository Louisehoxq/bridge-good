# Changelog

Release notes for BridgeGoodx, newest first. Each entry is one merged pull request: what changed for each role, then the technical highlights. Open work lives in [docs/BACKLOG.md](docs/BACKLOG.md).

Every person, chapter, organization and project in the app is a synthetic example. BRIDGEGOOD authors and owns the Design for Social Good philosophy; the app is a prototype of how it could be shared, practiced and improved.

The roles are: **apprentice** (BRIDGEGOOD's word for a student), **mentor**, **ambassador** (a **chapter lead** or a **company host**), **community partner**, and **BRIDGEGOOD steward** (program staff who keep the framework).

---

## Unreleased

### A new welcome page: "Design for …" and three ways in

**For everyone:** the home page has a bigger title, "Design for social good", whose last words run once through people, purpose, passion, community and impact, each in its own color, then settle on "social good" (under 5 seconds, so no pause button is needed; it never moves under reduced motion, and screen readers hear "Design for Social Good" once). The intro under it is now one sentence. Practice moments, the carry-it-forward kit and the 12 reflection prompts now have their own "Toolkits for any role" section below the hero instead of sitting among the roles.

**Apprentices, chapter leads and community partners:** each gets a large "I'm a …" card that leads to the library page written for them.

**Mentors and company hosts:** a smaller "I'm a …" link each, under the three main cards.

Technical: `HeroTitle` in `src/components/hero-title.tsx` stacks every word in one grid cell so the line never changes width, and starts only after hydration. DESIGN.md notes the hero as the one allowed autoplay.

### Removed the "version 0.1 … updated Oct 24, 2026" line

**For everyone:** the home page and the Learn page no longer show the framework's version, draft status or "updated" date. The note that BRIDGEGOOD owns and approves the wording stays. Technical: `FRAMEWORK_META.updated` is gone; the version history at `/learn/changelog` keeps its dates.

### Anthropic key testing steps

- `docs/gemma-prototype.md` explains how to test the companion with an Anthropic key, the fallback to Gemma. Docs only.

### Reflection Companion: Gemma first, on free and local providers

The companion can now run on Gemma 4, Google's open-weights model, on your own machine or on a free tier, with Claude as the fallback. Nothing has run against a live model yet.

**Apprentices**
- "How this was made" names the model and the host that wrote the review, and says when a free tier wrote it. Only a Gemma model is credited to Google.
- When a free tier runs the companion, the form says so before you send anything: use synthetic examples only.

**For the team**
- `EVALUATOR_PROVIDER` accepts `gemma-local` (Ollama, LM Studio, llama.cpp or vLLM: no key, and data stays on your machine), `gemma-google` (Google AI Studio free tier), `gemma-openrouter`, `gemma-gateway` and `claude`. Switching is an environment change, not a code change.
- Free tiers may use inputs to improve the host's products, so they stay off until whoever deploys sets `EVALUATOR_FREE_TIER=synthetic-only`.
- `npm run keys` sets, reads and checks keys in `.env.local` with hidden input and masked output, writes the file owner-only, and asks before turning on a free tier.
- `docs/gemma-prototype.md` opens with **Status and setup**: every provider with what it needs, its cost and where the data goes, how to run Gemma locally on a 16 GB Mac (including Ollama's context window), and how to check each host. `docs/ai-evaluator.md` now matches the code (`/api/reflect`, the regex personal-data screen, the files as built). `.env.example` documents every variable.

**Technical**
- Offline contract tests (`src/lib/evaluator/test/providers.test.ts`, in `npm run test:unit`) run the companion's real pipeline against a fake host for each Gemma provider: request shape, reply parsing, host errors, and no personal details sent. `evaluatorModel()` takes an optional `fetch` for this.
- `readReview()` finds the JSON inside a ```json fence or a sentence around it, which open models often add; the schema check is unchanged.
- `scripts/compare-evaluators.ts --live <baseUrl>` logs in as the demo apprentice, posts each synthetic golden to a running server's `/api/reflect`, and scores the replies with time to first token, testing the whole route.
- Adds `@ai-sdk/google` and `@ai-sdk/openai-compatible`.

### Reusable evaluation skills

**For the team**
- `/evaluate-mission` scores the app against the challenge brief on the same 13 criteria as earlier evaluations, with code evidence for each score, a guardrail check and the biggest gaps, then archives the previous report.
- `/evaluate-rubric` scores what judges would see in the 4-minute pitch against the judging rubric (weighted total out of 100 plus the accessibility bonus), checks live-demo readiness (AI key, live AI runs, deploy, CI, demo routes) and ranks at most five changes by points per hour.

**Technical**
- First run: [evaluation-rubric-2026-10-25.md](docs/evaluation-rubric-2026-10-25.md) scores `main` at 53/100, mainly because the AI has never run live and the demo still closes on the kit mockup.
- The demo script ([docs/demo-script.md](docs/demo-script.md)) is now on `main`, rewritten so the live kit replaces the mockup: a synthetic community group's kit feedback is accepted by the steward as a field note, and the group reads the decision with its reply code. The partner login is gone, leaving two logins in the pitch. Beat 3 runs the companion on Gemma 4 first (Google AI Studio's free tier, synthetic examples only), with a Claude server in a second tab as the fallback and a recording as the last resort.
- Project skills in `.claude/skills/evaluate-mission/` and `.claude/skills/evaluate-rubric/` (the rubric itself is in `rubric.md` beside it). `.claude/worktrees/` is now ignored so the skills can be committed.

### A real chapter map

Stacked on community events. `/chapters` now has an interactive map of a larger, still synthetic, proposed chapter model, and every chapter has its own page.

**For everyone (no login)**
- An **interactive map** of 15 synthetic chapters: 10 in US cities, plus Toronto, Mexico City, London, Singapore and Melbourne. Pins are buttons you can reach by keyboard. Each opens a popup with the chapter lead, focus and next event. It opens on the Americas, so pins don't overlap; zoom out or choose a region for the rest.
- **Filters** for region, focus and "has upcoming events", plus search. They change the map and the list together, and say how many chapters match.
- The **chapter list** stays the full alternative to the map: every detail, "Show on the map" (moves the map without taking focus), and a link to the chapter page. If the map can't load, the page says so and the list keeps working.
- A **chapter page** at `/chapters/:id`: region, chapter lead, focus, how often it meets, member count, company hosts, community partners, a shared chapter inbox (never a personal address), upcoming events from the chapter calendar, and the chapter's field notes (local adaptations BRIDGEGOOD recognized). Everything is labelled "Synthetic example" and "Proposed chapter model (concept)". Locations are a city only.

**Chapter leads, company hosts, community partners and mentors**
- **Host an event here** on a chapter page opens the host form on that chapter's calendar. Logged out, "Log in to host" brings you back to it.

**Technical**
- MapLibre GL JS 6.12.0 (pinned exactly) with OpenFreeMap's positron and dark styles: no API key, attribution always visible. It's imported in an effect, so it never runs on the server, and switches basemap with the color scheme.
- The build bundles MapLibre's worker with Vite (`?worker&url`, `worker.format: "es"`). In dev, a small plugin in `vite.config.ts` serves MapLibre's own worker files, because Vite's dev transform adds its client to them, which can't run in a worker.
- Accessibility: pins are `<button>`s in list order, labelled with the city and upcoming events. Enter opens the popup and moves focus into it; Escape closes it and returns focus to the pin. Zoom buttons are 48px and stay focusable at the zoom limit (`aria-disabled` instead of `disabled`). Scrolling the page never zooms the map (cooperative gestures).
- `Chapter` now has `lead`, `leadOrg`, a `focus` list from `FOCUS_AREAS`, `members`, `companyHosts`, `communityPartners`, a shared `inbox`, and finer regions. `chapterLabel()` matches field notes.
- Login follows `next` back to `/chapters` pages and to `/events/host?chapter=…`.
- Tests: `tests/chapters-map.spec.ts` (keyboard pins, filters, the list without the map, hosting from a chapter page). The axe and layout checks cover every chapter page.

### Community events

Small, Luma-style chapter calendars: each event is a simple page with an RSVP, and access details are required up front. Deliberately not a ticketing platform: no payments, waitlists, reminders, calendar sync, recurring series or check-in. Every event, host and place is synthetic, and places are an area only, never an address.

**For everyone (no login)**
- **Community events** at `/events` (new "Events" link in the header and footer): upcoming events on every chapter's calendar, filtered by chapter, type and format, with past events folded below. Filters live in the URL, so `/events?chapter=chicago` is a chapter's calendar.
- An **event page** for each one: what it is, when (in the chapter's own time zone), the area or "Online", the host with their role badge, the plan, who it's for, and links into the library (the carry-it-forward kit, a practice moment, pillars).
- An **Access** block on every event: step-free access, captions or interpretation, languages, childcare and cost (always free).
- **Add to my calendar** downloads a plain `.ics` file.
- Logged out, the event page says how to join instead of offering an RSVP, and points groups outside a chapter to the carry-it-forward kit. Logging in from an event page brings you back to it.
- Each chapter's entry at `/chapters` shows its next two events and a link to its calendar.

**Apprentices, mentors, chapter leads, company hosts and community partners**
- **RSVP** with your demo account, and cancel it. A full event says so; there's no waitlist. Online events show a synthetic join link to people who RSVP'd; in-person events say the host shares the exact place.
- **Your upcoming events** on every role overview: what you're hosting or going to.

**Chapter leads, company hosts, community partners and mentors (including alumni)**
- **Host an event** at `/events/host`, with a template for each type: critique circle, site visit, portfolio review, listening session, Demo Day and chapter meetup. The critique circle is pre-filled from the carry-it-forward kit, and shows the kit's four commitments to keep. Choosing another type only replaces what you haven't changed.
- Access details are required, the area is checked for street addresses, and free text is screened for email addresses and phone numbers.
- The host sees who's coming. After the event, they send **What we learned** to BRIDGEGOOD: what they learned about the approach, what worked for access, what BRIDGEGOOD should change, and roughly how many came (a number, no names). Credit only if they tick the box. In the demo, "pretend this event has happened" opens the form early.
- Apprentices see that they host with their chapter lead.

**BRIDGEGOOD stewards**
- A new inbox type, **What we learned (event)**, and a "Community events" tag filter. It follows the same rules: a reason for every decision, credit only with consent, no personal data. The steward's reply shows on the event page.
- **Featured events** in the inbox sidebar (Demo Day and listening sessions), and "Community events" in the steward sidebar.

**Technical**
- Model in `src/lib/events/types.ts`; pure rules in `src/lib/events/logic.ts` (time zones without a library, upcoming and past, RSVP counts, the host form's checks, the `.ics` file); demo collections `community-events` and `event-rsvps` in `src/lib/events/store.ts`. Templates and synthetic seeds in `src/content/events.ts`; seed dates are days from today, so there are always upcoming and past events. Chapters now carry an IANA time zone.
- The root loader returns `now` (`useServerNow()`), so the server and the browser agree on what's upcoming. Times are labelled "Chicago time", not Intl's zone names, which differ between Node and browsers.
- Feedback types: the `event-learning` kind and an `event` target.
- Login follows `next` back to `/events` pages as well as the role's own area.
- Unit tests for the event rules (`src/lib/events/test/`), an end-to-end spec (`tests/community-events.spec.ts`) for the whole loop, and the axe and layout checks now cover every seed event page and the host form (signed in).

### Practice moments and the carry-it-forward kit

Two answers to the weakest criteria in the [milestone 3 evaluation](docs/evaluation-milestone-3.md): outside communities can now run a session without BRIDGEGOOD, and people practice judgment instead of taking a module.

**For everyone (no login)**
- **Practice moments** at `/learn/practice`: four synthetic dilemmas (skip the interviews, the AI-written persona, the pre-ticked consent box, polish or fix), filterable by pillar and role. You make a call, then see BRIDGEGOOD's draft reasoning, the prompts that matter, what each option protects and costs, and synthetic "what others chose" numbers. Never a score; the choice isn't saved unless you share it.
- **Carry-it-forward kit** at `/learn/carry-it-forward`: who it's for, a 60-minute five-step critique circle, what to keep and what to adapt, all 12 prompt cards, and a credit line with the current framework version and a copy button. It prints cleanly, without navigation or forms.
- "Tell BRIDGEGOOD what you changed" asks for no name or email. The group gets a reply code and reads the steward's answer at `/learn/carry-it-forward/reply`. Credit by name only if they tick the box.
- The welcome page and the library index link to both.

**Apprentices**
- "Talk it over with my mentor" saves a practice moment as a conversation starter, the same way the Reflection Companion shares questions. Your choice is included only if you tick it.
- A practice moment sits in the mini project step on the Practice page.

**Mentors and community partners**
- A practice moment on the mentor's Prepare page and in the partner toolkit. Mentors see apprentices' practice starters on Growth conversations.

**Everyone signed in**
- "This would play out differently in my community" sends a local adaptation on that moment to the steward. Accepted ones show as field notes on the moment.

**BRIDGEGOOD stewards**
- A new inbox type, **Outside community**, and filters for practice moments and the kit. You can reply to an outside group without knowing who they are, and accept a practice adaptation as a field note on the moment.

**Technical**
- Content in `src/content/practice.ts` and `src/content/carry-forward.ts`; components in `src/components/practice/`.
- Feedback types: the `outside-community` kind, `practice` and `kit` targets, and field notes that can belong to a practice moment instead of a pillar. Reply codes avoid look-alike characters, accept loose typing, and never go in a URL.
- Unit tests for the new decision rules and reply codes, and an end-to-end spec (`tests/practice-and-kit.spec.ts`) for both flows. The axe and layout checks cover the new pages automatically.
- A print stylesheet: the light palette on white, and the header, footer and path strip hidden.

### Docs housekeeping

- Added this changelog and a single prioritized backlog, [docs/BACKLOG.md](docs/BACKLOG.md).
- `DESIGN.md` is now the one design spec. Its new "Implementation" section replaces `docs/design-system.md`.
- The two evaluations moved to `docs/archive/`, each with a status table that maps every recommendation to the PR that did it or to the backlog. The reading-level scan from the design follow-ups is archived beside them.
- `docs/design-followups.md` is deleted: its done items are release notes below (#6) and its open items are in the backlog.
- `docs/design/examples.html` is refreshed as the static design showcase. It opens without a server or a login, and now shows the steward, the feedback loop, field notes and the type scale.
- `CLAUDE.md` asks every PR to update this changelog, the backlog and `CLAUDE.md` itself.

---

## Remove backward-compatibility code ([#8](https://github.com/deka108/hack-buildgood/pull/8), 2026-10-25)

The prototype has no past users, bookmarks or stored data, so the compatibility code added by earlier refactors goes.

**For everyone**
- Old URLs no longer redirect: `/training/*`, `/student/path`, `/student/activities`, `/mentor/submissions` and `/partner/legal`. No link in the app pointed at them.
- "Organisation" is spelled "organization" everywhere, including chapter data, the partner brief and the scoping assistant's tool schema.

**Technical**
- Deleted `src/routes/redirects.ts` and `src/routes/legacy-redirect.ts`, and their entries in `src/routes.ts`.
- `session.server.ts` reads only the object form of the `bgx-session` cookie.
- `organisationType` → `organizationType`, and the `ORGANISATION_TOOLKIT` alias is gone.
- `<Icon>` takes only kebab-case Lucide names. The Material Symbols names it used to map are gone, and every call site is updated.

---

## Milestone 3: the feedback loop ([#7](https://github.com/deka108/hack-buildgood/pull/7), 2026-10-25)

The brief asks that the philosophy keep evolving through feedback from the people who use it, with BRIDGEGOOD keeping authorship. The first evaluation scored that loop 1 out of 5 because it existed only as text. This builds it.

**BRIDGEGOOD steward** (new role, `/steward`, synthetic account Morgan Ellis)
- One inbox for every kind of feedback, tagged by pillar, guide or prompt, and filterable by status, type and tag.
- One page per piece of feedback, with a decision form: accept, decline or reply first. Every decision needs a reason.
- When accepting, the steward chooses what changes: a **field note** (a recognized local variant shown beneath the official wording, no new version), the **official wording** (publishes a new version, for example 0.1 → 0.2), or **the next review** (a public note saying what will change).
- "Versions and wording" shows the framework's history. Only the steward can change the official wording.

**Chapter lead**
- "Propose an adaptation" at the bottom of the playbook: which pillar, what the chapter changed, why, what it kept, and whether to credit the chapter.
- The playbook shows the steward's decision and reason, and lets the chapter lead answer a steward's question.

**Apprentice and mentor**
- "This didn't fit" on pillar, guide and prompt pages: one tap, with an optional note. The sender sees the outcome where they sent it from.
- The Reflection Companion's "Not right" control now reaches the steward as a count by pillar. It sends no work, names or AI text.

**Community partner**
- A project retrospective on My project and team.

**Everyone**
- A public changelog at `/learn/changelog`: each version, what changed, why, where it came from, and credit only with consent.
- Pillar pages show BRIDGEGOOD's official wording, its version, and field notes from chapters beneath it, each labelled as a local adaptation.
- The inbox also shows an aggregated community feedback card: themes and counts only.

**Technical**
- Types, rules and store in `src/lib/feedback/`; components in `src/components/feedback/`; steward routes in `src/routes/steward/`.
- Version history in `src/content/framework-history.ts`, and synthetic seed data for every feedback type in `src/content/feedback-seed.ts`.
- `src/lib/roles.ts` adds `STAFF_ROLES`, `ALL_ROLES` and `CommunityRole`. `ROLES` stays the four community roles.
- Existing pages pick it up through small hooks marked "Milestone 3" (pillar, guide and prompt pages, the playbook, the partner project, the companion's feedback controls).
- Free text is screened for email addresses and phone numbers before it's saved. AI decides nothing here.
- `tests/feedback-loop.spec.ts` walks both loops in a browser (adaptation → field note → changelog, and flag → wording change → version 0.2). `test:unit` now also runs the feedback rules (50 tests).
- Known limits: decisions live in the browser's localStorage; mentor-lens disagreement records are seed data only; the home page and library index show the static `FRAMEWORK_META.version`.

---

## Milestone 2.5: Bridge Studio on every page ([#6](https://github.com/deka108/hack-buildgood/pull/6), 2026-10-24)

Applies the design system to every page, reorganizes content as the milestone 2 evaluation recommended, and records a manual accessibility pass.

**Apprentice**
- Your path is now the home page at `/student`. Overview and Your path merged, so the sidebar has 7 items instead of 8.
- "Practice" moved to `/student/practice` so the URL matches the label.
- The Reflection Companion's review sits in an AI draft frame, and each question turns solid ("Edited by you" or "Accepted by you") once you reword it or tick keep or share.
- The home page shows your people: you, your mentor and chapter lead, or your whole project team, joined by the gold path.
- Your reflections and your mentor's feedback appear as pinned notes. The first prompt at a decision point is highlighted.

**Mentor**
- Growth conversations moved to `/mentor/conversations`, and now shows the questions apprentices shared from the companion, so the promise made on the apprentice side is true.
- My mentee shows the team and the mentee's own words as a pinned note.

**Chapter lead and company host**
- Matching shows the team once it's formed. "Mark … as reached" wraps on narrow screens.

**Community partner**
- In the scoping studio, every assistant reply sits in a frame labelled "Assistant (AI)", and every AI-filled brief field has an "Accept as written" button. A warning counts fields still in draft before you send.
- Funding and legal templates are a "coming soon" section of Toolkit & FAQs instead of their own page.
- The scoping studio transcript can be scrolled by keyboard. "Enter to send, Shift+Enter for a new line" is a visible hint, not only a placeholder.

**Everyone**
- The welcome page is shorter, routes visitors by role near the top ("Start where you are") and uses the 5 pillars as its spine. The 6 principles appear as "How BRIDGEGOOD works", with the by-role table behind a disclosure.
- Terms and the comparison with other approaches moved to a new library page, `/learn/terms`.
- Role badges on login cards, the account menu, the sidebar, the impact loop and the principles table.
- No all-caps eyebrow labels, no text below 14px, no opacity on text, and no pill-shaped links or controls. Every status tag has an icon and a word.

**Accessibility**
- Every page passes 320px reflow and text spacing. The 7 pages that failed (`/chapters`, `/learn/self-check`, `/student/submissions`, `/ambassador/matching`, `/learn`, `/mentor/mentee`, `/design`) are fixed, and `KNOWN` and `KNOWN_LAYOUT` in `tests/a11y.spec.ts` are empty.
- Pillar links look 40px tall with a 48px hit area.
- A manual pass with forced colors, keyboard only (27 pages and every form) and an accessibility-tree review. Fixes from it:
  - in forced colors, the sidebar's current-page bar showed on every item
  - focus was lost when a control disappeared after use (office-hour slots, project interest)
  - adding an office-hour slot with no time did nothing
  - field errors pointed `aria-describedby` at messages that didn't exist
  - a submission heading read its "Synthetic example" badge aloud
  - success messages could be missed by screen readers (their status region is now always present)
  - AI replies that arrived in one piece weren't announced
  - screen readers now hear "Signed in as" before the account name
- Results: axe passes on 45 pages in light and dark; reflow, 200% zoom and text spacing pass on all 45.
- A reading-level scan of 45 pages, notes only, no copy changed: [docs/archive/reading-level-scan.md](docs/archive/reading-level-scan.md).

**Technical**
- Page headings use the `type-*` scale. The Material 3 aliases are removed from `src/app.css`.
- New shared components: `Notice`, `ErrorSummary`, `FieldMessage` (`src/components/notice.tsx`), `NativeSelect`, `DraftFieldFrame` and `TeamView`.
- `docs/page-copy-changes.md` was checked item by item, found fully applied, and deleted.
- 301 redirects for the renamed URLs (removed again in #8).
- `test:a11y`: 137 passed, 0 failed.

---

## Sync, WCAG layout checks and CI ([#5](https://github.com/deka108/hack-buildgood/pull/5), 2026-10-24)

A sync pass after milestone 2.

**Everyone**
- On small screens, the logged-out header no longer shows "Log in" beside the menu button. That bug made every public page scroll sideways at 320px.
- The scoping studio reflows at 320px.

**Technical**
- New evaluation of where the app stands: design-system compliance, accessibility, content organization, and gaps against the earlier docs. Now archived at [docs/archive/evaluation-milestone-2.md](docs/archive/evaluation-milestone-2.md).
- `CLAUDE.md`, the README and `DESIGN.md` describe Bridge Studio, the library, the companion and the checks, and no longer mention Material 3.
- `tests/a11y.spec.ts` adds WCAG 1.4.10 reflow (320px), 1.4.4 resize (640px, which is 200% zoom) and 1.4.12 text-spacing checks on every page.
- `npm run test:unit` runs the evaluator tests (33).
- `.github/workflows/ci.yml` runs typecheck, lint, the contrast check, unit tests, build and the accessibility suite on every PR and on `main`.

---

## Milestone 2: Bridge Studio, the library, and the Reflection Companion ([#4](https://github.com/deka108/hack-buildgood/pull/4), 2026-10-24)

Three workstreams merged together: the design system, the information architecture, and the first AI evaluator lens.

**Apprentice**
- "Your path": bootcamp → mini project → choose a project → capstone → alumni, with pages for choosing a project and My mentor.
- The **Reflection Companion** at `/student/reflection`. It asks questions tied to the pillars and the 12 reflection prompts, lists what it can't judge, and never scores. You choose which questions to keep and which to share with your mentor. Without an API key it offers BRIDGEGOOD's own questions without AI.
- A deterministic contrast checker, labelled "Automated check, not AI".

**Mentor**
- "Prepare" links into the library instead of copying training.
- The review is a growth conversation: it starts from the apprentice's self-assessment, with "What's working" and "One next step" for each pillar. No scores.
- The mentor is seeded as a synthetic BRIDGEGOOD alum.

**Ambassador**
- Split into two accounts, **chapter lead** and **company host**, sharing one area with different overviews and playbooks.
- "Playbook" and "Matching & milestones": read apprentices' interest notes, form a team, mark milestones.

**Community partner**
- "Partner" is now "Community partner".
- The brief requires "How will the people you serve shape this?"
- My project and team shows the team and the sprint.

**Everyone**
- One public library at `/learn`: the 5 pillars, the 12 prompts, guides, role tracks and the eligibility self-check. `/training/*` redirects there. Library pages show where they sit on your path when you're signed in.
- The new look: warm paper and navy ink, Atkinson Hyperlegible Next and Bricolage Grotesque, Lucide icons, body text at AAA contrast, light and dark.

**Technical**
- Bridge Studio tokens in `src/app.css`, primitives restyled, and signature components in `src/components/studio/` (path, people chip, role badge, highlight, pinned note, AI draft frame, field note), shown on `/design`.
- `npm run check:contrast` checks every token pair; `npm run test:a11y` runs Playwright and axe on every page in light and dark (94 tests, all passing).
- `/api/reflect` is hardened like `/api/scope`. The evaluator lives in `src/lib/evaluator/` with a zod schema that has no score, level or rank fields.
- A Gemma 4 prototype behind `EVALUATOR_PROVIDER`, with six synthetic test items and a comparison script ([docs/gemma-prototype.md](docs/gemma-prototype.md)). Not yet run against a live model.

---

## Port to React Router 7, content pass, and the Bridge Studio spec ([#3](https://github.com/deka108/hack-buildgood/pull/3), 2026-10-24)

Moves off Next.js to a stack close to BRIDGEGOOD's own, merges the content pass, and specifies the design system.

**Apprentice**
- Guides for the mock case, the real case, and AI and social good. An eligibility self-check that stores nothing and links to BRIDGEGOOD's official criteria.

**Community partner**
- List fields in the brief can be typed into again (they used to strip spaces and new lines on every keystroke).
- Screenshots are shrunk in the browser to stay under the 4.5 MB request limit.
- "Start another brief" clears the chat.

**Everyone**
- The team's framework is in the app: 5 pillars, 12 reflection prompts, learning outcomes, and which prompts come up at which decision point (`src/content/framework.ts`).
- An inclusive-language guide. US spelling, slogans removed, four-week sprint facts, and synthetic labels on every seeded person.
- A visible focus outline everywhere. Error summaries take focus and link to their fields, and focus stays put after book, cancel, remove and send.

**Technical**
- React Router 7 in framework mode on Vite 8, React 19, TanStack Query 5, Tailwind 4, shadcn/ui on Base UI.
- Role areas are layout routes whose loaders check an httpOnly demo cookie, replacing `proxy.ts`.
- `/api/scope` became a resource route: partner session required, messages validated, client-sent system turns rejected, size caps, output limit, AI availability read at request time.
- Security headers. Only http(s) submission links open. Bad saved demo data no longer crashes a page.
- `DESIGN.md` specifies Bridge Studio, with an example page in `docs/design/examples.html`. Planning docs: the first evaluation, `docs/social-good.md` and `docs/resilience-kit.md`.

---

## AI evaluator design ([#2](https://github.com/deka108/hack-buildgood/pull/2), 2026-10-24)

Docs only: [docs/ai-evaluator.md](docs/ai-evaluator.md), one evaluator engine with four lenses (apprentice reflection, mentor critique prep, partner brief review, ambassador case readiness) where people keep every decision. It sets out three labelled kinds of feedback (automated checks, AI observations, questions only a person can answer), a schema with no score fields, the tone, bias and privacy rules, the disagreement loop back to BRIDGEGOOD, and a phased build plan. Eligibility is deliberately never judged by AI.

---

## BridgeGoodx v2: the desktop-first web app ([#1](https://github.com/deka108/hack-buildgood/pull/1), 2026-10-24)

Replaces the earlier mobile-first, three-view prototype with a desktop-first web app built from the team's wireframe.

**Apprentice:** modules, activities, project submissions with mentor feedback, communities of practice, office hours and messages.

**Mentor:** training, a review queue for submissions, office hours and messages.

**Ambassador:** training, a partner project pipeline, and toolkits for problem owners and organizations.

**Community partner:** an **AI scoping assistant**, a chat with screenshot upload beside a live, always-editable project brief that BRIDGEGOOD reviews. Without an API key it falls back to a manual brief form. Also a project gallery and toolkit and FAQs.

**Everyone:** a welcome page (mission, comparison with other approaches, the impact loop, principles by role, terms), a chapter finder, training tracks, and a demo login with four synthetic accounts.

**Technical**
- A demo cookie holds the role (not real authentication). A localStorage demo store, shared by all roles, connects the flows: an apprentice submits, the mentor reviews, the apprentice sees the feedback.
- The scoping assistant uses AI SDK v7 `streamText` with an `updateBrief` tool. It's labelled as AI and never asks for personal data.
- axe reported 0 violations on all 30 pages. No horizontal overflow at 1440, 1024, 768 and 375px.
