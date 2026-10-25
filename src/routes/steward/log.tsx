import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { TypeBadge, usePlaybook } from "@/components/playbook/shared"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Maintenance log")

/** Maintain: source, review date, version and revisions for everything published. */
export default function MaintenanceLog() {
  const [entries] = usePlaybook()
  const published = entries.filter((e) => e.status === "published")
  return (
    <>
      <PageHeader title="Maintenance log">
        Every published entry with its source, last review date, version and history, so the Playbook stays accurate and
        accountable.
      </PageHeader>
      <div className="overflow-x-auto rounded-xl border" role="region" aria-label="Published entries" tabIndex={0}>
        <table className="w-full min-w-[52rem] border-collapse text-left">
          <thead className="bg-muted">
            <tr>
              <th scope="col" className="p-3">
                Entry
              </th>
              <th scope="col" className="p-3">
                Label
              </th>
              <th scope="col" className="p-3">
                Source
              </th>
              <th scope="col" className="p-3">
                Version
              </th>
              <th scope="col" className="p-3">
                Last reviewed
              </th>
              <th scope="col" className="p-3">
                History
              </th>
            </tr>
          </thead>
          <tbody>
            {published.map((e) => (
              <tr key={e.id} className="border-t align-top">
                <th scope="row" className="p-3 font-semibold">
                  <Link to={`/playbook/${e.id}`} className="underline underline-offset-4">
                    {e.title}
                  </Link>
                </th>
                <td className="p-3">
                  <TypeBadge entry={e} />
                </td>
                <td className="p-3">{e.attribution.as}</td>
                <td className="p-3">{e.version}</td>
                <td className="p-3">{e.reviewedAt ?? e.submittedAt}</td>
                <td className="p-3 type-small">
                  <ol className="space-y-0.5">
                    {e.history.map((h, i) => (
                      <li key={i}>
                        v{h.version} {h.action} ({h.at})
                      </li>
                    ))}
                  </ol>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
