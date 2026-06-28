import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../api/axiosInstance';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: async () => {
        try {
          await axiosInstance.post('/auth/logout');
        } catch (e) {
          console.error('Logout error', e);
        }
        set({ user: null, isAuthenticated: false });
      },
      checkSession: async () => {
        try {
          const { data } = await axiosInstance.get('/auth/me');
          if (data.success && data.user) {
            set({ user: data.user, isAuthenticated: true });
          }
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      }
    }),
    {
      name: 'investscore-auth', // localStorage key
    }
  )
);
