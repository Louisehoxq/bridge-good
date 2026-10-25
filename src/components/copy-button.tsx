import { useState } from "react"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"

/** Copies text to the clipboard and says so. If the browser blocks it, it says how to copy by hand instead. */
export function CopyButton({ text, label, className }: { text: string; label: string; className?: string }) {
  const [status, setStatus] = useState("")

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setStatus("Copied.")
    } catch {
      setStatus("Your browser blocked copying. Select the text above and copy it.")
    }
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" onClick={copy}>
          <Icon name="copy" />
          {label}
        </Button>
        <p role="status" className="font-semibold">
          {status}
        </p>
      </div>
    </div>
  )
}
