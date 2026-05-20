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
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Check Session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          // Not logged in
          if (pathname !== '/login' && pathname !== '/signup') {
            router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
          }
          setIsLoading(false);
          return;
        }

        // HARDCODED BYPASS & SELF-HEALING FOR CEO
        if (session.user.email === 'samasif582@gmail.com') {
          try {
            // Self-heal profile record in database to satisfy all RLS conditions
            const { data: dbProfile, error: dbError } = await supabase
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
            return;
          }
          setAuthorized(true);
          setIsLoading(false);
          return;
        }

        // 2. Check Profile Status & Role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, status')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Database Error:', profileError);
          // Don't redirect yet, let's see if we can still authorize
        }

        const status = profile?.status;
        const role = (profile?.role || 'guest').toUpperCase();
        // Supreme Admin check for CEO, MD, OD and Generic Admin (Case-Insensitive)
        const isAdminOrExecutive = ['ADMIN', 'CEO', 'MD', 'OD'].includes(role);
        const isTeam = role === 'TEAM';

        // 3. Handle Redirections based on Status
        if (status === 'pending' && pathname !== '/pending') {
          router.replace('/pending');
          return;
        }

        if (status === 'rejected') {
          router.replace('/login?error=Access Rejected');
          return;
        }

        // 4. Handle Admin Requirement (Strictly protect /admin)
        if (requireAdmin && !isAdminOrExecutive) {
          router.replace('/dashboard');
          return;
        }

        // 4b. Handle Team Requirement (Strictly protect /team)
        if (requireTeam && !isTeam && !isAdminOrExecutive) {
          router.replace('/dashboard');
          return;
        }

        // 5. If Executive is on standard dashboard, send to Admin Hub
        if (!requireAdmin && !requireTeam && isAdminOrExecutive && pathname === '/dashboard') {
          router.replace('/admin');
          return;
        }

        // 5b. If Team is on standard dashboard, send to Team Workspace
        if (!requireAdmin && !requireTeam && isTeam && pathname === '/dashboard') {
          router.replace('/team');
          return;
        }

        // All checks passed
        setAuthorized(true);
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname, requireAdmin]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[9999]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground animate-pulse font-medium">Verifying Credentials...</p>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
