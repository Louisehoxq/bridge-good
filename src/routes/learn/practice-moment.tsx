import { data } from "react-router"
import type { Route } from "./+types/practice-moment"
import { Breadcrumbs } from "@/components/library/library-page"
import { PracticeMomentView } from "@/components/practice/practice-moment"
import { getPracticeMoment } from "@/content/practice"
import { pageMeta } from "@/lib/meta"

export function loader({ params }: Route.LoaderArgs) {
  if (!getPracticeMoment(params.slug)) throw data(null, { status: 404 })
  return { slug: params.slug }
}

export const meta = ({ loaderData }: Route.MetaArgs) => pageMeta(loaderData ? `Practice: ${getPracticeMoment(loaderData.slug)!.title}` : "Practice moment")

export default function PracticeMomentPage({ loaderData }: Route.ComponentProps) {
  const moment = getPracticeMoment(loaderData.slug)!
  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs
        items={[
          { label: "Library", href: "/learn" },
          { label: "Practice moments", href: "/learn/practice" },
          { label: moment.title },
        ]}
      />
      {/* key: a fresh, private choice on every moment. */}
      <PracticeMomentView key={moment.slug} moment={moment} />
    </article>
  )
}
