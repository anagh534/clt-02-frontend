import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../api/axiosInstance';

export const useFounderStartup = () => {
  const user = useAuthStore(state => state.user);
  
  return useQuery({
    queryKey: ['founderStartup', user?.id],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/founders/me');
      return data.data || null; // Returns { founder, score } or null
    },
    enabled: !!user?.id,
  });
};

export const useSaveStartupScore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (startupData) => {
      const { data } = await axiosInstance.post('/founders', startupData);
      return data.data; // Returns { founder, score }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['founderStartup'] });
      queryClient.invalidateQueries({ queryKey: ['allStartups'] });
    }
  });
};

export const useFounderScoreHistory = () => {
  const user = useAuthStore(state => state.user);
  
  return useQuery({
    queryKey: ['founderScoreHistory', user?.id],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/founders/me/scores');
      return data.data || [];
    },
    enabled: !!user?.id,
  });
};
