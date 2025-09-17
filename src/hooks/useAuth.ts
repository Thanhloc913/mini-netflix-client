import { useAuthStore } from '@/store/auth';
import { useCurrentUser } from '@/hooks/queries/useAuthQueries';
import { useLogout } from '@/hooks/mutations/useAuthMutations';

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