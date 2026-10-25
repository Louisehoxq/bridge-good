import { index, route, type RouteConfig } from "@react-router/dev/routes"

/**
 * The public site follows the community experience cycle: Understand → Practice → Reflect and Share → Teach and Evolve.
 * Only the company host and steward areas need a (demo) login.
 */
export default [
  index("routes/home.tsx"),
  route("start/:audience", "routes/start.tsx"),
  route("understand", "routes/understand.tsx"),
  route("lab", "routes/lab/index.tsx"),
  route("lab/:slug", "routes/lab/scenario.tsx"),
  route("library", "routes/library/index.tsx"),
  route("library/:slug", "routes/library/resource.tsx"),
  route("playbook", "routes/playbook/index.tsx"),
  route("playbook/contribute", "routes/playbook/contribute.tsx"),
  route("playbook/:id", "routes/playbook/entry.tsx"),
  route("teach", "routes/teach.tsx"),
  // Chapters and their community events: calendars, event pages with an RSVP, and a form to host one.
  route("chapters", "routes/chapters.tsx"),
  route("chapters/:id", "routes/chapter.tsx"),
  route("events", "routes/events/index.tsx"),
  route("events/host", "routes/events/host.tsx"),
  route("events/:id", "routes/events/event.tsx"),
  route("about", "routes/about.tsx"),

  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.ts"),
  route("api/reflect", "routes/api.reflect.ts"),
  route("design", "routes/design.tsx"),

  route("host", "routes/host/layout.tsx", [
    index("routes/host/index.tsx"),
    route("guide", "routes/host/guide.tsx"),
    route("workplace", "routes/host/workplace.tsx"),
    route("projects", "routes/host/projects.tsx"),
    route("toolkit", "routes/host/toolkit.tsx"),
  ]),

  route("steward", "routes/steward/layout.tsx", [
    index("routes/steward/index.tsx"),
    route("review/:id", "routes/steward/review.tsx"),
    route("log", "routes/steward/log.tsx"),
    route("themes", "routes/steward/themes.tsx"),
  ]),
] satisfies RouteConfig
