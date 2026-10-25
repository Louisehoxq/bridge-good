import { AppShell } from "@/components/app-shell"
import { ChapterFinder } from "@/components/chapter-finder"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Find a chapter near you")

export default function ChaptersPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10 max-w-3xl space-y-3">
          <h1 className="text-4xl font-bold lg:text-5xl">Find a chapter near you</h1>
          <p className="text-lg text-muted-foreground">
            Chapters are run by ambassadors vetted by BRIDGEGOOD. Reach out to join as a student or mentor, or to bring a
            problem from your organisation.
          </p>
        </div>
        <ChapterFinder />
      </div>
    </AppShell>
  )
}
