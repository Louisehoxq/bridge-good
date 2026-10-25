import { useEffect, useState, useSyncExternalStore } from "react"
import { cn } from "@/lib/utils"

/**
 * The words that finish "Design for …". The first is the name of the philosophy: the one shown on the server,
 * under reduced motion, and where the cycle returns when paused. Each has its own Bridge Studio color, all AA as
 * text in both themes.
 */
const WORDS = [
  { word: "social good", color: "text-primary" },
  { word: "people", color: "text-apprentice" },
  { word: "purpose", color: "text-mentor" },
  { word: "passion", color: "text-error" },
  { word: "community", color: "text-ambassador" },
  { word: "impact", color: "text-partner" },
] as const

/** Time each word stays on screen. */
const STEP_MS = 2200

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/** The server and the first client render assume reduced motion, so nothing moves until the browser says it may. */
function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true
  )
}

/**
 * The home page h1: "Design for" and a word that keeps changing. It loops, so WCAG 2.2.2 needs a pause control:
 * the button under it stops the cycle on "social good". Screen readers hear "Design for Social Good" once; the
 * changing words are hidden from them. It never starts under reduced motion.
 */
export function HeroTitle({ id }: { id: string }) {
  const reducedMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [index, setIndex] = useState(0)
  const playing = !reducedMotion && !paused

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % WORDS.length), STEP_MS)
    return () => window.clearInterval(timer)
  }, [playing])

  const shown = playing ? index : 0

  return (
    <>
      <h1 id={id} className="type-display sm:text-6xl sm:leading-[1.1] lg:text-7xl">
        <span className="sr-only">Design for Social Good</span>
        <span aria-hidden="true">
          Design for{" "}
          {/* Every word sits in the same grid cell, so the line keeps the width of the longest and never jumps. */}
          <span className="inline-grid align-bottom">
            {WORDS.map((w, i) => (
              <span
                key={w.word}
                className={cn(
                  "col-start-1 row-start-1 whitespace-nowrap underline decoration-gold decoration-4 underline-offset-[0.18em] transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
                  w.color,
                  i === shown ? "translate-y-0 opacity-100" : "invisible translate-y-[0.35em] opacity-0"
                )}
              >
                {w.word}
              </span>
            ))}
          </span>
        </span>
      </h1>
      {!reducedMotion && (
        <button
          type="button"
          onClick={() => {
            setIndex(0)
            setPaused(!paused)
          }}
          className="mt-3 rounded-sm text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {paused ? "Play animation" : "Pause animation"}
        </button>
      )}
    </>
  )
}
