import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookies = request.cookies.getAll()
          return cookies
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            // Ensure cookies are set with proper options for Next.js
            response.cookies.set(name, value, {
              ...options,
              path: options?.path || '/',
              sameSite: options?.sameSite || 'lax',
              httpOnly: options?.httpOnly ?? false,
            })
          })
        },
      },
    }
  )

  const { pathname } = request.nextUrl

  // Try to get user directly - getSession might not work if cookie format is wrong
  // Supabase SSR should handle cookie parsing internally
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  
  // Only call getSession if getUser fails, to try to refresh
  let session = null
  if (userError && userError.message === 'Auth session missing!') {
    const { data: { session: sessionData } } = await supabase.auth.getSession()
    session = sessionData
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register']
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicRoute && pathname !== '/') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (user && isPublicRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

