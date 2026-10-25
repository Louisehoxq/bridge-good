import type { Metadata } from "next"
import { PageHeader } from "@/components/app-shell"
import { CommunityOfPractice } from "@/components/demo/community"

export const metadata: Metadata = { title: "Community of practice" }

export default function CommunityPage() {
  return (
    <>
      <PageHeader eyebrow="Communities of practice" title="Learn alongside other students">
        Peer circles where students swap tips, ask questions and support each other.
      </PageHeader>
      <CommunityOfPractice />
    </>
  )
}
