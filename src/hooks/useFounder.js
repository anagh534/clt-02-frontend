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
      
      // Scoring algorithm — max 100
      let score = 30; // base

      // Stage
      const stageBonus = { 'Pre-Seed': 5, 'Seed': 12, 'Series A': 18, 'Series B+': 22 };
      score += stageBonus[startupData.stage] || 5;

      // ARR / Revenue
      const arr = (startupData.metrics?.arr || '').toLowerCase();
      if (arr.includes('m') || parseFloat(arr.replace(/[^0-9.]/g, '')) >= 1000000) score += 18;
      else if (parseFloat(arr.replace(/[^0-9.]/g, '')) >= 100000) score += 12;
      else if (arr && arr !== '' && arr !== '$0') score += 6;

      // Growth rate
      const growth = parseFloat((startupData.metrics?.growth || '0').replace(/[^0-9.]/g, ''));
      if (growth >= 20) score += 10;
      else if (growth >= 10) score += 6;
      else if (growth > 0) score += 3;

      // Customers
      const custMap = {
        '0 (pre-launch)': 0, '1 – 10': 3, '11 – 100': 6,
        '101 – 1,000': 9, '1,001 – 10,000': 12, '10,000+': 15,
      };
      score += custMap[startupData.customers] ?? 0;

      // Founder signals
      if (startupData.priorExit) score += 15;
      if (startupData.technicalCofounder) score += 10;

      // Completeness bonus
      if (startupData.name && startupData.tagline && startupData.description) score += 5;

      const calculatedScore = Math.min(100, Math.max(30, Math.round(score)));
      
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
