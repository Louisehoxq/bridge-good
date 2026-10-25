---
name: evaluate-mission
description: Evaluate BridgeGoodx against the BRIDGEGOOD challenge brief (docs/challenge.md) and its non-negotiables, score each mission criterion 1–5 with evidence from the code, compare with the last evaluation, and write the result to docs/. Use when asked to evaluate, review or score the app against the mission, the brief or the problem statement, or after a milestone lands.
argument-hint: "[label, e.g. milestone-4] [focus area]"
---

# Evaluate BridgeGoodx against the mission

You are reviewing the app the way a BRIDGEGOOD staff member who knows the brief well would: does it help more people **explain how and why BRIDGEGOOD works and put that into practice**, without the founder in the room, while keeping community voice, adaptation, feedback and BRIDGEGOOD's authorship?

Arguments: `$ARGUMENTS`. The first word, if given, is the report label (for example `milestone-4`). Anything after it is a focus area to go deeper on. With no label, use today's date.

## 1. Gather the current state

1. Read `docs/challenge.md` in full, then the "Non-negotiables" section of `CLAUDE.md`.
2. Find the latest evaluation: the newest `docs/evaluation-*.md` outside `docs/archive/`. Its scores are the "Before" column. Read `docs/BACKLOG.md` and the "Unreleased" section of `CHANGELOG.md` for what has shipped since.
3. Record the commit: `git rev-parse --short HEAD` and the branch.
4. Survey the app, not just the docs. Read `src/routes.ts`, then the content files (`src/content/framework.ts`, `guides.ts`, `practice.ts`, `carry-forward.ts`, `framework-history.ts`) and the route modules for each role area. Claims in the changelog count only once you've found the code that does them.
5. Optionally, if the user wants it or a criterion depends on behavior: run `npm run typecheck`, `npm run test:unit`, or start the `bridgegoodx-dev` preview and click through the flow. Say which checks you ran and which you didn't.

## 2. Score each criterion

Use these criteria, **in this order and with these names**, so scores stay comparable across evaluations. Score 1–5:

| Score | Meaning |
|---|---|
| 1 | Missing, or works against the brief |
| 2 | Described but not practiced; or present in one place only |
| 3 | Works in the main flow, with clear gaps |
| 4 | Well covered across the roles that need it; gaps are minor or known |
| 5 | Covered, built into how the app works, and hard to break |

Criteria:

1. **Codify the values and the reasoning**: the *why*, not just the values. Pillars, prompts, terms, the library.
2. **Not a course by default**: reference and practice over modules and tracks.
3. **No checklists, slogans or marketing**: read the copy for slogans, quotes and vague branding.
4. **Practiced in the flows, not just described**: does the philosophy appear at the moments people make decisions?
5. **Communities adapt it locally**: chapters, outside groups, practice adaptations, field notes.
6. **Feedback loop back to BRIDGEGOOD**: every way feedback reaches the steward, and whether decisions are visible.
7. **BRIDGEGOOD keeps authorship**: who can change official wording, credit, versions.
8. **Human judgment and AI**: every AI surface labelled, in a `DraftFrame`, editable, never scores, says what it can't judge, never asks for personal data, and has run against a live model.
9. **Reach**: students (before, during, after), alumni, mentors, volunteers, staff, partners, outside communities. Name who is still thin.
10. **Concrete meaning of "social good", "inclusion", "access", "human-centered"**.
11. **Synthetic data, consent, privacy**.
12. **Accessibility and inclusive language** (WCAG 2.2 AA, reading level).
13. **Bonus: recruitment and alumni**.

For each, give **evidence**: file paths with line numbers, routes, or test names. If you can't find evidence, the score can't be above 2. Don't raise a score because a doc says something is done.

Then check the **risks and guardrails** in section 4 of the brief one by one, and list any the app breaks or comes close to breaking (for example, a story that reads as a real participant, or AI that grades).

## 3. Find the gaps

List the **3–5 biggest remaining gaps**, ranked by how much they hold back the brief's ideal outcome (section 3). For each: what's missing, who it affects, and the smallest change that would close it. Prefer changes that reuse what exists (the steward inbox, `/learn`, the evaluator) over new systems. Point to an existing `docs/BACKLOG.md` item where one fits rather than inventing a new one.

If a focus area was given, go deeper there: walk its flow end to end and note every point where the philosophy is missing or vague.

## 4. Write the report

1. Move the previous evaluation to `docs/archive/` with `git mv` and add a status table at its top (status: superseded, superseded by, date), as `CLAUDE.md` asks. Fix links that pointed to it (`grep -rn` for its filename in `docs/`, `CLAUDE.md`, `CHANGELOG.md`).
2. Write `docs/evaluation-<label>.md` with:
   - a first line saying which commit it reviews and how (code read, checks run, flows clicked)
   - "The problem in one line"
   - the scores table: criterion, Before, Now, Evidence
   - "What changed since the last evaluation" (two or three sentences)
   - guardrail findings
   - "Biggest remaining gaps"
3. Update `docs/BACKLOG.md`: add new gaps, reorder if priorities moved, and link the new report.
4. Follow the writing style of the existing evaluations: plain words, short sentences, no marketing tone. Every person or group you mention from the app is synthetic; say so if it could be misread.

## 5. Reply

In chat, give the scores table (Before → Now), the top three gaps, and the report's path. Don't paste the whole report. Don't commit unless asked.
