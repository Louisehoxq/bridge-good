import { AppShell } from "@/components/app-shell"
import { Icon } from "@/components/icon"
import { ChapterFinder } from "@/components/chapter-finder"
import { CHAPTER_MODEL_LABEL, CHAPTER_MODEL_NOTE } from "@/content/chapters"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Chapters: a proposed model")

export default function ChaptersPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10 max-w-3xl space-y-3">
          <h1 className="type-title-1">Chapters: a proposed model</h1>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-muted-foreground px-3 py-1 type-small font-semibold text-muted-foreground">
            <Icon name="info" className="text-base" />
            {CHAPTER_MODEL_LABEL}
          </p>
          <p className="type-body-lg text-muted-foreground">
            {CHAPTER_MODEL_NOTE} In this model, an ambassador BRIDGEGOOD has vetted would run each chapter. You could join
            as an apprentice or mentor, or bring a problem from your organization.
          </p>
        </div>
        <ChapterFinder />
      </div>
    </AppShell>
  )
}
