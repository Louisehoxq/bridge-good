import { PRINCIPLES } from "@/content/principles"
import { ROLE_INFO, ROLES } from "@/lib/roles"

/** Wide desktop matrix: each principle, and what it asks of every role. Scrolls horizontally on small screens. */
export function PrinciplesTable() {
  return (
    <div className="overflow-x-auto rounded-xl border" role="region" aria-label="Table: what each principle asks of each role" tabIndex={0}>
      <table className="w-full min-w-[60rem] border-collapse text-left">
        <caption className="sr-only">What each Design for Social Good principle asks of each role</caption>
        <thead className="bg-muted">
          <tr>
            <th scope="col" className="w-64 p-4 font-bold">
              Principle
            </th>
            {ROLES.map((r) => (
              <th key={r} scope="col" data-archetype={r} className="p-4 font-bold text-archetype">
                {ROLE_INFO[r].label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PRINCIPLES.map((p) => (
            <tr key={p.id} className="border-t align-top">
              <th scope="row" className="p-4 text-left">
                <span className="block font-bold">{p.name}</span>
                <span className="mt-1 block text-sm font-normal text-muted-foreground">{p.meaning}</span>
              </th>
              {ROLES.map((r) => (
                <td key={r} className="p-4 text-sm">
                  {p.inPractice[r]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
