'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireTeam?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false, requireTeam = false }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isTakingLong, setIsTakingLong] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;
    let hasSession = false;

    const progressTimeout = setTimeout(() => {
      if (isMounted) setIsTakingLong(true);
    }, 3000);

    // Safety timeout: Guarantee that the loader is dismissed after 8 seconds and redirect to login
    const safetyTimeout = setTimeout(() => {
      if (!isMounted) return;
      console.warn("Auth check safety timeout triggered. Redirecting to login...");
      if (pathname !== '/login' && pathname !== '/signup') {
        router.replace(`/login?error=timeout&returnUrl=${encodeURIComponent(pathname)}`);
      } else {
        setIsLoading(false);
      }
    }, 8000);

    const checkAuth = async () => {
      try {
        // 1. Fetch Session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (sessionError || !session) {
          console.log("No session returned from getSession");
          if (pathname !== '/login' && pathname !== '/signup') {
            router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
          }
          setIsLoading(false);
          clearTimeout(progressTimeout);
          clearTimeout(safetyTimeout);
          return;
        }

        hasSession = true;

        // HARDCODED BYPASS & SELF-HEALING FOR CEO
        if (session.user.email === 'samasif582@gmail.com') {
          try {
            // Self-heal profile record in database to satisfy all RLS conditions
            const { data: dbProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (!dbProfile) {
              // Profile record missing for this specific user ID, insert it
              await supabase.from('profiles').insert([{
                id: session.user.id,
                full_name: 'Asif K',
                email: 'samasif582@gmail.com',
                role: 'ADMIN',
                status: 'approved'
              }]);
            } else if (dbProfile.role !== 'ADMIN' && dbProfile.role !== 'CEO') {
              // Correct mismatch or case constraints
              await supabase
                .from('profiles')
                .update({ role: 'ADMIN', email: 'samasif582@gmail.com' })
                .eq('id', session.user.id);
            }
          } catch (err) {
            console.error('CEO profile self-healing failed:', err);
          }

          if (!requireAdmin && !requireTeam && pathname === '/dashboard') {
            router.replace('/admin');
            clearTimeout(progressTimeout);
            clearTimeout(safetyTimeout);
            return;
          }
          setAuthorized(true);
          setIsLoading(false);
          clearTimeout(progressTimeout);
          clearTimeout(safetyTimeout);
          return;
        }

        // 2. Check Profile Status & Role
        let { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, status')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          try {
            console.log("Profile record missing. Attempting self-healing insert for new signup...");
            const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'New User';
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert([{
                id: session.user.id,
                full_name: fullName,
                email: session.user.email,
                role: 'client',
                status: 'pending'
              }])
              .select('role, status')
              .single();

            if (insertError) {
              console.error("Self-healing profile insert failed:", insertError);
            } else if (newProfile) {
              profile = newProfile;
              profileError = null;
              console.log("Self-healed profile successfully created:", profile);
            }
          } catch (insertErr) {
            console.error("Crash during self-healing profile insert:", insertErr);
          }
        }

        if (!isMounted) return;

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Database Error when fetching profile:', profileError);
        }

        if (!profile) {
          throw new Error("User profile not found");
        }

        const status = profile.status;
        const role = (profile.role || 'guest').toUpperCase();
        
        // Supreme Admin check for CEO, MD, OD and Generic Admin (Case-Insensitive)
        const isAdminOrExecutive = ['ADMIN', 'CEO', 'MD', 'OD'].includes(role);
        const isTeam = role === 'TEAM';

        // 3. Handle Redirections based on Status
        if (status === 'pending' && pathname !== '/pending') {
          router.replace('/pending');
          setIsLoading(false);
          clearTimeout(progressTimeout);
          clearTimeout(safetyTimeout);
          return;
        }

        if (status === 'rejected') {
          router.replace('/login?error=Access Rejected');
          setIsLoading(false);
          clearTimeout(progressTimeout);
          clearTimeout(safetyTimeout);
          return;
        }

        // 4. Handle Admin Requirement (Strictly protect /admin)
        if (requireAdmin && !isAdminOrExecutive) {
          router.replace('/dashboard');
          setIsLoading(false);
          clearTimeout(progressTimeout);
          clearTimeout(safetyTimeout);
          return;
        }

        // 4b. Handle Team Requirement (Strictly protect /team)
        if (requireTeam && !isTeam && !isAdminOrExecutive) {
          router.replace('/dashboard');
          setIsLoading(false);
          clearTimeout(progressTimeout);
          clearTimeout(safetyTimeout);
          return;
        }

        // 5. If Executive is on standard dashboard, send to Admin Hub
        if (!requireAdmin && !requireTeam && isAdminOrExecutive && pathname === '/dashboard') {
          router.replace('/admin');
          setIsLoading(false);
          clearTimeout(progressTimeout);
          clearTimeout(safetyTimeout);
          return;
        }

        // 5b. If Team is on standard dashboard, send to Team Workspace
        if (!requireAdmin && !requireTeam && isTeam && pathname === '/dashboard') {
          router.replace('/team');
          setIsLoading(false);
          clearTimeout(progressTimeout);
          clearTimeout(safetyTimeout);
          return;
        }

        // All checks passed
        setAuthorized(true);
        setIsLoading(false);
        clearTimeout(progressTimeout);
        clearTimeout(safetyTimeout);
      } catch (err) {
        console.error('Auth check failed:', err);
        clearTimeout(progressTimeout);
        clearTimeout(safetyTimeout);
        if (pathname !== '/login' && pathname !== '/signup') {
          router.replace(`/login?error=auth_failed&returnUrl=${encodeURIComponent(pathname)}`);
        } else {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    // 6. Listen for auth state changes to auto-handle logins and logouts
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (!isMounted) return;
      console.log(`AuthGuard observed event: ${event}`);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        checkAuth();
      } else if (event === 'SIGNED_OUT') {
        setAuthorized(false);
        setIsLoading(false);
        clearTimeout(progressTimeout);
        clearTimeout(safetyTimeout);
        if (pathname !== '/login' && pathname !== '/signup') {
          router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(progressTimeout);
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, [router, pathname, requireAdmin, requireTeam]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[9999]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground animate-pulse font-medium">Verifying Credentials...</p>
        {isTakingLong && (
          <p className="text-xs text-muted-foreground/80 mt-2 animate-pulse font-medium">
            Checking profile state, this is taking longer than usual...
          </p>
        )}
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
