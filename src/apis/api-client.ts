import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { useAuthStore } from "@/store/auth";
import { refreshTokens } from "@/apis/auth";
import type { TokenPair } from "@/types/auth";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${tokens.access_token}`,
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
  const { refreshToken: currentRefreshToken, setTokens } = useAuthStore.getState();

  if (!currentRefreshToken) {
    throw new Error("Missing refresh token");
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        const tokens = await refreshTokens(currentRefreshToken);
        setTokens(tokens);
        return tokens;
      } finally {
        isRefreshing = false;
      }
    })();
  }

  const tokens = await refreshPromise!;
  return tokens;
}

export const apiClient = createClient();


