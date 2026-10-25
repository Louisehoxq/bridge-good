# Resilience kit: staying valuable as AI takes on production work

> **Status: concept for the team, written 2026-10-24. Not built yet; the hackathon slice (section 6) is next in [BACKLOG.md](BACKLOG.md).** BRIDGEGOOD authors and owns the Design for Social Good philosophy, the five pillars and the twelve reflection prompts. This doc proposes features that put them to work for apprentices and alumni. It builds on [social-good.md](social-good.md) (what the terms mean), [ai-evaluator.md](ai-evaluator.md) (the evaluator engine) and [evaluation.md](archive/evaluation.md) (where the app stood before milestone 2). Every example person, project and quote below is **synthetic**.

## In one paragraph

AI tools are getting good at *producing* design: layouts, components, copy variants, whole screens from a prompt. They are not good at deciding *which problem is worth solving with a community*, noticing *who a design leaves out*, testing with disabled people, running a room where people disagree, or being accountable when something goes wrong. That second list is what BRIDGEGOOD already teaches through its five pillars and twelve reflection prompts. So the kit doesn't teach a new skill set. It gives apprentices and alumni ways to **practice that judgment on real work, record it as evidence, and find the people and roles where it's valued**. Seven features do this. Each is tied to a pillar and a journey stage, and each says what a person does, what AI may help with, and what AI never touches.

---

## 1. The argument

We are careful here. Nobody knows how fast AI will change design hiring, and we don't quote forecasts or job-loss figures. The claim is narrower: whatever gets automated first will be the parts of the job that can be specified in a prompt and checked by looking at the output. The parts that depend on relationships, context and accountability are slower to automate, and they're the parts BRIDGEGOOD already centers.

| Work | What AI tools do well today | What still needs a person | Pillar |
|---|---|---|---|
| Making screens and components | Fast first drafts, variations, filling a design system | Choosing between drafts for *this* community, and saying why | 4. Good Design Craft |
| Framing the problem | Summarizing what it's given | Finding out whether the stated problem is the one people actually have, by talking to them | 1. Design for Good |
| Inclusion | Flagging some patterns it was trained to flag | Noticing who isn't in the room and getting them there | 2. Accessibility & Inclusion |
| Accessibility | Running automated rules; explaining a WCAG criterion | Keyboard, screen reader and zoom testing; testing with disabled people; judging whether the experience works, not only whether the rules pass | 2. Accessibility & Inclusion |
| Using AI responsibly | Generating content | Disclosing where AI was used, checking its output, deciding when it's the wrong tool | 3. Responsible AI |
| Ethics and impact | Listing generic risks | Owning the consequences, refusing manipulative patterns, deciding what success means with the community | 5. Ethics & Impact |
| Facilitation and relationships | Drafting an agenda | Holding a hard conversation, earning trust, getting a referral | (all; carried by people, not a pillar) |

**Why this is BRIDGEGOOD's argument to make, not a generic one.** BRIDGEGOOD's designers come from communities the industry overlooks, and its founding point is that networks and referrals gate access to design careers ([social-good.md §1.2](social-good.md)). If production skill becomes cheap, those gates matter *more*: the people who get hired will be the ones who can show judgment and who know someone. The kit works on both.

### What the kit is not

- **Not a course.** Every feature is used inside real project moments (a mini project, a capstone sprint, a job search), not worked through in order.
- **Not a credential.** Nothing here certifies anyone. Certification is BRIDGEGOOD's call ([social-good.md §4.1 item 7](social-good.md)).
- **Not a promise.** It doesn't make anyone "AI-proof". It makes judgment visible, practiced and connected to people who value it.
- **Not one definition of success.** The career map (feature 5) exists so people choose a direction with information, including directions outside big tech.

---

## 2. The seven features at a glance

Journey stages follow the proposed student path in [evaluation.md](archive/evaluation.md): **1 Bootcamp → 2 Mini project → 3 Choose a project → 4 Capstone → 5 Certification & portfolio**, then **Alumni** (and, for some, **Mentor**). The apprentice's "Your path" as built (PR #4) has no certification step: it runs bootcamp → mini project → choose a project → capstone → alumni. Reflection prompts are referenced by number. Their canonical wording lives in the team spec, and the pillar mapping follows [ai-evaluator.md §3](ai-evaluator.md).

| # | Feature | Main pillar(s) | Prompts | Stage | The person does | AI may help with | AI never |
|---|---|---|---|---|---|---|---|
| 1 | Judgment portfolio builder | 1, 3, 5 | 1–4, 9–12 | 2 → 5, Alumni | Writes each decision, the options, the trade-offs, and what they overruled | Asking follow-up questions; drafting an AI-use credit line for the person to edit | Write the case study; invent community input; rate the work |
| 2 | AI audit lab | 2, 3, 5 | 7, 9, 10, 11 | 1, 2, Alumni | Audits an AI-generated design first, on their own | A and B items from the evaluator, shown *after* the person's own audit | Grade the audit; say a design is "accessible" |
| 3 | Community research and facilitation kits | 1, 5 | 1–6, 8, 11 | 2, 3, 4 | Plans who to reach, gets consent, runs sessions, makes the synthesis | Plain-language and reading-level checks on consent forms and invites | Analyze interview data; stand in for a community member |
| 4 | Accessibility depth path | 2, 4 | 2, 7 | 1, 4, Alumni | Manual and assistive-tech testing; paid sessions with disabled testers | Automated checks (axe-core, contrast); explaining a rule in plain words | Declare anything accessible |
| 5 | Career paths map | 5 (and all) | 11, 12 | 3, 5, Alumni | Explores roles, talks to alumni, chooses | None in v1 | Recommend a career; predict pay or hiring |
| 6 | Alumni and mentor network with referrals | 1 (and all) | (relationships) | 4, 5, Alumni, Mentor | Asks, introduces, refers from firsthand knowledge | None in v1 | Match people; write referrals |
| 7 | Skills self-assessment | All five | All | 1, end of each project, Alumni | Describes what they can do, links evidence, chooses what to share | None. AI doesn't read it | Score, level, rank or summarize it |

The pattern: **AI helps with checking and wording. People do the deciding, the relating and the judging.** That split is the lesson, as well as the design rule.

---

## 3. Feature specs

### 3.1 Judgment portfolio builder

**Pillars:** 1 Design for Good, 3 Responsible AI, 5 Ethics & Impact. **Stages:** starts in the mini project, grows through the capstone, becomes the portfolio at stage 5, keeps going as an alum.

**The problem it solves.** Most junior portfolios show final screens. If screens become cheap to produce, they say less about the designer. What a hiring manager, a nonprofit or a community partner needs to see is *how you decide*. BRIDGEGOOD's accelerator already asks teams to "ship to defend" their choices ([social-good.md §1.4](social-good.md)). This makes that defense the portfolio.

**How it works.** A case study is a series of **decision records**. Each record is short (a phone screen or two) and has these parts:

| Field | What goes in | Why |
|---|---|---|
| The decision | One sentence: what had to be chosen | Keeps it concrete |
| Context | Who it's for, the constraint, the stage | Judgment only makes sense in context |
| Options considered | Two to four, including any the AI proposed | Shows you saw alternatives |
| Community input | What you heard, from whom (role, not name), and how it changed things. Links to de-identified notes or test findings | Prompts 1–4: real problem, whose voice, who's left out |
| What AI did | Tool, task, what you kept, what you changed | Responsible AI pillar; prompts 9–10 |
| What you overruled, and why | The AI suggestion, the partner request, or your own first idea that you turned down, and your reason | The core of the record. It shows judgment |
| Trade-offs | What this choice costs, and who bears that cost | Prompt 11: unintended impact |
| What you'd check next | An open question you didn't resolve | Honesty about limits |
| Credit | Team members and their roles, the partner, community contributors (only with consent), the mentor, and AI tools | BRIDGEGOOD's dual outcome: designers' growth and credit count ([social-good.md §1.1](social-good.md)) |

The builder then assembles records into a case-study page the person can export or link to. Records can also be written for an **AI audit** (feature 2) or an **accessibility test** (feature 4), so the portfolio shows all three kinds of judgment.

**Synthetic example (not a real participant).**
> *Decision:* reminders by SMS, not an app.
> *Options:* an AI-generated mobile app flow; a web form; three SMS messages.
> *Community input:* six synthetic pantry visitors; several shared phones or had limited data plans.
> *What AI did:* generated the app flow and first-draft copy. I kept two lines of copy and rewrote the rest to a 6th-grade reading level.
> *Overruled:* the AI flow's account sign-up, because visitors told us they didn't want to make accounts.
> *Trade-off:* SMS limits what we can show; the pantry pays per message.
> *Credit:* research and flow by the student team; copy edited by me; "AI used for: first-draft flow and copy. Design and research decisions: ours."

**Human vs AI.**
- The person writes every field. A record with no "community input" or no "overruled" is allowed (sometimes there wasn't any) but the builder asks about it rather than hiding the gap.
- AI (labeled "Assistant (AI)") may **ask questions** about a draft record, using the student lens of the evaluator: "You list two options. Was there a third you ruled out early?" It may draft the **AI-use credit line**, which stays marked "AI draft" until the person edits or confirms it ([ai-evaluator.md §5](ai-evaluator.md)).
- AI never writes a field, never adds community input, and never says whether a record is good.

**Consent and privacy.** Community quotes, photos and partner names need explicit, revocable permission before export. The builder shows a consent status on each item and blocks export of items without it. No participant names are stored. Records are private until the person publishes them.

**Feedback to BRIDGEGOOD.** With opt-in, BRIDGEGOOD sees anonymous counts of which fields people leave empty most often. If "community input" is often empty, that tells BRIDGEGOOD something about how projects are set up, not about the student.

### 3.2 AI audit lab

**Pillars:** 2 Accessibility & Inclusion, 3 Responsible AI, 5 Ethics & Impact. **Stages:** bootcamp (especially the apprenticeship's AI-tools week), mini project; alumni can come back as reviewers.

**The problem it solves.** If more first drafts come from AI, a valuable skill is being the person who can look at one and say what's wrong with it for real people. The lab turns the evaluator from [ai-evaluator.md](ai-evaluator.md) around: **the student is the auditor and AI output is the thing being audited.**

**How it works.**
1. **Pick a case.** Each case is a synthetic, AI-generated design (HTML or screenshots) for a synthetic brief, for example a benefits sign-up form for a Spanish-first audience. Cases come from the evaluator's golden set ([ai-evaluator.md §7](ai-evaluator.md)) and have **seeded issues**: a contrast failure, a missing label, a pre-ticked marketing consent, confirmshaming, a form that collects more personal data than the service needs, English-only copy, stereotyped stock imagery. BRIDGEGOOD reviews and approves every case.
2. **Audit it yourself first.** The person writes what they find, tagged by pillar, with where they found it. Nothing from the AI is visible yet. This mirrors the mentor's "review first" default, which reduces anchoring.
3. **Then compare.** The lab shows three labeled sections, exactly as the evaluator does:
   - **Automated checks** (A): axe-core and the contrast formula, with WCAG rule IDs.
   - **AI observations** (B): what the evaluator noticed, with confidence and evidence.
   - **Questions** (C): the human-only prompts, for example who might be left out.
4. **See what was seeded.** The lab reveals the seeded issues the person didn't mention, as a list, not a count or a score. It also shows where the **evaluator** missed seeded issues or flagged things that weren't there. Showing the AI being wrong is part of the lesson.
5. **Make a record.** One finding becomes a decision record (feature 1): "The AI form pre-ticked marketing consent. I changed it to unticked and explained why."

**Paired variants for bias.** Some cases come in pairs: the same layout with different names, languages or cultural imagery. The person audits both and notes whether their own reactions, or the AI's, shifted for reasons that have nothing to do with the design ([ai-evaluator.md §5](ai-evaluator.md)).

**Human vs AI.**
- The person's audit is theirs and is never graded.
- The evaluator supplies A and B items under the same schema (no score fields, a required `cannotJudge` list).
- The lab always shows: *"Automated checks find only some accessibility problems. Test with keyboard, screen reader, zoom, and with disabled people."*
- A mentor or alum can run a short group critique of one case. The lab gives them the case and the seeded list, not a script.

**Feedback to BRIDGEGOOD.** "Not right" and "Something's missing" on evaluator items feed the rubric loop already designed in [ai-evaluator.md §6](ai-evaluator.md). Alumni can propose new cases from patterns they see at work (synthetic, with no employer material), which BRIDGEGOOD reviews.

### 3.3 Community research and facilitation kits

**Pillars:** 1 Design for Good, 5 Ethics & Impact. **Stages:** mini project (practice), choose a project, capstone (for real).

**The problem it solves.** Talking to the people affected, and running a room where they disagree, is the part of design AI can't do for you. It is also where early-career designers get the least practice. BRIDGEGOOD asks for "evidence over assumption" and stakeholder interviews, "not invented personas" ([social-good.md §1.4](social-good.md)). These kits make that easier to do well, inside a real project.

**What's in a kit.** Each kit is a short, adaptable set of materials for one moment, not a lesson:

| Kit | When | Contents |
|---|---|---|
| Who's missing? | Before research | A worksheet for naming who the work might miss and how to reach them (prompts 5–6); questions to ask the partner about hard-to-reach groups |
| Consent and payment | Before any session | Plain-language consent template (what we'll ask, what we'll keep, how to withdraw); a note on paying people for their time (policy is BRIDGEGOOD's to set, see open questions) |
| Interview guide, co-written | Research | A starter guide the team edits *with the partner*, so the partner's assumptions are written down as things to test |
| Listening session | Research, small groups | Agenda, roles (facilitator, note-taker, timekeeper), how to open, how to close, how to report back to participants |
| Co-design workshop | Choosing a direction | Activities for comparing options with community members; how to record who preferred what without names |
| Community critique | Capstone, before calling it done | How community members judge the result and sign off ([social-good.md §4.1 item 5](social-good.md)) |
| When it gets hard | Any time | What to do when a session turns to discrimination, conflict or distress: pause, care for the person, and **hand off to BRIDGEGOOD staff**, whose social-worker-informed approach stays with trained people ([social-good.md §1.3](social-good.md)) |

Each kit ends with a short **"what we changed"** note that the team or chapter can send back to BRIDGEGOOD. This is the adaptation-note mechanism from [social-good.md §3.2](social-good.md), so chapters can adapt kits for their language and community while BRIDGEGOOD keeps the core.

**Human vs AI.**
- People plan, recruit, facilitate, take notes and synthesize. Synthesis is the skill, so the kit doesn't automate it.
- AI may check the **reading level** of a consent form or invite, and draft a plain-language version for the person to edit.
- AI may draft a **translation** that is always labeled "AI draft" and must be checked by a fluent speaker, preferably from the community, before use.
- In v1, AI does **not** read interview notes or recordings. They may contain personal details, and handing synthesis to AI would remove the practice the kit exists for.

**Practice before the real thing.** In the mini project, students rehearse a listening session with peers or alumni playing roles from a synthetic scenario (for example, "a partner wants to skip interviews"), with BRIDGEGOOD's reasoning shown afterwards. This builds on the "practice moments" pivot in [evaluation.md §3](archive/evaluation.md#3-mission-fit-judges-view).

### 3.4 Accessibility depth path

**Pillars:** 2 Accessibility & Inclusion, 4 Good Design Craft. **Stages:** apprenticeship accessibility week (bootcamp), every capstone, alumni.

**The problem it solves.** Automated checkers are getting better, and AI tools increasingly fix some of what they find. What remains scarce is people who can tell whether something *actually works* for disabled people, and who can test it with them. That's the depth this path builds.

**Why this is a real demand driver (sourced, checked 2026-10-24, not legal advice).**
- **US: ADA Title II web rule.** In April 2024 the Department of Justice issued a rule requiring state and local governments' web content and mobile apps to meet **WCAG 2.1 Level AA** ([ADA.gov fact sheet](https://www.ada.gov/resources/2024-03-08-web-rule/)). In April 2026 an interim final rule moved the compliance dates back one year: **April 26, 2027** for entities serving 50,000 or more people, and **April 26, 2028** for smaller entities and special district governments. The technical standard didn't change ([Federal Register, 2026-07663](https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web)). Public agencies, transit, libraries, schools and courts are the kind of public-interest clients many BRIDGEGOOD graduates may want to work with.
- **EU: European Accessibility Act.** Directive (EU) 2019/882 has applied since **28 June 2025** to a defined set of products and services, including e-commerce, banking, e-books and some transport services ([EUR-Lex](https://eur-lex.europa.eu/eli/dir/2019/882/oj)). Conformity is usually shown against the harmonized standard EN 301 549, whose web requirements align with WCAG 2.1 AA. Microenterprises providing services are exempt, and Article 32 sets transition periods for some existing services and contracts, up to 28 June 2030. It matters to US designers whose employers or clients sell into the EU.
- **What we don't claim.** We don't put numbers on job demand. These rules create work for people who can test and fix, but we have no sourced figure for how much, and we won't invent one.
- WCAG 2.2 is the current W3C Recommendation ([W3C](https://www.w3.org/TR/WCAG22/)) and the app's own target. Both rules above reference 2.1, so 2.2 work exceeds them.

**How it works.** The path is three kinds of practice, each producing evidence that goes into decision records. It is not a sequence of modules: a person can do layer 3 on their first capstone if the partner can support it.

| Layer | What the person does | Tools | Evidence produced |
|---|---|---|---|
| 1. Automated | Runs checks and fixes what they find | axe-core ([Deque](https://github.com/dequelabs/axe-core)), the contrast checker from the evaluator's Phase 0 | Rule-by-rule results with WCAG IDs |
| 2. Manual and assistive tech | Keyboard-only pass; zoom to 400% and reflow; screen reader passes with VoiceOver, NVDA or TalkBack; reduced motion; captions and transcripts; reading level | A test plan template; short how-to notes for each screen reader | A test log: what was tested, on what device, what broke |
| 3. With people | Plans and runs a paid, consented session with disabled testers, ideally recruited through disability-led organizations or the partner's community | The consent and payment kit (feature 3) | Findings with the testers' permission to use them, and what changed as a result |

**Human vs AI.**
- Layer 1 is deterministic code, labeled "Automated check".
- AI may **explain** a failed rule in plain language, and **suggest what to test by hand** next ("This page has a custom dropdown. Try it with a keyboard and a screen reader.").
- AI never declares a page accessible. A clean automated result always shows the "only some problems" line.
- Layer 3 is people only. Disabled testers are paid experts, not a source of "inspiration" for the case study, and their words appear only with permission.

**Outside credentials.** The career map (feature 5) can point to external certifications such as IAAP's CPACC and WAS ([IAAP](https://www.accessibilityassociation.org/certification)) as options, without BRIDGEGOOD endorsing them. Whether to link them is BRIDGEGOOD's call.

### 3.5 Career paths map

**Pillars:** 5 Ethics & Impact, drawing on all five. **Stages:** choose a project (pick a capstone that builds toward a direction), certification & portfolio, alumni.

**The problem it solves.** BRIDGEGOOD helps people "make informed career decisions instead of pushing everyone toward the same definition of success" (brief). If "product designer at a tech company" gets more crowded or changes shape, it helps to know the adjacent roles where BRIDGEGOOD's pillars are the core of the job.

**How it works.** A map of role cards. Each card is written by BRIDGEGOOD with alumni input, and every card answers the same questions:

- What the work looks like day to day
- Which pillars it leans on most
- What evidence from this kit shows you can do it (which kinds of decision records)
- Common ways in (stated as common, never as guaranteed)
- Trade-offs to weigh: stability, pay transparency, mission, remote options, credentials
- "Ask an alum": a button that opens a request in the network (feature 6), shown only if an alum in that role has opted in

**Starting roles (for BRIDGEGOOD to review and edit):**

| Role | Pillars it leans on | Where it shows up |
|---|---|---|
| Accessibility specialist or tester | 2, 4 | Agencies, public sector, product teams, consultancies |
| Content designer or UX writer | 2, 4, 5 | Product teams, government digital services, nonprofits |
| UX researcher | 1, 2, 5 | Product teams, research agencies, foundations |
| Service designer (public and nonprofit work) | 1, 5 | Civic tech groups, city and county digital teams, nonprofits |
| AI product or conversation designer | 3, 4, 5 | Teams building AI features, chatbots and voice services |
| Trust & safety or policy design | 3, 5 | Platforms and online communities |
| Product or UI designer (generalist) | 4, and all | Tech companies, agencies, startups |
| Independent and community practice | 1, 5 | Freelance, cooperative studios, community organizations |
| Teaching and further study | All | Bootcamps, community colleges, graduate programs, BRIDGEGOOD itself |

**What we leave out.** No salary figures, demand rankings or "fastest-growing" labels unless BRIDGEGOOD has a sourced, current, local source. No AI recommendations ("you should be a researcher"). The map informs; the person chooses, ideally after talking with an alum and their mentor.

**Human vs AI.** No AI in v1. The value is in conversations with people who do the work.

### 3.6 Alumni and mentor network with referrals

**Pillars:** 1 Design for Good and all others; this is how the philosophy travels person to person. **Stages:** capstone (first introductions), certification & portfolio, alumni, mentor.

**The problem it solves.** Referrals carry a lot of weight in hiring, and BRIDGEGOOD exists partly because people from overlooked communities often don't have them ([social-good.md §1.2](social-good.md)). Alumni are missing from the app as a role ([social-good.md §4.4](social-good.md)). This adds them, with care for how referrals can also shut people out.

**How it works.**
- **Opt-in profiles.** Alumni and mentors choose what's visible: role, kind of organization, what they're happy to help with (a 20-minute chat, a portfolio read, a mock interview, a referral). No demographic fields.
- **Clear, small asks.** A request says what the person wants and why, for example "20 minutes on what content design is like in local government". The alum can accept, decline or suggest someone else, without having to explain.
- **Referrals from firsthand knowledge.** A referral is offered only by someone who has worked with or mentored the person. The candidate chooses which decision records to share. The referrer writes, in their own words, what they saw firsthand. Both sides consent before anything is sent.
- **Fairness checks run by people.** Referral networks tend to help the most visible people most. Ambassadors and staff can see (aggregate, no names) whether introductions are reaching everyone in a cohort, and make introductions themselves for people who are being missed.
- **Ways to give back.** Alumni can mentor, review audit-lab cases, play roles in facilitation practice, or test as assistive-tech users if they are disabled and choose to. The student → alum → mentor path is the "beyond any one person" answer.

**Human vs AI.** No AI matching and no AI-written referrals. A referral's worth comes from a real person vouching from experience. Matching stays with staff and ambassadors, who know context the app doesn't.

**Feedback to BRIDGEGOOD.** With consent, anonymous outcomes (an introduction led to a conversation, an interview or a role) help BRIDGEGOOD see where the network works. These are never shown per person.

### 3.7 Skills self-assessment

**Pillars:** all five. **Stages:** start of bootcamp, end of each project, and once a year as an alum.

**The problem it solves.** People need a way to see their own growth across the pillars and decide what to work on next. The evaluation found mentor review framed as "success or failure", and recommended a growth conversation that **starts from the student's self-assessment** ([evaluation.md §2](archive/evaluation.md#2-are-the-users-well-defined); built as the mentor's growth conversation in PR #4). This is that starting point.

**How it works.**
- For each pillar, BRIDGEGOOD writes a few short "I can…" descriptions of practice, for example "I can run a keyboard and screen reader pass and explain what I found". They describe practice, not levels to pass.
- The person writes, in their own words, where they are now and what they want to try next. They can **link evidence**: decision records, audit-lab findings, test logs.
- Each time they revisit it, they see their own earlier entries beside the new one. That's the growth view. There's no score, no chart of levels and no comparison with anyone else.
- **Sharing is per entry.** The person can share an entry with their mentor before a conversation. The mentor responds in that conversation, as a person.

**Human vs AI.** **No AI.** The AI doesn't score it, summarize it, suggest levels, or read it. This is stated on the page.

**What it's never used for.** Certification, vetting, eligibility, hiring, or comparing people. It can be exported or deleted by its owner at any time.

**Feedback to BRIDGEGOOD.** Optional and anonymous: "which pillar do you most want more support in?" BRIDGEGOOD can use the counts to adjust programming, which is the brief's "feedback changes the plan".

---

## 4. How the pieces connect

The features are meant to feed each other through one person's work, not to be visited one by one:

```
AI audit lab finding ─┐
Accessibility test log ┼─► decision record ─► judgment portfolio ─► referral (with consent)
Community session notes┘          │                                        ▲
                                  ▼                                        │
                       skills self-assessment ─► mentor conversation ─► career paths map
                       (evidence linked, private)  (a person responds)   ("ask an alum")
```

And back to BRIDGEGOOD: kit adaptation notes, evaluator disagreement counts, empty-field counts and opt-in support requests go to the steward inbox (`/steward`, built in PR #7). They're aggregated and anonymous, and they change the kits, rubric and role cards over versions that BRIDGEGOOD publishes.

---

## 5. Guardrails

| Rule | Where it bites |
|---|---|
| AI is labeled "Assistant (AI)" wherever it appears, and its output is editable and marked "AI draft" until a person confirms it | Features 1, 3, 4 |
| No AI judgment of people: no scores, levels, ranks, fit or readiness | Features 1, 2, 7 (no AI at all in 7) |
| A named person after every AI step: the student, mentor, staff, or the community | Every feature |
| No personal data requested; uploads say "crop out names, faces, emails and phone numbers" | Features 1, 2, 3 |
| Community material only with explicit, revocable consent; export blocked without it | Features 1, 3, 4 |
| Synthetic cases and examples labeled "Synthetic example" | Features 1, 2, 3 |
| Hard conversations route to BRIDGEGOOD staff | Feature 3 |
| No invented statistics, salaries or forecasts | Features 4, 5 |
| BRIDGEGOOD authors the pillars, prompts, kits, role cards and cases; chapters adapt and send notes back | All |
| Student flows work on a phone at WCAG 2.2 AA | All student-facing pages |

---

## 6. Hackathon slice: "from audit to decision record"

**Goal for the demo:** in about three minutes, show that the platform turns AI output into practice in human judgment, and that the evidence belongs to the student.

**Depends on** the evaluator's Phase 0 ([ai-evaluator.md §9](ai-evaluator.md)): `rubric.ts`, `schema.ts`, the contrast checker and the student lens on `/api/evaluate`. Without an API key, the slice still works with the automated checks and the seeded-issue reveal.

**Build (about one day on top of evaluator Phase 0):**
1. **Audit lab, one case.** `/student/audit-lab`. One synthetic AI-generated sign-up form as static HTML in `src/content/` with five seeded issues (low-contrast text, a missing label, pre-ticked consent, confirmshaming on "No thanks", an unnecessary date-of-birth field). The student types their findings first. Then: contrast results (A), evaluator observations (B) and questions (C), then the reveal of seeded issues not mentioned.
2. **Decision record.** A button on any finding, "Turn this into a decision record", opens the record form pre-filled with the finding as context. Fields as in 3.1. The AI-use credit line is drafted and marked "AI draft". Saved with `useCollection`.
3. **Portfolio page.** `/student/portfolio` renders records as a case-study page with credits and a "Synthetic example" label on demo content. It includes a consent status on any community item.
4. **Self-assessment, one pillar.** `/student/self-assessment` for Accessibility & Inclusion only: "I can…" descriptions, the student's own words, a link to the record from step 2, and a per-entry "share with my mentor" toggle. The page says the AI doesn't read it.
5. **Career map, static.** `/student/paths` with six role cards from 3.5 and an "Ask an alum" button that opens a message to a synthetic alum in the existing messages feature.

**Demo script:**
1. As the student (synthetic Ari), open the audit lab and type two findings.
2. Reveal the automated checks, the AI observations and the three seeded issues Ari missed. Point out the item the AI got wrong.
3. Turn "pre-ticked consent" into a decision record: *The AI draft had marketing consent pre-ticked. I unticked it, because a pre-ticked box makes the choice for people instead of asking them.* Edit the AI credit line.
4. Show it on the portfolio page with credits.
5. Link it as evidence in the self-assessment and share that entry with the mentor.
6. Open the career map, pick "Accessibility specialist", and ask an alum.
7. Switch to the mentor (synthetic Jordan): the shared self-assessment entry is there for a conversation, with no score attached.

**Cut from the slice:** the facilitation kits beyond a static page, live axe-core runs on URLs, paired bias variants, referrals and the network beyond one message, and anything that sends data to BRIDGEGOOD.

---

## 7. Open questions for BRIDGEGOOD

1. **Framing.** Is "resilience in the age of AI" a framing BRIDGEGOOD wants to use with apprentices, or does it center the technology too much? A plainer alternative would describe what the kit does: practice judgment on real work, record it, and connect with people who value it.
2. **Decision records in portfolios.** Do they match what BRIDGEGOOD's employer and partner contacts look for? Which fields would they cut?
3. **Audit lab cases.** Who on staff approves cases, and should alumni be able to propose them?
4. **Paying participants.** Is there a policy or rate for community members and disabled testers, and who pays: partner, sponsor or chapter?
5. **Accessibility depth.** Should the path point to outside credentials (IAAP) or stay neutral?
6. **Career map.** Which roles and trade-offs should it show, and which alumni would help write the cards? Is there a sourced, local pay source BRIDGEGOOD trusts?
7. **Referrals.** What norms does BRIDGEGOOD already hold for alumni referrals, and how should staff watch for people being missed?
8. **Self-assessment wording.** Who writes the "I can…" descriptions, and how are they kept from turning into a checklist?
9. **AI in the kit at all.** Should students be able to switch off every AI feature in it? Our recommendation is yes.

---

## Sources

Checked 2026-10-24. Legal summaries are for orientation, not legal advice. Check the primary text before quoting dates in the app.

- U.S. Department of Justice, *Fact sheet: new rule on the accessibility of web content and mobile apps provided by state and local governments* (2024). https://www.ada.gov/resources/2024-03-08-web-rule/
- U.S. Department of Justice, *Extension of compliance dates for nondiscrimination on the basis of disability; accessibility of web information and services of state and local government entities*, interim final rule, Federal Register document 2026-07663, April 20, 2026. https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web
- Directive (EU) 2019/882 on the accessibility requirements for products and services (European Accessibility Act). https://eur-lex.europa.eu/eli/dir/2019/882/oj
- W3C, *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/WCAG22/
- Deque Systems, *axe-core*. https://github.com/dequelabs/axe-core
- International Association of Accessibility Professionals, *Certification*. https://www.accessibilityassociation.org/certification
