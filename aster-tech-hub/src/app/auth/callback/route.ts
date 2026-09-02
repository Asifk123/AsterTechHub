import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin
  const code = requestUrl.searchParams.get('code')
  const error_description = requestUrl.searchParams.get('error_description')
  const next = requestUrl.searchParams.get('next') ?? '/admin'

  if (error_description) {
    console.error("OAuth Provider error:", error_description)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error_description)}`)
  }

  if (code) {
    try {
      const cookieStore = await cookies()
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                )
              } catch (err) {
                // Ignore in server components
              }
            },
          },
        }
      )
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && data?.session?.user) {
        const user = data.session.user
        const EXECUTIVE_EMAILS = ['samasif582@gmail.com', 'k19107673@gmail.com', 'budensi45@gmail.com', 'manjunathn2212@gmail.com']
        const target = (user?.email && EXECUTIVE_EMAILS.includes(user.email.toLowerCase())) ? '/admin' : next
        return NextResponse.redirect(`${origin}${target}`)
      } else if (error) {
        console.error("Auth exchangeCodeForSession error:", error)
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
      }
    } catch (err: any) {
      console.error("Unhandled auth callback error:", err)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(err?.message || 'auth_callback_failed')}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=missing_auth_code`)
}
