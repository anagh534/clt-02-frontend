import { mockInvestors } from '../api/mockData';

// Simulated delay for realistic API behavior
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const getInvestorsData = () => {
  const storedData = localStorage.getItem('investors_data');
  if (storedData) {
    return JSON.parse(storedData);
  }
  localStorage.setItem('investors_data', JSON.stringify(mockInvestors));
  return mockInvestors;
};

const saveInvestorsData = (data) => {
  localStorage.setItem('investors_data', JSON.stringify(data));
};

export const investorService = {
  async getInvestors() {
    await delay(600); // Simulate network latency
    return getInvestorsData();
  },

  async getInvestorById(id) {
    await delay(400);
    const data = getInvestorsData();
    const investor = data.find(inv => inv.id === id);
    if (!investor) throw new Error('Investor not found');
    return investor;
  },

  async createInvestor(newInvestor) {
    await delay(700);
    const data = getInvestorsData();
    const investor = {
      ...newInvestor,
      id: Date.now().toString(),
    };
    const updatedData = [...data, investor];
    saveInvestorsData(updatedData);
    return investor;
  },

  async updateInvestor(id, updatedFields) {
    await delay(700);
    const data = getInvestorsData();
    const index = data.findIndex(inv => inv.id === id);
    if (index === -1) throw new Error('Investor not found');
    
    const updatedInvestor = { ...data[index], ...updatedFields };
    data[index] = updatedInvestor;
    saveInvestorsData(data);
    return updatedInvestor;
  },

  async deleteInvestor(id) {
    await delay(600);
    const data = getInvestorsData();
    const updatedData = data.filter(inv => inv.id !== id);
    saveInvestorsData(updatedData);
    return true;
  }
};
