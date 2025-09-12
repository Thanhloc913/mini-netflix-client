import * as authService from "@/services/auth";
import type { LoginRequest, RegisterRequest } from "@/schemas/auth.schema";
import type { TokenPair, RegisterResponse } from "@/types/auth";

// Re-export for backward compatibility and cleaner imports
export const loginApi = authService.login;
export const registerApi = authService.register;
export const refreshTokenApi = authService.refreshToken;

// Convenience functions
export async function loginUser(credentials: LoginRequest): Promise<TokenPair> {
  return authService.login(credentials);
}

export async function registerUser(
  userData: RegisterRequest, 
  avatar?: File
): Promise<RegisterResponse> {
  return authService.register(userData, avatar);
}

export async function refreshUserToken(refreshToken: string): Promise<TokenPair> {
  return authService.refreshToken(refreshToken);
}

// Account management
export const getAccounts = authService.getAccounts;
export const getAccountById = authService.getAccountById;
export const updateAccount = authService.updateAccount;
export const deleteAccount = authService.deleteAccount;

// Profile management
export const getProfiles = authService.getProfiles;
export const getProfileById = authService.getProfileById;
export const getProfileByAccountId = authService.getProfileByAccountId;
export const updateProfile = authService.updateProfile;
export const deleteProfile = authService.deleteProfile;

// Current user
export const getCurrentUser = authService.getCurrentUser;