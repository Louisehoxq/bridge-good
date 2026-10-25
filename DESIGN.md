# Bridge Studio: the BridgeGoodx design system

> **Status:** implemented on every page (October 2026). This is the single design spec. Where things live in the code is in [section 10, Implementation](#10-implementation).
>
> **See it:** the live `/design` page in the running app shows every token and component as built. [`docs/design/examples.html`](docs/design/examples.html) is a static showcase you can open straight from the repository, with no server or login, to share with BRIDGEGOOD or judges. Open design work is in [`docs/BACKLOG.md`](docs/BACKLOG.md).

Bridge Studio combines two ideas:

- **Bridge.** BRIDGEGOOD's work is about relationships: apprentices, mentors, ambassadors and community partners working *with* each other, not *for* each other. The interface shows those connections where they really exist.
- **Studio.** The philosophy lives in reflection and critique. The interface uses the marks of a design studio for thinking: a highlighter on the question that matters, a pinned note for a mentor's feedback, and a dashed frame for anything that is still a draft.

It keeps BRIDGEGOOD's identity (logo, navy and gold lineage, tone of voice) and moves away from the generic Material/Google look: warm paper instead of blue-grey surfaces, Atkinson Hyperlegible Next instead of Google Sans, and Lucide outline icons instead of Material Symbols.

---

## 1. Principles

1. **Readable by everyone, beyond the minimum.** WCAG 2.2 AA everywhere. Body text meets AAA (7:1), because the people we serve include older community members, people with low vision, and people reading on old phones in bright light.
2. **Color is never the only signal.** Every status has an icon and a word. Every role has an icon, a label and a color. If a screen still makes sense in grayscale, it passes.
3. **Human and AI are always distinguishable.** AI output sits in a dashed violet "draft" frame labelled "AI draft". Nothing AI-written looks final, and a person always decides.
4. **Paths only where relationships are real.** The connector line links people on a team, steps on a journey, and stages of the impact loop. It is never decoration.
5. **Studio marks for thinking.** Highlighter for the reflection question in focus, pinned notes for mentor feedback and reflections. Use them sparingly so they keep their meaning.
6. **Plain and warm.** 6th–8th grade reading level, sentence case, no all-caps labels, no slogans.

---

## 2. Color

All ratios are WCAG 2 contrast ratios, computed for these exact values. "Paper" is the page background, and "surface" is a card.

### Light theme

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--paper` | `#FAF6EE` | Page background | — |
| `--surface` | `#FFFFFF` | Cards, panels, inputs | — |
| `--surface-sunken` | `#F3EDE1` | Wells, table headers, the sidebar | — |
| `--ink` | `#1F2A44` | Body text, headings | 13.2 on paper (AAA) |
| `--ink-muted` | `#3E4760` | Secondary text, hints | 8.6 on paper, 7.9 on sunken (AAA) |
| `--action` | `#003365` | Primary buttons, links, focus ring | 11.7 on paper. White on action: 12.6 |
| `--line` | `#E2D9C8` | Decorative dividers and card edges only | — |
| `--line-strong` | `#767066` | **Control borders** (inputs, outline buttons, checkboxes) | 4.6 on paper, 4.9 on surface (needs 3:1) |
| `--marker` | `#F6D57A` | Highlighter: background only | Ink on marker: 10.0 |
| `--note` | `#FFF1B8` | Pinned note background | Ink on note: 12.6 |
| `--gold` | `#CD991D` | BRIDGEGOOD gold: path lines, rules, the logo | 2.4 on paper, **decorative only, never text or the only signal** |
| `--draft` / `--draft-soft` | `#5B4B9A` / `#EEEAF8` | AI draft frame and label | 6.7 on paper, 6.1 on draft-soft |
| `--success` / `--success-soft` | `#2B6A3F` / `#E3F1E6` | Success, with a check icon | 5.6 on soft |
| `--error` / `--error-soft` | `#A3261B` / `#FBE8E5` | Errors, with an alert icon | 6.2 on soft |
| `--warning` | ink on `--marker` | Warnings, with a triangle icon | 10.0 |

### Dark theme

Dark follows `prefers-color-scheme`. Dark cards sit only 1.1:1 from the page, so **cards always carry a `--line` border in dark mode**.

| Token | Value | Contrast |
|---|---|---|
| `--paper` | `#14181F` | — |
| `--surface` | `#1C222B` | — |
| `--surface-sunken` | `#10141A` | — |
| `--ink` | `#EDE8DE` | 14.6 on paper |
| `--ink-muted` | `#C4BFB4` | 9.7 on paper |
| `--action` | `#A9C1EC` (text on it: `#14181F`, 9.8) | 9.8 on paper |
| `--line` / `--line-strong` | `#2E3642` / `#8A8F99` | line-strong 4.9 on surface |
| `--marker` | `#5C4A12` | Ink on marker: 7.0 |
| `--note` | `#3A3216` | Ink on note: 10+ |
| `--gold` | `#D9AE3C` | Decorative only |
| `--draft` / `--draft-soft` | `#BDB2F0` / `#25213A` | 8.0 on soft |
| `--success` / `--success-soft` | `#93CFA4` / `#1A2E22` | 8.0 on soft |
| `--error` / `--error-soft` | `#F2A196` / `#3A1C19` | 7.6 on soft |

### Roles

Each role always shows **icon + label + color** together. Chapter lead and company host share the ambassador color because they are two kinds of ambassador; their icons tell them apart.

| Role | Icon (Lucide) | Light text / soft | Contrast | Dark text / soft | Contrast |
|---|---|---|---|---|---|
| Apprentice (and alumni) | `sprout` | `#2A4F95` / `#E6ECF7` | 7.4 on paper, 6.7 on soft | `#9DB8EE` / `#1E2A40` | 7.2 |
| Mentor | `message-circle-heart` | `#2F6B4F` / `#E2F0E7` | 5.8, 5.4 | `#8FCBAA` / `#1A2E25` | 7.7 |
| Chapter lead | `map-pin` | `#6A3F86` / `#EFE7F5` | 7.3, 6.5 | `#C9AEE0` / `#2A2036` | 7.8 |
| Company host | `building-2` | same as chapter lead | — | — | — |
| Community partner | `heart-handshake` | `#8A4B12` / `#F7EADB` | 6.3, 5.7 | `#E7B07A` / `#33261A` | 7.6 |
| BRIDGEGOOD steward | `scroll-text` | `--ink` / `--surface-sunken` | 12.2 | `--ink` / `--surface-sunken` | 15.1 |

White text on a role fill passes too: apprentice 7.9, partner 6.8, action 12.6.

### Rules

- Large areas stay paper and surface. Role color is for small accents: the sidebar marker, avatar, badge and active tab.
- Never put body text on gold or on a role's solid fill. Use the soft tint behind text.
- Use the highlighter on one phrase per screen at most.
- Red and green never appear side by side as the only difference. Success and error always carry their icons.

---

## 3. Typography

| Role | Family | Why |
|---|---|---|
| Body and interface | **Atkinson Hyperlegible Next** (Braille Institute, OFL, variable 200–800) | Designed for low vision: distinct I/l/1 and O/0, open shapes, generous x-height. |
| Headings | **Bricolage Grotesque** (OFL) | Warm and characterful at large sizes. Only used at 20px and up. |
| Code and data | **Atkinson Hyperlegible Mono** (OFL) | Same legibility goals, for IDs and code. |

Load from Google Fonts with `display=swap`.

### Scale (desktop-first; 1rem = 16px)

| Token | Size / line height | Weight | Family | Use |
|---|---|---|---|---|
| `display` | 48 / 56 | 600 | Bricolage | Welcome hero only |
| `title-1` | 36 / 44 | 600 | Bricolage | Page `h1` |
| `title-2` | 28 / 36 | 600 | Bricolage | Section `h2` |
| `title-3` | 22 / 30 | 600 | Bricolage | Card and panel `h3` |
| `body-lg` | 18 / 30 | 400 | Atkinson | Library, guides, long reading |
| `body` | 16 / 26 | 400 | Atkinson | Default |
| `label` | 16 / 24 | 600 | Atkinson | Form labels, buttons |
| `small` | 14 / 22 | 400 | Atkinson | Metadata only. Never for instructions or errors. |

### Rules

- Body text is never below 16px, and long-form reading uses 18px.
- Lines are 45–75 characters (`max-width: 70ch` for prose).
- No weights below 400 for text. No long italic passages, no justified text, no all caps (use sentence case and weight instead).
- Layouts must survive WCAG 1.4.12 text spacing (line height 1.5, paragraph spacing 2em, letter spacing 0.12em, word spacing 0.16em), 200% zoom (1.4.4), and reflow at 320 CSS px (1.4.10).

---

## 4. Space, shape, depth, motion

- **Spacing:** a 4px base: 4, 8, 12, 16, 24, 32, 48, 64.
- **Layout:** desktop-first. Design target 1280px, content `max-width: 80rem`, 24px gutters, 12-column grid. Role areas get a 16rem sidebar. Phone widths must work (no sideways scrolling) but aren't the design target.
- **Radius:**
  - controls 10px
  - cards and panels 16px
  - tags and avatars fully round
  - pinned notes 2px (paper-like)

  No pill-shaped buttons.
- **Borders:** cards use a 1px `--line` border. Controls use a 1.5px `--line-strong` border.
- **Depth:** flat. The only shadow is the pinned note's, a single soft 0 2px 0 offset, to read as paper. Use borders and surface tones for hierarchy.
- **Motion:** short and functional: 150–200ms, `cubic-bezier(0.2, 0, 0, 1)`. No parallax or autoplay. `prefers-reduced-motion` removes all transitions.

---

## 5. Iconography

- **Lucide** outline icons (ISC licence), 1.75px stroke, 20px inline and 24px standalone.
- Icons are decorative (`aria-hidden="true"`) next to visible text. Icon-only buttons need an `aria-label` and a tooltip.
- The same icon always means the same thing. Role icons are listed in section 2, and status icons are `circle-check`, `circle-alert`, `triangle-alert` and `info`.

---

## 6. Signature elements

| Element | What it is | Where it's used | Rules |
|---|---|---|---|
| **Path** | A gold curved line connecting people or steps | Team view (apprentice, mentor, partner), journey stepper, impact loop | Decorative: every node also has a text label. Never used as a divider or ornament. |
| **People chip** | An avatar with initials, role icon and label | Team lists, messages, review queues | Always initials (synthetic or consented people only), never stock photos. |
| **Highlighter** | `--marker` behind a phrase | The reflection prompt in focus at a decision point | One per screen. Never on links. |
| **Pinned note** | A `--note` card with a 2px radius and slight rotation | Mentor feedback, the student's own reflection, field notes from chapters | Rotation is −1° to 1°, and is removed under reduced motion. |
| **Draft frame** | A 1.5px dashed `--draft` border plus an "AI draft" label with the `sparkles` icon | Every piece of AI output (scoping brief fields, reflection companion questions) | Turns solid once a person edits or accepts it, with the label changing to "Edited by you". |
| **Field note** | A pinned note with a chapter name and the `map-pin` icon | Local adaptations shown beneath BRIDGEGOOD's official wording | Always labelled as a local adaptation. The official wording stays above it. |

---

## 7. Components

| Component | Spec |
|---|---|
| **Button** | 48px tall, 10px radius, `label` type, 20px horizontal padding. **Primary:** `--action` fill and white text (one per view). **Secondary:** surface fill with a 1.5px `--line-strong` border and `--action` text. **Quiet:** text only, underlined on hover. A destructive button is secondary with `--error` text and an icon, and always asks for confirmation. |
| **Text field** | 48px minimum height, surface fill, 1.5px `--line-strong` border, 10px radius. The label sits above (never placeholder-only). Hints and errors sit below and are linked with `aria-describedby`. The error state uses a 2px `--error` border, an alert icon and a text message. |
| **Select, checkbox, radio** | Native elements styled with tokens, 24px controls inside a 48px clickable row. |
| **Tag** | Fully round, soft role or status tint with matching text, an icon and a word. |
| **Card** | Surface, 1px `--line` border, 16px radius, 24px padding. A heading is required if the card has more than one item. |
| **Notice** | Soft status tint, icon, a bold first sentence, and an optional action. Uses `role="status"`, or `role="alert"` for errors only. |
| **Journey stepper** | Steps joined by a path. The current step is filled with `aria-current="step"`, done steps get a check, and future steps are outlined. The labels are always visible. |
| **Sidebar** | Sunken background. The active item gets a 4px role-color bar, bold text and `aria-current="page"`. Items are grouped into "Your path" and "Your people". |
| **Error summary** | Error-soft panel at the top of the form. It takes focus on submit and links to each field. |
| **Empty state** | One sentence that invites action and a single button. No illustrations of people. |

Focus is a 3px `--action` outline with a 2px offset on every interactive element. Components never remove it.

---

## 8. Accessibility requirements and checks

| WCAG 2.2 | How Bridge Studio meets it |
|---|---|
| 1.4.1 Use of color | Icon + label + color for roles and status; the grayscale check |
| 1.4.3 / 1.4.6 Contrast | AA everywhere, AAA for body and muted text (section 2) |
| 1.4.11 Non-text contrast | Control borders 4.6:1, focus ring 10:1 |
| 1.4.4 / 1.4.10 / 1.4.12 | 200% zoom, 320px reflow, text-spacing override without loss |
| 2.4.7 / 2.4.11 / 2.4.13 Focus | A 3px outline, never hidden behind sticky headers (`scroll-padding-top`) |
| 2.5.8 Target size | 48px targets, well above the 24px minimum |
| 2.3.3 / reduced motion | No motion unless the user allows it |
| Forced colors | Borders and focus use real borders and outlines, so Windows high-contrast mode keeps them |

**Patterns the pages follow**

- A skip link, labelled landmarks, one `h1` per page, and headings in order. `scroll-padding-top` keeps focused elements clear of the sticky header.
- Forms: every input has a visible label; hints and errors are linked with `aria-describedby`, and invalid fields get `aria-invalid`; an error summary takes focus and links to each field; optional fields say "(optional)" instead of marking required ones with an asterisk.
- When an action removes the focused element (book, cancel, remove, send), move focus to the relevant heading and say what happened in a `role="status"` region that is always present.
- Streaming or changing content isn't wrapped in `aria-live`. Chat transcripts use `role="log"`, and an AI reply is announced once, when it finishes.
- Expandable content uses native `<details>`, so it works without JavaScript.
- The current page in a nav has `aria-current="page"`; the selected item in a master–detail list has `aria-current="true"`.

**Tools**

| What | Tools |
|---|---|
| Color pairs | WebAIM Contrast Checker, AudioEye Color Contrast Checker, TPGi Colour Contrast Analyser; APCA as an advisory check (WCAG 3 draft) |
| Palettes | Adobe Leonardo |
| Color vision | Chrome DevTools vision-deficiency emulation, Sim Daltonism, the grayscale test |
| Pages | axe DevTools and axe-core, WAVE, Lighthouse |
| Text | Text Spacing bookmarklet, 200% zoom, a 320px viewport, forced-colors emulation, a reading-level check (Hemingway, readable.com or `textstat`) aiming for grade 8 or lower |

**Run in CI** on every PR (how they work is in [section 10](#checks)):

1. `npm run check:contrast` tests every token pair listed in section 2 against its required ratio.
2. `npm run test:a11y` runs axe on every route in light and dark, plus reflow at 320px, 200% zoom and text-spacing checks on every page.

---

## 9. Writing

These follow BRIDGEGOOD's tone guide (bridgegood.com/design): supportive, direct, trustworthy and approachable.

- Use "you". Lead with what people can do. Be specific ("Your mentor replies within 2 days", not "soon").
- US spelling, sentence case, contractions. No slogans, inspirational quotes or marketing filler.
- Label AI as AI. Label synthetic people and projects as "Synthetic example".
- Credit BRIDGEGOOD as the author and steward of the philosophy.

---

## 10. Implementation

### Where things live

| What | File |
|---|---|
| Color tokens, light and dark | `src/app.css`: `:root` and the `prefers-color-scheme: dark` block, exactly as in section 2 |
| Type scale | `src/app.css` (`type-*` utilities); fonts load from Google Fonts in `src/root.tsx` |
| Icons | `src/components/icon.tsx` (`<Icon name="…">`) |
| Primitives | `src/components/ui/` (shadcn/ui on Base UI): button, input, textarea, label, sheet, `NativeSelect` |
| Notices and form errors | `src/components/notice.tsx`: `Notice`, `ErrorSummary` (takes focus, links to fields), `FieldMessage` |
| Signature elements | `src/components/studio/`: `Path`, `TeamPath`, `JourneyStepper`, `PeopleChip`, `RoleBadge`, `Highlight`, `PinnedNote`, `FieldNote`, `DraftFrame`, `DraftTextarea`, `DraftFieldFrame` |
| The cycle | `src/components/cycle.tsx`: `CycleDiagram` (Welcome), `CycleStageBar` (every public page: its stage, with `aria-current="step"`, and the next step), `PublicPage` |
| Navigation | Seven top-level items in the concept's order (Welcome, Understand, Decision Lab, Practice Library, Living Playbook, Teach & Facilitate, About), shown in the bar from `xl` up and in the sheet menu below |
| Live reference | `src/routes/design.tsx` (`/design`, `noindex`) |
| Static showcase | `docs/design/examples.html`. It copies the tokens by hand, so update it when section 2 changes |
| Logo | `src/components/wordmark.tsx` is a text placeholder. Use BRIDGEGOOD's official SVGs in `public/brand/`; don't redraw, recolor or add effects |

### Tokens in Tailwind

- Bridge Studio names work directly: `bg-paper`, `bg-surface`, `bg-surface-sunken`, `text-ink`, `text-ink-muted`, `text-action`, `border-line`, `border-line-strong`, `bg-marker`, `bg-note`, `border-draft`, `bg-success-soft`, `bg-error-soft`, and so on.
- The shadcn names components use map onto them: `bg-background` → paper, `bg-card` → surface, `bg-muted` → surface-sunken, `text-muted-foreground` → ink-muted, `bg-primary` / `text-primary` → action, `border` → line, `border-input` → line-strong, `ring` → action, `destructive` → error. The Material 3 names (`surface-container`, `on-surface-variant`, `headline-large`…) were removed and no longer resolve.
- **Role color:** set `data-archetype` on a container (`apprentice` or `student`, `mentor`, `ambassador`, `chapter-lead` or `company-host`, `partner` or `community-partner`, `steward`), then use `text-archetype`, `bg-archetype-soft`, `border-archetype`, or `bg-archetype` with `text-on-archetype`.
- **Headings:** page `h1` is `type-title-1`, section `h2` is `type-title-2`, card `h3` is `type-title-3`, and `type-display` is for the welcome hero only. Metadata uses `type-small` with `text-muted-foreground`.
- **Radius:** controls `rounded-md` (10px), cards `rounded-xl` (16px), tags and avatars `rounded-full`, notes `rounded-xs` (2px).
- **Shadows:** `shadow-sm`, `shadow-md` and `shadow-lg` resolve to nothing. `shadow-note` is the only one.
- In dark mode a `bg-card` panel always needs `border border-border`, because cards sit only 1.1:1 from the page.

### Adding an icon

1. Import the icon from `lucide-react` in `src/components/icon.tsx`.
2. Add it to `ICONS` under a kebab-case name that matches Lucide's (`"circle-alert": CircleAlert`).
3. Use `<Icon name="circle-alert" />`. It's `aria-hidden`, drawn at a 1.75px stroke and 1.25em of the text beside it. An icon-only button needs an `aria-label`.

Keep one meaning per icon (section 5). Role and status icons are fixed.

### Checks

| Command | What it does |
|---|---|
| `npm run check:contrast` | `scripts/check-contrast.mjs` reads the color tables in section 2 of this file and the tokens in `src/app.css`, fails if they disagree, then tests every pair the spec relies on (7:1, 4.5:1 or 3:1) in light and dark. When a new combination appears, add it to `PAIRS`. Keep the section 2 tables in their current shape: the script parses them. |
| `npm run test:a11y` | `tests/a11y.spec.ts` builds and serves the production app, logs in through the demo login, and runs axe (WCAG 2.0–2.2 A/AA plus best practices) on every page route in `src/routes.ts`, in light and dark. It also checks 320px reflow, 200% zoom and text spacing on every page. Fill new dynamic segments in `PARAMS` or `PATH_PARAMS`. `KNOWN` and `KNOWN_LAYOUT` are empty: keep them that way. Run `npx playwright install chromium` once first. |

Both run in CI on every PR. Still check by hand when a page changes a lot: forced colors, keyboard only, the grayscale test, and a screen reader.

## 11. Open questions for BRIDGEGOOD

- Are you comfortable with BridgeGoodx having its own visual expression, keeping your logo, navy and gold lineage and tone, rather than matching bridgegood.com's Material 3 look?
- Can we use the official logo SVGs, and which lockup should we use beside the "x"?
- Do you have a preferred person-first or identity-first language convention for disability?
