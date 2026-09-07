import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
    withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('theliv-auth');
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
