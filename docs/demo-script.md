# Demo script (hackathon: 4-minute pitch, 1-minute Q&A)

> **Status: draft, 2026-10-25.** Written against `main` after milestone 3 and the gaps in [evaluation-milestone-3.md](evaluation-milestone-3.md). Every person, organization and quote on screen is synthetic and labelled that way in the app. Say so out loud once (beat 0) so judges don't wonder.

## The one idea to land

The brief asks how the philosophy can live "beyond any one person". Our answer: **put BRIDGEGOOD's reasoning at the moments people make decisions, and route what communities learn back to BRIDGEGOOD, who keeps authorship.** It isn't a course. The demo follows one synthetic project through the people involved and back to BRIDGEGOOD, so judges see the loop rather than a tour of pages.

The thread: **Eastside Tenants Network** (community partner) brings a problem → **Ari** (apprentice) works on it with **Jordan** (mentor) → **Priya** (Chicago chapter lead) adapts the practice for her community → **Morgan** (BRIDGEGOOD steward) decides, with a reason, and the public library changes.

## Before you present

**Setup (10 minutes before)**
1. Run `npm run build && npm start` (or open the Vercel deploy if it exists). Don't demo from `npm run dev`: the first page load is slow.
2. In the demo browser, clear site data for the app (DevTools → Application → Clear storage) so the seed data is fresh. Demo data lives in `localStorage` and every demo login in the same browser shares it, which is what makes the hand-offs work.
3. **Send the chapter lead's adaptation now, not on stage.** Log in as Ambassador → Playbook, fill in the form from [the text to paste](#text-to-paste), tick "Recognize it as our local variant" and "Credit the Chicago chapter", and press **Send to BRIDGEGOOD**. Typing four fields live costs about 30 seconds you don't have. On stage you show it already sent, and the steward's decision happens live.
4. Log in as Community partner and leave the browser on `/`. Beat 2 starts from the partner's area, so you skip one login on stage.
5. Zoom the browser to 125% so the room can read it.
6. Open these tabs in order: `/`, `/learn/pillars/ethics-impact`, `/partner/submit`, `/student/submissions`. Everything after that you reach by logging in or clicking.
7. Keep [the text to paste](#text-to-paste) open in a second window for the steward's reason.
8. **AI decision:** show the AI live only if `ANTHROPIC_API_KEY` (or the AI Gateway) is set *and* you ran beats 2 and 3 against it today. Otherwise use the "AI off" line. Never fake an AI response. With four minutes, "AI off" is the safer default anyway: a live model call can take 10 seconds or more.

**Backup:** a second browser profile where you've already run the whole script, so the steward's decision, the changelog entry and the field note exist. If anything breaks, switch to it and keep talking.

## The script (4:00)

Times are cumulative. **Say** is a guide, not word for word; at this length, aim for the gist and keep moving. **Proves** is for you, so you know which part of the brief each beat answers; don't read it out.

### 0. The problem (0:00–0:20) · `/`

**Say:** "BRIDGEGOOD's Design for Social Good philosophy passes on in person, through people who already know the culture. The brief asks how it survives growth without becoming a checklist or a course. BridgeGoodx puts BRIDGEGOOD's reasoning where people make decisions, and sends what communities learn back to BRIDGEGOOD. Everyone you'll see is synthetic."

**Show:** the hero, then a quick scroll to "BRIDGEGOOD authors it. A community practices it."

**Proves:** problem understanding; authorship visible from the first screen.

### 1. Words with concrete meaning (0:20–0:45) · `/learn/pillars/ethics-impact`

**Say:** "Five pillars, each saying what it means in practice, why BRIDGEGOOD works this way, and the questions to ask. 'Social good' means the community helped define the problem and judged the result, *and* the designers grew through the work. It's public, so anyone can read it."

**Show:** the pillar's plain meaning and its questions. Skip the terms page unless you're ahead of time.

**Proves:** codifies the reasoning, not just the values; concrete meaning; reach beyond programs.

### 2. The partner can't skip the community (0:45–1:15) · `/partner/submit` (already logged in)

**Say:** "A tenant advocacy group brings a problem. The brief asks a question they can't skip: *How will the people you serve shape this?* The philosophy shows up while the project is being scoped, not in a training afterwards."

**Show:** the required field and its validation message if left empty.

- **AI off (default):** "The scoping assistant is off here, and the form works without it. When it runs, its output arrives as a labelled draft that the partner edits."
- **AI on:** paste the problem, run the assistant, point at the draft frame and say the same thing.

**Proves:** practiced in the flow; community decision rights; AI keeps humans deciding.

### 3. Apprentice and mentor: questions, not scores (1:15–1:55) · log in as **Apprentice** → Submissions & feedback

**Say:** "Ari is an apprentice on that project. Before submitting, they get the questions for that moment, like *Who might be left out?*, not a rubric, and their answers reach their mentor only if they choose to share them. The Reflection Companion asks more questions, never scores, and says what it can't judge. Jordan, a volunteer mentor, gets a growth conversation rather than a grading form, and when Jordan disagrees with the AI, that goes back to BRIDGEGOOD."

**Show:** the questions on the submission, then click Reflection companion and point at "It never scores or grades your work". Don't log in as the mentor; say the last sentence over the companion page.

**Proves:** not a course; human judgment over AI; the mentor relationship stays at the center.

### 4. A community adapts it, BRIDGEGOOD decides (1:55–3:30) · the centerpiece

This beat answers the hardest part of the brief. Protect its time.

1. **(15s)** Log in as **Ambassador** → Playbook. Point at the adaptation you sent before the pitch.
   **Say:** "Priya's chapter meets in a community center where apprentices share a laptop, so they critique on paper first. She doesn't fork the philosophy. She proposes the change to BRIDGEGOOD and says which commitments she kept."
2. **(45s)** Log in as **BRIDGEGOOD steward** → Inbox → open "Chicago chapter: Good Design Craft" → Accept → "Show it as a field note" → paste the reason → **Record decision**.
   **Say:** "Morgan is BRIDGEGOOD staff. Only the steward changes the official wording, and every decision needs a reason. The same inbox gets apprentices' 'this didn't fit' flags, partner retrospectives and mentor–AI disagreements."
3. **(35s)** Open `/learn/changelog`, then `/learn/pillars/craft`.
   **Say:** "The decision is public, with the reason and the chapter's credit, because Priya agreed to be credited. On the pillar page, the official wording stays on top and Chicago's practice sits under it, labelled as local. Communities adapt it, and BRIDGEGOOD stays the author."

**Proves:** communities interpret it differently; feedback loop back to BRIDGEGOOD; authorship; consent-gated credit.

### 5. Next, and close (3:30–4:00) · `docs/design/mockups-practice-and-kit.html`

**Say:** "What's missing: people outside BRIDGEGOOD can read the library but can't yet run anything with it. This is the next build: a kit to run a critique circle in your own community, with BRIDGEGOOD's credit built in and a form that feeds the same steward inbox. So the philosophy doesn't depend on one person explaining it. People meet BRIDGEGOOD's reasoning when they decide, communities adapt it in the open, and BRIDGEGOOD stays the author."

**Show:** the kit section of the mockup. Mention practice moments only if a judge asks.

**Proves:** honest about limits; the plan for the weakest criterion (outside communities).

## Text to paste

Synthetic, matches `tests/feedback-loop.spec.ts`, so the flow is known to work.

| Field | Text |
|---|---|
| Partner problem (beat 2, AI on only) | Tenants miss repair deadlines because notices arrive as dense letters, often not in their first language. We want a way for tenants to understand what a notice asks and by when. |
| Which pillar is it about? | Good Design Craft |
| What did you change? | We critique on paper prototypes first, because many apprentices share one laptop. |
| Why does it fit your community better? | Laptops are scarce at our community center, and paper lets everyone take part. |
| Which core commitments did you keep? | Hierarchy, writing and error states still get checked before anything ships. |
| Steward's reason (on stage) | Keeps the craft commitments and removes a barrier other chapters face too. |

## If something goes wrong

| Problem | Do this |
|---|---|
| Login lands on the wrong role | Go to `/login` and pick again; the session is just a cookie. |
| The adaptation isn't in the inbox | You're in a different browser profile from the one you sent it in. Switch to the backup profile. |
| AI call errors or hangs | "The AI is off or slow, and the form works without it. That's deliberate." Move on. |
| Running long at 1:55 | Skip the Playbook step in beat 4 and go straight to the steward. Never cut the steward's decision or the changelog. |
| Running long at 3:30 | Say only the closing two sentences. |

## Q&A (1 minute)

You'll get one or two questions. Answer each in about 15 seconds: one sentence, then point at something on screen if it helps. Leave the browser on the pillar page with the Chicago field note, since most answers can point at it.

- **"Isn't this just a course?"** No: the library is reference, and the questions appear inside the partner brief, the submission and the mentor conversation. Practice moments, short scenarios with BRIDGEGOOD's reasoning and no score, will replace what still reads like modules.
- **"Why trust AI with mentoring?"** We don't: it asks questions, never scores, says what it can't judge, and mentors overrule it, with every disagreement going to BRIDGEGOOD. It hasn't been tested against a live model yet.
- **"How do you stop the philosophy drifting?"** Only BRIDGEGOOD's steward changes the official wording, every decision has a public reason and a version number, and local adaptations are labelled as local. *(Point at the field note.)*
- **"Real participant data?"** None: it's all synthetic and labelled, notes reject email addresses and phone numbers, and credit needs consent.
- **"Is it accessible?"** WCAG 2.2 AA checks run on every page in light and dark in CI: axe, reflow at 320px, 200% zoom and text spacing.
- **"What's needed to go live?"** A real database and accounts, since demo data lives in one browser; then the carry-it-forward kit; then a live AI test with BRIDGEGOOD staff reviewing the outputs.

## Before demo day (from the M3 gaps)

In priority order.

1. **Deploy to Vercel** and rehearse on the deployed URL (gap 4).
2. **Decide on AI:** get a key and test beats 2 and 3, or commit to the "AI off" lines (gap 3).
3. **Rehearse three times with a timer.** Four minutes leaves no slack: if a run goes over 4:00, cut words from beats 0 to 3, not from beat 4. Rehearse once with a deliberate failure to practice the backup switch.
4. If there's time to build one thing, build the **carry-it-forward kit** (gap 1), so beat 5 shows it working instead of a mockup. It's the lowest-scoring criterion and reuses the steward inbox.
