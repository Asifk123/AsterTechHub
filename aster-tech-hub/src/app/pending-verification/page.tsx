"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PendingVerification() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-6 py-20 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-primary/20 animate-pulse">
            <span className="material-symbols-outlined text-primary text-4xl">hourglass_empty</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-headline font-black mb-4 tracking-tight leading-tight">
            Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Verification</span> Pending
          </h1>
          
          <p className="text-on-surface-variant text-base mb-8 leading-relaxed">
            Welcome to Aster Tech Hub! Your account has been created successfully, but it requires manual verification by our Admin team to ensure platform security.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-start gap-4 text-left">
              <span className="material-symbols-outlined text-primary shrink-0">info</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Verification usually takes <span className="text-on-surface font-bold">2-12 hours</span>. You will receive an email once your access is granted.
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300 font-headline tracking-widest uppercase text-xs"
            >
              Refresh Status
            </button>

            <button
              onClick={handleSignOut}
              className="w-full py-4 bg-white/5 border border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/10 font-headline font-bold rounded-xl transition-all duration-300 text-xs uppercase tracking-widest"
            >
              Sign Out
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-white/5">
            <p className="text-xs text-on-surface-variant mb-4 italic">Need urgent access?</p>
            <Link 
              href="/consultation" 
              className="text-primary hover:underline font-headline font-bold text-sm"
            >
              Contact Support
            </Link>
          </div>
        </div>
        
        <p className="mt-8 text-[10px] text-on-surface-variant/40 uppercase tracking-[0.4em] font-headline">
          Aster Tech Hub © 2025 | Secure Node
        </p>
      </div>
    </div>
  );
}
