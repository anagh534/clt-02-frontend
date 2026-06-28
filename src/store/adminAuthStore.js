import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminAuthStore = create(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      login: (adminData) => set({ admin: adminData, isAuthenticated: true }),
      logout: () => {
        localStorage.removeItem('investscore-admin');
        set({ admin: null, isAuthenticated: false });
      },
    }),
    {
      name: 'investscore-admin',
    }
  )
);
