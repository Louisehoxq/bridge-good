# Bridge Studio: follow-ups outside the design-system files

The design-system workstream changed only `src/app.css`, the font links in `src/root.tsx`, `src/components/icon.tsx`, `src/components/ui/*`, `src/components/studio/*`, the `/design` page, `scripts/`, `tests/` and the docs. These changes belong to the files other sessions own (`src/routes/**`, `src/lib/**` and the other components). Each item names the file, the change and the `DESIGN.md` rule behind it.

## Remove all-caps and eyebrow labels (DESIGN.md §1.6, §3)

- `src/components/app-shell.tsx`: the `RoleShell` sidebar heading (`text-sm font-bold tracking-wide text-archetype uppercase`) and `PageHeader`'s `eyebrow`. Drop `uppercase tracking-wide`. Replace the sidebar heading with a `<RoleBadge role={STUDIO_ROLE_FOR[role]} />` from `src/components/studio/role-badge.tsx`, so the role shows icon + label + color.
- Search for other `uppercase` and `tracking-wide` classes under `src/routes/**` and `src/components/**` and remove them.

## Sidebar (DESIGN.md §7 "Sidebar")

- `src/components/app-shell.tsx` `RoleShell`: give the `<aside>` a sunken background (`bg-surface-sunken`), and group items under "Your path" and "Your people" headings (sentence case, `type-small font-semibold text-muted-foreground`, not uppercase).
- `src/components/nav-link.tsx` `variant="side"`: the active item should be `aria-[current=page]:bg-card` with the 4px `border-archetype` bar and bold text, rather than the soft tint. Use `rounded-md` (10px).
- `variant="top"` uses `rounded-full` on a link, which reads as a pill. Use `rounded-md`.
- Add an icon to each sidebar item (for example `route` for Overview and `sticky-note` for Reflection). New icon names go in `src/components/icon.tsx`.

## Headings and type scale (DESIGN.md §3)

- Page `h1`s use mixed sizes (`text-3xl … lg:text-4xl`, `text-4xl … lg:text-5xl`, `headline-large lg:display-small`). Use `type-title-1` for page `h1`, `type-title-2` for section `h2`, `type-title-3` for card `h3`, and `type-display` only for the welcome hero.
- Remove `font-bold` from headings. Bricolage is specified at 600, which `h1`–`h3` and the `type-*` utilities already set. The font link loads 600–700 so nothing is synthesized in the meantime.
- Any `text-xs` (12px) or `text-sm` (14px) used for instructions, errors or body copy should be at least `type-body` (16px). Keep `type-small` for metadata only. For example, `src/components/synthetic-badge.tsx` uses `text-xs`. Use `type-small`.
- Long reading (library, guides, training) should use `type-body-lg` with `max-w-[70ch]`.

## Cards in dark mode (DESIGN.md §2 "Dark theme")

- Dark cards sit about 1.1:1 from the page, so every `bg-card` panel needs a `border border-border` (the `--line` token). Check `src/routes/**` and `src/components/**` for `bg-card` without a border.
- Cards use `rounded-xl` (16px) and `p-6`. Several use `rounded-2xl`, which is now also 16px, so no change is needed there.

## Shadows (DESIGN.md §4 "Depth")

- `shadow-sm`, `shadow-md` and `shadow-lg` now resolve to nothing. Remove them from the components that still use them, and use borders for hierarchy.

## Signature elements on pages (DESIGN.md §6)

- **People chip:** use `<PeopleChip>` for team lists, message threads and review queues, for example in `src/components/demo/conversation.tsx`, `src/components/demo/submissions.tsx`, the mentor queue and `src/components/login-chooser.tsx` (the avatar circle there is a hand-built chip).
- **Path:** use `<TeamPath>` on the student and partner overviews (apprentice, mentor, community partner) and `<JourneyStepper>` for the apprenticeship journey. `src/components/impact-loop.tsx` could join its stages with `<Path>`. Never use it as a divider.
- **Draft frame:** wrap every AI output in `<DraftFrame>` or `<DraftTextarea>`. That includes the scoping studio brief fields and chat replies in `src/components/partner/scoping-studio.tsx`, and the reflection companion questions in `src/routes/student/reflection.tsx`. Each label should say "AI draft" (or "Assistant (AI)" for chat) and turn into "Edited by you" when a person changes it.
- **Pinned note:** mentor feedback (`src/components/demo/submissions.tsx`) and the student's own reflections.
- **Highlighter:** the reflection question in focus on `src/routes/student/reflection.tsx`, at most one per screen.
- **Field note:** local chapter adaptations in `src/components/principles-in-practice.tsx` or the chapter pages, always beneath BRIDGEGOOD's official wording.

## Roles (DESIGN.md §2 "Roles")

- The app's `student` role shows as "Apprentice" in Bridge Studio, `ambassador` as "Chapter lead", and `partner` as "Community partner" (`STUDIO_ROLE_FOR` in `src/components/studio/role-badge.tsx`). `ROLE_INFO` labels in `src/lib/roles.ts` still say Student, Ambassador and Partner. Decide whether to rename them; the colors already follow `DESIGN.md`.
- Wherever a role is shown by color alone (for example `src/components/principles-table.tsx` column headers, `src/routes/training.tsx` cards), add the role icon with `<RoleBadge>` or `<Icon name=…>`.

## Status and notices (DESIGN.md §7 "Notice", §5)

- Success, error and warning messages need their icon (`circle-check`, `circle-alert`, `triangle-alert`, `info`) as well as a word. Use `bg-success-soft`, `bg-error-soft` or `bg-marker`, with `text-foreground` for the body text. The `/design` page has examples.
- Field errors: add the `circle-alert` icon before the message, and keep `aria-invalid` and `aria-describedby`.

## Accessibility fixes found by `npm run test:a11y`

These are listed as `KNOWN` in `tests/a11y.spec.ts`. Remove each entry when it's fixed, because the test fails once a known violation has gone.

- `src/components/chapter-finder.tsx`: `<ul role="region" aria-label="Chapter list" tabIndex={0}>` replaces the list role, so the `<li>`s have no list (axe `aria-allowed-role`, `listitem`, on `/chapters`). Move `role="region"`, the label and `tabIndex` onto a wrapping `<div>`, and keep a plain `<ul>` inside it.
- `src/components/demo/conversation.tsx`: `<ol role="log" aria-label="Messages">` has the same problem (on `/student/messages` and `/mentor/messages`). Wrap the `<ol>` in `<div role="log" aria-label="Messages">`.

## Other

- `DESIGN.md`: the status line still says "not yet built". Change it to point at `docs/design-system.md` and `/design`.

- `src/root.tsx` skip link: it uses `rounded-md bg-primary`, which already resolves to the right tokens. No change needed.
- `focus:outline-none` on `<main tabIndex={-1}>` in `app-shell.tsx` is acceptable, because `main` is a programmatic focus target and not a control. Don't copy that pattern onto interactive elements.
- A text-spacing and 200% zoom screenshot pass (DESIGN.md §8, CI item 3) isn't built yet.
