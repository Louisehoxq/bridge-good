# Backlog

The single list of open work for BridgeGoodx, in priority order within each section. What's already shipped is in [CHANGELOG.md](../CHANGELOG.md). Every PR closes the items it finishes (move them to the changelog) and adds any new ones it finds.

Each item says why it matters and links to its design doc. The older reasoning behind many of them is in the archived evaluations: [evaluation.md](archive/evaluation.md) (before milestone 2) and [evaluation-milestone-2.md](archive/evaluation-milestone-2.md).

## Next

1. **Review the v3 copy with BRIDGEGOOD.** The principles, scenarios, Library tools and core Playbook entries are draft wording from the Community Playbook concept. BRIDGEGOOD should confirm they reflect its own language, values and approved practices.
2. **Live AI verification with an API key.** The Decision Lab's reflection helper hasn't run against a real model. Run it with a key, check it asks questions without grading, and write up what you find.
3. **More Decision Lab scenarios.** Six exist. Add ones written by and for chapters, educators and partners, and route proposed scenarios from the Playbook into the Lab once a steward approves them.
4. **Contribution follow-ups.** Contributors can reply to the steward, but there's no notification, and correction/withdrawal requests use the general contribution form. Give withdrawals their own form and a visible outcome.
5. **Archive the v2 design docs.** `docs/ai-evaluator.md`, `docs/resilience-kit.md`, `docs/gemma-prototype.md` and the milestone evaluations describe features v3 removed. Move them to `docs/archive/` with a status table.

## Later

1. **Community events: next steps.** Events and RSVPs live in one browser like the rest of the demo data. Still open: a way for the host to share the exact place with people who RSVP (today the page only says they will), letting the steward feature or unfeature an event (only seeds are featured), showing times in the viewer's own time zone after the page loads, a page title for events hosted in the browser (the server can't see them, so it says "Event"), apprentices co-hosting with their chapter lead, and letting an accepted "what we learned" become a field note or a template change. Design: the community events entry in [CHANGELOG.md](../CHANGELOG.md).
2. **Chapter map: next steps.** Only 6 of the 15 synthetic chapters have seed events, so add some for the new ones. Clustering would let the map open on the whole world without overlapping pins (today it opens on the Americas). The map has had automated checks and keyboard-only use, but no screen reader pass yet (VoiceOver, NVDA): include it in the pass below. Design: the chapter map entry in [CHANGELOG.md](../CHANGELOG.md).
3. **Dual-outcome project view.** What sets BRIDGEGOOD apart is that a project succeeds only if the community gets something that works *and* the designers grow. Show both on every project and in the gallery. Design: [social-good.md, recommendation 1](social-good.md#top-5-recommendations).
4. **Community decision rights.** Only the required "How will the people you serve shape this?" field exists. Add participation, paid time and community sign-off to the brief and the capstone, plus a consent-based way for community members to give feedback without an account. Design: [social-good.md, recommendation 3 and §4.4](social-good.md#top-5-recommendations).
5. **VoiceOver and screen reader pass.** The manual pass in #6 reviewed the accessibility tree only. Run VoiceOver or NVDA on a device, especially the scoping studio and the companion with a live model. Design: [DESIGN.md §8](../DESIGN.md#8-accessibility-requirements-and-checks).
6. **A named person beside every judgment.** The growth conversation is done, but there's no clear route to trained BRIDGEGOOD staff for conflict, discrimination or life challenges, and AI surfaces don't always say who reviews next. Design: [social-good.md, recommendation 4](social-good.md#top-5-recommendations).
7. **Reading-level rewording.** 43 of 45 pages are at grade 8 or below; a handful of passages score above grade 11. Reword them with BRIDGEGOOD, since some are principle wording they own. Notes: [archive/reading-level-scan.md](archive/reading-level-scan.md).
8. **Material access: cost, time zones and language.** Access is more than WCAG: office hours are in Pacific time only, and the app never says what BRIDGEGOOD covers (tuition, software, meals, coaching) or how chapters can fund it locally. Design: [social-good.md, recommendation 2 and §4.1 items 10–11](social-good.md#top-5-recommendations).
9. **Live framework version everywhere.** The home page and the library index still show the static `FRAMEWORK_META.version`; pillar and changelog pages show the live one, so after a wording change they disagree. Design: [evaluation-milestone-2.md §4](archive/evaluation-milestone-2.md#4-recommended-next-steps).
10. **A real store and accounts.** Demo data and steward decisions live in one browser's localStorage, so the feedback loop can't reach BRIDGEGOOD for real, and an outside group's reply code only works in the browser it was sent from. Rate-limit the kit's feedback form too, since it needs no account. Add rate limiting on `/api/scope` and `/api/reflect` before any public deploy. Design: [evaluation-milestone-2.md §4](archive/evaluation-milestone-2.md#4-recommended-next-steps), [evaluation.md §4](archive/evaluation.md#4-web-application-issues).
11. **Apprentice → alum → mentor in one account.** Passing the philosophy on person to person is the clearest answer to "beyond any one person", but one session holds one role, and alumni are only a path stage. Design: [evaluation.md §2](archive/evaluation.md#2-are-the-users-well-defined), [social-good.md §4.4](social-good.md#44-gaps-worth-naming).
12. **Links between related records.** Check where a submission, its brief and its mentor conversation link to each other, and add the missing links. Design: [evaluation.md §1, wayfinding](archive/evaluation.md#1-content-organization-and-information-hierarchy).

## Needs BRIDGEGOOD

These wait on BRIDGEGOOD, not on the team.

1. **Official logo files.** The wordmark is a text placeholder. We need the SVGs and the lockup to use beside the "x". See [DESIGN.md §11](../DESIGN.md#11-open-questions-for-bridgegood).
2. **Approval of the framework wording.** The pillars, prompts, principles and mission text are the team's draft (version 0.1). BRIDGEGOOD decides which framing is canonical and who approves changes. See [social-good.md §5](social-good.md#5-open-questions-for-bridgegood).
3. **Approval of the visual style.** Bridge Studio keeps BRIDGEGOOD's logo, navy and gold lineage and tone, but doesn't match bridgegood.com's Material 3 look. See [DESIGN.md §11](../DESIGN.md#11-open-questions-for-bridgegood).
4. **Approval of the event templates.** The six templates (critique circle, site visit, portfolio review, listening session, Demo Day, chapter meetup) and the "what we learned" questions are the team's draft. BRIDGEGOOD decides the wording, which types chapters may run, and whether partners are paid for listening sessions.
5. **Approval of the practice moments and the kit.** The reasoning in each practice moment, the kit's session plan and its "keep" list are the team's draft. BRIDGEGOOD decides the wording, and whether the synthetic "what others chose" numbers should be replaced by real, aggregated ones.
6. **Training assets.** The library's tracks and guides are drafts; real curriculum, explainers and case studies need to come from BRIDGEGOOD.
7. **Legal and funding templates.** "Coming soon" in the partner's Toolkit & FAQs.
8. **Answers to the open questions** in each design doc, such as certification, where AI on student work is welcome, paying community participants, and the disability language convention. See [social-good.md §5](social-good.md#5-open-questions-for-bridgegood), [ai-evaluator.md §10](ai-evaluator.md#10-open-questions-for-bridgegood), [resilience-kit.md §7](resilience-kit.md#7-open-questions-for-bridgegood) and [DESIGN.md §11](../DESIGN.md#11-open-questions-for-bridgegood).
