import { create } from "zustand";
import type { TokenPair, AuthUser, Account, Profile } from "@/types/auth";

type AuthState = {
  // Tokens
  accessToken: string | null;
  refreshToken: string | null;
  
  // User data
  user: AuthUser | null;
  
  // Loading states
  isLoading: boolean;
  isAuthenticating: boolean;
  
  // Actions
  setTokens: (tokens: TokenPair) => void;
  setUser: (user: AuthUser) => void;
  setLoading: (loading: boolean) => void;
  setAuthenticating: (authenticating: boolean) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  updateAccount: (account: Partial<Account>) => void;
  clear: () => void;
  
  // Computed
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
};

// Simple localStorage persistence - CHỈ LUU TOKENS
const getStoredTokens = () => {
  try {
    const stored = localStorage.getItem("auth-tokens");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const setStoredTokens = (accessToken: string | null, refreshToken: string | null) => {
  try {
    if (accessToken && refreshToken) {
      localStorage.setItem("auth-tokens", JSON.stringify({
        accessToken,
        refreshToken,
      }));
    } else {
      localStorage.removeItem("auth-tokens");
    }
  } catch {
    // Ignore localStorage errors
  }
};

export const useAuthStore = create<AuthState>((set, get) => {
  const storedTokens = getStoredTokens();
  
  return {
    // Initial state - CHỈ TOKENS từ localStorage, user = null
    accessToken: storedTokens.accessToken || null,
    refreshToken: storedTokens.refreshToken || null,
    user: null, // KHÔNG lưu user vào localStorage
    isLoading: false,
    isAuthenticating: false,

    // Actions
    setTokens: (tokens: TokenPair) => {
      const accessToken = tokens.access_token;
      const refreshToken = tokens.refresh_token;
      
      set({ accessToken, refreshToken });
      setStoredTokens(accessToken, refreshToken);
    },

    setUser: (user: AuthUser) => {
      set({ user });
      // KHÔNG lưu user vào localStorage
    },

    setLoading: (isLoading: boolean) => {
      set({ isLoading });
    },

    setAuthenticating: (isAuthenticating: boolean) => {
      set({ isAuthenticating });
    },

    updateProfile: (profileUpdate: Partial<Profile>) => {
      const state = get();
      if (state.user) {
        const updatedUser = {
          ...state.user,
          profile: { ...state.user.profile, ...profileUpdate }
        };
        set({ user: updatedUser });
        // KHÔNG lưu vào localStorage
      }
    },

    updateAccount: (accountUpdate: Partial<Account>) => {
      const state = get();
      if (state.user) {
        const updatedUser = {
          ...state.user,
          account: { ...state.user.account, ...accountUpdate }
        };
        set({ user: updatedUser });
        // KHÔNG lưu vào localStorage
      }
    },

    clear: () => {
      set({ 
        accessToken: null, 
        refreshToken: null, 
        user: null,
        isLoading: false,
        isAuthenticating: false
      });
      setStoredTokens(null, null);
    },

    // Computed
    isAuthenticated: () => {
      const state = get();
      return !!(state.accessToken); // CHỈ CẦN TOKEN, không cần user
    },

    isAdmin: () => {
      const state = get();
      return state.user?.account.role === "ADMIN";
    },
  };
});


