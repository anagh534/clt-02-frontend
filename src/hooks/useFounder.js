import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockStartups } from '../api/mockData';
import { useAuthStore } from '../store/authStore';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const getStartupData = () => {
  const stored = localStorage.getItem('investscore-startups');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('investscore-startups', JSON.stringify(mockStartups));
  return mockStartups;
};

export const useFounderStartup = () => {
  const user = useAuthStore(state => state.user);
  
  return useQuery({
    queryKey: ['founderStartup', user?.id],
    queryFn: async () => {
      await delay(600);
      const data = getStartupData();
      return data.find(s => s.founderId === user?.id) || null;
    },
    enabled: !!user?.id,
  });
};

export const useSaveStartupScore = () => {
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (startupData) => {
      await delay(800);
      const data = getStartupData();
      const index = data.findIndex(s => s.founderId === user?.id);
      
      let updatedStartup;
      
      // Super basic mockup of scoring algorithm based on inputs
      const calculatedScore = Math.min(100, Math.max(30, 50 + (startupData.metrics?.arr ? 20 : 0) + (startupData.stage === 'Seed' ? 10 : 20)));
      
      if (index >= 0) {
        updatedStartup = { ...data[index], ...startupData, score: calculatedScore };
        data[index] = updatedStartup;
      } else {
        updatedStartup = { 
          id: `s_${Date.now()}`, 
          founderId: user.id, 
          ...startupData,
          score: calculatedScore,
          savedBy: [] 
        };
        data.push(updatedStartup);
      }
      
      localStorage.setItem('investscore-startups', JSON.stringify(data));
      return updatedStartup;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['founderStartup'] });
      queryClient.invalidateQueries({ queryKey: ['allStartups'] });
    }
  });
};
