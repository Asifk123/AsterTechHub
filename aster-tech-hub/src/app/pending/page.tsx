"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PendingVerification() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    let channel: any = null;

    const checkStatusAndSubscribe = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !active) return;

      // 1. Initial check just in case they were approved while the page was loading
      const { data: profile } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', user.id)
        .single();

      if (!active) return;

      if (profile?.status === 'approved') {
        router.push('/dashboard');
        return;
      }

      // 2. Listen for real-time changes
      channel = supabase
        .channel(`pending-status-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload: any) => {
            if (payload.new?.status === 'approved') {
              router.push('/dashboard');
            }
          }
        )
        .subscribe();
    };

    checkStatusAndSubscribe();

    return () => {
      active = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="max-w-md w-full glass-panel rounded-3xl p-10 border border-white/5 text-center relative z-10 shadow-2xl">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin-slow">hourglass_empty</span>
        </div>
        
        <h1 className="text-3xl font-headline font-black text-white mb-4">Verification Pending</h1>
        
        <p className="text-on-surface-variant text-sm leading-relaxed mb-10">
          Thank you for joining <span className="text-primary font-bold">Aster Tech Hub</span>. Your account is currently being reviewed by our administrative team.
          <br /><br />
          You will be granted full access once your verification is complete. Please check back shortly.
        </p>

        <div className="space-y-4">
          <Link href="/" className="block w-full py-4 bg-primary text-background rounded-xl font-headline font-bold text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-primary/20">
            Return to Homepage
          </Link>
          <button 
            onClick={handleSignOut}
            className="block w-full py-4 bg-surface-container-high text-white rounded-xl font-headline font-bold text-xs uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5">
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
            Need urgent access? <Link href="/contact" className="text-primary hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
