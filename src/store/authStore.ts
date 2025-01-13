import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types/supabase';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
  signIn: (email: string, password: string, accountType: AccountType) => Promise<void>;
  signOut: () => Promise<void>;
  loadSession: () => Promise<void>;
}

type AccountType = 'admin' | 'chamber' | 'business' | 'government';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  signIn: async (email, password, accountType) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ loading: false });
      throw error;
    }

    const { data: { user } } = await supabase.auth.getUser();
    set({ user: { ...user, account_type: accountType } as UserProfile, loading: false });
  },
  signOut: async () => {
    set({ loading: true });
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, loading: false });
  },
  loadSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        set({ loading: false });
        return;
      }

      set({ user: profile as UserProfile, loading: false });
    } else {
      set({ loading: false });
    }
  },
}));
