# Demo script (hackathon: 4-minute pitch, 1-minute Q&A)

> **Status: draft, 2026-10-25.** Rewritten against `main` at `4706b29` (practice moments and the carry-it-forward kit) after the [rubric evaluation](evaluation-rubric-2026-10-25.md): the live kit replaces the mockup, and the partner login is gone. The kit loop in beats 2, 4 and 6 was walked in the dev server; the AI beat hasn't run against a live model yet. Beat 3 aims to run the companion on **Gemma 4 first**, with a Claude key as the fallback (the providers are in PR #17 and [gemma-prototype.md](gemma-prototype.md#status-and-setup)). Every person, organization and screen on show is synthetic and labelled that way in the app. Say so out loud once (beat 0) so judges don't wonder.

## How the rubric shapes this demo

| Criterion | Judges | Weight | Where the demo earns it |
|---|---|---|---|
| Technical execution (live demo) | Technical | 35% | Beat 3: the Reflection Companion running live. Beats 4 and 6: one piece of feedback travels from a group outside BRIDGEGOOD, through the steward, onto a public page and back to the group. |
| Impact and problem solving | Non-profit partner | 30% | Beats 2, 4 and 6: a community group runs BRIDGEGOOD's practice with no BRIDGEGOOD staff in the room, and what it learns reaches BRIDGEGOOD, who decides and keeps authorship. |
| Innovation (new technology, algorithms, methods) | Technical | 20% | Beat 3: an evaluator whose schema can't express a score, labelled kinds of finding, a synthetic test set with injection tests, running on open-weights Gemma 4 that a chapter could host itself. Beat 4: a steward loop that versions a philosophy, and anonymous feedback answered by reply code. |
| Demo and storytelling | All | 15% | One loop, three people, two logins. |
| Accessibility (bonus) | All | Bonus | Beat 4 is driven **by keyboard only**; beat 5 shows the axe suite passing in GitHub Actions. |

55% of the score comes from technical judges, and 35% is the *live* demo. "AI off" costs real points, so **getting the AI running is the top job before demo day** (see the end). The script assumes it's live and keeps an "AI off" line as a fallback only.

## The one idea to land

The brief asks how the philosophy can live "beyond any one person". Our answer: **put BRIDGEGOOD's reasoning where people make decisions, let anyone run it without BRIDGEGOOD in the room, and route what they learn back to BRIDGEGOOD, who keeps authorship.** It isn't a course, and the AI asks questions rather than judging.

The thread: **Ari** (apprentice) reflects on their work with the AI companion → **Eastside Tenants Network**, a community group outside BRIDGEGOOD, runs a critique circle with the kit and tells BRIDGEGOOD what it changed → **Morgan** (BRIDGEGOOD steward) decides, with a reason → the public library changes, and Eastside reads the answer with its reply code.

## Before you present

**Setup (15 minutes before)**
1. **Gemma first.** Run `npm run keys -- setup gemma-google` (a free Google AI Studio key, and a yes to "every input will be synthetic"), then `npm run build && npm start`. On Vercel, set `EVALUATOR_PROVIDER=gemma-google`, `GOOGLE_GENERATIVE_AI_API_KEY` and `EVALUATOR_FREE_TIER=synthetic-only` in the project and redeploy. Don't demo from `npm run dev`: the first page load is slow.
2. **Claude fallback, ready in a second tab:** with `ANTHROPIC_API_KEY` also in `.env.local`, start a second server with `EVALUATOR_PROVIDER=claude PORT=3001 npm start` (a variable set on the command line wins over `.env.local`), and open `localhost:3001/student/reflection` in a tab at the end of the row. Both servers share the login cookie, so once you log in as the apprentice in beat 3 that tab is ready too.
3. **Warm up the AI:** run one companion reflection on each server in a throwaway profile, so the first call on stage isn't a cold start and you know both work.
4. In the demo browser, clear site data for the app (DevTools → Application → Clear storage) so the seed data is fresh. Demo data lives in `localStorage`, and every demo login in the same browser shares it, which is what makes the hand-offs work.
5. **Send Eastside's kit feedback now, not on stage.** Logged out, open `/learn/carry-it-forward`, scroll to "Tell BRIDGEGOOD what you changed", and fill it in from [the text to paste](#text-to-paste): choose "A community organization", pick **Accessibility & Inclusion** as the pillar, tick "BRIDGEGOOD may credit our group by name", and press **Send to BRIDGEGOOD**. **Write the reply code on your sticky note**: it's the only way back to the answer in beat 6.
6. Leave the browser logged out, on `/`.
7. Zoom the browser to 125% so the room can read it.
8. Open these tabs in order: `/`, `/learn/pillars/ethics-impact`, `/learn/carry-it-forward` (scrolled to the top), and the [CI workflow runs on GitHub](https://github.com/deka108/hack-buildgood/actions/workflows/ci.yml) with a green run on `main` open on its "Accessibility (axe, reflow, zoom, text spacing)" job.
9. Have `src/content/evaluator-goldens/images/consent.png` ready to attach (Desktop or Downloads, so the file picker opens near it), and its note from [the text to paste](#text-to-paste).
10. **Rehearse the keyboard path in beat 4** and write the Tab counts on the sticky note, under the reply code. The steward inbox now lists featured community events above the feedback, so count the Tab stops on the current build. Have the mouse out of reach on stage so you aren't tempted.

**Backup:** a second browser profile where you've already run the whole script, including a finished companion review, the steward's decision and the reply. Also a **screen recording of the companion's live run** from rehearsal. If the AI fails on stage, play the recording and say so: a recording of a real run is honest, a mock isn't.

## The script (4:00)

Times are cumulative. **Say** is a guide, not word for word. **Proves** is for you; don't read it out.

### 0. The problem and who it's for (0:00–0:20) · `/`

**Say:** "BRIDGEGOOD's Design for Social Good philosophy passes on in person, through people who already know the culture. As BRIDGEGOOD grows, apprentices, mentors and whole communities need to practice it without the founder in the room. BridgeGoodx puts BRIDGEGOOD's reasoning where they make decisions, and sends what they learn back to BRIDGEGOOD. Everyone you'll see is synthetic."

**Show:** the hero, then a quick scroll to "BRIDGEGOOD authors it. A community practices it."

**Proves:** impact; problem understanding; authorship from the first screen.

### 1. Words with concrete meaning (0:20–0:35) · `/learn/pillars/ethics-impact`

**Say:** "Five pillars. Each says what it means in practice and the questions to ask. 'Social good' means the community helped define the problem *and* the designers grew through the work. The same questions show up inside apprentice submissions and partner briefs, where the decisions happen."

**Show:** the pillar's plain meaning and its questions.

**Proves:** codifies the reasoning, not slogans; practiced in the flows (said, not shown, to save a login).

### 2. Anyone can run it without us (0:35–0:55) · `/learn/carry-it-forward` (no login)

**Say:** "Most people who need this will never be in a BRIDGEGOOD program. So the library comes with a kit. A teacher, a library or a tenant group can run a one-hour critique circle with BRIDGEGOOD's prompt cards: what to keep, what to adapt, and a credit line with the framework version. It prints. Eastside Tenants Network ran one last week, on its own flyer, and told BRIDGEGOOD what it changed. No name, no email: they got a reply code."

**Show:** who it's for and the four facts (60 minutes, 4 to 12 people), a quick scroll past the five steps and the prompt cards to the credit line, then "Tell BRIDGEGOOD what you changed". Don't fill the form on stage; it was sent before the pitch.

**Proves:** impact (reach beyond programs, the weakest criterion in the last mission evaluation); not a course; authorship travels with the kit.

### 3. The AI asks, the apprentice decides (0:55–2:00) · log in as **Apprentice** → Reflection companion · *live AI*

1. **(15s)** Attach `consent.png`, paste its note, press the button to ask the companion.
   **Say:** "Ari is an apprentice. They share a screen they designed, a sign-up form, and ask the Reflection Companion about it."
2. **(25s, while it streams)** **Say:** "Here's what's new. It's one evaluator engine, built on BRIDGEGOOD's versioned rubric, and its output schema has no field for a score or a grade, so it can't produce one. Everything it says is labelled: an AI observation to check, or a question only people can answer. We test it against a synthetic set with seeded issues, prompt-injection attempts and fake personal data, and right now it's running on Gemma 4, Google's open-weights model. The same setting runs it on a laptop, so a chapter could keep every screenshot on its own machine." (Say the laptop line only if you've run `gemma-local` yourself.)
3. **(25s)** Point at the review in its dashed draft frame.
   **Say:** "It noticed the pre-ticked consent box, and asks about it rather than calling it wrong. Questions about who's left out stay questions. Here's what it says it can't judge. Ari edits these, keeps what's useful, and decides what to share with their mentor, who has the final say. When Ari marks something 'not right', that goes back to BRIDGEGOOD. And it says which model wrote it, and that this demo runs on a free tier, which is why it only ever sees synthetic examples."

**Show:** "AI observation · please check", "Question for you", "What I can't judge", the share-with-mentor control, and "How this was made" naming Gemma 4.

- **Gemma failing or slow:** switch to the Claude tab on port 3001 and ask again: "Same engine, same rules, a different model: that's one setting."
- **Both failing:** "The model isn't answering, and the page tells Ari they can still answer the questions themselves. Here's a recording of this run from earlier." Play the recording.

**Proves:** technical execution live; innovation (schema-level no-scoring, labelled kinds, golden set, open-weights Gemma); human judgment over AI; privacy (the free-tier notice).

### 4. BRIDGEGOOD decides, by keyboard (2:00–3:25) · the centerpiece

**Say first (5s):** "I'll do this part with the keyboard only."

1. **(50s)** Log in as **BRIDGEGOOD steward**. Use **Skip to main content**, Tab to "Outside community: a community organization", Enter. Tab to the decision, arrow keys to **Accept**, Tab to "What changes?", arrow to **Show it as a field note**, Tab past the prefilled field note to the reason and paste it, Tab to **Record decision**, Enter.
   **Say:** "Morgan is BRIDGEGOOD staff. Every piece of feedback lands in one inbox: Eastside's note, a chapter's local adaptation, apprentices' 'this didn't fit' flags, partner retrospectives, what chapters learned at their events, and where mentors disagreed with the AI. Only the steward changes the official wording, and every decision needs a reason. Morgan doesn't know who Eastside's members are, and doesn't need to." Mention the focus ring once: "You can always see where focus is."
2. **(30s)** Go to `/learn/pillars/access-inclusion`, then `/learn/changelog`.
   **Say:** "Eastside's practice now sits under the official wording, labelled as a local adaptation from a group outside BRIDGEGOOD, and credited only because they said yes. The decision and its reason are public. Communities adapt it; BRIDGEGOOD stays the author."

**Proves:** impact (feedback loop, local adaptation, authorship); technical execution across roles; accessibility bonus item 2.

### 5. Accessibility proof (3:25–3:40) · the GitHub Actions tab

**Say:** "Every pull request runs axe on every page in light and dark mode, plus reflow at 320 pixels, 200% zoom and text spacing, against WCAG 2.2 AA. Here's the job passing on main."

**Proves:** accessibility bonus item 1.

### 6. The loop closes, and the close (3:40–4:00) · `/learn/carry-it-forward/reply`

**Say:** "Back at Eastside, they type their code" (type it from the sticky note, loosely: "capitals and dashes don't matter") "and see BRIDGEGOOD's decision and why. So the philosophy doesn't depend on one person explaining it. People meet BRIDGEGOOD's reasoning where they decide, communities carry it on their own, and what they learn comes back to BRIDGEGOOD, who stays the author."

**Show:** "BRIDGEGOOD accepted this", the steward's reason and the link to the public changelog.

**Proves:** impact (the loop reaches people with no account); technical execution end to end.

## Text to paste

Synthetic. The companion note is the `consent` item in `src/content/evaluator-goldens/index.ts`. The kit feedback follows the flow in `tests/practice-and-kit.spec.ts`.

| Field | Text |
|---|---|
| Companion note (beat 3, with `consent.png`) | Synthetic test. Sign-up screen for a free after-school homework club. I wanted parents to sign up in one step. |
| Kit: what kind of group ran it? (setup) | A community organization |
| Kit: what did you change about the session? | We read each prompt card aloud in Spanish and English, and people could answer by drawing as well as talking, because several of our members read one language better than the other. |
| Kit: what didn't fit your community? | An hour was too long after work, so we took a short break halfway. |
| Kit: is it mostly about one pillar? | Accessibility & Inclusion |
| Kit: group name to credit | Eastside Tenants Network |
| Steward's reason (beat 4, on stage) | It removes a language barrier without dropping any prompt, and other groups face the same barrier. |

## If something goes wrong

| Problem | Do this |
|---|---|
| The companion errors or takes over 30 seconds on Gemma | Switch to the Claude tab (port 3001) and ask once. If that fails too, say the fallback line and play the recording. Don't retry the same model on stage. |
| Google's free tier says the limit is reached | Switch to the Claude tab. Free limits are per minute and per day, so don't rehearse right before the pitch. |
| The companion's review doesn't mention the consent box | Point at whatever it did observe and at "What I can't judge". Don't claim it found something it didn't. |
| Login lands on the wrong role | Go to `/login` and pick again; the session is just a cookie. |
| Eastside's feedback isn't in the inbox | You're in a different browser profile from the one you sent it in. Switch to the backup profile. |
| The reply code says "No feedback with that code" | Check the sticky note for a typo. If it's still missing, you're in the wrong profile; the seeded example code `BG-DEMO-7Q4X` shows a steward's reply instead. |
| Lost on the keyboard path | Say "I'll grab the mouse to save time" and finish. The bonus is for showing it works, not for perfection. |
| Running long at 2:00 | Cut beat 1 to one sentence next time; on stage, skip the changelog in beat 4. Never cut the live AI, the steward's decision or the reply. |
| Running long at 3:25 | Cut beat 5 to one sentence and say only the closing sentence of beat 6. |

## Q&A (1 minute)

One or two questions, about 15 seconds each: one sentence, then point at something if it helps.

- **"What's technically new here?"** The AI's output schema has no score field, so it can't grade anyone; findings are labelled as automated, AI observation or human-only question; and disagreements feed a versioned rubric that only BRIDGEGOOD changes.
- **"How do you know the AI behaves?"** A synthetic test set with seeded issues, injection attempts and fake personal data, plus unit tests on the rules; BRIDGEGOOD staff reading real outputs is the final check.
- **"Which model?"** Gemma 4, Google's open-weights model, on a free tier for this demo with synthetic examples only; one setting moves it to a chapter's own machine or to Claude, so BRIDGEGOOD isn't locked to one vendor. (Only claim comparison results you've actually run.)
- **"Isn't this just a course?"** No: the library is reference, practice moments are dilemmas with no score, and the questions appear inside the partner brief, the submission, the mentor conversation and a community's own critique circle.
- **"How do you stop the philosophy drifting?"** Only BRIDGEGOOD's steward changes the official wording, every decision has a public reason and a version number, and local adaptations are labelled as local.
- **"Real participant data?"** None: everything is synthetic and labelled, notes reject email addresses and phone numbers, outside groups never give a name unless they want credit, and credit needs consent.
- **"What's needed to go live?"** A real database and accounts, since demo data and reply codes live in one browser; then rate limits on the kit's open feedback form.

## Before demo day

In priority order. The reasoning and point estimates are in the [rubric evaluation](evaluation-rubric-2026-10-25.md).

1. **Get Gemma running and verify it** (worth up to 55% through technical execution and innovation). Get a free Google AI Studio key, make one live call (`scripts/compare-evaluators.ts --providers gemma-google --only consent --runs 1`), then run all six golden items three times with `--live` against a production build, and check that the `consent` item reliably mentions the pre-ticked box. If another item is more reliable, switch beat 3 to it. Then get an Anthropic key and check the Claude fallback the same way. Record a clean Gemma run as the backup, and a local Gemma run if you'll say the laptop line.
2. **Deploy to Vercel** and rehearse on the deployed URL.
3. **Put the test-set results on screen** in beat 3: `scripts/compare-evaluators.ts --live` prints a table (seeded issue found, injection resisted, personal data refused, no judging words). Needs a working model.
4. **Rehearse the keyboard path** in beat 4 until it's smooth, and check the focus ring is clearly visible on the projector.
5. **Rehearse the whole pitch three times with a timer**, once with a deliberate AI failure to practise the recording switch. If a run goes over 4:00, cut words from beats 0 to 2, never from beats 3, 4 and 6.
