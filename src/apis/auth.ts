import { apiClient } from "@/apis/api-client";
import type { loginType } from "@/schemas/auth.schema";
import type { registerRequest } from "@/schemas/auth.schema";
import type { TokenPair } from "@/types/auth";
import type { registerResponse } from "@/types/auth";

export async function loginApi(payload: loginType) {
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

export async function registerApi(payload: registerRequest) {
  const { data } = await apiClient.post<registerResponse>("/users", payload);
  return data;
}
