import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shortlistService } from '../services/shortlistService';
import { useShortlistStore } from '../store/shortlistStore';
import { useAuthStore } from '../store/authStore';

/**
 * Hook to fetch the full shortlist with search/filter/sort params
 */
export const useShortlist = (params = {}) => {
  const isFounder = useAuthStore((s) => s.user?.role === 'founder');
  return useQuery({
    queryKey: ['shortlist', params],
    queryFn: () => shortlistService.getShortlist(params),
    staleTime: 15_000,
    enabled: isFounder,
  });
};

/**
 * Hook to fetch just the shortlist count (lightweight, for badge)
 */
export const useShortlistCount = () => {
  const setCount = useShortlistStore((s) => s.setCount);
  const setShortlistedIds = useShortlistStore((s) => s.setShortlistedIds);
  const isFounder = useAuthStore((s) => s.user?.role === 'founder');

  return useQuery({
    queryKey: ['shortlistCount'],
    queryFn: async () => {
      const result = await shortlistService.getShortlistCount();
      setCount(result.data?.count || 0);
      return result;
    },
    staleTime: 10_000,
    refetchInterval: isFounder ? 30_000 : false,
    enabled: isFounder,
  });
};

/**
 * Hook to toggle (add/remove) an investor to/from the shortlist
 */
export const useToggleShortlist = () => {
  const queryClient = useQueryClient();
  const addId = useShortlistStore((s) => s.addId);
  const removeId = useShortlistStore((s) => s.removeId);
  const setCount = useShortlistStore((s) => s.setCount);

  return useMutation({
    mutationFn: async ({ investorId, isShortlisted }) => {
      if (isShortlisted) {
        await shortlistService.removeFromShortlist(investorId);
        return { action: 'removed', investorId };
      } else {
        await shortlistService.addToShortlist(investorId);
        return { action: 'added', investorId };
      }
    },
    onSuccess: (result) => {
      // Optimistically update the store
      if (result.action === 'added') {
        addId(result.investorId);
      } else {
        removeId(result.investorId);
      }

      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['shortlist'] });
      queryClient.invalidateQueries({ queryKey: ['shortlistCount'] });
    },
  });
};

/**
 * Hook to prefetch and sync shortlisted IDs into the store
 */
export const useSyncShortlistStore = () => {
  const setShortlistedIds = useShortlistStore((s) => s.setShortlistedIds);
  const setCount = useShortlistStore((s) => s.setCount);
  const isFounder = useAuthStore((s) => s.user?.role === 'founder');

  return useQuery({
    queryKey: ['shortlist', 'all'],
    queryFn: async () => {
      const result = await shortlistService.getShortlist({ limit: 500 });
      const ids = (result.data || []).map((inv) => inv._id);
      setShortlistedIds(ids);
      setCount(ids.length);
      return result;
    },
    staleTime: 15_000,
    enabled: isFounder,
  });
};
