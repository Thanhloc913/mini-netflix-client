import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { useAuthStore } from "@/store/auth";

const BASE_URL = "http://localhost:3000";

type TokenPair = { accessToken: string; refreshToken: string };

let isRefreshing = false;
let refreshPromise: Promise<TokenPair> | null = null;

function createClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: false,
  });

  instance.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken && !config.headers?.Authorization) {
      // mutate headers safely without fighting AxiosHeaders typing
      const headers = (config.headers ?? {}) as Record<string, string>;
      headers["Authorization"] = `Bearer ${accessToken}`;
      config.headers = headers as unknown as AxiosRequestHeaders;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const { response, config } = error;
      const originalRequest = config as AxiosRequestConfig & { _retry?: boolean };

      if (response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const tokens = await getOrRefreshTokens();
          // Update header and retry
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${tokens.accessToken}`,
          };
          return instance(originalRequest);
        } catch {
          // Refresh failed → clear and redirect to login
          useAuthStore.getState().clear();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

async function getOrRefreshTokens(): Promise<TokenPair> {
  const { refreshToken, setTokens } = useAuthStore.getState();

  // If we had an access token but it's invalid, refresh using refreshToken
  if (!refreshToken) {
    // No refresh token; cannot refresh
    throw new Error("Missing refresh token");
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        const res = await axios.post<TokenPair>(`${BASE_URL}/auth/refresh`, { refreshToken }, {
          headers: { "Content-Type": "application/json" },
        });
        setTokens(res.data);
        return res.data;
      } finally {
        isRefreshing = false;
      }
    })();
  }

  // Wait for the in-flight refresh
  const tokens = await refreshPromise!;
  return tokens;
}

export const apiClient = createClient();


