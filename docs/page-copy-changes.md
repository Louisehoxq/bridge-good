# Page copy changes (outside `src/content/`)

> **Status (October 2026):** written before the move to React Router, so paths like `src/app/page.tsx` now map to `src/routes/` (for example `src/routes/home.tsx`). The restructure applied most of these; the milestone 2.5 content pass should confirm each item and delete this file once everything is applied.

Written 2026-10-24 by the content-pass session, for the session porting the app to React Router. Everything in `src/content/` is already updated on branch `claude/content-pass-c9a490`. The items below live in pages, components and `src/lib/`, so the port should apply them to the ported files.

Paths are the current Next.js paths. Use whatever the ported file is called. Rules behind every change are in `src/content/language.ts`: US spelling, sentence case, grade 6–8 reading level, identity-first disability language ("disabled people"), and "people from groups underrepresented in design". Say "apprentice" when describing BRIDGEGOOD's own programs. Keep "student" as the app role name.

## 1. Copy to replace

### `src/app/page.tsx` (Welcome)

| Where | Before | After |
|---|---|---|
| Hero h1 | Design that starts with community, and leaves it stronger. | Design for Social Good: how BRIDGEGOOD works, and how you can work this way too |
| Hero lede | A shared home for BRIDGEGOOD's philosophy: what it means, why it's different, and how students, mentors, ambassadors and partners put it into practice. | In BRIDGEGOOD's approach, the community a project serves helps define the problem and judge the result. Emerging designers from groups underrepresented in design do the work, with mentors. A project counts only if it works for the community and the designers grow through it. |
| Hero button 2 | Find a chapter near you | See the proposed chapter model |
| Stat card 2 | **4 roles**: students, mentors, ambassadors and partners, all in one loop | Remove it. If you want a second card, use **$0 tuition**: for BRIDGEGOOD apprentices, with no income share agreements (public fact; confirm with BRIDGEGOOD). |
| Mission blockquote | [BRIDGEGOOD's official mission statement goes here. Use the Design System's approved wording.] | Remove the blockquote until BRIDGEGOOD supplies its approved mission. Keep the paragraph under it. |
| Mission box, item 2 | Students, mentors, ambassadors and partners practise it, and improve it through feedback. | Students, mentors, ambassadors and partners practice it, and improve it through feedback. |
| "Why" intro | It builds on human-centred design and design thinking. | It builds on human-centered design and design thinking. |
| Principles intro | Each principle is something people do, so it means something specific for each role. Draft wording, for BRIDGEGOOD to review. | Use `PRINCIPLES_INTRO` from `principles.ts`, then: "Draft wording, for BRIDGEGOOD to review." |
| Resources | Four items marked "Coming soon" | Remove the list, or move it to the footer. "Inclusive language guide" now exists as data (`language.ts`), so link it if you render it. "Capstone project lifecycle" → "Partner project lifecycle". |
| TOC | (no framework entry) | Add "The framework" after "Why Design for Social Good" (see section 2). |

### `src/components/impact-loop.tsx`

| Before | After |
|---|---|
| Step 4 leads back to step 1. Every project leaves the community, the people involved and the philosophy itself a little stronger. | Step 4 leads back to step 1. What partners, students and mentors send back goes to BRIDGEGOOD. BRIDGEGOOD decides what changes in the philosophy, and credits where each change came from. |

### `src/app/layout.tsx` (site metadata)

| Before | After |
|---|---|
| Learn, practise and carry forward BRIDGEGOOD's Design for Social Good philosophy, whether you're a student, an ambassador or an organisation with a problem to solve. | Learn, practice and carry forward BRIDGEGOOD's Design for Social Good philosophy, whether you're a student, a mentor, an ambassador or an organization with a problem to solve. |

### `src/components/site-footer.tsx`

| Before | After |
|---|---|
| …partners and communities who practise it. | …partners and communities who practice it. |
| Every person, organisation, chapter and project shown is a synthetic example… | Every person, organization, chapter and project shown is a synthetic example… |

### `src/app/chapters/page.tsx` and chapter finder

| Where | Before | After |
|---|---|---|
| h1 and metadata title | Find a chapter near you | Chapters: a proposed model |
| Eyebrow or badge | (none) | `CHAPTER_MODEL_LABEL` ("Proposed chapter model (concept)") |
| Intro | Chapters are run by ambassadors vetted by BRIDGEGOOD. Reach out to join as a student or mentor, or to bring a problem from your organisation. | `CHAPTER_MODEL_NOTE`, then: "In this model, an ambassador BRIDGEGOOD has vetted would run each chapter. You could join as a student or mentor, or bring a problem from your organization." |

### `src/lib/roles.ts`

| Where | Before | After |
|---|---|---|
| Mentor `summary` | Guide students with care, review their work against the principles, and share what industry really looks like. | Guide students with care, give feedback that starts from their own reflection, and share what industry really looks like. |
| Mentor `demoAccount.detail` | Senior product designer, volunteer mentor | Product designer and BRIDGEGOOD alum, volunteer mentor (synthetic) |
| Ambassador `summary` | Carry the philosophy to your city or organisation… | Carry the philosophy to your city or organization… |
| Partner `summary` | Non-profits and social organisations share a design problem… | Nonprofits and community organizations share a design problem… |
| Partner sidebar | Capstone gallery | Project gallery |
| `PUBLIC_NAV` | Find a chapter | Chapters (concept) |
| Partner `label` (optional) | Partner | Community partner (suggested in `docs/evaluation.md`. Only the display label; keep the `partner` role id.) |

### Student area

| File | Before | After |
|---|---|---|
| `student/activities/page.tsx` title | Practise, then apply | Practice, then apply |
| same, intro | Build skills in small steps, rehearse on a mock case, then learn from real capstone case studies. | Build skills in small steps, rehearse on a mock case, then look at example partner projects (synthetic). |
| same, nav card 3 | What real capstone teams did | Synthetic examples of finished partner projects |
| same, `FUNDAMENTALS` | Practise a consent script… | Practice a consent script… |
| `components/demo/submissions.tsx` `ACTIVITY_TYPES` | Capstone project | Partner project (capstone) |
| same, reflection label | Reflection: what did you learn? | Reflection: what did you learn, and who did it help? Show `promptsForMoment("studentSubmit")` above it as optional questions. Answers are shared with the mentor only if the student chooses. |
| `student/reflection/page.tsx` | It's clearly labelled as AI… | It's clearly labeled as AI… |
| Office hours (student and mentor) | Times end in "PT" with no explanation | Add once per page: "Times are in Pacific Time (PT)." |

### Mentor area

| File | Before | After |
|---|---|---|
| `mentor/submissions/page.tsx` intro | Evaluate each piece against the principles. Lead with what's working, and make next steps specific. | Start from the student's own reflection. Then use the rubric to talk about where the work is now and what to try next. Lead with what's working, and make next steps specific. |
| `components/demo/submissions.tsx` review heading | Evaluate against the principles | Where the work is now |
| same, below the heading | (none) | "These levels start a conversation. They are not a pass or fail." Show the pillar names from `RUBRIC[n].pillarIds` beside each row, and `promptsForMoment("mentorReview")` above the form. |
| `mentor/training/page.tsx` intro | Start with the one-page explainer, then work through the modules. | Start with the one-page explainer. Use the modules in any order, when you need them. |

### Ambassador area

| File | Before | After |
|---|---|---|
| `ambassador/page.tsx` stat | Completed capstones | Completed projects |
| `ambassador/projects/page.tsx` | …from first contact to completed capstone. | …from first contact to Demo Day. |
| `ambassador/toolkits/page.tsx` intro | …partner organisations… | …partner organizations… |
| same, h2 | Organisation toolkit | Organization toolkit (`ORGANIZATION_TOOLKIT` is now an alias export) |
| `ambassador/training/page.tsx` `ADAPT` | How you recognise and celebrate participants | How you recognize and celebrate participants |

### Partner area

| File | Before | After |
|---|---|---|
| `partner/page.tsx` intro | …we'll help shape it into a capstone that a student team can take on with mentor support. | …we'll help shape it into a four-week partner project. A student team takes it on with mentor support, and it ends at Demo Day. |
| same, card | Chat with the scoping assistant, add screenshots, and build a capstone brief in minutes. | Chat with the scoping assistant, add screenshots, and build a project brief. A person at BRIDGEGOOD reviews it before anything happens. |
| `partner/submit/page.tsx` title | Shape your problem into a capstone brief | Shape your problem into a project brief |
| `partner/gallery/page.tsx` eyebrow and metadata | Capstone gallery | Project gallery |
| same, title | Previous capstone projects | Example partner projects (synthetic) |
| same, intro | What partners, students and mentors have built together. These are synthetic examples. | Examples of what a partner project could produce. These are synthetic: the organizations, teams and outcomes are made up. |
| same, sr-only h2 | Completed capstones | Example projects |
| `components/problem-board.tsx` | `Outcome: ` | `{OUTCOME_LABEL}: ` ("Example outcome (synthetic)") |
| `partner/toolkit/page.tsx` title | Resources for resource-constrained organisations | Resources for organizations with small teams and budgets |
| `components/partner/scoping-studio.tsx` | Capstone brief (draft) | Project brief (draft) |

### `src/lib/brief.ts`

| Where | Before | After |
|---|---|---|
| `organisation` describe | Type of organisation, e.g. 'tenant advocacy non-profit'. No personal names. | Type of organization, e.g. 'tenant advocacy nonprofit'. No personal names. (Keep the `organisation` key.) |
| `suggestedScope` describe | A capstone-sized scope for a student team over 8–12 weeks | A scope a student team can finish in a four-week sprint that ends at Demo Day |
| Labels | Organisation type · Suggested capstone scope | Organization type · Suggested project scope |
| Header comment | Capstone brief built with… | Project brief built with… |

### `src/app/api/scope/route.ts` (system prompt)

| Before | After |
|---|---|
| help non-profits and social organisations ("partners") turn a problem into a capstone brief that a team of emerging designers from under-represented backgrounds can take on over 8–12 weeks | help nonprofits and community organizations ("partners") turn a problem into a project brief that a team of emerging designers from groups underrepresented in design can take on in a four-week sprint that ends at Demo Day |
| (disability, language, literacy, connectivity, age) | (disability, language, reading level, connectivity, age) |
| not vanity metrics | not numbers that only look good, like page views or clicks |
| tool description: the partner's draft capstone brief | the partner's draft project brief |
| (new line under "Work in BRIDGEGOOD's…") | - Treat the partner's account of the community as a starting point to test with the community, not a finding. Ask how the people affected could help shape the work. |

### `src/lib/demo-store.ts`

| Before | After |
|---|---|
| `new Date().toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", … })` | `new Date().toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })`. New records then match the seed format ("Mon, Oct 21, 3:10 PM"). |

## 2. New content to render

These exports are new in `src/content/`. Each needs a place in the UI.

| Export | File | Suggested placement |
|---|---|---|
| `PILLARS`, `REFLECTION_PROMPTS`, `FRAMEWORK_META` | `framework.ts` | Welcome "The framework" section after "Why", and a public Framework page. Show `FRAMEWORK_META.version`, `updated` and the BRIDGEGOOD authorship note. |
| `PROMPTS_BY_MOMENT`, `DECISION_MOMENT_INFO`, `promptsForMoment()` | `framework.ts` | 2–3 prompts at student submit, mentor review and partner brief (see section 1). Answers are free text and never scored. |
| `RUBRIC[n].pillarIds` | `seed.ts` | Pillar chips on each rubric row. |
| `pillarIds` on training modules | `training.ts` | Pillar chip on each module card. |
| `MOCK_CASE_GUIDE`, `REAL_CASE_GUIDE` (`MENTOR_GUIDES`) | `guides.ts` | Mentor "Prepare" or Training page. Each step shows "what to do" and "why", plus its prompts. |
| `AI_SOCIAL_GOOD_GUIDE` | `guides.ts` | Mentor and ambassador training, and public `/training`. |
| `MENTOR_COMMITMENT` | `guides.ts` | Mentor training, and the public mentor training page. Show the "draft" note. |
| `AMBASSADOR_VETTING` | `guides.ts` | Ambassador training, and a public "Become an ambassador" section. |
| `SELF_CHECK`, `OFFICIAL_CRITERIA_URL` | `eligibility.ts` | Public "Is this for you?" page. Don't use a form submit or `useCollection`. Answers stay in component state and are never saved. Link the official criteria prominently. |
| `PARTNER_FAQS[n].draft` | `toolkits.ts` | Show "Draft: BRIDGEGOOD will confirm" on answers with `draft: true`. |
| `SYNTHETIC_LABEL`, `synthetic` flag on seeded submissions, evaluations, messages, slots and posts | `seed.ts` | Render `SyntheticBadge` next to the author or name wherever `synthetic` is true: submissions list, mentor queue, messages, community posts, office-hour slots. |
| `synthetic` on chapters and problems | `chapters.ts`, `problems.ts` | Already badged in the UI. Switch to the flag instead of badging everything. |
| `CHAPTER_MODEL_LABEL`, `CHAPTER_MODEL_NOTE` | `chapters.ts` | Chapters page and finder (section 1). |
| `OUTCOME_LABEL` | `problems.ts` | Problem board (section 1). |
| `PRINCIPLES_INTRO` | `principles.ts` | Above the principles table, so principles ("how we work") read as separate from pillars ("what students learn"). |
| `GLOSSARY[n].notThis`, `missingWhen` | `glossary.ts` | Optional extra lines on glossary cards: "What it isn't" and "How you'd notice it's missing". |
| `WRITING_RULES`, `DISABILITY_CONVENTION`, `PREFERRED_TERMS` | `language.ts` | Inclusive language guide (Welcome resources or footer). |

## 3. Compatibility notes

- No export or type field was renamed or removed. The `organisation` and `organisationType` keys stay as they are, and their values now use US spelling.
- New type fields are optional (`synthetic?`, `pillarIds?`, `draft?`, `notThis?`, `missingWhen?`), except `RUBRIC[n].pillarIds`. `RUBRIC` is a const literal, so nothing else constructs it.
- `PILLAR_IDS` match the evaluator schema in `docs/ai-evaluator.md` (`design-for-good`, `access-inclusion`, `responsible-ai`, `craft`, `ethics-impact`). Prompt ids are the numbers 1–12.
- Prompt-to-pillar mapping follows the ai-evaluator rubric table. Prompts 5 and 6 weren't mapped there, so they're added to Design for Good and Accessibility & Inclusion.
