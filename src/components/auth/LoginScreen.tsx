import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
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

  // Validation rules
  const isUsernameValid = username.trim().length >= 3;
  const hasAt = email.includes('@');
  const hasDotCom = email.toLowerCase().includes('.com');
  const isEmailValid = hasAt && hasDotCom;
  const isPasswordValid = password.length >= 6;

  // Real-time email validation status text
  const getEmailFeedback = () => {
    if (!email) {
      return {
        text: "Must include '@' and '.com'",
        status: 'idle',
      };
    }
    if (!hasAt && !hasDotCom) {
      return {
        text: "Missing '@' and '.com'",
        status: 'error',
      };
    }
    if (!hasAt) {
      return {
        text: "Missing '@' in email",
        status: 'error',
      };
    }
    if (!hasDotCom) {
      return {
        text: "Missing '.com' domain suffix",
        status: 'error',
      };
    }
    return {
      text: "Verified email (contains '@' and '.com')",
      status: 'success',
    };
  };

  const emailFeedback = getEmailFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate Username
    if (!isUsernameValid) {
      setErrorMessage('Username must be at least 3 characters long.');
      soundService.playErrorBuzz();
      return;
    }

    // Validate Email strictly checking @ and .com
    if (!isEmailValid) {
      if (!hasAt && !hasDotCom) {
        setErrorMessage("Email must contain both '@' and '.com'.");
      } else if (!hasAt) {
        setErrorMessage("Email format error: missing '@' symbol.");
      } else {
        setErrorMessage("Email format error: missing '.com' domain ending.");
      }
      soundService.playErrorBuzz();
      return;
    }

    // Validate Password
    if (!isPasswordValid) {
      setErrorMessage('Password must be at least 6 characters.');
      soundService.playErrorBuzz();
      return;
    }

    setIsSubmitting(true);
    soundService.playSuccessChime();

    try {
      if (rememberMe && typeof window !== 'undefined') {
        localStorage.setItem('queryquest_user_username', username.trim());
        localStorage.setItem('queryquest_user_email', email.trim());
      }
      await login(username, email, password);
    } catch (err) {
      setErrorMessage('Failed to initialize session. Please try again.');
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0b1a] text-slate-100 font-sans px-4 py-8 select-none">
      {/* Unique Ambient Glowing Atmospheric Orbs */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-violet-600/35 via-indigo-600/20 to-transparent blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-36 -right-36 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-teal-500/30 via-emerald-500/20 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-fuchsia-600/10 via-purple-700/15 to-cyan-500/10 blur-[160px] pointer-events-none" />

      {/* Cyber Grid Decorative Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.14]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(168, 85, 247, 0.4) 1px, transparent 1px), linear-gradient(to right, rgba(20, 184, 166, 0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px, 64px 64px',
        }}
      />

      {/* Floating SQL Keywords in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden text-[11px] font-mono tracking-widest text-violet-400/10 uppercase select-none">
        <span className="absolute top-[12%] left-[8%] animate-pulse">SELECT * FROM universe;</span>
        <span className="absolute top-[22%] right-[12%]">JOIN knowledge ON brain.id = data.ref</span>
        <span className="absolute bottom-[18%] left-[10%]">BEGIN TRANSACTION; COMMIT;</span>
        <span className="absolute bottom-[28%] right-[8%] animate-pulse">WHERE status = 'Active'</span>
        <span className="absolute top-[48%] left-[4%]">GROUP BY mission_id HAVING xp &gt; 100</span>
      </div>

      {/* Main Glassmorphism Terminal Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Shimmer Border Container */}
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-teal-400/40 via-violet-500/30 to-fuchsia-500/20 shadow-[0_0_80px_-20px_rgba(124,58,237,0.4)]">
          <div className="rounded-3xl backdrop-blur-2xl bg-[#0f1128]/85 p-6 sm:p-9 border border-white/5 relative overflow-hidden">
            {/* Top Glowing Edge Light */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

            {/* Brand Logo and Title */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-3 group">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-violet-600 opacity-70 blur-md group-hover:opacity-100 transition duration-300" />
                <div className="relative w-16 h-16 rounded-2xl bg-[#16183c] border border-violet-400/30 flex items-center justify-center p-2.5 shadow-inner">
                  <img
                    src="/logo.png"
                    alt="Quest Query Emblem"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-violet-300 bg-clip-text text-transparent">
                  Quest Query
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 tracking-wider uppercase">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Real-world relational database simulation engine
              </p>

              {/* Status Indicator Pill */}
              <div className="inline-flex items-center gap-1.5 mt-2.5 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[11px] font-mono text-violet-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>TERMINAL GATEWAY // READY</span>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#090a18]/70 border border-violet-500/20 mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
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
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'register'
                    ? 'bg-gradient-to-r from-violet-500/25 to-fuchsia-500/25 text-violet-300 border border-violet-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Cadet</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-200 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login / Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  User Name <span className="text-emerald-400">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. alex_chen"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#080918]/80 border border-violet-500/25 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all font-medium"
                  />
                  {username.length >= 3 && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-1 px-1 text-[11px] text-slate-500">
                  <span>Min 3 characters</span>
                  {username.length > 0 && username.length < 3 && (
                    <span className="text-amber-400 text-[10px]">Too short</span>
                  )}
                </div>
              </div>

              {/* Email Field with Strict @ and .com Validation */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Mail ID <span className="text-emerald-400">*</span>
                  </label>
                  {/* Status Indicator */}
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors ${
                      emailFeedback.status === 'success'
                        ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20'
                        : emailFeedback.status === 'error'
                        ? 'text-amber-300 bg-amber-500/10 border border-amber-500/20'
                        : 'text-slate-400'
                    }`}
                  >
                    {emailFeedback.text}
                  </span>
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cadet@questquery.com"
                    className={`w-full pl-10 pr-10 py-2.5 bg-[#080918]/80 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all font-medium ${
                      isEmailValid
                        ? 'border-emerald-500/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                        : email.length > 0
                        ? 'border-amber-500/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                        : 'border-violet-500/25 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                    }`}
                  />
                  {isEmailValid ? (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : email.length > 0 ? (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-amber-400">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  ) : null}
                </div>

                {/* Micro Helper Tags */}
                <div className="flex items-center gap-2 mt-1.5 px-1">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono flex items-center gap-1 ${
                      hasAt
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {hasAt ? '✓' : '○'} includes '@'
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono flex items-center gap-1 ${
                      hasDotCom
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {hasDotCom ? '✓' : '○'} ends with '.com'
                  </span>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password <span className="text-emerald-400">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#080918]/80 border border-violet-500/25 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-between items-center mt-1 px-1 text-[11px] text-slate-500">
                  <span>Min 6 characters</span>
                  {password.length > 0 && (
                    <span
                      className={`text-[10px] font-semibold ${
                        password.length >= 8
                          ? 'text-emerald-400'
                          : password.length >= 6
                          ? 'text-teal-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {password.length >= 8 ? 'Strong' : password.length >= 6 ? 'Adequate' : 'Short'}
                    </span>
                  )}
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#080918] border-violet-500/40 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-0 focus:ring-1"
                  />
                  <span className="text-xs text-slate-300 font-medium">Remember call sign</span>
                </label>
                <span className="text-[11px] text-teal-400 hover:underline cursor-pointer">
                  Local offline storage
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                <span>{mode === 'login' ? 'Launch Terminal Session' : 'Create Cadet Profile & Enter'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-violet-500/20" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                <span className="bg-[#0f1128] px-3 text-slate-400">or instant access</span>
              </div>
            </div>

            {/* Guest Quick Play Button */}
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-violet-950/40 hover:bg-violet-900/50 border border-violet-500/30 hover:border-violet-400/50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Continue as Guest Cadet (1-Click Test Drive)</span>
            </button>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="mt-5 flex items-center justify-center gap-5 text-slate-400 text-xs">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SQLite Offline WASM</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>7 Enterprise Worlds</span>
          </div>
        </div>
      </div>
    </div>
  );
};
