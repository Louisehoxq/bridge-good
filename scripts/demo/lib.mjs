// Shared helper for recording demo-video scenes. Every scene goes through recordScene(), so every clip has the same
// size, frame rate, cursor, captions and pacing. Scenes only write their steps. See docs/demo/recording-plan.md.
import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "@playwright/test"

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
export const BASE = process.env.BASE ?? "http://localhost:4400"
export const STATE_DIR = join(ROOT, "docs/demo/state")
export const CLIP_DIR = join(ROOT, "docs/demo/clips")
export const SIZE = { width: 1920, height: 1080 }
const FPS = 30
const OVERRUN_TOLERANCE_S = 1

/** Read docs/demo/state/meta.json (written by prepare-state.mjs): the Eastside reply code and so on. */
export function readMeta() {
  return JSON.parse(readFileSync(join(STATE_DIR, "meta.json"), "utf8"))
}

/** Injected into every page (runs again after each full navigation): a cursor, a click ripple and a caption bar. */
const OVERLAY = `(() => {
  const KEY = "__demo_overlay"
  const saved = (() => { try { return JSON.parse(sessionStorage.getItem(KEY) || "{}") } catch { return {} } })()
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify({ x: state.x, y: state.y, caption: state.caption })) } catch {} }
  const state = { x: saved.x ?? 960, y: saved.y ?? 540, caption: saved.caption ?? "" }
  const mount = () => {
    if (document.getElementById("__demo_cursor")) return
    const style = document.createElement("style")
    style.textContent = \`
      #__demo_cursor{position:fixed;left:0;top:0;width:30px;height:30px;z-index:2147483647;pointer-events:none;transition:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,.45))}
      .__demo_ripple{position:fixed;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;border:3px solid #2563eb;z-index:2147483646;pointer-events:none;animation:__demo_r .5s ease-out forwards}
      @keyframes __demo_r{to{transform:scale(3.2);opacity:0}}
      #__demo_caption{position:fixed;left:50%;bottom:44px;transform:translateX(-50%);max-width:1500px;z-index:2147483647;pointer-events:none;
        background:rgba(17,24,39,.94);color:#fff;font:600 34px/1.35 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
        padding:14px 30px;border-radius:14px;text-align:center;box-shadow:0 6px 24px rgba(0,0,0,.35);display:none}
    \`
    const cursor = document.createElement("div")
    cursor.id = "__demo_cursor"
    cursor.setAttribute("aria-hidden", "true")
    cursor.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M3 2l7.5 19 2.6-7.9L21 10.5z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>'
    const cap = document.createElement("div")
    cap.id = "__demo_caption"
    cap.setAttribute("aria-hidden", "true")
    document.documentElement.append(style, cursor, cap)
    place(); showCaption(state.caption)
  }
  const place = () => { const c = document.getElementById("__demo_cursor"); if (c) c.style.transform = "translate(" + state.x + "px," + state.y + "px)" }
  const showCaption = (text) => { const c = document.getElementById("__demo_caption"); if (!c) return; c.textContent = text; c.style.display = text ? "block" : "none" }
  window.__demo = {
    move(x, y) { state.x = x; state.y = y; place(); save() },
    ripple(x, y) { const r = document.createElement("div"); r.className = "__demo_ripple"; r.style.left = x + "px"; r.style.top = y + "px"; document.documentElement.append(r); setTimeout(() => r.remove(), 600) },
    caption(text) { state.caption = text; showCaption(text); save() },
    scroll(dy, ms) {
      return new Promise((done) => {
        const start = performance.now(), from = window.scrollY
        const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
        const tick = (now) => { const t = Math.min(1, (now - start) / ms); window.scrollTo(0, from + dy * ease(t)); t < 1 ? requestAnimationFrame(tick) : done() }
        requestAnimationFrame(tick)
      })
    },
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount()
})()`

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const srtTime = (s) => {
  const ms = Math.round(s * 1000)
  const p = (n, w = 2) => String(n).padStart(w, "0")
  return `${p(Math.floor(ms / 3_600_000))}:${p(Math.floor(ms / 60_000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`
}

/**
 * Record one scene.
 * scene = { id, budgetSeconds, state?: "fresh" | "apprentice" | ..., run(api) }
 * api: page, goto, pause, hold, caption, click, type, scrollBy, scrollIntoView, hover, endCard, meta
 */
export async function recordScene(scene) {
  const { id, budgetSeconds, state, run } = scene
  mkdirSync(CLIP_DIR, { recursive: true })
  const tmp = join(ROOT, "docs/demo/.tmp", id)
  rmSync(tmp, { recursive: true, force: true })
  mkdirSync(tmp, { recursive: true })

  const storageState = state ? join(STATE_DIR, `${state}.json`) : undefined
  if (storageState && !existsSync(storageState)) throw new Error(`Missing state ${state}: run "node scripts/demo/prepare-state.mjs" first`)

  const browser = await chromium.launch({ args: ["--hide-scrollbars"] })
  const context = await browser.newContext({
    viewport: SIZE,
    deviceScaleFactor: 1,
    locale: "en-US",
    timezoneId: "Europe/London",
    colorScheme: "light",
    reducedMotion: "no-preference",
    baseURL: BASE,
    storageState,
    recordVideo: { dir: tmp, size: SIZE },
  })
  await context.addInitScript(OVERLAY)
  const page = await context.newPage()
  const t0 = Date.now()
  const now = () => (Date.now() - t0) / 1000
  const captions = []
  let current = null
  let cursor = { x: 960, y: 540 }

  const endCurrentCaption = () => {
    if (current) {
      current.end = Math.min(now(), budgetSeconds)
      current = null
    }
  }

  const api = {
    page,
    meta: () => readMeta(),
    BASE,
    async goto(path) {
      await page.goto(path, { waitUntil: "load" })
      await page.evaluate(() => document.fonts.ready).catch(() => {})
    },
    pause: (ms) => sleep(ms),
    hold: (ms) => sleep(ms),
    /** Show a caption now. It stays for `seconds` (not blocking), or until the next caption. */
    async caption(text, seconds = 3) {
      endCurrentCaption()
      const entry = { text, start: now(), end: null }
      captions.push(entry)
      current = entry
      await page.evaluate((t) => window.__demo?.caption(t), text)
      const token = entry
      setTimeout(async () => {
        if (current === token) {
          endCurrentCaption()
          await page.evaluate(() => window.__demo?.caption("")).catch(() => {})
        }
      }, seconds * 1000)
    },
    async clearCaption() {
      endCurrentCaption()
      await page.evaluate(() => window.__demo?.caption("")).catch(() => {})
    },
    async moveTo(locator, { steps = 28 } = {}) {
      await locator.scrollIntoViewIfNeeded()
      const box = await locator.boundingBox()
      if (!box) throw new Error("moveTo: element has no box")
      const target = { x: Math.round(box.x + box.width / 2), y: Math.round(box.y + Math.min(box.height / 2, 40)) }
      for (let i = 1; i <= steps; i++) {
        const t = i / steps
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        const x = cursor.x + (target.x - cursor.x) * e
        const y = cursor.y + (target.y - cursor.y) * e
        await page.mouse.move(x, y)
        await page.evaluate(([a, b]) => window.__demo?.move(a, b), [x, y])
        await sleep(12)
      }
      cursor = target
      return target
    },
    async hover(locator) {
      await api.moveTo(locator)
    },
    async click(locator, { after = 350 } = {}) {
      const p = await api.moveTo(locator)
      await sleep(180)
      await page.evaluate(([a, b]) => window.__demo?.ripple(a, b), [p.x, p.y])
      await locator.click()
      await sleep(after)
    },
    async type(locator, text, { delay = 28 } = {}) {
      await api.click(locator, { after: 120 })
      await locator.pressSequentially(text, { delay })
      await sleep(250)
    },
    /** Smooth scroll by `px` over `ms`. */
    async scrollBy(px, ms = 1200) {
      await page.evaluate(([a, b]) => window.__demo.scroll(a, b), [px, ms])
      await sleep(150)
    },
    async scrollIntoView(locator, { ms = 900 } = {}) {
      const box = await locator.boundingBox()
      if (!box) return
      const dy = box.y - SIZE.height * 0.3
      if (Math.abs(dy) > 20) await api.scrollBy(dy, ms)
    },
    /** A full-screen static end card (not an app page). `lines` is an array of strings; the first is the title. */
    async endCard(lines) {
      endCurrentCaption()
      const [title, ...rest] = lines
      const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c])
      await page.setContent(
        `<!doctype html><meta charset="utf-8"><title>BridgeGoodx</title><body style="margin:0;height:100vh;display:grid;place-items:center;background:#16213e;color:#fff;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;text-align:center">
        <main style="max-width:1400px;padding:0 60px"><h1 style="font-size:84px;margin:0 0 28px;letter-spacing:-1px">${esc(title)}</h1>${rest
          .map((l) => `<p style="font-size:38px;margin:10px 0;opacity:.9">${esc(l)}</p>`)
          .join("")}</main></body>`,
      )
    },
  }

  let failure = null
  try {
    await run(api)
  } catch (e) {
    failure = e
  }
  const elapsed = now()
  endCurrentCaption()
  await sleep(300)
  const video = page.video()
  await context.close()
  const raw = await video.path()
  await browser.close()
  if (failure) {
    console.error(`scene ${id} failed after ${elapsed.toFixed(1)}s: ${failure.message}`)
    throw failure
  }

  // Normalize: 30 fps, 1920x1080, H.264, silent stereo track, fades; pad with the last frame or trim to the budget.
  const out = join(CLIP_DIR, `${id}.mp4`)
  const pad = Math.max(0, budgetSeconds - elapsed)
  execFileSync(
    "ffmpeg",
    [
      "-y", "-loglevel", "error",
      "-i", raw,
      "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000",
      "-vf", `fps=${FPS},scale=${SIZE.width}:${SIZE.height}:flags=lanczos,format=yuv420p,tpad=stop_mode=clone:stop_duration=${pad.toFixed(2)},fade=t=in:st=0:d=0.3,fade=t=out:st=${(budgetSeconds - 0.3).toFixed(2)}:d=0.3`,
      "-t", String(budgetSeconds),
      "-map", "0:v", "-map", "1:a",
      "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-c:a", "aac", "-shortest",
      out,
    ],
    { stdio: "inherit" },
  )
  renameSync(raw, join(tmp, "raw.webm"))

  const srt = captions
    .filter((c) => c.end !== null && c.end > c.start)
    .map((c, i) => `${i + 1}\n${srtTime(c.start)} --> ${srtTime(c.end)}\n${c.text}\n`)
    .join("\n")
  writeFileSync(join(CLIP_DIR, `${id}.srt`), srt)

  const over = elapsed - budgetSeconds
  console.log(`scene ${id}: recorded ${elapsed.toFixed(1)}s, budget ${budgetSeconds}s -> ${out}`)
  if (over > OVERRUN_TOLERANCE_S) {
    throw new Error(`scene ${id} overran its ${budgetSeconds}s budget by ${over.toFixed(1)}s: shorten pauses or captions`)
  }
  return { out, elapsed }
}
