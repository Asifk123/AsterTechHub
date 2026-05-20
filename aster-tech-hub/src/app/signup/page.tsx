"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        setSuccess(true);
        // We don't automatically redirect because they might need to confirm email
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  if (success) {
    return (
      <section className="relative min-h-screen flex items-center justify-center px-6 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_70%)]"></div>
        <div className="max-w-md mx-auto text-center relative z-10 glass-panel p-8 rounded-xl border border-white/5">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary text-3xl">mark_email_read</span>
          </div>
          <h1 className="text-2xl font-headline font-black mb-4">Verify Your Email</h1>
          <p className="text-on-surface-variant mb-8 leading-relaxed">
            We've sent a verification link to <span className="text-primary font-bold">{formData.email}</span>. 
            Please check your inbox to complete your registration.
          </p>
          <Link 
            href="/login" 
            className="inline-block px-8 py-3 bg-primary text-on-primary rounded-lg font-headline font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
          >
            Go to Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[300px] flex items-center justify-center px-6 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_70%)]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1 mb-4 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-headline tracking-widest uppercase">
            Join Us
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tight mb-4 leading-tight">
            Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Account</span>
          </h1>
          <p className="text-on-surface-variant text-base max-w-2xl mx-auto leading-relaxed">
            Start your journey with Aster Tech today.
          </p>
        </div>
      </section>

      {/* Signup Form */}
      <section className="py-16 px-6 pb-32">
        <div className="max-w-md mx-auto">
          <div className="glass-panel rounded-xl border border-white/5 p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 bg-error/10 border border-error/20 text-error text-sm rounded-lg mb-4">
                  {error}
                </div>
              )}
              
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-headline mb-2 text-on-surface">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full p-4 rounded-lg bg-surface-container-low border border-white/5 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-headline mb-2 text-on-surface">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  className="w-full p-4 rounded-lg bg-surface-container-low border border-white/5 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-headline mb-2 text-on-surface">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="w-full p-4 pr-12 rounded-lg bg-surface-container-low border border-white/5 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:outline-none transition-colors"
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-headline mb-2 text-on-surface">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="w-full p-4 pr-12 rounded-lg bg-surface-container-low border border-white/5 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 mt-1 rounded border-white/20 bg-surface-container-low checked:bg-primary checked:border-primary focus:outline-none cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-on-surface-variant cursor-pointer">
                  I agree to the{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Terms & Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-[0_0_25px_rgba(0,212,255,0.3)] hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(0,212,255,0.4)] transition-all duration-300 font-headline tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-xs text-on-surface-variant">OR</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* Social Signup */}
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

          {/* Login Link */}
          <p className="text-center mt-8 text-on-surface-variant">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-headline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

