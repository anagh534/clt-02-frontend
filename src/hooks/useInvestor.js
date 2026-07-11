import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../api/axiosInstance';

export const useAllStartups = () => {
  return useQuery({
    queryKey: ['allStartups'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/founders');
      return data.data;
    }
  });
};

export const useStartupDetails = (id) => {
  return useQuery({
    queryKey: ['startupDetails', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/founders/${id}`);
      return data.data;
    },
    enabled: !!id
  });
};

export const useSavedStartups = () => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: ['savedStartups', user?.id],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/founders/saved');
      return data.data;
    },
    enabled: !!user?.id
  });
};

export const useToggleSaveStartup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (startupId) => {
      const { data } = await axiosInstance.post(`/founders/${startupId}/toggle-save`);
      return data.data;
    },
    onSuccess: (data, startupId) => {
      queryClient.invalidateQueries({ queryKey: ['allStartups'] });
      queryClient.invalidateQueries({ queryKey: ['startupDetails', startupId] });
      queryClient.invalidateQueries({ queryKey: ['savedStartups'] });
    }
  });
};

export const useAddInvestorScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ startupId, score, note, conviction, customers, sector, priorExit, techCofounder }) => {
      const { data } = await axiosInstance.post(`/founders/${startupId}/investor-score`, {
        score,
        note,
        conviction,
        customers,
        sector,
        priorExit,
        techCofounder
      });
      return data.data;
    },
    onSuccess: (_, { startupId }) => {
      queryClient.invalidateQueries({ queryKey: ['startupDetails', startupId] });
      queryClient.invalidateQueries({ queryKey: ['allStartups'] });
      queryClient.invalidateQueries({ queryKey: ['savedStartups'] });
    }
  });
};

export const useSendOutreach = () => {
  return useMutation({
    mutationFn: async ({ founderId, subject, body }) => {
      const { data } = await axiosInstance.post('/emails/send', {
        founderId,
        subject,
        body
      });
      return data.data;
    }
  });
};
