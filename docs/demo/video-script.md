# BridgeGoodx demo video: script (2:00)

> **Status: draft, 2026-10-25.** A short, muted-friendly video for judges and BRIDGEGOOD staff. The 4-minute live pitch is [../demo-script.md](../demo-script.md); this video reuses its thread (Ari → Eastside Tenants Network → Morgan the steward) in less than half the time. Every person, group and screen is synthetic and labelled that way in the app.

## The one idea

A philosophy that lives in people's heads can't scale. BridgeGoodx puts BRIDGEGOOD's reasoning where people decide, lets communities practice and adapt it, and sends what they learn back to BRIDGEGOOD, who keeps authorship. The AI asks questions; people decide.

We show the **loop**, not the roles. Cut on purpose: mentor area, ambassador playbook, design system, events host form, mentee messaging.

## Scenes

Each scene is one clip with its own time budget, so any one can be re-recorded and swapped. Times are the budget for the clip, not cumulative. **Captions** are burned into the recording by the page itself (see [recording-plan.md](recording-plan.md#captions)); **narration** is optional voice-over text, ~130 words a minute.

| # | ID | Budget | Cumulative | Where |
|---|---|---|---|---|
| 1 | `01-hook` | 12s | 0:12 | `/` |
| 2 | `02-library` | 16s | 0:28 | `/learn/pillars/ethics-impact`, `/learn/practice` |
| 3 | `03-companion` | 30s | 0:58 | `/student/reflection` (live AI) |
| 4 | `04-scoping` | 14s | 1:12 | `/partner/submit` (live AI) |
| 5 | `05-community` | 18s | 1:30 | `/learn/carry-it-forward`, `/chapters` |
| 6 | `06-steward` | 18s | 1:48 | `/steward`, then `/learn/changelog` |
| 7 | `07-reply-close` | 12s | 2:00 | `/learn/carry-it-forward/reply`, end card |

### 1. Hook (12s)

- **Show:** the welcome page, the "Design for … social good" title looping, then a slow scroll to "BRIDGEGOOD authors it. A community practices it."
- **Captions:** "BRIDGEGOOD's Design for Social Good travels person to person." · "BridgeGoodx lets communities practice it, and sends what they learn back." · "Every person and group shown is synthetic."
- **Narration:** "BRIDGEGOOD's philosophy travels from person to person. BridgeGoodx lets communities practice it without BRIDGEGOOD in the room, and carries what they learn back. Everyone you'll see is synthetic."

### 2. Words with concrete meaning (16s)

- **Show:** the Ethics & Impact pillar (its plain meaning and questions), then a practice moment: a synthetic dilemma with BRIDGEGOOD's draft reasoning. Click one choice; the reasoning appears. No score anywhere.
- **Captions:** "Each pillar says what it means in practice." · "Practice moments: a dilemma, BRIDGEGOOD's reasoning, no score."
- **Narration:** "Social good gets a concrete meaning, with the questions to ask. Practice moments set a real dilemma beside BRIDGEGOOD's reasoning. Nobody is scored."

### 3. The AI asks, the apprentice decides (30s)

- **Setup:** logged in as **Apprentice** (Ari). Attach `src/content/evaluator-goldens/images/consent.png`, paste the companion note from [the text to paste](../demo-script.md#text-to-paste), ask for the review.
- **Show:** the AI label, the personal-data screen, the review inside its dashed draft frame, "AI observation · please check", "Question for you", "What I can't judge", the share-with-mentor control, "How this was made".
- **Captions:** "Ari asks the Reflection Companion about a sign-up screen." · "AI is labelled. It can't produce a score." · "It asks a question about the pre-ticked box instead of judging it." · "It says what it can't judge. Ari edits, and decides what to share."
- **Narration:** "Ari asks the Reflection Companion about a sign-up form. The AI is labelled, and its output has no field for a score. It asks about the pre-ticked consent box, says what it can't judge, and leaves Ari to edit and decide what to share with a mentor."

### 4. A partner stays the author (14s)

- **Setup:** logged in as **Community partner**. Open the scoping studio, send one short synthetic need, show the brief draft.
- **Show:** the required "How will the people you serve shape this?" field, left visibly empty or filled by the partner, and the AI draft in its frame with an edit cursor.
- **Captions:** "A community partner scopes a problem with AI help." · "The brief is a draft. The partner is the author." · "The people they serve shape it: a required question."
- **Narration:** "A community partner turns a need into a brief with AI help. The brief is a draft in their hands, and one question can't be skipped: how will the people you serve shape this?"

### 5. Communities adapt it (18s)

- **Show:** the carry-it-forward kit (60 minutes, 4 to 12 people, prompt cards, credit line, print button), then the chapters list with the map settling on city-level pins.
- **Captions:** "The kit lets any group run a critique circle, no account needed." · "It prints, and carries BRIDGEGOOD's credit line." · "Chapters are city-level only, with a shared inbox."
- **Narration:** "Most people who need this will never join a program. The kit lets a tenants' group run a critique circle on its own, with BRIDGEGOOD's prompts and credit. Chapters show only the city, never a person."

### 6. BRIDGEGOOD decides, with a reason (18s)

- **Setup:** logged in as **BRIDGEGOOD steward** (Morgan), on the state where Eastside's feedback has already been sent and is still undecided.
- **Show:** the inbox with "Outside community: a community organization" → open → choose **Accept**, **Show it as a field note**, type the reason, **Record decision** → `/learn/changelog` showing the new entry and credit.
- **Captions:** "All feedback lands in one inbox, from every role." · "Only the steward changes the wording, always with a reason." · "The change is public, and credits the group that asked."
- **Narration:** "Every piece of feedback lands with a steward, who decides and says why. Eastside's adaptation appears under the official wording, credited because they said yes. BRIDGEGOOD stays the author."

### 7. The loop closes (12s)

- **Setup:** logged out, on the state after the steward's decision.
- **Show:** `/learn/carry-it-forward/reply`, type the reply code, see "BRIDGEGOOD accepted this" with the reason, then the end card.
- **Captions:** "No name, no email: Eastside reads the answer with a reply code." · End card: "BridgeGoodx · BRIDGEGOOD's philosophy, your community's practice · all data synthetic"
- **Narration:** "Back at Eastside, a reply code brings the decision and the reason. People meet BRIDGEGOOD's reasoning where they decide, communities carry it on, and what they learn comes back."

## Style rules for every scene

- Show the thing a judge should look at for at least 2 seconds, then move. No fast scrolling.
- Never show a real key, a real email or any personal data. Synthetic text only, from the repo.
- The AI scenes must show the AI label on screen. Don't crop it out.
- No claim in captions that the app doesn't back up (for example "runs offline on a laptop").
