# Bridge Studio: follow-ups on pages

This tracks how far the pages follow `DESIGN.md`, and records the accessibility checks. Milestone 2.5 (October 2026) closed the items from the milestone 2 evaluation (`docs/evaluation-milestone-2.md`, sections 2, 2b and 2c). What's still open is at the end.

## Done in milestone 2.5

### Type and labels (DESIGN.md §1.6, §3)

- Every page heading uses the scale: `type-title-1` for the page `h1`, `type-title-2` for section `h2`, `type-title-3` for card `h3`, and `type-display` only on the welcome hero at desktop widths. No raw `text-2xl`–`text-6xl` sizes are left in `src/routes` or `src/components` (outside the primitives).
- The Material 3 compatibility aliases (color names like `surface-container` and `on-surface-variant`, and scale names like `headline-large` and `body-large`) are removed from `src/app.css`.
- No `uppercase` or `tracking-wide`. Eyebrow labels are gone: `PageHeader` takes only a title, and the role shows as a `RoleBadge` in the sidebar instead.
- No `text-xs` and no `opacity` on text. Metadata (dates, "Step 2 of 5", counts) uses `type-small` with `text-muted-foreground`. Hints, instructions, errors and notes that used `text-sm` are now 16px.
- No pill links or pill controls. Top nav links, the "Add screenshot" controls, the attached-file chips, the region filter on `/chapters` and the pillar links are 10px-radius. Tags (status, role, synthetic) stay fully round, and every status tag now has an icon and a word.

### Signature components (DESIGN.md §6)

| Component | Where it's used now |
|---|---|
| `DraftFrame` / `DraftFieldFrame` | **Every piece of AI output.** Scoping studio: each assistant reply sits in a dashed frame labelled "Assistant (AI)", and each brief field the assistant filled sits in a frame labelled "AI draft · edit or accept it" with an "Accept as written" button. The frame turns solid with "Edited by you" or "Accepted by you". A warning notice counts fields still in draft before sending. Reflection Companion: the whole review sits in a dashed frame ("AI draft · you decide"), and each AI-written question turns solid once the apprentice rewords it ("Edited by you") or ticks keep or share ("Accepted by you"). BRIDGEGOOD's own prompts (the no-AI mode) aren't framed, because they aren't AI. |
| `PeopleChip` + `Path` (`TeamView`) | Apprentice home (you, your mentor and chapter lead, or your whole project team), My mentee, My project and team (partner), and Matching (once a team is formed). Also: mentor review queue, community posts, conversation lists, interest notes on Matching, and the account menu. |
| `PinnedNote` | Mentor feedback on Submissions & feedback, the apprentice's self-assessment and reflection on the mentor's review, the mentee's own words on My mentee, and saved reflections in the Reflection Companion. |
| `Highlight` | The first prompt at each decision point: apprentice submission, mentor review, partner brief, and the latest companion review. One per screen. |
| `RoleBadge` | Login cards, the account menu and sheet menu, the sidebar (and the tab strip on small screens), the welcome page's "Start where you are", the impact loop, the principles table headers, and "Reviewed by BRIDGEGOOD" (steward). |
| `JourneyStepper` style | The role path stepper now uses the same marks: a check for done, a filled role color for the current step, outlined for later steps, and a dotted gold line joining the stages. |

### Content organization (evaluation section 2c)

- **Welcome (`/`)** is shorter and organized around the 5 pillars. Order: hero with "Start where you are" (one card per role, linking to that role's library track, plus log in), the five pillars, "How BRIDGEGOOD works with everyone involved" (the 6 principles, with the by-role table behind a disclosure), the impact loop, and who the philosophy belongs to.
- **Terms** and the comparison with other approaches moved to a new library page, `/learn/terms`. The duplicated resources list is gone; the library already holds those pages.
- **Apprentice home:** Your path is now the home page at `/student`. Overview and Your path merged, and the sidebar went from 8 items to 7. `/student/path` redirects to `/student`.
- **Funding & legal templates** is a "coming soon" section on Toolkit & FAQs (`/partner/toolkit#legal`). `/partner/legal` redirects there.
- **URLs match labels:** `/mentor/submissions` → `/mentor/conversations`, `/student/activities` → `/student/practice`, both with 301 redirects.
- **Mentor conversation starters** (questions apprentices shared from the companion) now show on Growth conversations, so the apprentice-side promise is true.
- `docs/page-copy-changes.md` was checked item by item, found fully applied, and deleted.

### Layout failures (WCAG 1.4.10 reflow, 1.4.12 text spacing)

`KNOWN` and `KNOWN_LAYOUT` in `tests/a11y.spec.ts` are both empty.

| Page | Was | Fix |
|---|---|---|
| `/chapters` | 320px | Columns and the search field can shrink (`min-w-0`), email addresses wrap, and the region filter wraps. |
| `/learn/self-check` | 320px | `fieldset` has a `min-content` minimum width by default, so it got `min-w-0`; the "Read the Apprenticeship page" button wraps. |
| `/student/submissions` | 320px | The form column and fieldsets can shrink, the activity select is the new `NativeSelect`, and the submit button wraps. |
| `/ambassador/matching` | 320px | "Mark … as reached" wraps; cards and the team list can shrink. |
| `/learn` | text spacing | Card summaries are no longer clamped. Pillar cards show the short learning outcome in full. |
| `/mentor/mentee` | text spacing | Conversation previews show the latest message in full, wrapped, instead of `line-clamp-1`. |
| `/design` | text spacing | Icon names wrap instead of `truncate`. |

The team path stacks as a plain list below 640px and hides the curve, so it never scrolls sideways.

## Accessibility results (October 2026)

### Automated

| Check | Result |
|---|---|
| axe-core, WCAG 2.0–2.2 A/AA plus best practices, 45 pages × light and dark | All pass |
| Reflow at 320px, 200% zoom (640px), text spacing, 45 pages | All pass |
| `npm run check:contrast` (every token pair, light and dark, AAA body text) | Pass |

### Manual

**Forced colors** (Chromium `forced-colors: active`, every page in every role):
- Holds up: borders on cards, fields, buttons and pinned notes stay visible (the transparent borders become real lines), the focus outline shows, the highlighter shows as the system Mark color, and status tags keep their icon and word.
- **Found and fixed:** every sidebar item showed the 4px "current page" bar, because transparent borders render as lines in forced colors, so the current page couldn't be told apart. Now only the current item draws the bar (also in the small-screen tab strip).
- Expected and acceptable: avatar circles lose their fill, but the initials and the name next to them stay.

**Keyboard only** (Tab, Shift+Tab, Enter and Space; 27 pages across all roles, plus the forms):
- Every tab stop shows the 3px focus outline, and none sits under the sticky header or off screen. (The skip link is flagged by the script but is fixed above the header.)
- Forms: apprentice submission, project interest, office-hour booking and cancelling, messages, community posts, mentor reply, offering a slot, matching a team, partner feedback, the scoping studio and the Reflection Companion. Each one submits from the keyboard. On an error the error summary takes focus, and its links move focus to the field, which has `aria-invalid` and its message linked by `aria-describedby`.
- **Found and fixed:**
  - Adding an office-hour slot with no time did nothing. It now shows an error and moves focus to the field.
  - Expressing or withdrawing interest in a project removed the focused control. Focus now moves to the project's heading, and a status message says what happened.
  - The scoping studio's transcript scrolled but couldn't be reached by keyboard. It's now a focusable, labelled region.
  - "Enter to send, Shift+Enter for a new line" was only in the placeholder, which disappears. It's now a hint linked to the field.
  - Field errors in the submission form pointed `aria-describedby` at messages that didn't exist. Each field now has its own message.
- The scoping studio and companion were walked through with mocked AI replies (no API key): send by Enter, tab to "Accept as written", accept, edit, and submit with a gap.

**Screen reader:** VoiceOver couldn't be run from this environment. Instead we reviewed what it would read, the accessibility tree of the main flows (welcome, terms, apprentice home, submissions, growth conversations, partner project): one `h1` per page, no skipped heading levels, every control named, and every landmark labelled.
- **Found and fixed:**
  - A submission heading included its "Synthetic example" badge in its spoken name.
  - Success messages were added together with their `role="status"`, which VoiceOver can miss. The status region is now always present, and the message goes inside it.
  - The AI reply announcement only fired after a streaming phase. It now also fires for replies that arrive in one piece.
  - Screen readers now hear "Signed in as" before the account name in the header.

## Still open

- **A real VoiceOver (or NVDA) pass** on a device, especially the scoping studio and the companion with a live model. The tree review above isn't a substitute.
- **Live AI check:** both AI surfaces were checked with mocked replies only. Run them once with an API key.
- **Pillar links** are 32px tall: they pass WCAG 2.5.8 (24px), but they're below Bridge Studio's 48px target.
- **Field notes:** `FieldNote` is still only on `/design`. It belongs under official wording once chapters can adapt it, which is the milestone 3 feedback loop.
- **Reading level:** the grade 8 check from `DESIGN.md` §8 hasn't been run on the content.
- **Logo:** the wordmark is still a text placeholder until BRIDGEGOOD supplies the SVGs.
