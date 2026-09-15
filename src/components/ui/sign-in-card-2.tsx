'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Sparkles,
  ShieldCheck,
  Building2,
  Compass,
  Palette,
  Box,
  AlertCircle
} from 'lucide-react';
import {
  supabase,
  isSupabaseConfigured,
  signInWithGoogle,
  signUpWithEmailOTP,
  verifyEmailOTP
} from '../../utils/supabaseClient';

export type StudioRole =
  | 'Sales Lead'
  | 'Designer Team'
  | 'Project Management'
  | 'Finance Team'
  | 'Interior Designer'
  | 'Architect'
  | '3D Artist'
  | 'Homeowner';

export interface SignInCard2Props {
  onLoginSuccess?: (userEmail: string, role?: string) => void;
  onOpenForgotPassword?: () => void;
  onLaunchGuestDemo?: () => void;
  onGoogleSignIn?: () => void;
  defaultTab?: 'login' | 'signup';
}

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className, ...props }) => (
  <input
    className={cn(
      'w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-white text-xs text-[#0F1428] placeholder-slate-400 focus:outline-none focus:border-[#D64062] focus:ring-1 focus:ring-[#D64062] transition-all',
      className
    )}
    {...props}
  />
);

const ROLES: { id: StudioRole; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'Interior Designer', label: 'Interior Designer', icon: Palette },
  { id: 'Architect', label: 'Architect', icon: Building2 },
  { id: '3D Artist', label: '3D Artist', icon: Box },
  { id: 'Project Management', label: 'Project Manager', icon: ShieldCheck },
  { id: 'Finance Team', label: 'Finance Lead', icon: Building2 },
  { id: 'Sales Lead', label: 'Sales Manager', icon: User },
  { id: 'Homeowner', label: 'Homeowner', icon: Compass }
];

export function Component({
  onLoginSuccess,
  onOpenForgotPassword,
  onLaunchGuestDemo,
  onGoogleSignIn,
  defaultTab = 'login'
}: SignInCard2Props) {
  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<StudioRole>('Interior Designer');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Hardware Accelerated 3D Card Tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [4, -4]);
  const rotateY = useTransform(mouseX, [-300, 300], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;
    setAuthError(null);
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        if (tab === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email,
            password: password || 'ForynPassword123!',
            options: {
              data: {
                name: name || email.split('@')[0],
                role: selectedRole
              }
            }
          });
          if (error) {
            setAuthError(error.message);
            setIsLoading(false);
            return;
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: password || 'ForynPassword123!'
          });
          if (error) {
            setAuthError(error.message);
            setIsLoading(false);
            return;
          }
        }
      } catch (err: any) {
        setAuthError(err.message || 'Authentication failed');
        setIsLoading(false);
        return;
      }
    }

    setTimeout(() => {
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(email, selectedRole);
      }
    }, 800);
  };

  return (
    <div className="w-full relative flex items-center justify-center p-1 sm:p-2">
      {/* Background ambient light glow - Pentagram Crimson #D64062 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#D64062]/10 via-[#0F1428]/5 to-transparent pointer-events-none rounded-3xl blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
        style={{ perspective: 1200 }}
      >
        <motion.div
          className="relative transform-gpu"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative group">
            {/* Card Perimeter Traveling Light Beams */}
            <div className="absolute -inset-[1px] rounded-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-[2px] w-[60%] bg-gradient-to-r from-transparent via-[#D64062] to-transparent opacity-90 transform-gpu"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.5 }}
              />
              <motion.div
                className="absolute top-0 right-0 h-[60%] w-[2px] bg-gradient-to-b from-transparent via-[#D64062] to-transparent opacity-90 transform-gpu"
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.5, delay: 0.75 }}
              />
              <motion.div
                className="absolute bottom-0 right-0 h-[2px] w-[60%] bg-gradient-to-r from-transparent via-[#D64062] to-transparent opacity-90 transform-gpu"
                animate={{ x: ['100%', '-200%'] }}
                transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.5, delay: 1.5 }}
              />
              <motion.div
                className="absolute bottom-0 left-0 h-[60%] w-[2px] bg-gradient-to-b from-transparent via-[#D64062] to-transparent opacity-90 transform-gpu"
                animate={{ y: ['100%', '-200%'] }}
                transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.5, delay: 2.25 }}
              />
            </div>

            {/* Glassmorphism Card Container - Pure White Workspace Theme */}
            <div className="relative bg-[#FDFDFD]/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl shadow-[#0F1428]/10 overflow-hidden transition-all duration-300">
              {/* Subtle background architectural grid */}
              <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(135deg, #0F1428 1px, transparent 1px), linear-gradient(45deg, #0F1428 1px, transparent 1px)`,
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Top Pentagram OS Brand & Tab Selector */}
              <div className="text-center space-y-3 mb-6 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-[#D64062] bg-[#D64062]/10 px-3 py-1 rounded-full border border-[#D64062]/20 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#D64062]" />
                    Pentagram OS
                  </span>
                  <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => setTab('login')}
                      className={cn(
                        'px-3.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer',
                        tab === 'login'
                          ? 'bg-[#0F1428] text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      )}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('signup')}
                      className={cn(
                        'px-3.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer',
                        tab === 'signup'
                          ? 'bg-[#0F1428] text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      )}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>

                <div className="pt-2 text-left">
                  <h1 className="text-2xl font-black tracking-tight text-[#0F1428] flex items-center gap-2">
                    {tab === 'login' ? 'Welcome Back' : 'Create Studio Account'}
                    <Sparkles className="w-5 h-5 text-[#D64062] animate-pulse" />
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {tab === 'login'
                      ? 'Sign in to access 3D floor plans, BOQ engine & studio workstations'
                      : 'Join Pentagram OS to design, cost & execute interior projects'}
                  </p>
                </div>
              </div>

              {/* Login / Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                {authError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* Full Name Input (For Sign Up) */}
                <AnimatePresence mode="popLayout">
                  {tab === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-1 overflow-hidden"
                    >
                      <label className="text-xs font-bold text-[#0F1428] uppercase tracking-wider">
                        Full Name
                      </label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
                        <Input
                          type="text"
                          placeholder="Elena Rostova"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                          required={tab === 'signup'}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0F1428] uppercase tracking-wider">
                    Email ID
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="name@pentagram.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0F1428] uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-[#0F1428] transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Primary Studio Role Selection Pills */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Primary Studio Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((r) => {
                      const Icon = r.icon;
                      const isSelected = selectedRole === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setSelectedRole(r.id)}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200 text-left cursor-pointer',
                            isSelected
                              ? 'bg-[#D64062]/10 border-[#D64062] text-[#D64062] font-bold shadow-xs'
                              : 'bg-white/80 border-slate-200/90 text-slate-700 hover:border-slate-300'
                          )}
                        >
                          <Icon className={cn('w-3.5 h-3.5', isSelected ? 'text-[#D64062]' : 'text-slate-400')} />
                          <span className="truncate">{r.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer text-slate-600 font-medium hover:text-[#0F1428] transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-[#D64062] focus:ring-[#D64062]"
                    />
                    <span>Remember me</span>
                  </label>
                  {onOpenForgotPassword && (
                    <button
                      type="button"
                      onClick={onOpenForgotPassword}
                      className="text-[#D64062] hover:underline font-bold cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                {/* Submit Action Button - Pentagram Crimson #D64062 */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group/btn mt-3 overflow-hidden rounded-xl bg-[#D64062] hover:bg-[#C03252] text-white font-extrabold h-12 transition-all duration-300 flex items-center justify-center shadow-lg shadow-[#D64062]/30 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 transform-gpu" />

                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-bold">Authenticating Studio...</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="btn-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2 text-sm font-extrabold"
                      >
                        {tab === 'login' ? 'Sign In to Workspace' : 'Create Account & Enter'}
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>

              {/* Divider */}
              <div className="relative my-4 flex items-center">
                <div className="flex-grow border-t border-slate-200/80" />
                <span className="mx-3 text-[11px] font-mono text-slate-400 font-semibold uppercase">
                  OR
                </span>
                <div className="flex-grow border-t border-slate-200/80" />
              </div>

              {/* Google OAuth Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  if (isSupabaseConfigured) {
                    signInWithGoogle();
                  } else if (onGoogleSignIn) {
                    onGoogleSignIn();
                  }
                }}
                className="w-full h-11 bg-white hover:bg-slate-50 text-[#0F1428] font-semibold text-sm rounded-xl border border-slate-200 flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </motion.button>

              {/* SOC2 & Security Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  256-Bit Encrypted Workspace
                </span>
                <span>© Pentagram Living Pvt Ltd</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
