import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Create the response and then manually set cookies on it from the store
      const response = NextResponse.redirect(`${origin}${next}`)
      
      // Copy all supabase cookies from the store to the response
      const allCookies = cookieStore.getAll()
      allCookies.forEach((cookie) => {
        if (cookie.name.includes('auth-token') || cookie.name.includes('supabase')) {
          response.cookies.set({
            name: cookie.name,
            value: cookie.value,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          })
        }
      })

      return response
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
