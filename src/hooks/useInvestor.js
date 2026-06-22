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

// Investor adds a proprietary score note on a startup
export const useAddInvestorScore = () => {
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ startupId, score, note, conviction, customers, sector, priorExit, techCofounder }) => {
      await delay(400);
      const data = getStartupData();
      const index = data.findIndex(s => s.id === startupId);
      if (index < 0) throw new Error('Startup not found');

      const startup = data[index];
      const investorScores = startup.investorScores || [];

      // Replace existing entry from this investor or add new one
      const existing = investorScores.findIndex(e => e.investorId === user.id);
      const entry = { investorId: user.id, investorName: user.name, score, note, conviction, customers, sector, priorExit, techCofounder, createdAt: new Date().toISOString() };
      if (existing >= 0) investorScores[existing] = entry;
      else investorScores.push(entry);

      data[index] = { ...startup, investorScores };
      localStorage.setItem('investscore-startups', JSON.stringify(data));
      return data[index];
    },
    onSuccess: (_, { startupId }) => {
      queryClient.invalidateQueries({ queryKey: ['startupDetails', startupId] });
      queryClient.invalidateQueries({ queryKey: ['allStartups'] });
    }
  });
};
