import { AppShell } from "@/components/app-shell"
import { ChapterFinder } from "@/components/chapter-finder"
import { CHAPTER_MODEL_LABEL, CHAPTER_MODEL_NOTE } from "@/content/chapters"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Chapters: a proposed model")

export default function ChaptersPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10 max-w-3xl space-y-3">
          <p className="text-sm font-bold tracking-wide text-primary uppercase">{CHAPTER_MODEL_LABEL}</p>
          <h1 className="text-4xl font-bold lg:text-5xl">Chapters: a proposed model</h1>
          <p className="text-lg text-muted-foreground">
            {CHAPTER_MODEL_NOTE} In this model, an ambassador BRIDGEGOOD has vetted would run each chapter. You could join
            as a student or mentor, or bring a problem from your organization.
          </p>
        </div>
        <ChapterFinder />
      </div>
    </AppShell>
  )
}
