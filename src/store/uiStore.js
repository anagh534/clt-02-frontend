import { create } from 'zustand';

export const useUiStore = create((set) => ({
  isSidebarOpen: false,
  theme: localStorage.getItem('theliv-theme') || 'dark',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theliv-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    return { theme: newTheme };
  }),
  setTheme: (theme) => set(() => {
    localStorage.setItem('theliv-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    return { theme };
  })
}));
