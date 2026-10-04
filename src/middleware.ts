import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const publicPaths = ['/', '/login', '/register', '/auth/callback', '/forgot-password', '/terms', '/privacy', '/enterprise']
const protectedPaths = ['/profile', '/dashboard', '/onboarding', '/settings', '/messages', '/connections']
const requiresOnboarding = ['/dashboard', '/profile', '/settings', '/messages', '/connections']

const matches = (list: string[], pathname: string) =>
  list.some((p) => pathname === p || pathname.startsWith(p + '/'))

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Resposta base; o Supabase pode renovar os cookies de sessão nela
  let response = NextResponse.next({ request: { headers: request.headers } })

  // IMPORTANTE: o client precisa ler/escrever cookies da REQUEST/RESPONSE do middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // getUser() valida o token no servidor do Supabase (getSession() só lê o cookie)
  const { data: { user } } = await supabase.auth.getUser()

  const isPublicPath = matches(publicPaths, pathname)
  const isProtectedPath = matches(protectedPaths, pathname)

  // Sem login em rota protegida -> /login
  if (isProtectedPath && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Só consulta o perfil quando realmente precisa
  const needsProfile =
    !!user &&
    (pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/onboarding' ||
      matches(requiresOnboarding, pathname))

  if (needsProfile && user) {
    // maybeSingle(): não dá erro quando o perfil ainda não existe
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if ((pathname === '/login' || pathname === '/register') && profile) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if ((pathname === '/login' || pathname === '/register') && !profile) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    if (pathname === '/onboarding' && profile) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (matches(requiresOnboarding, pathname) && !profile) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  if (!isPublicPath && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|api|icons|manifest.json).*)'],
}
