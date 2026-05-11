import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/product';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },
      updateProfile: (data) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...data } });
        }
      },
      initialize: async () => {
        if (get().isInitialized) return;

        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        const handleUser = async (supabaseUser: any) => {
          if (supabaseUser) {
            // Get profile from profiles table
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supabaseUser.id)
              .single();

            const userData: User = {
              id: supabaseUser.id,
              email: supabaseUser.email || '',
              name: profile?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Glow User',
              avatarUrl: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url,
              loyaltyPoints: profile?.loyalty_points || 0,
              skinType: profile?.skin_type,
            };

            set({ user: userData, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        };

        // Handle initial session
        if (session?.user) {
          await handleUser(session.user);
        }

        // Listen for Auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
            await handleUser(session?.user);
          } else if (event === 'SIGNED_OUT') {
            set({ user: null, isAuthenticated: false });
          }
        });

        set({ isInitialized: true });
      },
    }),
    { name: 'glow-addict-auth' }
  )
);
