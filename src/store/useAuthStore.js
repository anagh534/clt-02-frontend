import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const STORAGE_KEY = 'vite_app_auth';

function getStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

const stored = getStoredAuth();

export const useAuthStore = create((set) => ({
  user: stored?.user || null,
  isAuthenticated: Boolean(stored?.user),

  login: (user) => {
    const data = { user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    set({
      user,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    }
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, isAuthenticated: false });
  },

  checkSession: async () => {
    try {
      const { data } = await axiosInstance.get('/auth/me');
      if (data.success && data.user) {
        set({ user: data.user, isAuthenticated: true });
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: data.user }));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      set({ user: null, isAuthenticated: false });
    }
  }
}));
