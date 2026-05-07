import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role

  // Protect /admin routes
  if (nextUrl.pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', nextUrl))
    }
    if (role !== 'admin_dinas' && role !== 'super_admin') {
      return NextResponse.redirect(new URL('/mitra/dashboard', nextUrl))
    }
  }

  // Protect /mitra routes
  if (nextUrl.pathname.startsWith('/mitra')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', nextUrl))
    }
    if (role !== 'mitra') {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl))
    }
  }

  // Redirect /login if already logged in
  if (nextUrl.pathname === '/login') {
    if (isLoggedIn) {
      if (role === 'mitra') return NextResponse.redirect(new URL('/mitra/dashboard', nextUrl))
      if (role === 'admin_dinas' || role === 'super_admin') return NextResponse.redirect(new URL('/admin/dashboard', nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
