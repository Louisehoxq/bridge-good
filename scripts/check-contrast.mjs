#!/usr/bin/env node
/**
 * npm run check:contrast
 *
 * 1. Reads the Bridge Studio color tables in DESIGN.md (light, dark, roles) and the tokens in src/app.css,
 *    and fails if the two disagree, so the spec and the app can't drift apart.
 * 2. Tests every token pair DESIGN.md relies on against its required WCAG 2 contrast ratio, in light and dark:
 *    7:1 (AAA) for body and muted text, 4.5:1 for other text, 3:1 for control borders and focus.
 */
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const root = new URL("..", import.meta.url)
const read = (path) => readFileSync(fileURLToPath(new URL(path, root)), "utf8")

const AAA = 7
const AA = 4.5
const UI = 3

/** [foreground, background, required ratio, what the pair is for]. Token names without the leading --. */
const PAIRS = [
  ["ink", "paper", AAA, "body text"],
  ["ink", "surface", AAA, "body text on cards"],
  ["ink", "surface-sunken", AAA, "body text in wells and the sidebar"],
  ["ink-muted", "paper", AAA, "secondary text"],
  ["ink-muted", "surface", AAA, "secondary text on cards"],
  ["ink-muted", "surface-sunken", AAA, "secondary text in wells"],
  ["action", "paper", AA, "links"],
  ["action", "surface", AA, "links and secondary buttons"],
  ["action", "surface-sunken", AA, "secondary button hover"],
  ["on-action", "action", AA, "primary button label"],
  ["action", "paper", UI, "focus outline"],
  ["action", "surface", UI, "focus outline on cards"],
  ["line-strong", "paper", UI, "control borders"],
  ["line-strong", "surface", UI, "control borders on cards"],
  ["error", "surface", UI, "error field border"],
  ["ink", "marker", AAA, "highlighted phrase and warnings"],
  ["ink", "note", AAA, "pinned note text"],
  ["draft", "paper", AA, "AI draft label"],
  ["draft", "surface", AA, "AI draft label in a frame"],
  ["draft", "draft-soft", AA, "AI tag"],
  ["success", "success-soft", AA, "success tag"],
  ["success", "surface", AA, "done step check"],
  ["error", "error-soft", AA, "error tag"],
  ["error", "surface", AA, "field error message"],
  ["error", "paper", AA, "field error message"],
  ["ink", "success-soft", AAA, "notice text"],
  ["ink", "error-soft", AAA, "notice text"],
  ["ink", "draft-soft", AAA, "notice text"],
  ["ink", "surface-sunken", AAA, "BRIDGEGOOD steward badge"],
  ["paper", "ink", AA, "BRIDGEGOOD steward avatar"],
]
for (const role of ["apprentice", "mentor", "ambassador", "partner"]) {
  PAIRS.push(
    [role, "paper", AA, `${role} text`],
    [role, "surface", AA, `${role} text on cards`],
    [role, `${role}-soft`, AA, `${role} badge`],
    ["on-archetype", role, AA, `${role} avatar initials and current step`],
    ["ink", `${role}-soft`, AAA, `body text on the ${role} tint`],
    ["ink-muted", `${role}-soft`, AA, `secondary text on the ${role} tint`]
  )
}

// ---------- Parse src/app.css ----------

function tokensIn(block) {
  return Object.fromEntries([...block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})\b/gi)].map(([, n, v]) => [n, v.toUpperCase()]))
}

/** The body of the first `{ … }` that follows `start` in `css`, matching nested braces. */
function blockAfter(css, start) {
  const at = css.indexOf(start)
  if (at < 0) throw new Error(`src/app.css: can't find "${start}"`)
  let depth = 0
  const open = css.indexOf("{", at)
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++
    else if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i)
  }
  throw new Error(`src/app.css: unbalanced braces after "${start}"`)
}

const css = read("src/app.css").replace(/\/\*[\s\S]*?\*\//g, "")
const app = {
  light: tokensIn(blockAfter(css, "\n:root {")),
  dark: tokensIn(blockAfter(blockAfter(css, "@media (prefers-color-scheme: dark) {"), ":root")),
}
app.dark = { ...app.light, ...app.dark }

// ---------- Parse DESIGN.md ----------

function section(md, heading) {
  const start = md.indexOf(heading)
  if (start < 0) throw new Error(`DESIGN.md: can't find "${heading}"`)
  const rest = md.slice(start + heading.length)
  const end = rest.search(/\n#{2,3} /)
  return end < 0 ? rest : rest.slice(0, end)
}

const rows = (text) =>
  text
    .split("\n")
    .filter((line) => line.startsWith("|") && !/^\|[-\s|]+\|$/.test(line))
    .slice(1)
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))

const hexes = (cell) => (cell.match(/#[0-9A-Fa-f]{6}\b/g) ?? []).map((h) => h.toUpperCase())

function themeTable(text) {
  const spec = {}
  for (const [names, values] of rows(text)) {
    const tokens = [...names.matchAll(/`--([a-z0-9-]+)`/g)].map((m) => m[1])
    const found = hexes(values)
    tokens.forEach((token, i) => found[i] && (spec[token] = found[i]))
    // "`#A9C1EC` (text on it: `#14181F`, 9.8)": the second value is the text color on action.
    if (tokens[0] === "action" && found[1]) spec["on-action"] = found[1]
  }
  return spec
}

const md = read("DESIGN.md")
const spec = {
  light: { "on-action": "#FFFFFF", ...themeTable(section(md, "### Light theme")) },
  dark: themeTable(section(md, "### Dark theme")),
}
const ROLE_ROWS = { Apprentice: "apprentice", Mentor: "mentor", "Chapter lead": "ambassador", "Community partner": "partner" }
for (const [name, , light, , dark] of rows(section(md, "### Roles"))) {
  const role = Object.entries(ROLE_ROWS).find(([label]) => name.startsWith(label))?.[1]
  if (!role) continue
  ;[spec.light[role], spec.light[`${role}-soft`]] = hexes(light)
  ;[spec.dark[role], spec.dark[`${role}-soft`]] = hexes(dark)
}
// "White text on a role fill passes too"; dark role fills take the dark page color (src/app.css).
spec.light["on-archetype"] = "#FFFFFF"
spec.dark["on-archetype"] = spec.dark.paper

// ---------- Contrast ----------

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

let failures = 0

for (const theme of ["light", "dark"]) {
  console.log(`\n${theme === "light" ? "Light" : "Dark"} theme`)

  for (const [token, value] of Object.entries(spec[theme])) {
    if (app[theme][token] !== value) {
      failures++
      console.log(`  ✗ --${token}: DESIGN.md says ${value}, src/app.css has ${app[theme][token] ?? "nothing"}`)
    }
  }

  for (const [fg, bg, min, use] of PAIRS) {
    const [a, b] = [app[theme][fg], app[theme][bg]]
    if (!a || !b) {
      failures++
      console.log(`  ✗ --${fg} on --${bg}: missing token in src/app.css`)
      continue
    }
    const r = ratio(a, b)
    // Ratios are compared at two decimals, as WCAG checkers report them, so 6.996 doesn't pass as 7.
    const pass = Math.floor(r * 100) / 100 >= min
    if (!pass) failures++
    console.log(`  ${pass ? "✓" : "✗"} ${r.toFixed(2).padStart(5)}:1 ≥ ${min}  --${fg} on --${bg} (${use})`)
  }

  console.log(`  · ${ratio(app[theme].gold, app[theme].paper).toFixed(2)}:1  --gold on --paper (decorative only, never text)`)
}

if (failures) {
  console.error(`\n${failures} contrast check${failures === 1 ? "" : "s"} failed.`)
  process.exit(1)
}
console.log("\nAll Bridge Studio token pairs meet their required contrast in light and dark.")
