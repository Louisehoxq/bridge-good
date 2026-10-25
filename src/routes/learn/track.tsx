import { data, Link } from "react-router"
import type { Route } from "./+types/track"
import { LibraryPage } from "@/components/library/library-page"
import { TrainingTrack } from "@/components/training-track"
import { TRAINING, type Audience } from "@/content/training"
import { GUIDE_TITLES, TRACKS, type GuideSlug } from "@/lib/library"
import { pageMeta } from "@/lib/meta"

/** Role-area color for each track. Company hosts are a kind of ambassador. */
const COLOR: Record<Audience, string> = { student: "student", mentor: "mentor", ambassador: "ambassador", company: "ambassador" }

const RELATED: Record<Audience, (GuideSlug | "self-check")[]> = {
  student: ["self-check", "inclusive-language"],
  mentor: ["mentor-commitment", "mock-case", "real-case", "ai-and-social-good"],
  ambassador: ["ambassador-vetting", "adapt-locally", "ai-and-social-good"],
  company: ["ambassador-vetting", "mentor-commitment"],
}

export function loader({ params }: Route.LoaderArgs) {
  const track = TRACKS.find((t) => t.slug === params.slug)
  if (!track) throw data(null, { status: 404 })
  return { slug: track.slug }
}

export const meta = ({ loaderData }: Route.MetaArgs) => pageMeta(TRACKS.find((t) => t.slug === loaderData?.slug)?.title ?? "Role track")

export default function TrackPage({ loaderData }: Route.ComponentProps) {
  const track = TRACKS.find((t) => t.slug === loaderData.slug)!
  const content = TRAINING[track.audience]

  return (
    <div data-archetype={COLOR[track.audience]}>
      <LibraryPage href={`/learn/tracks/${track.slug}`} intro={<p>{content.intro}</p>}>
        <p className="mb-8 max-w-3xl rounded-xl bg-archetype-soft p-4">
          Use the modules in any order, when you need them. Nothing here is graded.
        </p>
        <TrainingTrack audience={track.audience} />
        <section aria-labelledby="related-title" className="mt-14">
          <h2 id="related-title" className="mb-4 text-2xl font-bold">
            Guides for this role
          </h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {RELATED[track.audience].map((slug) => {
              const href = slug === "self-check" ? "/learn/self-check" : `/learn/guides/${slug}`
              const title = slug === "self-check" ? "Is this a good fit for you right now?" : GUIDE_TITLES[slug].title
              return (
                <li key={slug}>
                  <Link to={href} className="flex min-h-12 items-center rounded-xl border bg-card p-4 font-bold underline-offset-4 hover:bg-muted hover:underline">
                    {title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      </LibraryPage>
    </div>
  )
}
