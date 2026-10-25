# Evaluation after milestone 3 (2026-10-25)

This reviews `main` at `37469d5` (PR #7 merged) against the hackathon brief in [challenge.md](challenge.md). It's based on the code and content, not a fresh click-through of every flow. Scores use the same 1–5 judging scale as the first evaluation ([evaluation.md](evaluation.md)), so the "Before" column is directly comparable.

**The problem in one line:** make BRIDGEGOOD's values *and the reasoning behind them* explicit, so more people can explain and practice them without the founder in the room. Keep community voice, adaptation, feedback and BRIDGEGOOD's authorship.

## Scores against the brief

| Brief criterion | Before | Now | Evidence |
|---|---|---|---|
| Codify the values and the reasoning | 3 | **4** | The 5 pillars, 12 prompts and learning outcomes in `src/content/framework.ts`; the public `/learn` library with pillar pages, guides and terms; a versioned framework |
| Not a course by default | 2 | **3** | The library is reference material, role areas show your *path*, and prompts appear where decisions happen. Weak spot: role tracks still read as modules, and there are no practice moments. |
| No checklists, slogans or marketing | 3 | **4** | The content pass removed slogans, and the welcome page explains the approach concretely |
| Practiced in the flows, not just described | 2 | **4** | Prompts at the apprentice's submission, the mentor's growth conversation and the partner's brief (with a required "How will the people you serve shape this?"), plus the Reflection Companion |
| Communities adapt it locally | 2 | **4** | Chapter leads propose adaptations, which show as field notes on pillar pages, labelled as local |
| Feedback loop back to BRIDGEGOOD | 1 | **4** | The steward inbox takes adaptations, "this didn't fit" flags, mentor–AI disagreements, partner retrospectives and community cards. Every decision has a reason, and the changelog is public. Only limit: demo data lives in one browser. |
| BRIDGEGOOD keeps authorship | 3 | **5** | Only the steward changes the official wording, credit requires consent, versions are recorded, and the welcome page has an ownership section |
| Human judgment and AI | 4 | **4** | The scoping brief is an editable draft in a `DraftFrame`, the companion never scores and says what it can't judge, and the mentor decides. Gaps: the companion doesn't use `DraftFrame` yet, and no AI feature has been run against a live model. |
| Reach: students, alumni, mentors, volunteers, staff, partners, outside communities | 2 | **3** | Alumni are a path stage, staff have the steward role, and chapter leads and company hosts are covered. Outside communities only get the public library: there's no way to run a session without BRIDGEGOOD. |
| Concrete meaning of "social good", "inclusion", "access" | — | **4** | Defined in terms, pillar pages and guides; reasoning in [social-good.md](social-good.md) |
| Synthetic data, consent, privacy | 4 | **5** | Synthetic labels throughout, no personal data, consent-gated credit |
| Accessibility and inclusive language | 4 | **5** | WCAG 2.2 AA checks (axe, reflow, zoom, text spacing) run in CI; 43 of 45 pages read at grade 8 or below. A screen reader pass is still to do (low priority). |
| Bonus: recruitment and alumni | — | **3** | The eligibility self-check helps people judge fit; alumni are a path stage. Thin beyond that. |

**What changed since the first evaluation:** the two hardest asks in the brief, the feedback loop and practice in the flows, went from barely there to well covered. Authorship is now built into how the app works.

## Biggest remaining gaps

1. **Outside communities can't carry it forward.** A teacher or community leader outside BRIDGEGOOD can read the library but can't run a session with it. This is the weakest criterion. The fix is a **"carry it forward" kit**: a session guide, prompt cards, built-in credit, and "tell BRIDGEGOOD what you changed" into the steward inbox.
2. **It still reads a bit like a course.** Role tracks and modules remain. **Practice moments** (short scenarios with choices, then BRIDGEGOOD's reasoning, never a score) would show judgment instead of teaching it.
3. **The AI features are unverified.** The scoping assistant, the Reflection Companion and the Gemma comparison have never run against a model, so a live demo carries risk.
4. **Demo practicalities:** data is in one browser, nothing is deployed, and there's no demo script yet.
5. **The resilience kit** ([resilience-kit.md](resilience-kit.md)) is designed but not built. It's a strong story for apprentices and alumni.

## Mockups for gaps 1 and 2

Rough, clickable mockups of practice moments and the carry-it-forward kit, in Bridge Studio, are in [design/mockups-practice-and-kit.html](design/mockups-practice-and-kit.html). Open the file in a browser. They're for deciding the shape before building, not final content. All scenarios and people in them are synthetic.
