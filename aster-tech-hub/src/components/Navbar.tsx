'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then((res: any) => {
      const session = res.data?.session;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      // HARDCODED BYPASS FOR CEO
      if (currentUser?.email === 'samasif582@gmail.com') {
        setProfile({ role: 'CEO', status: 'approved' });
      } else if (currentUser && !profile) {
        fetchProfile(currentUser.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      // HARDCODED BYPASS FOR CEO
      if (currentUser?.email === 'samasif582@gmail.com') {
        setProfile({ role: 'CEO', status: 'approved' });
      } else if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (id: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('role').eq('id', id).single();
      if (!error) setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/projects" },
    { name: "Reviews", href: "/reviews" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/consultation" },
  ];

  const role = (profile?.role || 'guest').toUpperCase();
  const isAdmin = ['ADMIN', 'CEO', 'MD', 'OD'].includes(role);
  const isTeam = role === 'TEAM';

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/5 backdrop-blur-xl dark:bg-slate-950/40 border-b border-white/10 shadow-[0_4_30px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center w-full px-4 md:px-6 py-4 max-w-7xl mx-auto">

          {/* Logo */}
          <Link
            href="/"
            className="text-lg md:text-2xl font-black tracking-tighter font-headline bg-gradient-to-r from-[#a8e8ff] via-[#00D4FF] to-[#d9b9ff] text-transparent bg-clip-text hover:opacity-80 transition-all duration-500 z-50 relative"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Aster Tech Hub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 font-headline tracking-wide uppercase text-sm">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-slate-300 hover:text-[#00D4FF] transition-colors">
                  {link.name}
                </Link>
              ))}
              {user && (
                <div className="flex items-center gap-6 pl-6 border-l border-white/10">
                  {isAdmin ? (
                    <Link href="/admin" className="text-[#00D4FF] font-black hover:opacity-80 transition-all flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">dashboard</span> Admin Console
                    </Link>
                  ) : isTeam ? (
                    <Link href="/team" className="text-[#00D4FF] font-black hover:opacity-80 transition-all flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">group</span> Team Workspace
                    </Link>
                  ) : (
                    <Link href="/dashboard" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">home</span> Dashboard
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 z-50 relative">

            {/* Auth Button — Desktop/Tablet */}
            {user ? (
              <button
                onClick={handleSignOut}
                className="hidden sm:flex relative px-4 md:px-5 py-2 rounded-md font-headline font-bold uppercase tracking-wider text-xs md:text-sm overflow-hidden group hover:shadow-[0_0_30px_rgba(255,100,100,0.4)] hover:scale-105 transition-all duration-300"
              >
                <span className="absolute inset-0 rounded-md backdrop-blur-xl bg-white/5" />
                <span className="absolute inset-0 rounded-md bg-gradient-to-r from-error/50 to-error p-[1px]">
                  <span className="absolute inset-[1px] rounded-md bg-[#0a0a0f]/80 backdrop-blur-xl" />
                </span>
                <span className="relative z-10 text-error">
                  Sign Out
                </span>
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex relative px-4 md:px-5 py-2 rounded-md font-headline font-bold uppercase tracking-wider text-xs md:text-sm overflow-hidden group hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] hover:scale-105 transition-all duration-300"
              >
                <span className="absolute inset-0 rounded-md backdrop-blur-xl bg-white/5" />
                <span className="absolute inset-0 rounded-md bg-gradient-to-r from-[#a8e8ff] via-[#00D4FF] to-[#d9b9ff] p-[1px]">
                  <span className="absolute inset-[1px] rounded-md bg-[#0a0a0f]/80 backdrop-blur-xl" />
                </span>
                <span className="relative z-10 bg-gradient-to-r from-[#a8e8ff] to-[#d9b9ff] bg-clip-text text-transparent">
                  Sign In
                </span>
              </Link>
            )}

            {/* Hamburger Toggle */}
            <button
              className="md:hidden p-2 text-white hover:text-[#00D4FF] transition-colors focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
            >
              <span className="material-symbols-outlined text-2xl">
                menu
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-[#0a0a0f] z-50 transform transition-transform duration-500 ease-out md:hidden border-r border-white/10 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Menu Header */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-headline font-black uppercase tracking-[0.25em] text-primary">Navigation</span>
            <button
              className="p-1.5 bg-white/5 rounded-lg text-white hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col gap-4 flex-grow">
            <Link
              href="/"
              className="text-lg font-headline font-bold tracking-wide text-on-surface hover:text-primary hover:translate-x-2 transition-all duration-300 flex items-center justify-between group animate-fade-in-slide border-b border-white/5 pb-2.5"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ animationDelay: "0ms" }}
            >
              Home
              <span className="material-symbols-outlined text-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary">arrow_forward</span>
            </Link>
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-headline font-bold tracking-wide text-on-surface hover:text-primary hover:translate-x-2 transition-all duration-300 flex items-center justify-between group animate-fade-in-slide border-b border-white/5 pb-2.5"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ animationDelay: `${(i + 1) * 50}ms` }}
              >
                {link.name}
                <span className="material-symbols-outlined text-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary">arrow_forward</span>
              </Link>
            ))}
            {user && (
              <Link
                href={isAdmin ? "/admin" : isTeam ? "/team" : "/dashboard"}
                className="text-lg font-headline font-bold tracking-wide text-primary hover:text-primary/80 hover:translate-x-2 transition-all duration-300 flex items-center justify-between group animate-fade-in-slide border-b border-white/5 pb-2.5"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ animationDelay: `${(navLinks.length + 1) * 50}ms` }}
              >
                {isAdmin ? "Admin Console" : isTeam ? "Team Workspace" : "Dashboard"}
                <span className="material-symbols-outlined text-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary">arrow_forward</span>
              </Link>
            )}
          </div>

          {/* Footer of Drawer */}
          <div className="mt-auto pt-4 border-t border-white/10 space-y-4">
            {user ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="relative w-full flex justify-center px-4 py-3 rounded-lg font-headline font-bold uppercase tracking-wider text-xs overflow-hidden group hover:shadow-[0_0_20px_rgba(255,100,100,0.2)] transition-all duration-300"
              >
                <span className="absolute inset-0 bg-error/10 border border-error/20 rounded-lg" />
                <span className="relative z-10 text-error">Sign Out</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="relative w-full flex justify-center px-4 py-3 rounded-lg font-headline font-bold uppercase tracking-wider text-xs overflow-hidden group hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-lg" />
                <span className="relative z-10 text-primary">Sign In</span>
              </Link>
            )}
            <p className="text-[9px] text-on-surface-variant uppercase tracking-widest text-center opacity-50">Aster Tech Hub © 2025</p>
          </div>
        </div>
      </div>
    </>
  );
}

