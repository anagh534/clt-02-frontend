import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investorService } from '../services/investorService';

export const useInvestors = () => {
  return useQuery({
    queryKey: ['investors'],
    queryFn: investorService.getInvestors,
  });
};

export const useInvestor = (id) => {
  return useQuery({
    queryKey: ['investors', id],
    queryFn: () => investorService.getInvestorById(id),
    enabled: !!id,
  });
};

export const useCreateInvestor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: investorService.createInvestor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investors'] });
    },
  });
};

export const useUpdateInvestor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => investorService.updateInvestor(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['investors'] });
      queryClient.invalidateQueries({ queryKey: ['investors', variables.id] });
    },
  });
};

export const useDeleteInvestor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: investorService.deleteInvestor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investors'] });
    },
  });
};
