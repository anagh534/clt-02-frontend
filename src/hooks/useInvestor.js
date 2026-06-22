import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockStartups } from '../api/mockData';
import { useAuthStore } from '../store/authStore';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const getStartupData = () => {
  const stored = localStorage.getItem('investscore-startups');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('investscore-startups', JSON.stringify(mockStartups));
  return mockStartups;
};

export const useAllStartups = () => {
  return useQuery({
    queryKey: ['allStartups'],
    queryFn: async () => {
      await delay(600);
      return getStartupData();
    }
  });
};

export const useStartupDetails = (id) => {
  return useQuery({
    queryKey: ['startupDetails', id],
    queryFn: async () => {
      await delay(400);
      const data = getStartupData();
      return data.find(s => s.id === id) || null;
    },
    enabled: !!id
  });
};

export const useSavedStartups = () => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: ['savedStartups', user?.id],
    queryFn: async () => {
      await delay(400);
      const data = getStartupData();
      return data.filter(s => (s.savedBy || []).includes(user?.id));
    },
    enabled: !!user?.id
  });
};

export const useToggleSaveStartup = () => {
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (startupId) => {
      await delay(300);
      const data = getStartupData();
      const index = data.findIndex(s => s.id === startupId);
      
      if (index >= 0) {
        const startup = data[index];
        const savedBy = startup.savedBy || [];
        
        if (savedBy.includes(user.id)) {
          startup.savedBy = savedBy.filter(id => id !== user.id);
        } else {
          startup.savedBy = [...savedBy, user.id];
        }
        
        data[index] = startup;
        localStorage.setItem('investscore-startups', JSON.stringify(data));
        return startup;
      }
      throw new Error('Startup not found');
    },
    onSuccess: (data, startupId) => {
      queryClient.invalidateQueries({ queryKey: ['allStartups'] });
      queryClient.invalidateQueries({ queryKey: ['startupDetails', startupId] });
      queryClient.invalidateQueries({ queryKey: ['savedStartups'] });
    }
  });
};
