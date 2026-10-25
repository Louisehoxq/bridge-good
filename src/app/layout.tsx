import type { Metadata, Viewport } from "next"
import { Atkinson_Hyperlegible, Bricolage_Grotesque } from "next/font/google"
import "./globals.css"

// PLACEHOLDER typefaces. Swap for the BRIDGEGOOD Design System fonts.
const body = Atkinson_Hyperlegible({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
})

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "BridgeGoodx · Design for Social Good",
    template: "%s · BridgeGoodx",
  },
  description:
    "Learn, practise and carry forward BRIDGEGOOD's Design for Social Good philosophy, whether you're a student, an ambassador or an organisation with a problem to solve.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:px-4 focus:py-3"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
