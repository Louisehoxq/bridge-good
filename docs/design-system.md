# Design system

> **Status: placeholder.** We're waiting for the official BRIDGEGOOD Design System (logo assets, tone and writing guidance, accessible patterns). Until it arrives, the site uses neutral placeholder tokens that are easy to swap.

## Where things live

| What | File | Swap how |
| --- | --- | --- |
| Colours, radius | `src/app/globals.css`, in the `:root` block marked "BRAND TOKENS — PLACEHOLDER" | Replace the hex values. Every component reads these variables. |
| Role accent colours | the same `:root` block (`--student`, `--mentor`, `--ambassador`, `--partner`) | Keep each at 4.5:1 or better against white. |
| Typefaces | `src/app/layout.tsx` (`--font-body`, `--font-display`) | Swap the `next/font` imports. |
| Logo | `src/components/wordmark.tsx` (text placeholder) | Put the official files in `public/brand/` and render them with `next/image`. Don't redraw or alter them. |
| UI primitives | `src/components/ui/*` (shadcn/ui on Base UI) | Already themed from the tokens. Buttons and inputs are sized to at least 44px. |

## Layout: desktop-first

- The design target is 1280px or wider. Use `max-w-7xl` content, multi-column grids at `xl`, and master–detail patterns (lists beside detail panes) for queues, inboxes and the scoping studio.
- Role areas: a sticky left sidebar at `lg`+. Below `lg` it becomes a horizontal tab strip, and below `md` the top nav collapses into a sheet.
- Wide tables (comparison, principles by role) scroll horizontally inside a focusable region on small screens. Never let the page itself scroll sideways.
- Accent colours follow the role: set `data-archetype="<role>"` on a container and use `text-archetype`, `bg-archetype` or `bg-archetype-soft`.

## Accessibility baseline (WCAG 2.2 AA)

- Skip link, semantic landmarks, one `h1` per page, and section headings in order.
- Visible 3px focus outline on every interactive element (`:focus-visible` in `globals.css`).
- Tap targets of at least 44×44px.
- Text contrast of at least 4.5:1. Placeholder tokens pass axe-core with zero violations.
- `prefers-reduced-motion` turns off animation and smooth scrolling.
- Forms:
  - every input has a visible label
  - hints and errors are linked with `aria-describedby`
  - an error summary receives focus and links to each field
  - optional fields are marked "(optional)" instead of marking required ones with an asterisk
- Expandable content uses native `<details>`, so it works without JavaScript.
- Current page in navs uses `aria-current="page"`. In master–detail lists the selected item uses `aria-current="true"`.
- Live updates (chat, messages, bookings) sit in `aria-live="polite"` regions.

## AI features

- Always labelled as AI ("Assistant (AI)").
- Output is a draft the person can edit, and it's reviewed by BRIDGEGOOD before anything happens.
- Never asks for or stores personal details. Images are sent only with the request.

## Writing (interim rules until BRIDGEGOOD's tone guide arrives)

- Plain, warm, direct. Speak to the reader as "you".
- Concrete over abstract. Say what someone *does*, not a slogan about values.
- Never present synthetic people or projects as real. Label them "Synthetic example".
- No personal stories, names, portfolios or artwork without explicit consent.
- Credit BRIDGEGOOD as the author and steward of the philosophy.
