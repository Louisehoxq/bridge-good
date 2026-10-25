import { AppShell } from "@/components/app-shell"
import { ChapterFinder } from "@/components/chapter-finder"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Chapters")

export default function ChaptersPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10 max-w-3xl space-y-3">
          <h1 className="type-title-1">Chapters</h1>
        </div>
        <ChapterFinder />
      </div>
    </AppShell>
  )
}
