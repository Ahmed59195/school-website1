import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const role = (req.nextauth.token as any)?.role

    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    if (pathname.startsWith("/teacher") && !["TEACHER","ADMIN"].includes(role)) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    if (pathname.startsWith("/student") && !["STUDENT","ADMIN"].includes(role)) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    if (pathname.startsWith("/parent") && !["PARENT","ADMIN"].includes(role)) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    return NextResponse.next()
  },
  { callbacks: { authorized: ({ token }) => !!token } }
)

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*", "/parent/:path*"],
}
