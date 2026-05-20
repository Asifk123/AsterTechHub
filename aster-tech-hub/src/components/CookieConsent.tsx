'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * CookieConsent Component
 * Respects user privacy by persisting choices in localStorage.
 */
export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShouldRender(true);
      // Delay showing the popup for a smoother experience
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    setTimeout(() => setShouldRender(false), 500);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
    setTimeout(() => setShouldRender(false), 500);
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto w-auto md:max-w-[420px] z-[10000] transition-all duration-1000 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <div className="glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative overflow-hidden group">
        
        {/* Animated background glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[60px] animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/10 rounded-full blur-[60px]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10 shadow-inner">
              <span className="material-symbols-outlined text-primary text-2xl">security</span>
            </div>
            <div>
              <h3 className="font-headline font-black text-xl tracking-tight text-on-surface">Privacy Choice</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Cookies & Privacy</p>
            </div>
          </div>
          
          <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
            We use cookies to improve your experience. You can choose to accept all cookies for the best experience or reject non-essential ones. Read our{' '}
            <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors font-bold underline decoration-primary/30 underline-offset-4">Privacy Policy</Link>.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleAccept}
              className="group relative flex items-center justify-center py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-black rounded-xl text-xs uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">Accept All</span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={handleReject}
              className="flex items-center justify-center py-4 bg-white/5 border border-white/10 text-on-surface font-headline font-black rounded-xl text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95"
            >
              Reject All
            </button>
          </div>
          
          <p className="text-[9px] text-center mt-6 text-on-surface-variant/50 uppercase tracking-[0.3em] font-medium">
            Your Privacy, Your Control
          </p>
        </div>
      </div>
    </div>
  );
}




