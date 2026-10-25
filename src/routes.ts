import { index, route, type RouteConfig } from "@react-router/dev/routes"

/** Each role area: a guarded layout (RoleShell + sidebar) with its pages nested inside. */
const area = (role: string, pages: string[]) =>
  route(role, `routes/${role}/layout.tsx`, [
    index(`routes/${role}/index.tsx`),
    ...pages.map((page) => route(page, `routes/${role}/${page}.tsx`)),
  ])

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.ts"),
  route("chapters", "routes/chapters.tsx"),
  route("training", "routes/training.tsx"),
  route("training/:audience", "routes/training.audience.tsx"),
  route("api/scope", "routes/api.scope.ts"),
  route("design", "routes/design.tsx"),

  area("student", ["learn", "activities", "submissions", "reflection", "community", "office-hours", "messages"]),
  area("mentor", ["training", "submissions", "office-hours", "messages"]),
  area("ambassador", ["training", "projects", "toolkits"]),
  area("partner", ["submit", "gallery", "toolkit", "legal"]),

  // v1 URLs, from before the site became role-based.
  ...["students", "ambassadors", "problem-owners"].map((path) =>
    route(path, "routes/legacy-redirect.ts", { id: `legacy-${path}` })
  ),
] satisfies RouteConfig
