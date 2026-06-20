import { create } from 'zustand'
import axios from 'axios'

const STORAGE_KEY = 'vite_app_auth'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

function getStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
  } catch {
    return null
  }
}

const stored = getStoredAuth()

export const useAuthStore = create((set) => ({
  user: stored?.user || null,
  accessToken: stored?.accessToken || null,
  isAuthenticated: Boolean(stored?.accessToken),

  login: (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    set({
      user: data.user || null,
      accessToken: data.accessToken || null,
      isAuthenticated: Boolean(data.accessToken),
    })
  },

  logout: async () => {
    try {
      const stored = getStoredAuth()
      if (stored?.refreshToken) {
        await axios.post(`${BASE_URL}/auth/logout`, { refreshToken: stored.refreshToken })
      }
    } catch {}
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, accessToken: null, isAuthenticated: false })
  },
}))
