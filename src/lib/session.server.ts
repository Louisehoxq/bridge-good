import { createCookie, redirect } from "react-router"
import { isAmbassadorKind, isRole, ROLE_INFO, SESSION_COOKIE, type AmbassadorKind, type Role, type Session } from "@/lib/roles"

/**
 * DEMO session: the signed-in role lives in a cookie. There is no password and no account, so this is
 * not real authentication. It only decides which role area a visitor sees, and for ambassadors which
 * kind (chapter lead or company host).
 */
const sessionCookie = createCookie(SESSION_COOKIE, {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30,
})

export async function getSession(request: Request): Promise<Session | null> {
  const value: unknown = await sessionCookie.parse(request.headers.get("Cookie"))
  if (value && typeof value === "object" && "role" in value && isRole(value.role)) {
    const kind = "ambassadorKind" in value && isAmbassadorKind(value.ambassadorKind) ? value.ambassadorKind : "chapter-lead"
    return { role: value.role, ambassadorKind: value.role === "ambassador" ? kind : undefined }
  }
  return null
}

export async function getSessionRole(request: Request): Promise<Role | null> {
  return (await getSession(request))?.role ?? null
}

/** Role-area guard: send visitors without the matching demo role to /login, remembering where they were going. */
export async function requireRole(request: Request, role: Role) {
  if ((await getSessionRole(request)) === role) return
  const { pathname } = new URL(request.url)
  throw redirect(`/login?next=${encodeURIComponent(pathname)}`)
}

/** Demo login: no password, just the chosen synthetic account's role (and ambassador kind). */
export async function loginAs(role: Role, next: string, ambassadorKind?: AmbassadorKind) {
  // Only follow `next` into the chosen role's own area, so it can't send anyone off-site.
  const target = next === `/${role}` || next.startsWith(`/${role}/`) ? next : ROLE_INFO[role].home
  const session: Session = role === "ambassador" ? { role, ambassadorKind: ambassadorKind ?? "chapter-lead" } : { role }
  return redirect(target, { headers: { "Set-Cookie": await sessionCookie.serialize(session) } })
}

export async function logout() {
  return redirect("/", { headers: { "Set-Cookie": await sessionCookie.serialize("", { maxAge: 0 }) } })
}
