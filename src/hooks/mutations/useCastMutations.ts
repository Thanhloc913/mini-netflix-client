import { useMutation, useQueryClient } from '@tanstack/react-query';
import { castsApi } from '@/apis/casts';
import { castQueryKeys } from '@/hooks/queries/useCastQueries';
import type { CreateCastRequest, UpdateCastRequest } from '@/types/cast';

// Create cast mutation
export function useCreateCast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCastRequest) => castsApi.createCast(data),
    onSuccess: () => {
      // Invalidate and refetch casts list
      queryClient.invalidateQueries({ queryKey: castQueryKeys.lists() });
    },
  });
}

// Update cast mutation
export function useUpdateCast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCastRequest }) =>
      castsApi.updateCast(id, data),
    onSuccess: (updatedCast) => {
      // Invalidate and refetch casts list
      queryClient.invalidateQueries({ queryKey: castQueryKeys.lists() });
      // Update the specific cast in cache
      queryClient.setQueryData(
        castQueryKeys.detail(updatedCast.id),
        updatedCast
      );
    },
  });
}

// Delete cast mutation
export function useDeleteCast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => castsApi.deleteCast(id),
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch casts list
      queryClient.invalidateQueries({ queryKey: castQueryKeys.lists() });
      // Remove the specific cast from cache
      queryClient.removeQueries({ queryKey: castQueryKeys.detail(deletedId) });
    },
  });
}