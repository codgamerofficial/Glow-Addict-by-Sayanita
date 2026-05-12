import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/product';
import { createClient, isSupabaseConfigured } from '@/utils/supabase/client';

const supabase = isSupabaseConfigured ? createClient() : null;

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
        await supabase?.auth.signOut();
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
        if (!supabase) {
          set({ isInitialized: true });
          return;
        }

        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          set({ 
            user: {
              id: session.user.id,
              email: session.user.email || '',
              name: profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              avatarUrl: profile?.avatar_url || session.user.user_metadata?.avatar_url,
              loyaltyPoints: profile?.loyalty_points || 0,
              skinType: profile?.skin_type,
            }, 
            isAuthenticated: true 
          });
        }

        // Listen for changes
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            set({ 
              user: {
                id: session.user.id,
                email: session.user.email || '',
                name: profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                avatarUrl: profile?.avatar_url || session.user.user_metadata?.avatar_url,
                loyaltyPoints: profile?.loyalty_points || 0,
                skinType: profile?.skin_type,
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
