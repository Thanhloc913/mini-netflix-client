import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    login,
    register,
    getCurrentUser,
    getAccounts,
    getProfiles,
    updateAccount,
    updateProfile,
    deleteAccount,
    deleteProfile
} from '@/apis/auth';
import { useAuthStore } from '@/store/auth';
import { queryKeys } from '@/lib/query-keys';
import type { RegisterRequest, Account } from '@/types/auth';

// Login mutation
export function useLogin() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { setTokens, setUser } = useAuthStore();

    return useMutation({
        mutationFn: login,
        onSuccess: async (tokens) => {
            console.log("✅ Login successful, setting tokens");
            setTokens(tokens);

            // Decode userId từ token để fetch user data
            try {
                const payload = JSON.parse(atob(tokens.access_token.split('.')[1]));
                const userId = payload.sub || payload.userId || payload.id;

                if (userId) {
                    // Prefetch user data
                    const userData = await queryClient.fetchQuery({
                        queryKey: queryKeys.auth.user(userId),
                        queryFn: () => getCurrentUser(userId),
                    });

                    setUser(userData);
                    navigate('/', { replace: true });
                }
            } catch (error) {
                console.error("Failed to fetch user data after login:", error);
                // Vẫn navigate về home, user data sẽ được fetch sau
                navigate('/', { replace: true });
            }
        },
        onError: (error) => {
            console.error("❌ Login failed:", error);
        },
    });
}

// Register mutation
export function useRegister() {
    const navigate = useNavigate();
    // Store actions would be used if auto-login after registration

    return useMutation({
        mutationFn: ({ userData, avatar }: { userData: RegisterRequest; avatar?: File }) =>
            register(userData, avatar),
        onSuccess: async () => {
            console.log("✅ Registration successful");
            // Auto login after registration
            navigate('/login', { replace: true });
        },
        onError: (error) => {
            console.error("❌ Registration failed:", error);
        },
    });
}

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

// Get accounts query (Admin only)
export function useAccounts() {
    return useQuery({
        queryKey: queryKeys.auth.accounts(),
        queryFn: getAccounts,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

// Get profiles query (Admin only)
export function useProfiles() {
    return useQuery({
        queryKey: queryKeys.auth.profiles(),
        queryFn: getProfiles,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

// Update account mutation
export function useUpdateAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<Account> }) =>
            updateAccount(id, payload),
        onSuccess: (updatedAccount) => {
            // Invalidate accounts list
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.accounts() });

            // Update specific user cache
            queryClient.setQueryData(
                queryKeys.auth.user(updatedAccount.id),
                (oldData: any) => oldData ? { ...oldData, account: updatedAccount } : undefined
            );
        },
    });
}

// Update profile mutation
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, name, avatar }: { id: string; name: string; avatar?: File }) =>
            updateProfile(id, name, avatar),
        onSuccess: (updatedProfile) => {
            // Invalidate profiles list
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.profiles() });

            // Update specific user cache
            queryClient.setQueryData(
                queryKeys.auth.user(updatedProfile.accountId),
                (oldData: any) => oldData ? { ...oldData, profile: updatedProfile } : undefined
            );
        },
    });
}

// Delete account mutation
export function useDeleteAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            // Invalidate accounts list
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.accounts() });
        },
    });
}

// Delete profile mutation
export function useDeleteProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProfile,
        onSuccess: () => {
            // Invalidate profiles list
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.profiles() });
        },
    });
}

// Logout function
export function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { clear } = useAuthStore();

    return () => {
        // Clear auth store
        clear();

        // Clear all cached data
        queryClient.clear();

        // Navigate to login
        navigate('/login', { replace: true });
    };
}