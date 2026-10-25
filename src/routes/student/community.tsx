import { PageHeader } from "@/components/app-shell"
import { CommunityOfPractice } from "@/components/demo/community"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Community of practice")

export default function CommunityPage() {
  return (
    <>
      <PageHeader eyebrow="Communities of practice" title="Learn alongside other apprentices">
        Peer circles where apprentices swap tips, ask questions and support each other.
      </PageHeader>
      <CommunityOfPractice />
    </>
  )
}
