import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow access to login page
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // For all other admin routes, check authentication
    // Note: In a real app, you'd check server-side session/JWT
    // For this demo, we'll let the client-side handle redirects
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
