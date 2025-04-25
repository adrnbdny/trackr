import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Public paths that don't require authentication
  const publicPaths = ["/login"]
  const isPublicPath = publicPaths.includes(req.nextUrl.pathname)

  // Auth callback paths should always be accessible
  const isAuthCallbackPath = req.nextUrl.pathname.startsWith("/auth/callback")

  // Static assets should always be accessible
  const isStaticAsset = req.nextUrl.pathname.startsWith("/_next") || req.nextUrl.pathname.startsWith("/favicon.ico")

  // If no session and trying to access a protected route, redirect to login
  if (!session && !isPublicPath && !isAuthCallbackPath && !isStaticAsset) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/login"
    return NextResponse.redirect(redirectUrl)
  }

  // If session and on login page, redirect to home
  if (session && isPublicPath) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/"
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
