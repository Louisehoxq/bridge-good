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
  route("api/scope", "routes/api.scope.ts"),
  route("api/reflect", "routes/api.reflect.ts"),
  route("design", "routes/design.tsx"),

  // The public library: one stable URL per page. Role areas link in here.
  route("learn", "routes/learn/layout.tsx", [
    index("routes/learn/index.tsx"),
    route("pillars/:pillarId", "routes/learn/pillar.tsx"),
    route("prompts", "routes/learn/prompts.tsx"),
    route("terms", "routes/learn/terms.tsx"),
    route("tracks/:slug", "routes/learn/track.tsx"),
    route("guides/:slug", "routes/learn/guide.tsx"),
    route("self-check", "routes/learn/self-check.tsx"),
    route("changelog", "routes/learn/changelog.tsx"), // Milestone 3
    route("practice", "routes/learn/practice.tsx"),
    route("practice/:slug", "routes/learn/practice-moment.tsx"),
    route("carry-it-forward", "routes/learn/carry-it-forward.tsx"),
    route("carry-it-forward/reply", "routes/learn/kit-reply.tsx"),
  ]),

  area("student", ["practice", "projects", "submissions", "reflection", "mentor", "community"]),
  area("mentor", ["prepare", "mentee", "conversations"]),
  area("ambassador", ["playbook", "matching", "projects", "toolkits"]),
  area("partner", ["submit", "project", "gallery", "toolkit"]),

  // Milestone 3: the BRIDGEGOOD steward area.
  route("steward", "routes/steward/layout.tsx", [
    index("routes/steward/index.tsx"),
    route("framework", "routes/steward/framework.tsx"),
    route("feedback/:id", "routes/steward/feedback.tsx"),
  ]),
] satisfies RouteConfig
