import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const isAuthRequest = (url = '') => /\/auth\//.test(url) || /\/auth$/.test(url);

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    const requestUrl = error.config?.url || '';
    const onAuthPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/auth');

    if (error.response?.status === 401 && !onAuthPage && !isAuthRequest(requestUrl)) {
      window.dispatchEvent(new CustomEvent("auth:session-expired"));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
