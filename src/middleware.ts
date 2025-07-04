import { NextResponse } from 'next/server'

export function middleware() {
  const res = NextResponse.next()
  res.headers.set('X-Frame-Options', 'SAMEORIGIN')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'same-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=()')
  return res
} 