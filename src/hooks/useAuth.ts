import { useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { loginApi, registerApi, getCurrentUser } from "@/apis/auth";
import type { LoginRequest, RegisterRequest } from "@/schemas/auth.schema";
import type { AuthUser } from "@/types/auth";

export function useAuth() {
  const {
    accessToken,
    refreshToken,
    user,
    isLoading,
    isAuthenticating,
    setTokens,
    setUser,
    setLoading,
    setAuthenticating,
    clear,
    isAuthenticated,
    isAdmin,
  } = useAuthStore();

  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchUserData = async (userId?: string, shouldClearOnError = true) => {
    try {
      setLoading(true);
      
      let userIdToUse = userId;
      
      // Nếu không có userId, decode từ token
      if (!userIdToUse && accessToken) {
        try {
          console.log("🔍 Decoding JWT token...");
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          userIdToUse = payload.sub || payload.userId || payload.id;
          console.log("✅ JWT decoded, user ID:", userIdToUse);
        } catch (decodeError) {
          console.error("❌ Failed to decode JWT:", decodeError);
          if (shouldClearOnError) {
            clear();
          }
          throw new Error("Invalid token");
        }
      }
      
      if (!userIdToUse) {
        console.error("❌ No user ID available");
        if (shouldClearOnError) {
          clear();
        }
        throw new Error("No user ID available");
      }
      
      // Gọi API để lấy thông tin user
      console.log("🌐 Calling getCurrentUser API with ID:", userIdToUse);
      const { account, profile } = await getCurrentUser(userIdToUse);
      console.log("✅ API response received:", { account: account.email, profile: profile.name });

      const authUser: AuthUser = {
        account,
        profile
      };
      
      setUser(authUser);
      console.log("👤 User data set in store");
      return authUser;
    } catch (err) {
      console.error("❌ Failed to fetch user data:", err);
      // Chỉ clear token nếu được phép (không phải trong quá trình login)
      if (shouldClearOnError) {
        console.log("🗑️ Clearing tokens due to fetch error");
        clear();
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setError(null);
      setAuthenticating(true);
      
      console.log("🔐 Starting login...");
      const tokens = await loginApi(credentials);
      console.log("✅ Login API successful, got tokens");
      
      setTokens(tokens);
      console.log("💾 Tokens saved to store");
      
      // Fetch user data sau khi có token - KHÔNG clear token nếu thất bại
      try {
        console.log("👤 Fetching user data...");
        await fetchUserData(undefined, false); // shouldClearOnError = false
        console.log("✅ User data fetched successfully");
      } catch (fetchError) {
        console.warn("⚠️ Failed to fetch user data after login, but keeping tokens:", fetchError);
        // KHÔNG gọi clear() ở đây - giữ token để AuthProvider thử lại
      }
      
      return tokens;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đăng nhập thất bại";
      setError(message);
      throw err;
    } finally {
      setAuthenticating(false);
    }
  };

  const register = async (userData: RegisterRequest, avatar?: File) => {
    try {
      setError(null);
      setAuthenticating(true);
      
      const response = await registerApi(userData, avatar);
      
      // Auto login after successful registration
      await login({
        email: userData.email,
        password: userData.password,
      });
      
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đăng ký thất bại";
      setError(message);
      throw err;
    } finally {
      setAuthenticating(false);
    }
  };

  const logout = useCallback(() => {
    clear();
    setError(null);
  }, [clear]);

  const refreshUserData = async () => {
    try {
      await fetchUserData();
    } catch (err) {
      console.error("Failed to refresh user data:", err);
    }
  };

  // Initialize auth từ stored token
  const initializeAuth = async () => {
    if (!accessToken) {
      console.log("ℹ️ No access token found, skipping auth initialization");
      return;
    }
    
    try {
      console.log("🔄 Initializing auth with stored token...");
      await fetchUserData(undefined, true); // shouldClearOnError = true cho init
      console.log("✅ Auth initialization successful");
    } catch (err) {
      console.error("❌ Failed to initialize auth:", err);
      // Token có thể đã hết hạn, clear nó
      console.log("🗑️ Clearing invalid tokens");
    }
  };

  return {
    // State
    accessToken,
    refreshToken,
    user,
    isLoading,
    isAuthenticating,
    error,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    
    // Actions
    login,
    register,
    logout,
    clearError,
    refreshUserData,
    initializeAuth,
    setLoading,
  };
}