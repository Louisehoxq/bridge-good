import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * The words that finish "Design for …". The first is the name of the philosophy: the one shown on the server,
 * under reduced motion, and where the cycle ends. Each has its own Bridge Studio color, all AA as text in both
 * themes.
 */
const WORDS = [
  { word: "social good", color: "text-primary" },
  { word: "people", color: "text-apprentice" },
  { word: "purpose", color: "text-mentor" },
  { word: "passion", color: "text-error" },
  { word: "community", color: "text-ambassador" },
  { word: "impact", color: "text-partner" },
] as const

/** One pass through every word and back to "social good" takes 6 × 800ms, under WCAG 2.2.2's 5 seconds. */
const STEP_MS = 800

/**
 * The home page h1: "Design for" and a word that changes. It plays once and stops on "social good", so it needs
 * no pause control (WCAG 2.2.2). Screen readers hear "Design for Social Good" once; the changing words are hidden
 * from them. It never moves under reduced motion.
 */
export function HeroTitle({ id }: { id: string }) {
  const [index, setIndex] = useState(0)

  // Start only in the browser, and only when the reader allows motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let step = 0
    const timer = window.setInterval(() => {
      step += 1
      setIndex(step % WORDS.length)
      if (step === WORDS.length) window.clearInterval(timer)
    }, STEP_MS)
    return () => window.clearInterval(timer)
  }, [])

  return (
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
                i === index ? "translate-y-0 opacity-100" : "invisible translate-y-[0.35em] opacity-0"
              )}
            >
              {w.word}
            </span>
          ))}
        </span>
      </span>
    </h1>
  )
}
