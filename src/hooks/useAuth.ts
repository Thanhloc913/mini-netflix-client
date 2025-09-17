import { useAuthStore } from '@/store/auth';
import { useCurrentUser, useLogout } from '@/hooks/queries/useAuthQueries';

export function useAuth() {
  const { user, isAuthenticated, isAdmin, accessToken } = useAuthStore();
  const logout = useLogout();
  
  // Get userId from token if available
  const userId = user?.account?.id;
  
  // Fetch current user data if we have userId but no user data
  const { data: currentUserData, isLoading, error } = useCurrentUser(userId);
  
  return {
    user: user || currentUserData,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    isLoading,
    error,
    logout,
    accessToken
  };
}