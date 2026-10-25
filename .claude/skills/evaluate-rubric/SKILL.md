---
name: evaluate-rubric
description: Score BridgeGoodx against the hackathon judging rubric (impact 30%, live technical execution 35%, innovation 20%, demo and storytelling 15%, accessibility bonus), check demo-day readiness, and rank the few changes that would gain the most points. Use when asked how the app would score with judges, how to improve the pitch or demo, or whether it's ready for demo day.
argument-hint: "[label, e.g. final-round]"
---

# Evaluate BridgeGoodx against the judging rubric

You are four judges at once: a non-profit partner judge who cares whether BRIDGEGOOD would use this, two technical judges watching a live demo, and everyone judging the story. Score what judges would **see in a 4-minute pitch**, not what exists in the repo.

Arguments: `$ARGUMENTS`. The first word, if given, is the report label. With no label, use today's date.

## 1. Gather the current state

1. Read [rubric.md](rubric.md) (the rubric and its weights), `docs/challenge.md`, and `docs/demo-script.md`. If the demo script isn't on this branch, look for it on others (`git log --all --oneline -- docs/demo-script.md`) and read it with `git show <branch>:docs/demo-script.md`; say in the report which version you used. With no demo script at all, score the demo you'd expect from the app's strongest flows and recommend writing one.
2. Read the latest mission evaluation (`docs/evaluation-*.md` outside `docs/archive/`, not a rubric one) for impact evidence, and the latest rubric evaluation (`docs/evaluation-rubric-*.md`) for the "Before" scores. If the mission evaluation is older than the "Unreleased" changes in `CHANGELOG.md`, say so and suggest running `/evaluate-mission` first.
3. Record `git rev-parse --short HEAD` and the branch.
4. **Check live-demo readiness.** These decide technical execution, so check them, don't assume:
   - Is an AI key configured? Check whether `.env.local` exists and which variable names it sets (`ANTHROPIC_API_KEY`, `AI_GATEWAY_API_KEY`). Never print or repeat the values.
   - Has any AI surface run against a live model? Look in `docs/BACKLOG.md` ("Live AI verification") and the latest evaluations.
   - Is there a deploy? Look for `.vercel/`, a deploy URL in the README or demo script, or ask the user.
   - Is CI green on `main`? `gh run list --workflow ci.yml --branch main --limit 3`.
   - Does every page and screen the demo script names exist? Check each route against `src/routes.ts` and each file it mentions (for example the golden images). Flag any beat that shows a mockup instead of the app.
5. Optionally, if the user wants it: run `npm run build`, start the `bridgegoodx-dev` preview and walk the demo script's beats, including the keyboard-only path. Say what you ran.

## 2. Score each criterion

Score 1–5, with the same scale every time:

| Score | Meaning |
|---|---|
| 1 | Judges wouldn't see it, or it fails on stage |
| 2 | Shown, but as a claim, a mockup, or with high risk of failing |
| 3 | Works live in the main beat; the story or evidence is thin |
| 4 | Works live, clearly told, with evidence judges can see |
| 5 | Memorable: works live, clearly different from other teams, hard to argue with |

For each criterion give the score, a weighted contribution (score ÷ 5 × weight), and the evidence: the beat in the demo script, the route, the file. Then a **weighted total out of 100** and the accessibility bonus separately (each of its two items: met, partly met, or not met).

Guidance per criterion:
- **Impact (30%)**: does the demo show the brief's problem being solved: the philosophy practiced without the founder, communities adapting it, feedback reaching BRIDGEGOOD, BRIDGEGOOD keeping authorship, outside communities reached? Would a non-profit staff member see themselves using it next month?
- **Technical execution (35%)**: what runs live, end to end, across roles. If the AI has never run against a live model, cap this at 2 and say why. If it runs only with a fallback recording, cap it at 3.
- **Innovation (20%)**: what is new as a *method*, and whether judges can see proof (a results table, a test run, a visible constraint) rather than hearing a claim.
- **Demo and storytelling (15%)**: one thread, few role switches, a clear before and after, time per beat against the 4-minute limit.
- **Accessibility (bonus)**: automated tools shown (axe in CI), and keyboard use shown live with a visible focus ring.

## 3. Recommend, without overcomplicating

Rank **at most five** changes by points gained per hour of work. For each: the criterion, the estimated score change, the effort (hours), and the smallest version that would earn the points. Rules:
- Make what exists work live and visible before building anything new.
- Prefer turning a mockup or a claim into something judges can see over adding features.
- Recommend at most **one** new build, and only if it closes the weakest impact gap.
- Say what to deliberately skip and why (features that don't move the rubric in 4 minutes).
- Name the items only the user can do (adding a key, deploying, rehearsing) as theirs.

## 4. Write the report

1. If an earlier `docs/evaluation-rubric-*.md` exists, move it to `docs/archive/` with `git mv`, add a status table at its top (status: superseded, superseded by, date), and fix links to it.
2. Write `docs/evaluation-rubric-<label>.md`: the commit and how you checked, the readiness checklist (met or not, with evidence), the scores table (criterion, weight, Before, Now, weighted, evidence), the weighted total, the accessibility bonus, the ranked changes, and what to skip.
3. If recommendations change the demo, add or update the "Before demo day" list at the end of `docs/demo-script.md`. Add buildable items to `docs/BACKLOG.md`.
4. Plain words, short sentences, no marketing tone.

## 5. Reply

In chat, give the scores table with the weighted total, the readiness items that aren't met, the ranked changes, and the report's path. Don't commit unless asked.
