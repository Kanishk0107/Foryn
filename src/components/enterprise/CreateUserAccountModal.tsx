import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  Palette,
  Box,
  Compass,
  KeyRound
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../utils/supabaseClient';

export interface CreateUserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated?: (newUser: { name: string; email: string; role: string }) => void;
}

const ROLES = [
  { id: 'Interior Designer', label: 'Interior Designer', icon: Palette },
  { id: 'Architect', label: 'Architect', icon: Building2 },
  { id: '3D Artist', label: '3D Artist', icon: Box },
  { id: 'Project Management', label: 'Project Manager', icon: ShieldCheck },
  { id: 'Finance Team', label: 'Finance Lead', icon: Building2 },
  { id: 'Sales Lead', label: 'Sales Manager', icon: User },
  { id: 'Homeowner', label: 'Homeowner (Client View)', icon: Compass }
];

export const CreateUserAccountModal: React.FC<CreateUserAccountModalProps> = ({
  isOpen,
  onClose,
  onUserCreated
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Interior Designer');
  const [isLoading, setIsLoading] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    email: string;
    password: string;
    role: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let pwd = 'Verdiore@';
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pwd);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    const finalPassword = password || 'Verdiore2026!';
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: finalPassword,
          options: {
            data: {
              name,
              role: selectedRole,
              created_by_admin: true
            }
          }
        });

        if (error) {
          setErrorMsg(error.message);
          setIsLoading(false);
          return;
        }
      }

      const credentials = {
        name,
        email,
        password: finalPassword,
        role: selectedRole
      };

      // Store in local storage for local offline session support
      try {
        const existing = JSON.parse(localStorage.getItem('foryn_admin_provisioned_users') || '[]');
        localStorage.setItem(
          'foryn_admin_provisioned_users',
          JSON.stringify([credentials, ...existing])
        );
      } catch (err) {
        // localStorage fallback
      }

      setCreatedCredentials(credentials);
      if (onUserCreated) {
        onUserCreated({ name, email, role: selectedRole });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to provision account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const text = `Verdiore Studio Login Credentials:\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\nRole: ${createdCredentials.role}\nLogin: http://localhost:5173`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetAndClose = () => {
    setName('');
    setEmail('');
    setPassword('');
    setCreatedCredentials(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FDFDFD] dark:bg-[#0F1428] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D64062]/10 border border-[#D64062]/20 flex items-center justify-center text-[#D64062]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0F1428] dark:text-white">
                Provision User Sign-In
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Admin-controlled account creation & role assignment
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 text-xs text-red-600 dark:text-red-400 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Success View: Copyable Credentials Card */}
        {createdCredentials ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Account Successfully Provisioned!
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                  The user can now directly sign in on the main portal with these credentials.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Name:</span>
                <span className="font-bold text-[#0F1428] dark:text-white">{createdCredentials.name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Work Email:</span>
                <span className="font-bold text-[#0F1428] dark:text-white">{createdCredentials.email}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Assigned Role:</span>
                <span className="font-bold text-[#D64062]">{createdCredentials.role}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Password:</span>
                <span className="font-bold text-[#0F1428] dark:text-white bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {createdCredentials.password}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#0F1428] hover:bg-[#161D3A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
              </button>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="py-2.5 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        ) : (
          /* Form View */
          <form onSubmit={handleCreate} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F1428] dark:text-white uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Malhotra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-[#0F1428] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#D64062] focus:ring-1 focus:ring-[#D64062] transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F1428] dark:text-white uppercase tracking-wider">
                Work Email ID
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. aryan@verdiore.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-[#0F1428] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#D64062] focus:ring-1 focus:ring-[#D64062] transition-all"
                />
              </div>
            </div>

            {/* Password with Generate Option */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#0F1428] dark:text-white uppercase tracking-wider">
                  Initial Password
                </label>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="text-[11px] font-semibold text-[#D64062] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound className="w-3 h-3" />
                  Generate Strong
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Leave blank for default: Verdiore2026!"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-[#0F1428] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#D64062] focus:ring-1 focus:ring-[#D64062] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-[#0F1428] dark:hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F1428] dark:text-white uppercase tracking-wider">
                Assign Primary Studio Role
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D64062]/10 border-[#D64062] text-[#D64062] font-bold shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D64062]' : 'text-slate-400'}`} />
                      <span className="truncate">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-[#D64062] hover:bg-[#C03252] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Provisioning...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Sign-In Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
