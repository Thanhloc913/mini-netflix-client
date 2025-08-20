import { apiClient } from "@/apis/api-client";

export type LoginPayload = { username: string; password: string };
export type TokenPair = { accessToken: string; refreshToken: string };

export async function loginApi(payload: LoginPayload) {
  const { data } = await apiClient.post<TokenPair>("/auth/login", payload);
  return data;
}

export async function refreshApi(refreshToken: string) {
  const { data } = await apiClient.post<TokenPair>("/auth/refresh", { refreshToken });
  return data;
}

export async function logoutApi() {
  const { data } = await apiClient.post<{ success: true }>("/auth/logout");
  return data;
}


