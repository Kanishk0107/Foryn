import { createClient } from '@supabase/supabase-js';
import { UserRole } from '../types';

// Read Supabase environment variables from Vite env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'your-anon-key-here');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface SupabaseUserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  isAdmin?: boolean;
  loginCount?: number;
  lastLoginAt?: string;
}

export async function getCurrentUserProfile(): Promise<SupabaseUserProfile | null> {
  if (!supabase) return null;
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      role: (user.user_metadata?.role as UserRole) || 'Sales Lead',
      company: 'Foryn Partner',
      isAdmin: false
    };
  }

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role as UserRole,
    company: profile.company,
    isAdmin: Boolean(profile.is_admin),
    loginCount: profile.login_count || 1,
    lastLoginAt: profile.last_login_at
  };
}

export async function signInWithGoogle(): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('Supabase client is not configured') };
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
  return { error };
}

export async function signUpWithEmailOTP(
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<{ error: Error | null; data: any }> {
  if (!supabase) return { error: new Error('Supabase client is not configured'), data: null };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role
      }
    }
  });
  return { data, error };
}

export async function verifyEmailOTP(
  email: string,
  otpToken: string
): Promise<{ error: Error | null; session: any }> {
  if (!supabase) return { error: new Error('Supabase client is not configured'), session: null };
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otpToken,
    type: 'signup'
  });
  return { session: data.session, error };
}

export async function recordUserLoginMetrics(userId: string): Promise<void> {
  if (!supabase) return;
  try {
    const { data } = await supabase.from('profiles').select('login_count').eq('id', userId).single();
    const currentCount = data?.login_count || 0;
    await supabase
      .from('profiles')
      .update({
        last_login_at: new Date().toISOString(),
        login_count: currentCount + 1
      })
      .eq('id', userId);
  } catch (err) {
    console.error('Error updating login metrics:', err);
  }
}

export async function updateUserUsageDuration(userId: string, addedSeconds: number): Promise<void> {
  if (!supabase || addedSeconds <= 0) return;
  try {
    const { data } = await supabase.from('profiles').select('total_usage_seconds').eq('id', userId).single();
    const currentSeconds = data?.total_usage_seconds || 0;
    await supabase
      .from('profiles')
      .update({ total_usage_seconds: currentSeconds + addedSeconds })
      .eq('id', userId);
  } catch (e) {
    console.error('Error updating usage duration:', e);
  }
}
