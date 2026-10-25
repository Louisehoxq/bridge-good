# Reading-level scan (October 2026)

> **Archived notes.** Moved here from `docs/design-followups.md`, which was deleted once its items were in [CHANGELOG.md](../../CHANGELOG.md) (PR #6) and [BACKLOG.md](../BACKLOG.md). The rewording pass is backlog item [Later 5](../BACKLOG.md#later).

`DESIGN.md` §1.6 asks for a 6th–8th grade reading level. We scanned the visible text of 45 pages (every public page, and every page in each role) with the Flesch-Kincaid grade formula. Each line of the rendered page counted as its own sentence, and the site's header, navigation and footer were left out. **No copy was changed.** These are notes for a later rewording pass with BRIDGEGOOD.

**Overall:** 43 of 45 pages average grade 8 or below. Most pages fall between grades 4 and 7, and the role areas between 3.6 and 7.0.

| Page | Grade | Notes |
|---|---|---|
| `/chapters` | 9.3 | No single long passage. Short fragments full of place and organization names ("Bank (inclusive design office)", "Focus: Older adults, social services") push the average up. Probably fine as it is. |
| `/learn/terms` | 8.2 | The densest page: 19 passages above grade 8. Some are comparison-table rows that the scan read as one sentence. The real ones are the long "In practice" and "How you'd notice it's missing" lines for Access and Community voice, and the Pillar definition, which lists all five pillar names. |
| `/partner/gallery` | 8.0 | Borderline, because of the example outcome below. |

**Passages worth rewording first** (each one scores above grade 11, and most appear on several pages):

| Grade | Where | Passage | Why it scores high |
|---|---|---|---|
| 15.5 | `/ambassador/toolkits` | "Typical costs for a chapter cohort, and how to fund it from corporate social responsibility (CSR), employee resource group (ERG) or learning and development (L&D) budgets" | Three spelled-out acronyms in one sentence |
| 14.9 | Gallery, practice, partner pipeline, apprentice and chapter lead tracks | "Example outcome (synthetic): In this made-up example, caseworkers said families asked fewer repeat questions in the first week…" | One long sentence with two clauses. It comes from `src/content/problems.ts`, so one fix covers five pages. |
| 13.1 | Welcome, mentor and ambassador principles | "Identity, accessibility, discrimination and conflict affect design work and workplaces…" | Long abstract nouns. This is principle wording BRIDGEGOOD should approve. |
| 12.3 | Same three pages | "We respond to what participants and communities tell us, even when that's harder than doing what's easiest for the organization." | Long sentence. Also principle wording. |
| 12.5 | `/learn/guides/adapt-locally` | "A note can stay local, become a recognized variant credited to your chapter, or change the core in a new version of the framework…" | Three outcomes in one sentence |
| 12.3 | Welcome | "Since 2009, BRIDGEGOOD has helped people see themselves as creators, leaders and problem-solvers…" | Mission text; BRIDGEGOOD's own wording takes priority |
| 11.7 | Company host track | "How it differs from corporate social responsibility (CSR) programs and pro bono design…" | Acronym and specialist terms |
| 11.4 | Mock case and real case guides | "If a conversation turns to identity, discrimination or conflict, or a student is dealing with a life challenge, bring in BRIDGEGOOD staff…" | Long conditional sentence |

**What the scan can't tell us:**
- Some words are necessary even though they score high, such as "accessibility", "discrimination", "WCAG" and the pillar names. The fix there is a short definition nearby, not a simpler word.
- The formula only measures sentence and word length. It can't tell whether something is clear, kind or specific. A plain-language review with people from the communities served is still the real test.
- Principle and framework wording is a draft BRIDGEGOOD owns. Any rewording goes to BRIDGEGOOD for approval rather than straight into `src/content/`.

**How to repeat it:** load each page in a browser, take the visible text of `<main>` without its navigation, split it into lines, and score it with Flesch-Kincaid. The scan used a 20-word minimum before scoring a single passage on its own.
