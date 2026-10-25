import { FileTextIcon } from "lucide-react"
import type { ToolkitSection } from "@/content/toolkits"

export function ToolkitList({ sections }: { sections: ToolkitSection[] }) {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {sections.map((s, i) => (
        <section key={s.title} aria-label={s.title} className="rounded-2xl border bg-card p-5">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <span className="flex size-7 items-center justify-center rounded-full bg-archetype text-sm text-white" aria-hidden="true">
              {i + 1}
            </span>
            {s.title}
          </h3>
          <ul className="space-y-3">
            {s.items.map((item) => (
              <li key={item.name} className="flex gap-3">
                <FileTextIcon className="mt-1 size-4 shrink-0 text-archetype" aria-hidden="true" />
                <div>
                  <p className="font-semibold">
                    {item.name} <span className="text-sm font-normal text-muted-foreground">· {item.format}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
