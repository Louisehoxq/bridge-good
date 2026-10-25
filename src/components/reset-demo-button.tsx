import { useState } from "react"
import { resetDemoData } from "@/lib/demo-store"
import { Button } from "@/components/ui/button"

export function ResetDemoButton() {
  const [done, setDone] = useState(false)
  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          resetDemoData()
          setDone(true)
        }}
      >
        Reset demo data
      </Button>
      <p role="status">
        {done ? "Demo data reset to the starting examples." : ""}
      </p>
    </div>
  )
}
