# Rubric evaluation (2026-10-25)

This scores `main` at `4706b29` (PR #11, practice moments and the carry-it-forward kit, merged) against the hackathon judging rubric in [`.claude/skills/evaluate-rubric/rubric.md`](../.claude/skills/evaluate-rubric/rubric.md). It scores what judges would **see in the 4-minute pitch**, not everything in the repo.

**How it was checked:** I read the code and docs; checked for an AI key (variable names only), a deploy and CI status; confirmed that every route and file the demo script uses exists on `main`; and loaded `/learn/carry-it-forward` in the dev server (it renders, with no console errors). I didn't run the AI (there's no key), the build, or the demo script end to end.

**Demo script used:** `docs/demo-script.md` from the unmerged branch `docs/evaluation-m3-and-mockups` (`8b55b3c`). It isn't on `main`, and it predates the kit.

This is the first rubric evaluation, so there's no "Before" column.

## Demo-day readiness

| Check | State | Evidence |
|---|---|---|
| AI key configured | **Not met** | No `.env.local`; only `.env.example` |
| Any AI surface run against a live model | **Not met** | `docs/BACKLOG.md`, Next item 2: "No AI surface has run against a real model" |
| Deployed | **Not met** | No `.vercel/`, and no deploy URL in the README or docs |
| CI green | Met | PR #11's checks passed, including "Accessibility (axe, reflow, zoom, text spacing)". The last `main` push run (`#10`) passed; no push run for `4706b29` is listed yet. |
| Demo routes and files exist | Met | `/`, `/learn/pillars/ethics-impact`, `/partner/submit`, the companion, `/ambassador/playbook`, `/steward`, `/learn/changelog`, `/learn/pillars/craft`, and `src/content/evaluator-goldens/images/consent.png` |
| Demo script on `main` and current | **Not met** at review; met since | It was on an unmerged branch, and beat 6 showed the mockup in `docs/design/mockups-practice-and-kit.html`, although the kit is live at `/learn/carry-it-forward`. Changes 2 and 4 below have since been made in [demo-script.md](demo-script.md). |
| Keyboard path rehearsed | Unknown | Planned in beat 4; no record of a rehearsal |

## Scores

Scale: 1 = judges wouldn't see it or it fails on stage; 3 = works live in the main beat, with thin story or evidence; 5 = memorable, works live, hard to argue with. Weighted = score ÷ 5 × weight.

| Criterion | Weight | Now | Weighted | Evidence |
|---|---|---|---|---|
| Impact and problem solving | 30% | **3** | 18 | The substance is strong: prompts at decision points, chapter adaptations, a steward who decides with a reason, a public changelog, and now a kit that lets outside communities run a session and send feedback (`src/content/carry-forward.ts`, `src/components/feedback/kit-feedback.tsx`). But the demo ends on a mockup of the kit, so judges don't see the answer to "beyond any one person" for people outside BRIDGEGOOD. |
| Technical execution (live demo) | 35% | **2** | 14 | Capped at 2: the centerpiece live AI beat (beat 3) has never run against a model, and nothing is deployed. The cross-role feedback loop works and is tested (`tests/feedback-loop.spec.ts`, `tests/practice-and-kit.spec.ts`), but on its own it isn't the "live demo" the script promises. |
| Innovation | 20% | **3** | 12 | The methods are real: an output schema with no score field (`src/lib/evaluator/schema.ts`), labelled kinds of finding, a test set with injection and fake-personal-data items (`src/content/evaluator-goldens/`), and a versioned philosophy with steward decisions. In the pitch they're spoken claims: there's no on-screen result showing the companion passing its test set. |
| Demo and storytelling | 15% | **3** | 9 | One synthetic thread, with good timings and fallbacks. But there are four login switches in 4 minutes, the script isn't on `main`, and its closing beat is out of date. |
| **Weighted total** | | | **53 / 100** | |

**Accessibility bonus**

| Item | State | Evidence |
|---|---|---|
| 1. An accessibility tool used | **Met** | axe on every page, light and dark, plus reflow, zoom and text-spacing checks, in CI on every PR (PR #11 green). Beat 5 shows the job. |
| 2. Keyboard use shown | **Partly met** | Beat 4 is planned keyboard-only with a visible focus ring, but it hasn't been rehearsed. |

With the first three changes below done, the same app scores about **80 / 100** (impact 4, technical 4, innovation 4, demo 4).

## Changes ranked by points per hour

| # | Change | Criterion | Score change | Effort | Who |
|---|---|---|---|---|---|
| 1 | **Make the AI live and deploy.** Add an Anthropic key or turn on the AI Gateway, run the companion on all six test items, check that `consent` reliably mentions the pre-ticked box, deploy to Vercel, and record one clean run as the backup. | Technical | 2 → 4 (**+14**) | 1–2 h | **You** (the key and the deploy) |
| 2 | **Show the kit live, not the mockup.** Merge the demo script into `main`. In beat 4, the steward inbox already shows an "Outside community" item from a synthetic school group that ran the kit: accept it with a reason and reply. Close on `/learn/carry-it-forward` and the group reading the reply with its code. Prepare it before the pitch, as the chapter adaptation is. | Impact, demo | 3 → 4 (**+6**), demo +1 | 1 h | Team |
| 3 | **Put the test-set results on screen.** A script that runs the companion over the six golden items and prints a table (seeded issue found, injection resisted, personal data refused, no score). Show it for 10 seconds in beat 3. Needs the key from change 1. | Innovation | 3 → 4 (**+4**) | 3–4 h | Team |
| 4 | **Cut a role switch.** Drop the partner beat (2) or make it one sentence over a screenshot, and use the time for change 2. Fewer logins means fewer chances to get lost. | Demo | 3 → 4 (**+3**) | 30 min | Team |
| 5 | **Rehearse.** Three timed runs, one with a deliberate AI failure to practise switching to the recording, and the keyboard path until it's smooth on the projector. | Accessibility bonus 2, technical | Partly → met | 1–2 h | Team |

**Done since this review:** changes 2 and 4. The demo script is on `main`; beat 2 shows the public kit instead of the partner login, beat 4 has the steward accept an outside group's kit feedback as a field note, and beat 6 closes with the group reading the decision by reply code. That loop was walked in the dev server; the scores above are as reviewed.

The only new build is change 3, and it reuses `src/lib/evaluator/golden-checks.ts`. The kit closed the biggest impact gap, so it doesn't need another feature: it needs to be in the demo.

## What to skip before demo day

- **More practice moments, the resilience kit, and AI lenses 2–4.** They're good backlog items, but none moves a 4-minute score, and each adds a surface that could fail on stage.
- **A real database and accounts.** Judges accept browser-held demo data if you say so in one line during Q&A.
- **The Gemma comparison**, unless changes 1 and 3 are done. Mention it as an option in Q&A only, and claim no results you haven't run.
- **Visual polish.** CI already proves the accessibility, and judges won't score small design follow-ups.
