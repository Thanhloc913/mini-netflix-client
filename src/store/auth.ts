import { create } from "zustand";
import type { TokenPair } from "@/services/auth";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (t: TokenPair) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
  clear: () => set({ accessToken: null, refreshToken: null }),
}));


