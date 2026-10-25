/**
 * PLACEHOLDER wordmark, colored like the BRIDGEGOOD logo: BRIDGE in navy, GOOD in gold.
 * Drawn as an image (SVG with a text alternative) because it's a logo: logos are exempt from text contrast
 * (WCAG 1.4.3), and the gold on paper is 2.4:1. Replace with the official logo from the Design System
 * (put the files in public/brand/ and render them with <img>). Don't redraw or alter the official logo.
 */
export function Wordmark() {
  return (
    <svg role="img" aria-label="BRIDGEGOODx" viewBox="0 0 136 24" width="136" height="24" className="block">
      <text
        x="0"
        y="12"
        dominantBaseline="central"
        textLength="136"
        lengthAdjust="spacingAndGlyphs"
        className="font-heading"
        fontSize="20"
        fontWeight="700"
        letterSpacing="-0.5"
      >
        <tspan className="fill-action">BRIDGE</tspan>
        <tspan className="fill-gold">GOOD</tspan>
        <tspan className="fill-action">x</tspan>
      </text>
    </svg>
  )
}
