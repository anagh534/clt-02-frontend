import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investorService } from '../services/investorService';

export const useInvestors = (params = {}) => {
  return useQuery({
    queryKey: ['investors', params],
    queryFn: () => investorService.getInvestors(params),
    staleTime: 30_000, // 30 seconds before refetch
  });
};

export const useInvestor = (id) => {
  return useQuery({
    queryKey: ['investors', id],
    queryFn: () => investorService.getInvestorById(id),
    enabled: !!id,
  });
};

export const useUpsertInvestor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: investorService.upsertInvestorProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investors'] });
    },
  });
};
