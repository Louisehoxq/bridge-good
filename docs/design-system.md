# Design system

BridgeGoodx follows the [BRIDGEGOOD Design System](https://bridgegood.com/design), which is built on Material 3. Token values were taken from bridgegood.com's own stylesheet (October 2026), for both light and dark themes.

## Where things live

| What | File | Notes |
| --- | --- | --- |
| Color, shape, elevation, motion tokens | `src/app.css` (`:root` and the dark-theme `@media` block) | Material 3 roles (`surface`, `surface-container-*`, `primary-container`, `outline`…) plus the shadcn names the components use (`bg-card`, `text-muted-foreground`…), mapped onto them. |
| Role accents | the same file (`--student`, `--mentor`, `--ambassador`, `--partner`) | Royal blue, teal, navy and amber, each at least 4.5:1 on the surface and on its soft tint, in both themes. |
| Type | `src/root.tsx` loads Google Sans; `src/app.css` defines the M3 type scale utilities (`display-small`, `headline-large`, `title-medium`, `body-large`, `label-large`…) | Body text stays 16px or larger. |
| Icons | `src/components/icon.tsx` | Material Symbols Rounded, subset to the names in `ICON_NAMES`. Add a name there before using it. Icons are decorative (`aria-hidden`); the control's text carries the meaning. |
| Logo | `src/components/wordmark.tsx` (text placeholder) | Use the official SVGs from bridgegood.com/design in `public/brand/`. Don't redraw, recolor or add effects. Full logo at least 120px wide. |
| UI primitives | `src/components/ui/*` (shadcn/ui on Base UI) | M3 button (filled, tonal, outlined, text), outlined text fields. |

### Color rules

- Brand navy `#003366`, royal `#0059B3`, gold `#CC9900`.
- **Gold fails as small text** (2.16:1). Use it only for large accents; for text under 24px use Amber Bronze `#AB6624` or the darker `--partner` amber.
- Brand teal `#2D8686` is 4.23:1 on the M3 surface, so text uses the darker `--tertiary` / `--mentor` teal.
- Control borders use `border-input` (the M3 `outline`, 3:1 or better). `border` (`outline-variant`) is for decorative dividers only.
- Text on a role-colored fill uses `text-on-archetype`: white in light mode and dark in dark mode.

## Layout: desktop-first

- The design target is 1280px or wider: `max-w-7xl` content, multi-column grids at `xl`, and master–detail panes for queues, inboxes and the scoping studio. Phone widths must still work (no sideways page scroll), but they aren't the design target.
- Role areas get a sticky left sidebar at `lg`+. Below `lg` it becomes a horizontal tab strip, and below `md` the top nav collapses into a sheet.
- Wide tables scroll horizontally inside a focusable `role="region"` with an `aria-label`.
- Role accents: set `data-archetype="<role>"` on a container and use `text-archetype`, `bg-archetype`, `bg-archetype-soft` or `text-on-archetype`.

## Accessibility baseline (WCAG 2.2 AA)

- Skip link, semantic landmarks, one `h1` per page, and section headings in order.
- A visible 3px focus outline on every interactive element (`:focus-visible` in `app.css`). Don't add `outline-none` to components.
- Touch targets of at least 48×48px (the M3 button's visible 40px height is padded to 48px).
- Text contrast of at least 4.5:1, and control boundaries of at least 3:1, in light and dark themes.
- `prefers-reduced-motion` turns off animation and smooth scrolling.
- Forms:
  - every input has a visible label
  - hints and errors are linked with `aria-describedby`, and invalid fields get `aria-invalid`
  - an error summary receives focus and links to each field
  - optional fields are marked "(optional)" instead of marking required ones with an asterisk
- When an action removes the focused element (book, cancel, remove, send), move focus to the relevant heading and announce the result in a `role="status"` message.
- Streaming or changing content is not wrapped in `aria-live`. Chat transcripts use `role="log"`. AI replies are announced once, when they finish.
- Expandable content uses native `<details>`, so it works without JavaScript.
- Current page in navs uses `aria-current="page"`. In master–detail lists the selected item uses `aria-current="true"`.

## AI features

- Always labelled as AI ("Assistant (AI)").
- Output is a draft the person can edit, and BRIDGEGOOD reviews it before anything happens.
- Never asks for or stores personal details. Screenshots are shrunk in the browser and sent only with the request.

## Writing (from BRIDGEGOOD's tone guide)

- Supportive, direct, trustworthy and approachable. Write at a 6th–8th grade reading level, with paragraphs of five sentences or fewer.
- Sentence case. US spelling. Gender-neutral language that makes no assumptions about ability, background or identity.
- Lead with what people can do. Be specific ("Saves in 2 seconds", not "Saves quickly").
- Concrete over abstract: say what someone *does*, not a slogan about values.
- Never present synthetic people or projects as real. Label them "Synthetic example".
- No personal stories, names, portfolios or artwork without explicit consent.
- Credit BRIDGEGOOD as the author and steward of the philosophy.
