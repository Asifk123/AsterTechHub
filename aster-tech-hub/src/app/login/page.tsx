"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Fetch role from profiles to redirect correctly
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        const role = (profile?.role || '').toUpperCase();
        
        if (['ADMIN', 'CEO', 'MD', 'OD'].includes(role)) {
          router.push("/admin");
        } else if (role === 'TEAM') {
          router.push("/team");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Error connecting to Google");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-20">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      {/* Header badge + heading */}
      <div className="relative z-10 text-center mb-8 w-full max-w-md px-2">
        <div className="inline-block px-4 py-1 mb-4 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-headline tracking-widest uppercase">
          Welcome Back
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black tracking-tight mb-3 leading-tight">
          Sign In to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Your Account
          </span>
        </h1>
        <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
          Access your dashboard and manage your projects.
        </p>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-panel rounded-2xl border border-white/10 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-error/10 border border-error/20 text-error text-sm rounded-lg mb-4 text-center">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-headline mb-2 text-on-surface uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                className="w-full p-4 rounded-xl bg-surface-container-low border border-white/5 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-sm"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-xs font-headline mb-2 text-on-surface uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full p-4 pr-12 rounded-xl bg-surface-container-low border border-white/5 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-sm">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-surface-container-low accent-primary focus:outline-none"
                />
                <span className="text-sm text-on-surface-variant">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-[0_0_25px_rgba(0,212,255,0.3)] hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,212,255,0.5)] transition-all duration-300 font-headline tracking-wider uppercase text-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-on-surface-variant uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Button */}
          <button 
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-3 px-4 rounded-xl bg-surface-container-low border border-white/5 text-on-surface hover:bg-surface-container-high hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3 text-sm font-headline"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-on-surface-variant text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:text-primary/80 transition-colors font-headline font-bold">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

