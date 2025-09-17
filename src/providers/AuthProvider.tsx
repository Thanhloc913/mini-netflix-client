import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useCurrentUser } from "@/hooks/queries/useAuthQueries";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { accessToken, user, setUser } = useAuthStore();
  
  // Decode userId từ token
  const userId = accessToken ? (() => {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      return payload.sub || payload.userId || payload.id;
    } catch {
      return null;
    }
  })() : null;

  // Fetch user data với TanStack Query
  const userQuery = useCurrentUser(userId);

  // Sync user data từ query vào store
  useEffect(() => {
    if (userQuery.data && !user) {
      setUser(userQuery.data);
    }
  }, [userQuery.data, user, setUser]);

  return <>{children}</>;
}