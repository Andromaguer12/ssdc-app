import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server'

interface CustomCookies extends RequestCookies {
  auth: string;
}

interface NextRequestCustom extends NextRequest {
  cookies: CustomCookies
}

export function middleware(req: NextRequestCustom) {
  const accessToken = req.cookies.auth;

  if (!accessToken && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect('/login')
  }

  return NextResponse.next()
}
