import { index, route, type RouteConfig } from "@react-router/dev/routes"
import { REDIRECT_PATHS } from "./routes/redirects"

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
  ]),

  area("student", ["practice", "projects", "submissions", "reflection", "mentor", "community"]),
  area("mentor", ["prepare", "mentee", "conversations"]),
  area("ambassador", ["playbook", "matching", "projects", "toolkits"]),
  area("partner", ["submit", "project", "gallery", "toolkit"]),

  // Old URLs: v1 role pages, /training/*, and role pages merged into others.
  ...REDIRECT_PATHS.map((path) => route(path, "routes/legacy-redirect.ts", { id: `redirect-${path.replace(/[^a-z]+/g, "-")}` })),
] satisfies RouteConfig
