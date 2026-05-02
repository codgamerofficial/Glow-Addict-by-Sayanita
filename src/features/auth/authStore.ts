import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/product';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const demoUser: User = {
  id: 'u-demo',
  email: 'sayanita@glowaddict.com',
  name: 'Sayanita',
  phone: '+91 98765 43210',
  skinType: 'Combination',
  skinConcerns: ['Dark Spots', 'Dullness'],
  loyaltyPoints: 2450,
  gender: 'Female',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: demoUser,
      isAuthenticated: true,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...data } });
        }
      },
    }),
    { name: 'glow-addict-auth' }
  )
);
