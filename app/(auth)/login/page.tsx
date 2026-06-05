'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Mail, Shield, Compass, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
      setIsSuccess(false);
    } else {
      setMessage('A secure login link has been sent to your email.');
      setIsSuccess(true);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7f9] text-[#1e293b]">
      {/* Centered Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[580px]">
          {/* Left panel - Dark Teal Branding */}
          <div className="md:w-1/2 bg-[#023d4c] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#012631] via-[#023d4c] to-[#045265] opacity-90 z-0"></div>
            
            <div className="relative z-10 flex items-center gap-2">
              <Compass className="h-6 w-6 text-emerald-400" />
              <span className="text-sm font-bold tracking-wider uppercase text-emerald-300">The Academic Architect</span>
            </div>

            <div className="relative z-10 my-12 space-y-6">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Curate your own brilliance.
              </h1>
              <p className="text-sm md:text-base text-gray-300 font-medium leading-relaxed max-w-md">
                Experience the next generation of learning management, designed for structural clarity and academic prestige.
              </p>
            </div>

            <div className="relative z-10 bg-[#012c37]/60 border border-white/10 rounded-2xl p-4 flex gap-4 items-start backdrop-blur-sm">
              <div className="bg-[#023d4c] p-2.5 rounded-xl border border-white/10 shrink-0 text-emerald-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-wider uppercase text-white">Enterprise Security</h4>
                <p className="text-[11px] text-gray-300 mt-1 leading-normal">
                  Multi-layer encryption and OAuth 2.0 protocols protecting structural workflows.
                </p>
              </div>
            </div>
          </div>

          {/* Right panel - Credentials and login actions */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="max-w-md w-full mx-auto space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#08333e]">Sign In</h2>
                <p className="text-xs font-medium text-gray-500 mt-2">
                  Please enter your credentials to access your dashboard.
                </p>
              </div>

              {/* Google OAuth button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-xs text-gray-700 shadow-sm"
              >
                <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.38c0,-0.68 -0.06,-1.33 -0.17,-2H21.35z" fill="#4285F4" />
                  <path d="M12,20.6c2.32,0 4.27,-0.77 5.7,-2.09l-3.3,-2.58c-0.91,0.61 -2.08,0.97 -3.3,0.97c-2.54,0 -4.69,-1.71 -5.46,-4.02H2.21v2.67C3.63,18.39 7.55,20.6 12,20.6z" fill="#34A853" />
                  <path d="M6.54,12.88c-0.2,-0.6 -0.31,-1.24 -0.31,-1.9s0.11,-1.3 0.31,-1.9V6.41H2.21c-0.78,1.57 -1.21,3.33 -1.21,5.19s0.43,3.62 1.21,5.19L6.54,12.88z" fill="#FBBC05" />
                  <path d="M12,6.5c1.26,0 2.39,0.43 3.28,1.28l2.46,-2.46C16.27,3.94 14.32,3.17 12,3.17c-4.45,0 -8.37,2.21 -9.79,6.01l4.33,3.35c0.77,-2.31 2.92,-4.02 5.46,-4.02z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative bg-white px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Or email login
                </div>
              </div>

              {/* Login Email Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-gray-500 mb-2 uppercase">
                    Institutional Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@university.edu"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-xs font-semibold bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#023d4c] focus:border-[#023d4c] transition-all"
                      required
                    />
                    <Mail className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 text-[#023d4c] focus:ring-[#023d4c]"
                    defaultChecked
                  />
                  <label htmlFor="remember" className="text-[11px] font-semibold text-gray-500">
                    Keep me signed in for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#023d4c] text-white font-bold rounded-xl text-xs hover:bg-[#035165] focus:outline-none transition-all shadow-md shadow-[#023d4c]/10 disabled:opacity-50"
                >
                  {loading ? 'Sending OTP Link...' : 'Access Dashboard'}
                </button>
              </form>

              {message && (
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isSuccess 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                    : "bg-rose-50 border-rose-100 text-rose-800"
                }`}>
                  {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />}
                  <p className="text-xs font-semibold leading-relaxed">{message}</p>
                </div>
              )}

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500 font-semibold">
                  New to the architecture? <Link href="/pricing" className="text-[#023d4c] hover:underline font-bold">Create an Account</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding Area */}
      <footer className="w-full px-6 py-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-500 font-semibold border-t border-gray-200/50 bg-[#f4f7f9] mt-auto">
        <div className="flex items-center gap-2">
          <Compass className="h-4.5 w-4.5 text-[#023d4c]" />
          <span className="text-[#023d4c] font-bold">The Academic Architect</span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
          <Link href="/cookies" className="hover:text-gray-900 transition-colors">Cookie Policy</Link>
          <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact Us</Link>
        </div>
        <div>
          © 2026 The Academic Architect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
