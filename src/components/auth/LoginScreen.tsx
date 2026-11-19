import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Database,
  ArrowRight,
  ShieldCheck,
  Zap,
  Terminal,
} from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { soundService } from '../../services/sound/sound-effects';

export const LoginScreen: React.FC = () => {
  const { login } = useUserStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved credentials if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('queryquest_user_username');
      const savedEmail = localStorage.getItem('queryquest_user_email');
      if (savedUser) setUsername(savedUser);
      if (savedEmail) setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Backend validation runs inside useUserStore.login
      await login(username, email, password);
      soundService.playSuccessChime();

      if (rememberMe && typeof window !== 'undefined') {
        localStorage.setItem('queryquest_user_username', username.trim());
        localStorage.setItem('queryquest_user_email', email.trim());
      }
    } catch (err: unknown) {
      soundService.playErrorBuzz();
      const message = err instanceof Error ? err.message : 'Authentication failed. Please verify your credentials.';
      setErrorMessage(message);
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    soundService.playSuccessChime();
    const guestUser = `Cadet_${Math.floor(100 + Math.random() * 900)}`;
    const guestEmail = `${guestUser.toLowerCase()}@questquery.com`;
    await login(guestUser, guestEmail, 'guestPass123');
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0b1a] text-slate-100 font-sans p-3 sm:p-6 select-none">
      {/* Unique Ambient Glowing Atmospheric Orbs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-violet-600/30 via-indigo-600/20 to-transparent blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-36 -right-36 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-teal-500/25 via-emerald-500/15 to-transparent blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-gradient-to-r from-fuchsia-600/10 via-purple-700/10 to-cyan-500/10 blur-[150px] pointer-events-none" />

      {/* Cyber Grid Decorative Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(168, 85, 247, 0.4) 1px, transparent 1px), linear-gradient(to right, rgba(20, 184, 166, 0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px, 64px 64px',
        }}
      />

      {/* Floating Background SQL Decorators */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden text-[11px] font-mono tracking-widest text-violet-400/10 uppercase select-none hidden lg:block">
        <span className="absolute top-[8%] left-[6%] animate-pulse">SELECT * FROM universe;</span>
        <span className="absolute top-[14%] right-[8%]">JOIN knowledge ON brain.id = data.ref</span>
        <span className="absolute bottom-[10%] left-[8%]">BEGIN TRANSACTION; COMMIT;</span>
        <span className="absolute bottom-[16%] right-[6%] animate-pulse">WHERE status = 'Active'</span>
      </div>

      {/* Main Wide & Short Glassmorphism Terminal Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[96vh] overflow-y-auto sm:overflow-visible">
        {/* Shimmer Border Container */}
        <div className="relative rounded-2xl md:rounded-3xl p-[1px] bg-gradient-to-r from-teal-400/40 via-violet-500/35 to-fuchsia-500/25 shadow-[0_0_70px_-15px_rgba(124,58,237,0.35)]">
          <div className="rounded-2xl md:rounded-3xl backdrop-blur-2xl bg-[#0f1128]/95 p-4 sm:p-6 md:p-7 border border-white/5 relative overflow-hidden">
            {/* Top Glowing Edge Light */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-7 items-center">
              {/* Left Column: Brand & Terminal Mode & Quick Play */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-4 md:border-r border-violet-500/20 md:pr-6">
                {/* Brand Header */}
                <div className="flex items-center gap-3">
                  <div className="relative group flex-shrink-0">
                    <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-violet-600 opacity-70 blur group-hover:opacity-100 transition duration-300" />
                    <div className="relative w-12 h-12 rounded-xl bg-[#16183c] border border-violet-400/30 flex items-center justify-center p-2 shadow-inner">
                      <img
                        src="/logo.png"
                        alt="Quest Query Emblem"
                        className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-violet-300 bg-clip-text text-transparent">
                        Quest Query
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                        v2.0
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
                      Relational SQL simulation terminal
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-mono text-violet-300 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>GATEWAY // READY FOR CADET</span>
                </div>

                {/* Mode Switcher */}
                <div className="grid grid-cols-2 p-1 rounded-xl bg-[#090a18]/70 border border-violet-500/20 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      mode === 'login'
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage(null);
                    }}
                    className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      mode === 'register'
                        ? 'bg-gradient-to-r from-violet-500/25 to-fuchsia-500/25 text-violet-300 border border-violet-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>New Cadet</span>
                  </button>
                </div>

                {/* Feature Highlights Card */}
                <div className="space-y-1.5 text-[11px] text-slate-400 bg-[#090a18]/50 p-2.5 rounded-xl border border-violet-500/10">
                  <div className="flex items-center gap-2 text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>In-Browser SQLite WASM engine</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Database className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>7 enterprise worlds • 52 scenario missions</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>0ms local latency • Offline persistence</span>
                  </div>
                </div>

                {/* Guest Quick Access Button */}
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-violet-950/40 hover:bg-violet-900/50 border border-violet-500/30 hover:border-violet-400/50 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99]"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Continue as Guest Cadet (1-Click Test Drive)</span>
                </button>
              </div>

              {/* Right Column: Clean Form Fields with Backend Validation */}
              <div className="md:col-span-7 flex flex-col justify-center">
                {/* Mode Heading */}
                <div className="mb-3">
                  <h2 className="text-sm sm:text-base font-bold text-slate-200">
                    {mode === 'login' ? 'Cadet Authentication' : 'Cadet Registration'}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {mode === 'login'
                      ? 'Enter your credentials to launch your SQL mission terminal.'
                      : 'Enroll your call sign and start your relational database journey.'}
                  </p>
                </div>

                {/* Error Alert Displaying Backend Validation Result */}
                {errorMessage && (
                  <div className="mb-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-200 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{errorMessage}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Username Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      User Name <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. alex_chen"
                        className="w-full pl-9 pr-4 py-2 bg-[#080918]/80 border border-violet-500/25 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mail ID <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="cadet@questquery.com"
                        className="w-full pl-9 pr-4 py-2 bg-[#080918]/80 border border-violet-500/25 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-10 py-2 bg-[#080918]/80 border border-violet-500/25 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Controls Row: Remember Me & Offline Tag */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded bg-[#080918] border-violet-500/40 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-0 focus:ring-1"
                      />
                      <span className="text-slate-300 font-medium text-[11px]">Remember call sign</span>
                    </label>
                    <span className="text-[10px] text-teal-400/90 font-mono">Offline local storage</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                  >
                    <span>{mode === 'login' ? 'Launch Terminal Session' : 'Create Cadet Profile & Enter'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
