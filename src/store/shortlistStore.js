import { create } from 'zustand';

export const useShortlistStore = create((set) => ({
  count: 0,
  shortlistedIds: new Set(),
  setCount: (count) => set({ count }),
  setShortlistedIds: (ids) => set({ shortlistedIds: new Set(ids) }),
  addId: (id) => set((state) => {
    const newSet = new Set(state.shortlistedIds);
    newSet.add(id);
    return { shortlistedIds: newSet, count: newSet.size };
  }),
  removeId: (id) => set((state) => {
    const newSet = new Set(state.shortlistedIds);
    newSet.delete(id);
    return { shortlistedIds: newSet, count: newSet.size };
  }),
  isShortlisted: (id) => {
    // This is a getter — Zustand doesn't support getters out of the box,
    // so we use a store-level helper via the hook in components:
    // const { shortlistedIds } = useShortlistStore();
    // shortlistedIds.has(investorId)
    return false; // placeholder, use the set directly
  }
}));
