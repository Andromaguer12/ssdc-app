import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const uid = req.cookies.get("auth");
  const accessToken = req.cookies.get("accessToken");

  if (!accessToken && !uid && req.nextUrl.pathname.startsWith('/admin')) {    
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
