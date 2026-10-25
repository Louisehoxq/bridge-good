import { NextResponse, type NextRequest } from "next/server"

// Keep in sync with SESSION_COOKIE in src/lib/roles.ts. Proxy runs separately from the app bundle.
const SESSION_COOKIE = "bgx-session"

/** Demo route guard: role areas need the matching demo session. */
export function proxy(request: NextRequest) {
  const area = request.nextUrl.pathname.split("/")[1]
  const role = request.cookies.get(SESSION_COOKIE)?.value
  if (role === area) return NextResponse.next()

  const url = new URL("/login", request.url)
  url.searchParams.set("next", request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/student/:path*", "/mentor/:path*", "/ambassador/:path*", "/partner/:path*"],
}
