import { useQuery } from '@tanstack/react-query';
import { castsApi } from '@/apis/casts';

export const castQueryKeys = {
  all: ['casts'] as const,
  lists: () => [...castQueryKeys.all, 'list'] as const,
  list: () => [...castQueryKeys.lists()] as const,
  details: () => [...castQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...castQueryKeys.details(), id] as const,
};

// Get all casts
export function useCasts() {
  return useQuery({
    queryKey: castQueryKeys.list(),
    queryFn: castsApi.getAllCasts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get single cast
export function useCast(id: string) {
  return useQuery({
    queryKey: castQueryKeys.detail(id),
    queryFn: () => castsApi.getCastById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}