# Demo script (hackathon, ~5 minutes)

> **Status: draft, 2026-10-25.** Written against `main` after milestone 3 and the gaps in [evaluation-milestone-3.md](evaluation-milestone-3.md). Every person, organization and quote on screen is synthetic and labelled that way in the app. Say so out loud once (beat 0) so judges don't wonder.

## The one idea to land

The brief asks how the philosophy can live "beyond any one person". Our answer: **put BRIDGEGOOD's reasoning at the moments people make decisions, and route what communities learn back to BRIDGEGOOD, who keeps authorship.** It isn't a course. The demo follows one synthetic project through four people and back to BRIDGEGOOD, so judges see the loop rather than a tour of pages.

The thread: **Eastside Tenants Network** (community partner) brings a problem → **Ari** (apprentice) works on it → **Jordan** (mentor) holds a growth conversation → **Priya** (Chicago chapter lead) adapts the practice for her community → **Morgan** (BRIDGEGOOD steward) decides, with a reason, and the public library changes.

## Before you present

**Setup (10 minutes before)**
1. Run `npm run build && npm start` (or open the Vercel deploy if it exists). Don't demo from `npm run dev`: the first page load is slow.
2. In the demo browser, clear site data for the app (DevTools → Application → Clear storage) so the seed data is fresh. Demo data lives in `localStorage` and every demo login in the same browser shares it, which is what makes the hand-offs work.
3. Zoom the browser to 125% so the room can read it. Turn on dark mode only if the room is dark; both are checked.
4. Open these tabs in order: `/`, `/learn/pillars/ethics-impact`, `/login`. Everything else you reach by clicking.
5. Keep [the text to paste](#text-to-paste) open in a second window. Typing live is slow and error-prone.
6. **AI decision:** if `ANTHROPIC_API_KEY` (or the AI Gateway) is set *and* you have run beat 2 and beat 3 against it today, show the AI live. Otherwise show that the AI is off and say so (script below). Never fake an AI response. The M3 evaluation lists the AI features as unverified, so plan on "off".

**Backup:** a second browser profile where you've already run the whole script, so the adaptation, changelog entry and field note exist. If anything breaks live, switch to it and keep talking. A screen recording of a clean run is the last resort.

## The script

Times are cumulative. **Say** is a guide, not a word-for-word script. **Proves** is for you, so you know which part of the brief each beat answers; don't read it out.

### 0. The problem (0:00–0:30) · `/`

**Say:** "BRIDGEGOOD's Design for Social Good philosophy mostly passes on in person: in critiques, mentoring and hard conversations, with people who already know the culture. The brief asks how it survives growth without turning into a checklist or a course. We built BridgeGoodx to put BRIDGEGOOD's reasoning where people make decisions, and to send what communities learn back to BRIDGEGOOD. Everyone you'll see is synthetic."

**Show:** the welcome page hero, then scroll to the ownership section ("BRIDGEGOOD authors it. A community practices it.").

**Proves:** problem understanding; authorship visible from the first screen.

### 1. Words with concrete meaning (0:30–1:05) · `/learn/pillars/ethics-impact`

**Say:** "The philosophy is five pillars. Each one says what it means in practice, why BRIDGEGOOD works this way, and the questions to ask, not a slogan. 'Social good' here means the community helped define the problem and judged the result, *and* the designers grew through the work. The library is public, so someone outside BRIDGEGOOD can read it today."

**Show:** the pillar's plain meaning and prompts. Briefly open `/learn/terms` and point at "social good" or "access" (access includes money, food, time and tools, not only WCAG).

**Proves:** codifies the reasoning, not just the values; concrete meaning of the four terms; reach beyond programs.

### 2. The partner can't skip the community (1:05–1:50) · log in as **Community partner** → Submit a problem

**Say:** "A tenant advocacy group brings a problem. The brief form asks a question they can't skip: *How will the people you serve shape this?* That's the Design for Good pillar, asked where it matters, while the project is being scoped."

**Show:** the required field and its validation message if left empty.

- **AI on:** paste the problem from [the text to paste](#text-to-paste), run the scoping assistant, point at the draft frame: "AI output always arrives labelled as a draft. The partner edits it, and BRIDGEGOOD reviews it before it reaches apprentices."
- **AI off:** "There's a scoping assistant, but it isn't switched on in this demo, and the form works without it. When it runs, its output arrives in a labelled draft frame the partner edits. We'd rather show you that honestly than fake it."

**Proves:** practiced in the flow; community decision rights; AI keeps humans deciding.

### 3. The apprentice reflects, nobody scores (1:50–2:40) · log in as **Apprentice** → Submissions & feedback, then Reflection companion

**Say:** "Ari is an apprentice on that project. When they submit work, they see the questions for this moment, like *Who might be left out?*, not a rubric. Their answers go to their mentor only if they choose to share them. The Reflection Companion asks questions about their work. It never scores, it says what it can't judge, and Ari decides which questions to keep and share with their mentor."

**Show:** the decision-point prompt on the submission; on the companion page, the line "It never scores or grades your work" and the "what it can't judge" section. AI on: run one reflection. AI off: show the page and say the same thing about it being off.

**Proves:** not a course; human judgment over AI; the relationship (mentor) stays at the center.

### 4. The mentor holds the conversation (2:40–3:10) · log in as **Mentor** → Growth conversations

**Say:** "Jordan, a volunteer mentor and alum, gets a growth conversation, not a grading form. The prompts help a volunteer sound like BRIDGEGOOD without the founder in the room: care, tone and expectations. When Jordan disagrees with the AI, that disagreement goes to BRIDGEGOOD too."

**Show:** the conversation prompts and the absence of scores.

**Proves:** mentors and volunteers reflect BRIDGEGOOD's care and tone; disagreement with AI is treated as signal.

### 5. A community adapts it, BRIDGEGOOD decides (3:10–4:25) · the centerpiece

This is the beat that answers the hardest part of the brief. Give it time.

1. Log in as **Ambassador** (Chicago chapter lead) → Playbook → propose an adaptation. Paste the four fields from [the text to paste](#text-to-paste), tick "Recognize it as our local variant" and "Credit the Chicago chapter", then **Send to BRIDGEGOOD**.
   **Say:** "Priya's chapter meets in a community center where apprentices share a laptop, so they critique on paper first. She doesn't fork the philosophy. She proposes the change and says which commitments she kept."
2. Log in as **BRIDGEGOOD steward** → Inbox → filter "Tagged: Good Design Craft" → open the Chicago item → Accept → "Show it as a field note" → paste the reason → **Record decision**.
   **Say:** "Morgan is BRIDGEGOOD staff. Only the steward changes the official wording, and every decision needs a reason. The inbox also gets apprentices' 'this didn't fit' flags, partner retrospectives and mentor–AI disagreements."
3. Open `/learn/changelog`, then `/learn/pillars/craft`.
   **Say:** "The decision is public, with the reason and the chapter's credit, because Priya consented to it. On the pillar page the official wording stays on top, and Chicago's practice sits under it, labelled as local. Communities adapt it, and BRIDGEGOOD stays the author."

**Proves:** communities interpret it differently; feedback loop back to BRIDGEGOOD; authorship; consent-gated credit.

### 6. Where it goes next (4:25–5:00) · `docs/design/mockups-practice-and-kit.html`

**Say:** "Two things aren't built yet, and we know it. First, people outside BRIDGEGOOD can read the library but can't yet *run* anything with it. This mockup is a carry-it-forward kit: a critique circle session plan, what to keep and what to adapt, the credit line, and a 'tell BRIDGEGOOD what you changed' form that feeds the same steward inbox you just saw. Second, practice moments: short scenarios where you choose, then see BRIDGEGOOD's reasoning, with no score. Both reuse the loop we built."

**Close:** "So the philosophy doesn't depend on one person explaining it. People meet BRIDGEGOOD's reasoning when they decide, communities adapt it in the open, and BRIDGEGOOD stays the author."

**Proves:** honesty about limits; the plan for the weakest criterion (outside communities).

## Text to paste

Synthetic, matches `tests/feedback-loop.spec.ts`, so the flow is known to work.

| Field | Text |
|---|---|
| Partner problem (beat 2) | Tenants miss repair deadlines because notices arrive as dense letters, often not in their first language. We want a way for tenants to understand what a notice asks and by when. |
| Which pillar is it about? | Good Design Craft |
| What did you change? | We critique on paper prototypes first, because many apprentices share one laptop. |
| Why does it fit your community better? | Laptops are scarce at our community center, and paper lets everyone take part. |
| Which core commitments did you keep? | Hierarchy, writing and error states still get checked before anything ships. |
| Steward's reason | Keeps the craft commitments and removes a barrier other chapters face too. |

## If something goes wrong

| Problem | Do this |
|---|---|
| Login lands on the wrong role | Go to `/login` and pick again; the session is just a cookie. |
| The adaptation doesn't appear in the inbox | You're probably in a different browser profile from the one you submitted in. Switch to the backup profile. |
| AI call errors or hangs | "That's the AI being off or slow, and the form still works without it. That's deliberate." Move on. |
| Running long | Cut beat 4 to one sentence; never cut beat 5. |

## Questions judges are likely to ask

- **"Isn't this just a course with extra steps?"** The library is reference, not lessons, and prompts appear in the partner brief, the submission and the mentor conversation. Role tracks still read a bit like modules; practice moments (beat 6) replace them.
- **"Why trust the AI with mentoring?"** We don't. It asks questions, never scores, says what it can't judge, outputs drafts people edit, and mentor disagreement goes to BRIDGEGOOD. It hasn't been run against a live model yet ([evaluation-milestone-3.md](evaluation-milestone-3.md) gap 3).
- **"How does BRIDGEGOOD stop the philosophy drifting as chapters adapt it?"** Only the steward changes official wording, every decision has a reason, versions are recorded in `src/content/framework-history.ts`, and local adaptations are labelled as local.
- **"What about real participant data?"** None. Everything is synthetic and labelled, feedback notes reject email addresses and phone numbers (you can show this with a "This didn't fit" flag), and credit needs consent.
- **"Is it accessible?"** WCAG 2.2 AA checks run in CI on every page in light and dark: axe, reflow at 320px, 200% zoom and text spacing. Contrast is checked for every token pair.
- **"What's stopping this going live?"** Demo data lives in one browser. It needs a real store and accounts, then the kit, then a live AI check with BRIDGEGOOD staff reviewing outputs.

## Before demo day (from the M3 gaps)

In priority order. Each one makes the script stronger or safer.

1. **Deploy to Vercel** and rehearse on the deployed URL (gap 4).
2. **Decide on AI:** get a key and run beats 2 and 3 end to end, or commit to the "AI off" lines (gap 3).
3. **Rehearse twice with a timer**, once with a deliberate failure to practice the backup switch.
4. If there's time to build one thing, build the **carry-it-forward kit** (gap 1), so beat 6 shows it working instead of a mockup. It's the lowest-scoring criterion and reuses the steward inbox.
