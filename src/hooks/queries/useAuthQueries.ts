import { useQuery } from '@tanstack/react-query';
import { 
    getCurrentUser, 
    getAccounts, 
    getProfiles
} from '@/apis/auth';
import { queryKeys } from '@/lib/query-keys';

// Get current user query
export function useCurrentUser(userId?: string) {
    return useQuery({
        queryKey: queryKeys.auth.user(userId || ''),
        queryFn: () => getCurrentUser(userId!),
        enabled: !!userId,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    });
}

// Get all accounts query
export function useAccounts() {
    return useQuery({
        queryKey: queryKeys.auth.accounts(),
        queryFn: getAccounts,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

// Get all profiles query
export function useProfiles() {
    return useQuery({
        queryKey: queryKeys.auth.profiles(),
        queryFn: getProfiles,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}