# Evaluation after milestone 2 (2026-10-25)

> **Archived (October 2026).** Kept for its reasoning. What shipped is in [CHANGELOG.md](../../CHANGELOG.md), and what's open is in [BACKLOG.md](../BACKLOG.md). Paths to `docs/design-followups.md` and `docs/page-copy-changes.md` below refer to files that have since been deleted; their contents are in the changelog (PR #6) and the backlog.

## Status of the recommendations

| Recommendation | Section | Status |
|---|---|---|
| Sync `CLAUDE.md`, README, `DESIGN.md` and older docs; add `test:unit`, CI and WCAG layout checks; fix the header reflow bug | §1, §4.1 | Implemented (PR #5) |
| Confirm `docs/page-copy-changes.md` is applied | §1 | Implemented (PR #6, file deleted) |
| Fix `src/app/` paths in `docs/ai-evaluator.md` | §1 | Implemented (docs housekeeping, unreleased) |
| No all caps, the `type-*` scale on pages, no `text-xs` or opacity on text, no pill links | §2, §4.2 | Implemented (PR #6) |
| `DraftFrame` on all AI output | §2, §4.2 | Implemented (PR #6) |
| `PeopleChip` and `Path` on team views, `PinnedNote`, `Highlight`, `RoleBadge` wherever a role appears | §2, §4.2 | Implemented (PR #6) |
| Remove the Material 3 aliases from `app.css` | §4.2 | Implemented (PR #6) |
| Fix the 7 known layout failures | §2b, §4.2 | Implemented (PR #6) |
| Manual checks: forced colors, keyboard only, reading level | §2b | Implemented (PR #6; reading level scanned, rewording in backlog: [Later 5](../BACKLOG.md#later)) |
| Screen reader pass (VoiceOver or NVDA) | §2b | In backlog ([Later 3](../BACKLOG.md#later)) |
| Pillars as the spine of the welcome page; principles as "how BRIDGEGOOD works" | §2c.1 | Implemented (PR #6) |
| Shorter welcome page, routing by role; terms into `/learn` | §2c.2 | Implemented (PR #6) |
| Your path as the apprentice home | §2c.3 | Implemented (PR #6) |
| Legal templates into Toolkit & FAQs | §2c.4 | Implemented (PR #6) |
| URLs that match their labels | §2c.5 | Implemented (PR #6) |
| A place for staff | §2c.6 | Implemented (PR #7) |
| Record the desktop-first decision in `social-good.md` | §3 | Implemented (PR #5) |
| Feedback loop: steward inbox, adaptations, flags, disagreement records, retrospectives, community card, versioned framework, changelog, field notes | §3, §4.3 | Implemented (PR #7) |
| Feedback loop follow-ups: a real store and accounts | §4.3 | In backlog ([Later 8](../BACKLOG.md#later)) |
| Feedback loop follow-ups: mentor-lens feedback controls | §4.3 | In backlog ([Next 1](../BACKLOG.md#next)) |
| Feedback loop follow-ups: live version on the home page and library index | §4.3 | In backlog ([Later 7](../BACKLOG.md#later)) |
| Practice moments | §3, §4.5 | In backlog ([Next 4](../BACKLOG.md#next)) |
| "Carry it forward" kit | §3, §4.5 | In backlog ([Next 5](../BACKLOG.md#next)) |
| Dual-outcome project view | §3, §4.5 | In backlog ([Later 1](../BACKLOG.md#later)) |
| Community decision rights | §3, §4.5 | In backlog ([Later 2](../BACKLOG.md#later)) |
| A named human beside every judgment, and a route to trained staff | §3 | In backlog ([Later 4](../BACKLOG.md#later)) |
| AI evaluator phases 2–4 | §3 | In backlog ([Next 1](../BACKLOG.md#next)) |
| Resilience kit | §3 | In backlog ([Next 3](../BACKLOG.md#next)) |
| Live AI verification, including the Gemma comparison | §3, §4.4 | In backlog ([Next 2](../BACKLOG.md#next)) |

---

This reviews `main` at `05b55a0` (PR #4): after the React Router migration, the Bridge Studio design system, the library and role restructure, and the Reflection Companion. It follows [evaluation.md](evaluation.md), which reviewed the app before milestone 2.

## 1. Is everything in sync?

**The code is in sync. The docs are not.**

| Check | Result |
|---|---|
| Local `main` matches `origin/main` | Yes |
| `npm run typecheck`, `lint`, `build` | Pass |
| `npm run check:contrast` | Pass: every token pair, light and dark |
| `npm run test:a11y` (axe, 47 pages × light and dark) | 94 of 94 pass. The tree is identical to the one tested before merging. |
| Evaluator unit tests | 33 of 33 pass. Now `npm run test:unit`. |
| Next.js code left in `src/` | None. One stale comment remains (`wordmark.tsx` mentions `next/image`). |
| CI on GitHub | Added: `.github/workflows/ci.yml` runs typecheck, lint, contrast, unit tests, build and the accessibility suite on every PR and on `main`. |
| WCAG layout checks (added) | Reflow at 320px, 200% zoom and text spacing on every page. 7 pages still fail and are tracked in `docs/design-followups.md`. The shared header bug that broke every public page is fixed. |

**Stale docs (now updated, apart from the last two, which have status notes):**

| File | Problem |
|---|---|
| `CLAUDE.md` line 12 | Says tokens are "BRIDGEGOOD Design System (Material 3)" and icons are "Material Symbols". Both were replaced by Bridge Studio and Lucide. Agents read this file first. |
| `README.md` lines 73 and 87 | Same Material 3, Google Sans and Material Symbols wording. |
| `DESIGN.md` status line | Says "chosen direction, not yet built". It's built. |
| `docs/page-copy-changes.md` | Paths still point at `src/app/...` (Next.js). Check whether the restructure applied every item. (Milestone 2.5: every item confirmed applied, and the file deleted.) |
| `docs/ai-evaluator.md` | Mixes `src/app/` paths with a note that they map to `src/routes/`. |

## 2. Does the app follow the design system?

**At the token level, mostly yes. The page-level design language isn't applied yet.** These counts exclude the UI primitives, the studio components and the `/design` page.

| `DESIGN.md` rule | State |
|---|---|
| No raw palette colors, no shadows, focus never removed | Met: 0 raw palette colors, 0 shadows. `outline-none` only on the `main` landmark, which isn't interactive. |
| Contrast (AA everywhere, AAA body) | Met (contrast check and axe) |
| Role shown as icon + label + color | Partly. Role colors exist, but `RoleBadge` isn't used anywhere. |
| No all caps (§1.6) | **Not met:** 14 uses of `uppercase` or `tracking-wide` in 5 files: `app-shell.tsx` eyebrows, `home.tsx`, `chapters.tsx`, and the reflection companion. |
| Type scale (§3) | **Not adopted on pages.** The new `type-*` utilities appear only in primitives and studio components. Pages still use 63 raw `text-2xl`–`text-6xl` sizes in 27 files, plus 5 old Material 3 names (`headline-large`, `body-large`, `bg-surface-container`) in `root.tsx`, `login.tsx` and `home.tsx`, which only work through compatibility aliases in `app.css`. |
| Small text never below 14px (§3) | **Not met:** `text-xs` (12px) is used 25 times in 14 files, including message metadata, badges and the scoping studio. 12 `opacity-*` uses on text in 2 files. |
| No pill shapes (§4) | Mostly met for buttons. 28 `rounded-full` uses, mostly avatars and tags (allowed), but the top nav links and the scoping studio's "Add screenshot" control are pills. |
| **AI output always in a draft frame (§1.3, §6)** | **Not met on real pages.** `DraftFrame` is used only on `/design`. The scoping studio and the reflection companion, the two AI surfaces, use their own styling. This is the design principle most tied to the brief. |
| Signature elements only where relationships are real (§6) | **Not applied.** `Path`, `PeopleChip`, `Highlight`, `PinnedNote` and `FieldNote` appear only on `/design`, not on the apprentice path, my mentee, my project or the reflection prompts. |

`docs/design-followups.md` lists most of these. They waited for the restructure, which is now merged.

## 2b. Accessibility, against standard evaluation methods

| Method | Coverage | State |
|---|---|---|
| WCAG 2.2 A/AA automated rules (axe-core, the engine behind Deque's axe DevTools and Lighthouse) | Every page, light and dark | 94 of 94 pass |
| Color contrast (WCAG 1.4.3, 1.4.6 AAA for body text, 1.4.11) | Every design token pair, light and dark | Pass |
| Reflow (1.4.10), resize text (1.4.4), text spacing (1.4.12) | Every page | 39 of 46 pass. 7 known failures are listed and must shrink. |
| Target size (2.5.8), focus visible (2.4.7, 2.4.11), reduced motion | Design tokens and primitives (48px targets, 3px outline), plus axe's target-size rule | Pass |
| Forced colors, keyboard-only use, screen readers (VoiceOver or NVDA), cognitive load and reading level | Manual | **Not done yet.** This is the next accessibility step. |

## 2c. Content organization

Mostly sound: one public library with stable URLs, role areas grouped into "Your path" and "Your people", and no duplicated training. To tighten:
1. **Two frameworks on the welcome page.** `/` still shows both the 6 principles (`principles.ts`, the principles-by-role matrix) and the 5 pillars. Make the pillars the spine and present the principles as "how BRIDGEGOOD works", or fold them into the pillars. `evaluation.md` flagged this as "three competing structures", and it isn't fully resolved.
2. **The welcome page is long.** In order: mission, why, framework, loop, principles matrix, terms, resources. Terms and resources duplicate the library. Route visitors by role near the top ("I'm an apprentice, mentor, ambassador, community partner") and move terms into `/learn`.
3. **The apprentice sidebar has 8 items**, and Overview and Your path overlap. Consider making Your path the apprentice home.
4. **"Funding & legal templates" is a coming-soon page in the partner sidebar.** Fold it into Toolkit & FAQs as a coming-soon row.
5. **URLs that don't match their labels:** `/mentor/submissions` is labelled "Growth conversations", and `/student/activities` "Practice". Rename them, with redirects.
6. **Nowhere for staff.** Fixed in milestone 3: the BRIDGEGOOD steward area at `/steward` is the home for review, adaptations and the changelog.

## 3. The app compared with the docs

### Done since `evaluation.md`
- The 5 pillars, 12 prompts and learning outcomes are in `src/content/framework.ts` and the public `/learn` library.
- Reflection prompts appear at decision points: `PROMPTS_BY_MOMENT` is used in the student submission, the mentor review and the partner brief.
- Training duplication is removed: role areas link to `/learn` through "Your path", "Prepare" and "Playbook".
- Missing journey pages are added, plus chapter lead and company host, "Community partner", and alumni as a path stage.
- The mentor review is a growth conversation with no scores. The partner brief requires community participation.
- The Reflection Companion, phase 1, never scores, says what it can't judge, and lets apprentices share questions with their mentor.
- A Gemma 4 prototype with test items is built. It hasn't been run against a live model.

### Conflicts between the docs and decisions since
1. **Desktop-first versus phone-first.** `social-good.md` (§4 and its second top recommendation) and `evaluation.md` (persona table) recommend phone-first student and partner flows. The team decided desktop-first, because design work happens on a laptop. Record the decision in `social-good.md` and keep checking phone widths for reflow (WCAG 1.4.10).
2. **`DESIGN.md` principle 3 versus the AI surfaces.** See section 2.
3. **`CLAUDE.md` and README versus the implementation.** See section 1.

### Gaps against the docs (not built yet)

| From | Recommendation | State |
|---|---|---|
| `evaluation.md` pivot 2, `social-good.md` recommendation 5 | Feedback loop: steward inbox, adaptations, versioned framework, public changelog | Done in milestone 3: steward role and inbox, adaptations, flags, AI disagreement counts, partner retrospectives, a community card, field notes, a versioned framework and `/learn/changelog`. Decisions live in the browser until there's a database. |
| `evaluation.md` pivot 3 | Practice moments (scenarios showing BRIDGEGOOD's reasoning) instead of course-style modules | Not started |
| `evaluation.md` pivot 4 | A "Carry it forward" kit for outside communities | Not started |
| `social-good.md` recommendation 1 | The dual outcome (what changed for the community *and* how designers grew) at the center of projects and the gallery | Not started |
| `social-good.md` recommendation 3 | Community decision rights: participation, paid time, sign-off | Partly: the required brief field only |
| `social-good.md` recommendation 4 | A named human next to every judgment, plus a route to trained staff for hard conversations | Partly: the growth conversation is done, the staff route isn't |
| `ai-evaluator.md` phases 2–4 | Mentor support, partner proposal reviewer, ambassador vetting | Not started |
| `resilience-kit.md` | Decision-record portfolio, AI audit lab, career paths | Not started |
| All AI features | Live verification | No API key yet, so scoping, reflection and Gemma have never run against a model |

## 4. Recommended next steps

1. **Sync pass:** done in this branch. Updated `CLAUDE.md`, the README and `DESIGN.md`, added status notes to older docs, added `test:unit`, CI, and the WCAG layout checks, and fixed the header reflow bug.
2. **Apply Bridge Studio to pages and tighten content organization (milestone 2.5):**
   - Fix the 7 known layout failures and do the manual accessibility pass (section 2b).
   - Apply the content-organization changes in section 2c.
   - The `design-followups.md` items: type scale, no all caps, `type-small` instead of `text-xs`, no pill nav.
   - Use the signature components where they mean something:
     - `DraftFrame` on all AI output
     - `PeopleChip` and `Path` on team views
     - `PinnedNote` for mentor feedback and reflections
     - `Highlight` on the decision-point prompt
     - `RoleBadge` wherever a role appears
   - Then remove the Material 3 aliases from `app.css`, and do the manual accessibility checks (200% zoom, 320px, text spacing, forced colors, screen reader).
3. **Milestone 3: the feedback loop.** Done. Tested end to end in `tests/feedback-loop.spec.ts`; the rules have unit tests in `src/lib/feedback/test/`. Open items: a real store and accounts so decisions leave the browser, mentor-lens feedback controls (only the companion's are wired; mentor records are synthetic), and the home page and library index still read the static `FRAMEWORK_META.version`.
   - A BRIDGEGOOD steward demo login with an inbox.
   - "Propose an adaptation" for chapter leads, and "this didn't fit" flags on prompts and guides.
   - Mentor–AI disagreement records (wire the companion's feedback controls into the inbox), partner retrospectives, and an aggregated community feedback card.
   - A versioned framework with a public changelog, and field notes on pillar pages.
4. **Live AI verification**, once there's an API key: the scoping and reflection flows end to end, and the Gemma comparison script (`docs/gemma-prototype.md`).
5. **Mission gaps after milestone 3:** the dual-outcome project view, community decision rights in the brief and capstone, practice moments, and the "Carry it forward" kit.

Items 2 and 3 can run in parallel if the feedback-loop work stays in new routes and components, touching shared pages (pillar pages, companion feedback controls) only through small, agreed hooks.
