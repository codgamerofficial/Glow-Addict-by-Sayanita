import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/product';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (user: User) => void;
  logout: () => void;
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
        
        if (session?.user) {
          set({ 
            user: {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              avatarUrl: session.user.user_metadata?.avatar_url,
              loyaltyPoints: 0, // In real app, fetch from profiles table
            }, 
            isAuthenticated: true 
          });
        }

        // Listen for changes
        supabase.auth.onAuthStateChange((event, session) => {
          if (session?.user) {
            set({ 
              user: {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                avatarUrl: session.user.user_metadata?.avatar_url,
                loyaltyPoints: 0,
              }, 
              isAuthenticated: true 
            });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        });

        set({ isInitialized: true });
      },
    }),
    { name: 'glow-addict-auth' }
  )
);
