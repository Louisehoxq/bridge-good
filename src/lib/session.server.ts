import { createCookie, redirect } from "react-router"
import { isRole, ROLE_INFO, SESSION_COOKIE, type Role } from "@/lib/roles"

/**
 * DEMO session: the signed-in role lives in a cookie. There is no password and no account, so this is
 * not real authentication. It only decides which role area a visitor sees.
 */
const sessionCookie = createCookie(SESSION_COOKIE, {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30,
})

export async function getSessionRole(request: Request): Promise<Role | null> {
  const value = await sessionCookie.parse(request.headers.get("Cookie"))
  return isRole(value) ? value : null
}

/** Role-area guard: send visitors without the matching demo role to /login, remembering where they were going. */
export async function requireRole(request: Request, role: Role) {
  if ((await getSessionRole(request)) === role) return
  const { pathname } = new URL(request.url)
  throw redirect(`/login?next=${encodeURIComponent(pathname)}`)
}

/** Demo login: no password, just the chosen synthetic account's role. */
export async function loginAs(role: Role, next: string) {
  // Only follow `next` into the chosen role's own area, so it can't send anyone off-site.
  const target = next === `/${role}` || next.startsWith(`/${role}/`) ? next : ROLE_INFO[role].home
  return redirect(target, { headers: { "Set-Cookie": await sessionCookie.serialize(role) } })
}

export async function logout() {
  return redirect("/", { headers: { "Set-Cookie": await sessionCookie.serialize("", { maxAge: 0 }) } })
}
