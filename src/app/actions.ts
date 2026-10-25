"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { isRole, ROLE_INFO, SESSION_COOKIE } from "@/lib/roles"

/** Demo login: no password, just the chosen synthetic account's role. */
export async function loginAs(formData: FormData) {
  const role = formData.get("role")
  if (!isRole(role)) return
  const store = await cookies()
  store.set(SESSION_COOKIE, role, { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" })
  const next = String(formData.get("next") ?? "")
  redirect(next.startsWith(`/${role}`) ? next : ROLE_INFO[role].home)
}

export async function logout() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  redirect("/")
}
