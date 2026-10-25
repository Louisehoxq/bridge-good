import type { ReactNode } from "react"
import { PinnedNote } from "@/components/studio/pinned-note"

/**
 * Field note: how one chapter adapts the philosophy locally. Place it beneath BRIDGEGOOD's official wording,
 * which always stays above it. It is always labelled as a local adaptation.
 */
export function FieldNote({ chapter, children, className }: { chapter: string; children: ReactNode; className?: string }) {
  return (
    <PinnedNote icon="map-pin" tilt="right" title={`Local adaptation from ${chapter}`} className={className}>
      {children}
    </PinnedNote>
  )
}
