import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('investscore-auth');
  if (token) {
    try {
      const authData = JSON.parse(token);
      if (authData?.state?.isAuthenticated) {
        config.headers.Authorization = `Bearer mock-token-for-${authData.state.user.id}`;
      }
    } catch (e) {
      // ignore parse errors
    }
  }
  return config;
});

export default apiClient;
