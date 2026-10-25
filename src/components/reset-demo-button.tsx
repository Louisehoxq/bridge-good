"use client"

import { useState } from "react"
import { resetDemoData } from "@/lib/demo-store"
import { Button } from "@/components/ui/button"

export function ResetDemoButton() {
  const [done, setDone] = useState(false)
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Submissions, messages and bookings you make are saved in this browser only.
      </p>
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
      <p role="status" className="text-sm">
        {done ? "Demo data reset to the starting examples." : ""}
      </p>
    </div>
  )
}
