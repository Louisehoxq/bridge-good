# Design system: Bridge Studio

BridgeGoodx uses **Bridge Studio**, specified in [`DESIGN.md`](../DESIGN.md): warm paper, navy ink, gold paths, Atkinson Hyperlegible Next and Lucide icons. It keeps BRIDGEGOOD's logo, navy and gold lineage and tone of voice. Open `/design` in the running app to see every token and component in place (it follows your system light or dark theme).

`DESIGN.md` is the spec. This page describes what is built and where it lives. Changes still needed in pages and shared components are listed in [`design-followups.md`](design-followups.md).

## Where things live

| What | File | Notes |
| --- | --- | --- |
| Color tokens | `src/app.css` (`:root` and the `prefers-color-scheme: dark` block) | The Bridge Studio tokens (`--paper`, `--surface`, `--ink`, `--action`, `--line-strong`, `--marker`, `--draft`…), exactly as in `DESIGN.md` §2. |
| Semantic names | the same file | The shadcn names components already use are mapped onto Bridge Studio: `bg-background` → paper, `bg-card` → surface, `bg-muted` → surface-sunken, `text-muted-foreground` → ink-muted, `bg-primary`/`text-primary` → action, `border` → line, `border-input` → line-strong, `ring` → action, `destructive` → error. The old Material 3 names (`surface-container`, `on-surface-variant`, `outline`…) were removed in milestone 2.5, so they no longer resolve. |
| Role accents | the same file | `--apprentice`, `--mentor`, `--ambassador`, `--partner`, each with a `-soft` tint. Set `data-archetype` to `student`/`apprentice`, `mentor`, `ambassador`/`chapter-lead`/`company-host`, `partner`/`community-partner` or `steward`, then use `text-archetype`, `bg-archetype-soft`, `border-archetype`, or `bg-archetype` with `text-on-archetype`. |
| Type | `src/root.tsx` loads Atkinson Hyperlegible Next, Bricolage Grotesque and Atkinson Hyperlegible Mono from Google Fonts; `src/app.css` defines the scale | `type-display`, `type-title-1`, `type-title-2`, `type-title-3`, `type-body-lg`, `type-body`, `type-label`, `type-small`. `h1`–`h3` use Bricolage at 600. Page `h1` is `type-title-1`, section `h2` is `type-title-2`, card `h3` is `type-title-3`, and `type-display` is for the welcome hero only. The Material 3 scale names were removed. |
| Icons | `src/components/icon.tsx` | Lucide outline icons at 1.75px stroke, sized at 1.25em of the text around them (20px beside body text; a text-size class on the icon changes it). The old Material Symbols names (`arrow_forward`, `description`…) map to Lucide icons, so call sites didn't change. Bridge Studio's own names (`sprout`, `sparkles`, `circle-alert`…) are there too. Add a name to `ICONS` before using it. |
| UI primitives | `src/components/ui/*` (shadcn/ui on Base UI) | Button, input, textarea, label and sheet, restyled to `DESIGN.md` §7. |
| Signature elements | `src/components/studio/*` | `Path`, `TeamPath`, `JourneyStepper`, `PeopleChip`, `RoleBadge`, `Highlight`, `PinnedNote`, `DraftFrame`, `DraftTextarea`, `DraftFieldFrame`, `FieldNote`. |
| Team views | `src/components/team/team-view.tsx` | `TeamView`, `teamFor` and `mentoringPair`: people chips joined by the gold path, used on the apprentice home, My mentee, My project and team, and Matching. |
| Notices and form errors | `src/components/notice.tsx` | `Notice` (tint, icon and words), `ErrorSummary` (takes focus, links to fields) and `FieldMessage` (alert icon under a field). |
| Dev page | `src/routes/design.tsx` (`/design`, `noindex`) | Every token, type size, primitive and signature element. All people on it are labelled synthetic. |
| Logo | `src/components/wordmark.tsx` (text placeholder) | Use the official SVGs from bridgegood.com/design in `public/brand/`. Don't redraw, recolor or add effects. |

## Color rules

- Body and muted text meet AAA (7:1) on paper, surface and sunken surfaces, in both themes. Other text meets 4.5:1. Control borders (`border-input`) and the focus outline meet 3:1.
- **Gold is decorative only.** It is 2.4:1 on paper, so use it only for paths and rules, never for text or as the only signal.
- `border` (`--line`) is for decorative dividers and card edges. Controls use `border-input` (`--line-strong`).
- In dark mode, cards are only 1.1:1 from the page, so a `bg-card` panel always needs `border border-border`.
- Never put body text on gold or on a solid role fill. Put it on the soft tint (`bg-archetype-soft`) instead.
- Status always pairs a color with an icon and a word: `bg-success-soft` with `circle-check`, `bg-error-soft` with `circle-alert`, `bg-marker` with `triangle-alert`, and `info`.
- Flat surfaces: `shadow-sm`, `shadow-md` and `shadow-lg` resolve to nothing. The pinned note's paper edge is the only shadow.

## Components

| Component | What it does |
| --- | --- |
| `Button` | 48px tall, 10px radius, label type, never pill-shaped. `default` is primary (action fill, one per view). `secondary` and `outline` have a surface fill, a 1.5px line-strong border and action text. `ghost` is quiet: text only, underlined on hover. `destructive` is secondary with error text; pair it with an icon and a confirmation. Sizes: `default` (48px), `sm` (40px visible, 48px hit area), `lg` (56px), `icon` (48px), `icon-sm` (40px with a 48px hit area). |
| `Input`, `Textarea` | 48px minimum height, surface fill, 1.5px line-strong border, 10px radius. `aria-invalid` gives a 2px error border. Put a visible `Label` above, and link hints and errors with `aria-describedby`. |
| `Label` | Label type (16px, 600), above the field. |
| `Sheet` | A surface panel with a line border and a 48px close button. Title in `type-title-3`. |
| `RoleBadge` | A fully round tag in the role's soft tint, with its icon and label: apprentice (`sprout`), mentor (`message-circle-heart`), chapter lead (`map-pin`), company host (`building-2`), community partner (`heart-handshake`), BRIDGEGOOD steward (`scroll-text`). `STUDIO_ROLE_FOR` maps the demo roles onto these. |
| `PeopleChip` | An initials avatar (never a photo) in the role color, with the person's name, role icon and label. `stacked` centers it for a team view. |
| `Path` / `TeamPath` | The gold curve that joins a team. It is decorative (`aria-hidden`), and every node has a text label. Use it only where the relationship is real. |
| `JourneyStepper` | Steps joined by a dotted gold path. Done steps get a check and a hidden ", done", the current step is filled with `aria-current="step"`, and future steps are outlined. It stacks vertically on narrow screens. |
| `Highlight` | A `<mark>` in the marker color for the one phrase that matters. At most one per screen, never on a link. |
| `PinnedNote` | A note-colored card with a 2px radius and a tilt of under 1°. The tilt is removed under reduced motion. Use it for mentor feedback and reflections. |
| `FieldNote` | A pinned note with `map-pin` and "Local adaptation from …". Place it beneath BRIDGEGOOD's official wording. |
| `DraftFrame` | A 1.5px dashed violet frame labelled "AI draft · you decide" with `sparkles`. Pass `edited` once a person edits or accepts it, and it turns solid with "Edited by you". |
| `DraftTextarea` | A labelled textarea holding an AI draft. It turns solid on its own once the text differs from the draft, and the status is linked with `aria-describedby`. |
| `DraftFieldFrame` | The draft frame for a field whose value lives elsewhere (the scoping brief, the companion's questions). Status `ai`, `edited` ("Edited by you") or `accepted` ("Accepted by you"). Link the field to `statusId`. |
| `NativeSelect` | `src/components/ui/select.tsx`: a native `<select>` styled like the text field. |

## Layout: desktop-first

- The design target is 1280px: `max-w-7xl` content, 24px gutters, and multi-column grids at `lg`/`xl`. Role areas get a 16rem sidebar. Phone widths must still work (no sideways page scroll), but they aren't the design target.
- Spacing uses the 4px base: 4, 8, 12, 16, 24, 32, 48, 64.
- Radius: controls 10px (`rounded-md`/`rounded-lg`), cards 16px (`rounded-xl`/`rounded-2xl`), tags and avatars `rounded-full`, and notes 2px (`rounded-xs`).
- Motion is 150–200ms on `ease-standard`. `prefers-reduced-motion` removes transitions, smooth scrolling and the pinned-note tilt.

## Accessibility (WCAG 2.2 AA, AAA for body text)

- Skip link, semantic landmarks, one `h1` per page, and section headings in order.
- Every interactive element gets a 3px `--action` outline with a 2px offset (`:focus-visible` in `app.css`). Components never remove it. `scroll-padding-top` keeps focused elements clear of the sticky header.
- Targets are at least 48×48px.
- Color is never the only signal: roles carry an icon and a label, and status carries an icon and a word.
- Icons are `aria-hidden`. Icon-only buttons need an `aria-label`.
- Forms:
  - every input has a visible label
  - hints and errors are linked with `aria-describedby`, and invalid fields get `aria-invalid`
  - an error summary receives focus and links to each field
  - optional fields are marked "(optional)" instead of marking required ones with an asterisk
- When an action removes the focused element (book, cancel, remove, send), move focus to the relevant heading and announce the result in a `role="status"` message.
- Streaming or changing content is not wrapped in `aria-live`. Chat transcripts use `role="log"`. AI replies are announced once, when they finish.
- Expandable content uses native `<details>`, so it works without JavaScript.
- The current page in a nav uses `aria-current="page"`. In master–detail lists the selected item uses `aria-current="true"`.

## Checks

| Command | What it checks |
| --- | --- |
| `npm run check:contrast` | `scripts/check-contrast.mjs` reads the color tables in `DESIGN.md` and the tokens in `src/app.css`. It fails if they disagree, then tests every pair the spec relies on against its required ratio (7:1, 4.5:1 or 3:1) in light and dark. Add a pair to `PAIRS` when a new combination appears. |
| `npm run test:a11y` | `tests/a11y.spec.ts` runs Playwright and `@axe-core/playwright` (WCAG 2.0–2.2 A/AA plus best practices) on every page route in `src/routes.ts`, in light and dark. It builds and serves the production app, logs in through the demo login for role areas, and fills dynamic segments from `PARAMS`. Run `npx playwright install chromium` once first. |

Also check by hand: 200% zoom, a 320px viewport, the text-spacing bookmarklet, forced-colors emulation, and the grayscale test.

## AI features

- Always labelled as AI, inside a `DraftFrame` ("AI draft" or "Assistant (AI)").
- Output is a draft the person can edit, and BRIDGEGOOD reviews it before anything happens.
- Never asks for or stores personal details. Screenshots are shrunk in the browser and sent only with the request.

## Writing (from BRIDGEGOOD's tone guide)

- Supportive, direct, trustworthy and approachable. Write at a 6th–8th grade reading level, with paragraphs of five sentences or fewer.
- Sentence case, never all caps. US spelling. Gender-neutral language that makes no assumptions about ability, background or identity.
- Lead with what people can do. Be specific ("Your mentor replies within 2 days", not "soon").
- Concrete over abstract: say what someone *does*, not a slogan about values.
- Never present synthetic people or projects as real. Label them "Synthetic example".
- No personal stories, names, portfolios or artwork without explicit consent.
- Credit BRIDGEGOOD as the author and steward of the philosophy.
