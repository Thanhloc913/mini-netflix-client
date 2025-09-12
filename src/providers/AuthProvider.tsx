import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initializeAuth, accessToken, user, isLoading } = useAuth();

  useEffect(() => {
    // Nếu có token nhưng chưa có user data, fetch ngay
    if (accessToken && !user && !isLoading) {
      console.log("🔄 Initializing auth with stored token...");
      initializeAuth().catch((error) => {
        console.error("❌ Failed to initialize user data:", error);
      });
    }
  }, [accessToken, user, isLoading, initializeAuth]);

  return <>{children}</>;
}