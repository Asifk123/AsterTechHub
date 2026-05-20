'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      setMessage(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (error) throw error;

      setMessage({
        text: 'A secure password recovery link has been sent to your email address.',
        type: 'success',
      });
    } catch (error: any) {
      console.error('Password reset request failed:', error);
      setMessage({
        text: error.message || 'Failed to send recovery email. Please check your spelling.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-on-surface flex items-center justify-center px-4 relative overflow-hidden font-body">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-[120px] pointer-events-none animate-pulse"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/5 shadow-[0_0_50px_rgba(0,212,255,0.05)] transform transition-all animate-in fade-in duration-500 relative">
        {/* Decorative top pulse line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        <div className="text-center mb-8">
          <Link href="/" className="inline-block font-headline font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
            ASTER TECH HUB
          </Link>
          <h2 className="text-xl font-headline font-bold mb-2">Password Recovery</h2>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Enter your registered email address below, and we will send you a secure link to reset your password.
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl border mb-6 text-xs flex items-start gap-3 animate-in fade-in duration-300 ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <span className="material-symbols-outlined shrink-0 text-sm">
              {message.type === 'success' ? 'check_circle' : 'warning'}
            </span>
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block text-[10px] font-headline font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
              Email Address
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all text-sm"
              placeholder="name@company.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-[0_0_25px_rgba(0,212,255,0.3)] hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,212,255,0.5)] transition-all duration-300 font-headline tracking-wider uppercase text-center text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Send Recovery Link'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <Link href="/login" className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
