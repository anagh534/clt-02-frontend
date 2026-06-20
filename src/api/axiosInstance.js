import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Queue concurrent 401s so only one refresh call fires
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
}

async function clearSession() {
  try {
    const stored = JSON.parse(localStorage.getItem("vite_app_auth") || "null");
    if (stored?.refreshToken) {
      await axios.post(`${BASE_URL}/auth/logout`, {
        refreshToken: stored.refreshToken,
      });
    }
  } catch {}
  localStorage.removeItem("vite_app_auth");
  // React listens to this event (useSessionExpiry hook) to logout + show toast + navigate
  window.dispatchEvent(new CustomEvent("auth:session-expired"));
}

axiosInstance.interceptors.request.use((config) => {
  try {
    const stored = JSON.parse(localStorage.getItem("vite_app_auth") || "null");
    if (stored?.accessToken) {
      config.headers.Authorization = `Bearer ${stored.accessToken}`;
    }
  } catch {}
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (original.skipRefresh) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // If refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const stored = JSON.parse(
        localStorage.getItem("vite_app_auth") || "null"
      );
      if (!stored?.refreshToken) throw new Error("No refresh token");

      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken: stored.refreshToken,
      });

      const updated = {
        ...stored,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      localStorage.setItem("vite_app_auth", JSON.stringify(updated));

      original.headers.Authorization = `Bearer ${data.accessToken}`;
      processQueue(null, data.accessToken);
      return axiosInstance(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearSession();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
